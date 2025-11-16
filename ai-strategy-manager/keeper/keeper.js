/**
 * Continuous Keeper Service - Submits AI recommendations to blockchain
 * Works on both local and production (Railway/Render/VPS)
 * Runs 24/7 and polls MongoDB for pending recommendations
 */
const { ethers } = require('ethers');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const STRATEGY_MANAGER_ABI = [
  "function submitAI((address manager, uint256 nonce, uint256 deadline, uint256[] indices, uint256[] allocations, uint256 timestamp, string modelVersion, uint256 confidence) rec, bytes sig) external",
  "function getAgentNonce(address agent) external view returns (uint256)",
  "event AISubmitted(address indexed agent, uint256 nonce, uint256 confidence)"
];

class ContinuousKeeper {
  constructor() {
    // Configuration
    this.pollInterval = parseInt(process.env.KEEPER_POLL_INTERVAL || '60000'); // 60 seconds
    this.maxGasPrice = ethers.utils.parseUnits(
      process.env.MAX_GAS_PRICE || '100',
      'gwei'
    );
    this.running = true;
    
    // Stats
    this.stats = {
      startTime: Date.now(),
      checksPerformed: 0,
      recommendationsSubmitted: 0,
      lastCheckTime: null,
      lastSubmissionTime: null,
      errors: 0
    };

    // Blockchain setup
    this.provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      process.env.STRATEGY_MANAGER_ADDRESS,
      STRATEGY_MANAGER_ABI,
      this.wallet
    );

    // MongoDB setup (will be connected in initialize())
    this.mongoClient = null;
    this.db = null;
  }

  async initialize() {
    console.log('🚀 Initializing Continuous Keeper Service...\n');
    
    // Connect to MongoDB (works for both local and Atlas)
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
    this.mongoClient = new MongoClient(mongoUri);
    
    try {
      await this.mongoClient.connect();
      this.db = this.mongoClient.db(process.env.MONGO_DB || 'defi_strategies');
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      throw error;
    }

    // Display configuration
    console.log('📋 Configuration:');
    console.log(`   Wallet: ${this.wallet.address}`);
    console.log(`   Contract: ${process.env.STRATEGY_MANAGER_ADDRESS}`);
    
    try {
      const network = await this.provider.getNetwork();
      console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`);
    } catch (error) {
      console.log(`   Network: Unable to detect (${error.message})`);
    }
    
    console.log(`   Poll interval: ${this.pollInterval / 1000} seconds`);
    console.log(`   Max gas price: ${ethers.utils.formatUnits(this.maxGasPrice, 'gwei')} gwei`);
    
    // Check wallet balance
    try {
      const balance = await this.wallet.getBalance();
      console.log(`   Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);
      
      if (balance.isZero()) {
        console.warn('\n⚠️  WARNING: Wallet has 0 balance. You need ETH to submit transactions!');
      }
    } catch (error) {
      console.log(`   Wallet balance: Unable to check (${error.message})`);
    }

    console.log('\n✅ Keeper initialized successfully');
    console.log('   Press Ctrl+C to stop\n');
    console.log('='.repeat(60));
  }

  async getPendingRecommendations() {
    const recommendations = this.db.collection('recommendations');
    
    // Find pending recommendations that haven't expired
    return await recommendations.find({
      status: 'pending',
      submitted: false,
      'recommendation.deadline': { $gt: Math.floor(Date.now() / 1000) }
    })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();
  }

  async verifyAndFixNonce(recommendation) {
    try {
      const onChainNonce = await this.contract.getAgentNonce(recommendation.signer);
      const expectedNonce = recommendation.recommendation.nonce;
      
      console.log(`   🔍 Nonce check: on-chain=${onChainNonce}, recommendation=${expectedNonce}`);
      
      if (onChainNonce.toNumber() !== expectedNonce) {
        console.log(`   ⚠️  Nonce mismatch detected! Auto-fixing...`);
        
        // Update the recommendation with correct nonce
        recommendation.recommendation.nonce = onChainNonce.toNumber();
        
        // Also update in MongoDB to keep it in sync
        await this.db.collection('recommendations').updateOne(
          { _id: recommendation._id },
          { 
            $set: { 
              'recommendation.nonce': onChainNonce.toNumber(),
              'nonce_fixed': true,
              'nonce_fixed_at': new Date()
            } 
          }
        );
        
        console.log(`   ✅ Nonce updated: ${expectedNonce} → ${onChainNonce.toNumber()}`);
      } else {
        console.log(`   ✅ Nonce verified: ${expectedNonce}`);
      }
      
      return true;
    } catch (error) {
      console.error(`   ❌ Nonce verification failed: ${error.message}`);
      throw error;
    }
  }

  async checkGasPrice() {
    try {
      const currentGasPrice = await this.provider.getGasPrice();
      console.log(`   ⛽ Current gas price: ${ethers.utils.formatUnits(currentGasPrice, 'gwei')} gwei`);
      
      if (currentGasPrice.gt(this.maxGasPrice)) {
        console.log(`   ⚠️  Gas price too high (max: ${ethers.utils.formatUnits(this.maxGasPrice, 'gwei')} gwei). Skipping...`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.log(`   ⚠️  Unable to check gas price: ${error.message}`);
      return true; // Continue anyway
    }
  }

  async submitRecommendation(recommendation) {
    console.log('\n📤 Submitting recommendation to blockchain...');
    console.log(`   Recommendation ID: ${recommendation._id}`);
    console.log(`   Signer: ${recommendation.signer}`);
    console.log(`   Confidence: ${(recommendation.recommendation.confidence / 1e18 * 100).toFixed(1)}%`);
    
    // Display allocations
    console.log('   Allocations:');
    recommendation.predictions.forEach(pred => {
      console.log(`     Strategy ${pred.index}: ${(pred.recommended_allocation / 100).toFixed(2)}%`);
    });

    // Verify and fix nonce if needed
    await this.verifyAndFixNonce(recommendation);

    // Check gas price
    const gasOk = await this.checkGasPrice();
    if (!gasOk) {
      return { success: false, reason: 'gas_too_high' };
    }

    // Check deadline
    const now = Math.floor(Date.now() / 1000);
    if (recommendation.recommendation.deadline < now) {
      console.log('   ⚠️  Recommendation expired');
      await this.markAsExpired(recommendation._id);
      return { success: false, reason: 'expired' };
    }

    // Prepare transaction data
    const rec = {
      manager: recommendation.recommendation.manager,
      nonce: recommendation.recommendation.nonce,
      deadline: recommendation.recommendation.deadline,
      indices: recommendation.recommendation.indices,
      allocations: recommendation.recommendation.allocations,
      timestamp: recommendation.recommendation.timestamp,
      modelVersion: recommendation.recommendation.modelVersion,
      confidence: recommendation.recommendation.confidence.toString()
    };

    const signature = recommendation.signature;

    try {
      // Estimate gas
      console.log('   📊 Estimating gas...');
      const gasEstimate = await this.contract.estimateGas.submitAI(rec, signature);
      console.log(`   ⛽ Gas estimate: ${gasEstimate.toString()}`);

      // Submit transaction
      const tx = await this.contract.submitAI(rec, signature, {
        gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
      });

      console.log(`   🔄 Transaction sent: ${tx.hash}`);
      console.log('   ⏳ Waiting for confirmation...');

      // Wait for confirmation
      const receipt = await tx.wait();

      console.log(`   ✅ Confirmed in block ${receipt.blockNumber}`);
      console.log(`   ⛽ Gas used: ${receipt.gasUsed.toString()}`);

      // Mark as submitted in database
      await this.markAsSubmitted(recommendation._id, {
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      });

      // Update stats
      this.stats.recommendationsSubmitted++;
      this.stats.lastSubmissionTime = Date.now();

      return { 
        success: true, 
        txHash: tx.hash,
        blockNumber: receipt.blockNumber 
      };

    } catch (error) {
      console.error(`   ❌ Submission failed: ${error.message}`);
      
      // Check if it's a contract revert with reason
      if (error.message.includes('execution reverted')) {
        const match = error.message.match(/execution reverted: (.*?)"/);
        if (match) {
          console.error(`   📋 Revert reason: ${match[1]}`);
        }
      }
      
      // Mark as failed in database
      await this.markAsFailed(recommendation._id, error.message);
      
      return { success: false, reason: error.message };
    }
  }

  async markAsSubmitted(recommendationId, txData) {
    try {
      const recommendations = this.db.collection('recommendations');
      await recommendations.updateOne(
        { _id: recommendationId },
        {
          $set: {
            submitted: true,
            status: 'executed',
            submittedAt: new Date(),
            txHash: txData.txHash,
            blockNumber: txData.blockNumber,
            gasUsed: txData.gasUsed
          }
        }
      );
    } catch (error) {
      console.error(`   ⚠️  Failed to update database: ${error.message}`);
    }
  }

  async markAsFailed(recommendationId, errorMessage) {
    try {
      const recommendations = this.db.collection('recommendations');
      await recommendations.updateOne(
        { _id: recommendationId },
        {
          $set: {
            status: 'failed',
            error: errorMessage,
            failedAt: new Date()
          }
        }
      );
    } catch (error) {
      console.error(`   ⚠️  Failed to update database: ${error.message}`);
    }
  }

  async markAsExpired(recommendationId) {
    try {
      const recommendations = this.db.collection('recommendations');
      await recommendations.updateOne(
        { _id: recommendationId },
        {
          $set: {
            status: 'expired',
            expiredAt: new Date()
          }
        }
      );
    } catch (error) {
      console.error(`   ⚠️  Failed to update database: ${error.message}`);
    }
  }

  async checkAndSubmit() {
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      // Update stats
      this.stats.checksPerformed++;
      this.stats.lastCheckTime = Date.now();

      // Check for pending recommendations
      const pending = await this.getPendingRecommendations();

      if (pending.length === 0) {
        console.log(`⏳ ${timestamp} - No pending recommendations (checked: ${this.stats.checksPerformed})`);
        return;
      }

      // Found a pending recommendation
      const recommendation = pending[0];
      console.log(`\n📋 ${timestamp} - Found pending recommendation!`);

      // Submit it
      const result = await this.submitRecommendation(recommendation);

      if (result.success) {
        console.log(`\n🎉 Successfully submitted recommendation!`);
        console.log(`   TX Hash: ${result.txHash}`);
        console.log(`   Block: ${result.blockNumber}`);
      } else {
        console.log(`\n⚠️  Submission skipped: ${result.reason}`);
      }

    } catch (error) {
      console.error(`\n❌ Error in check cycle: ${error.message}`);
      this.stats.errors++;
      // Don't exit - continue running
    }
  }

  printStats() {
    const uptime = Math.floor((Date.now() - this.stats.startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    console.log('\n' + '='.repeat(60));
    console.log('📊 Keeper Statistics');
    console.log('='.repeat(60));
    console.log(`   Uptime: ${hours}h ${minutes}m ${seconds}s`);
    console.log(`   Checks performed: ${this.stats.checksPerformed}`);
    console.log(`   Recommendations submitted: ${this.stats.recommendationsSubmitted}`);
    console.log(`   Errors encountered: ${this.stats.errors}`);
    if (this.stats.lastCheckTime) {
      console.log(`   Last check: ${new Date(this.stats.lastCheckTime).toLocaleTimeString()}`);
    }
    if (this.stats.lastSubmissionTime) {
      console.log(`   Last submission: ${new Date(this.stats.lastSubmissionTime).toLocaleTimeString()}`);
    }
    console.log('='.repeat(60) + '\n');
  }

  async run() {
    try {
      // Initialize connections
      await this.initialize();

      // Print stats every hour
      const statsInterval = setInterval(() => {
        this.printStats();
      }, 3600000); // 1 hour

      // Main loop - runs forever
      while (this.running) {
        await this.checkAndSubmit();
        
        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, this.pollInterval));
      }

      // Cleanup
      clearInterval(statsInterval);

    } catch (error) {
      console.error('\n💥 Fatal error:', error);
      throw error;
    }
  }

  async stop() {
    console.log('\n⏹️  Shutting down keeper...');
    this.running = false;
    
    // Print final stats
    this.printStats();
    
    // Close MongoDB connection
    if (this.mongoClient) {
      await this.mongoClient.close();
      console.log('✅ MongoDB connection closed');
    }
    
    console.log('✅ Keeper stopped gracefully');
  }
}

// Handle graceful shutdown
let keeper = null;

async function shutdown() {
  if (keeper) {
    await keeper.stop();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);  // Ctrl+C
process.on('SIGTERM', shutdown); // Kill command

// Run if called directly
if (require.main === module) {
  keeper = new ContinuousKeeper();
  
  keeper.run().catch(async (error) => {
    console.error('Fatal error:', error);
    if (keeper) {
      await keeper.stop();
    }
    process.exit(1);
  });
}

module.exports = ContinuousKeeper;