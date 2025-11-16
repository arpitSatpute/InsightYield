/**
 * Enhanced Continuous Keeper Service
 * Features:
 * 1. Submits AI recommendations to StrategyManager (updates allocations)
 * 2. Monitors Deposit events from YieldVault
 * 3. Auto-triggers YieldVault.rebalance() when deposits occur
 * 4. Runs all processes seamlessly without interruption
 */
const { ethers } = require('ethers');
const { MongoClient } = require('mongodb');
require('dotenv').config();


// Strategy Manager ABI
const STRATEGY_MANAGER_ABI = [
  "function submitAI((address manager, uint256 nonce, uint256 deadline, uint256[] indices, uint256[] allocations, uint256 timestamp, string modelVersion, uint256 confidence) rec, bytes sig) external",
  "function getAgentNonce(address agent) external view returns (uint256)",
  "function updateAllocations(uint256[] calldata newAllocations) external",
  "function getAllocations() external view returns (uint256[] memory)",
  "event AISubmitted(address indexed agent, uint256 nonce, uint256 confidence)",
  "event AllocationsUpdated(uint256[] newAllocations, uint256 timestamp)"
];

// Yield Vault ABI
const YIELD_VAULT_ABI = [
  "function deposit(uint256 assets, address receiver) external returns (uint256 shares)",
  "function totalAssets() external view returns (uint256)",
  "function rebalance() external",
  "event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)",
  "event Rebalanced(uint256 timestamp, uint256 totalAssets)"
];

class EnhancedKeeper {
  constructor() {
    // Configuration
    this.pollInterval = parseInt(process.env.KEEPER_POLL_INTERVAL || '60000'); // 60 seconds
    this.maxGasPrice = ethers.utils.parseUnits(
      process.env.MAX_GAS_PRICE || '100',
      'gwei'
    );
    this.depositThreshold = ethers.utils.parseUnits(
      process.env.DEPOSIT_THRESHOLD || '1000', // 1000 USDC threshold
      6 // USDC decimals
    );
    this.running = true;
    
    // Stats
    this.stats = {
      startTime: Date.now(),
      checksPerformed: 0,
      recommendationsSubmitted: 0,
      rebalancesTriggered: 0,
      depositsDetected: 0,
      lastCheckTime: null,
      lastSubmissionTime: null,
      lastRebalanceTime: null,
      errors: 0
    };

    // Blockchain setup
    this.provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    
    // Strategy Manager Contract
    this.strategyManager = new ethers.Contract(
      process.env.STRATEGY_MANAGER_ADDRESS,
      STRATEGY_MANAGER_ABI,
      this.wallet
    );

    // Yield Vault Contract
    this.yieldVault = new ethers.Contract(
      process.env.YIELD_VAULT_ADDRESS,
      YIELD_VAULT_ABI,
      this.wallet
    );

    // MongoDB setup
    this.mongoClient = null;
    this.db = null;
    
    // Event tracking
    this.lastProcessedBlock = 0;
    this.isRebalancing = false;
  }

  async initialize() {
    console.log('🚀 Initializing Enhanced Keeper Service...\n');
    
    // Connect to MongoDB
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

    // Get last processed block from DB
    await this.loadLastProcessedBlock();

    // Display configuration
    console.log('📋 Configuration:');
    console.log(`   Wallet: ${this.wallet.address}`);
    console.log(`   Strategy Manager: ${this.strategyManager.address}`);
    console.log(`   Yield Vault: ${this.yieldVault.address}`);
    
    try {
      const network = await this.provider.getNetwork();
      console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`);
      
      const currentBlock = await this.provider.getBlockNumber();
      console.log(`   Current block: ${currentBlock}`);
      console.log(`   Starting from block: ${this.lastProcessedBlock || currentBlock}`);
    } catch (error) {
      console.log(`   Network: Unable to detect (${error.message})`);
    }
    
    console.log(`   Poll interval: ${this.pollInterval / 1000} seconds`);
    console.log(`   Max gas price: ${ethers.utils.formatUnits(this.maxGasPrice, 'gwei')} gwei`);
    console.log(`   Deposit threshold: ${ethers.utils.formatUnits(this.depositThreshold, 6)} USDC`);
    
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

    // Display current allocations
    try {
      const allocations = await this.strategyManager.getAllocations();
      console.log(`\n📊 Current Strategy Allocations:`);
      allocations.forEach((alloc, i) => {
        console.log(`   Strategy ${i}: ${(alloc.toNumber() / 100).toFixed(2)}%`);
      });
    } catch (error) {
      console.log(`   Unable to fetch allocations: ${error.message}`);
    }

    console.log('\n✅ Keeper initialized successfully');
    console.log('   Features enabled:');
    console.log('   🤖 AI Recommendation Submission → StrategyManager.submitAI()');
    console.log('   📊 Deposit Event Monitoring → YieldVault.Deposit');
    console.log('   🔄 Auto-Rebalancing → YieldVault.rebalance()');
    console.log('\n   Press Ctrl+C to stop\n');
    console.log('='.repeat(60));
  }

  async loadLastProcessedBlock() {
    try {
      const state = await this.db.collection('keeper_state').findOne({ _id: 'event_tracker' });
      if (state && state.lastProcessedBlock) {
        this.lastProcessedBlock = state.lastProcessedBlock;
      } else {
        // Start from current block if no saved state
        this.lastProcessedBlock = await this.provider.getBlockNumber();
        await this.saveLastProcessedBlock();
      }
    } catch (error) {
      console.log('   Creating new event tracker state...');
      this.lastProcessedBlock = await this.provider.getBlockNumber();
      await this.saveLastProcessedBlock();
    }
  }

  async saveLastProcessedBlock() {
    try {
      await this.db.collection('keeper_state').updateOne(
        { _id: 'event_tracker' },
        { 
          $set: { 
            lastProcessedBlock: this.lastProcessedBlock,
            updatedAt: new Date()
          } 
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('⚠️  Failed to save last processed block:', error.message);
    }
  }

 async monitorDepositEvents() {
    try {
      const currentBlock = await this.provider.getBlockNumber();

      if (currentBlock <= this.lastProcessedBlock) return;

      const filter = this.yieldVault.filters.Deposit();

      // 🔥 FIX: Fetch logs in 10-block chunks (Alchemy free-tier safe)
      const events = await this.getEventsInChunks(
        this.yieldVault,
        filter,
        this.lastProcessedBlock + 1,
        currentBlock,
        10
      );

      if (events.length > 0) {
        console.log(`\n💰 Detected ${events.length} deposit event(s)!`);

        for (const event of events) {
          const { sender, owner, assets, shares } = event.args;

          console.log(`\n📥 Deposit Event (Block ${event.blockNumber}):`);
          console.log(`   Sender: ${sender}`);
          console.log(`   Owner: ${owner}`);
          console.log(`   Assets: ${ethers.utils.formatUnits(assets, 6)} USDC`);
          console.log(`   Shares: ${ethers.utils.formatUnits(shares, 18)}`);

          this.stats.depositsDetected++;

          if (assets.gte(this.depositThreshold)) {
            console.log(`   ✅ Threshold hit: triggering rebalance`);
            await this.triggerVaultRebalance(event.blockNumber, assets);
          }

          await this.logDeposit(event);
        }
      }

      this.lastProcessedBlock = currentBlock;
      await this.saveLastProcessedBlock();

    } catch (error) {
      console.error(`❌ Error monitoring deposit events: ${error.message}`);
      this.stats.errors++;
    }
  }

  async getEventsInChunks(contract, eventFilter, fromBlock, toBlock, chunkSize = 10) {
    let allEvents = [];
    let start = fromBlock;

    while (start <= toBlock) {
      const end = Math.min(start + chunkSize - 1, toBlock);

      try {
        const logs = await contract.queryFilter(eventFilter, start, end);
        allEvents = allEvents.concat(logs);
      } catch (err) {
        console.error(`❌ Alchemy log fetch failed for range ${start} → ${end}:`, err.message);
      }

      start = end + 1;
    }

    return allEvents;
  }


  async triggerVaultRebalance(blockNumber, depositAmount) {
    // Prevent concurrent rebalances
    if (this.isRebalancing) {
      console.log('   ⏳ Rebalance already in progress, skipping...');
      return;
    }

    this.isRebalancing = true;

    try {
      // Check gas price
      const gasOk = await this.checkGasPrice();
      if (!gasOk) {
        console.log('   ⚠️  Gas price too high, will retry later');
        this.isRebalancing = false;
        return;
      }

      console.log('   🔄 Calling YieldVault.rebalance()...');

      // Get current allocations from StrategyManager
      const allocations = await this.strategyManager.getAllocations();
      console.log('   📊 Current allocations:');
      allocations.forEach((alloc, i) => {
        console.log(`      Strategy ${i}: ${(alloc.toNumber() / 100).toFixed(2)}%`);
      });

      // Estimate gas for vault rebalance
      const gasEstimate = await this.yieldVault.estimateGas.rebalance();
      console.log(`   ⛽ Gas estimate: ${gasEstimate.toString()}`);

      // Execute YieldVault rebalance
      const tx = await this.yieldVault.rebalance({
        gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
      });

      console.log(`   🔄 Transaction sent: ${tx.hash}`);
      console.log('   ⏳ Waiting for confirmation...');

      const receipt = await tx.wait();

      console.log(`   ✅ Rebalance confirmed in block ${receipt.blockNumber}`);
      console.log(`   ⛽ Gas used: ${receipt.gasUsed.toString()}`);

      // Update stats
      this.stats.rebalancesTriggered++;
      this.stats.lastRebalanceTime = Date.now();

      // Log rebalance to MongoDB
      await this.logRebalance(blockNumber, depositAmount, tx.hash, receipt.blockNumber);

      console.log('   🎉 YieldVault rebalance completed successfully!');
      console.log('   💰 Funds deployed to strategies based on current allocations');

    } catch (error) {
      console.error(`   ❌ Rebalance failed: ${error.message}`);
      
      // Check if it's a contract revert
      if (error.message.includes('execution reverted')) {
        const match = error.message.match(/execution reverted: (.*?)"/);
        if (match) {
          console.error(`   📋 Revert reason: ${match[1]}`);
        }
      }

      this.stats.errors++;
    } finally {
      this.isRebalancing = false;
    }
  }

  async logDeposit(event) {
    try {
      await this.db.collection('deposit_events').insertOne({
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        sender: event.args.sender,
        owner: event.args.owner,
        assets: event.args.assets.toString(),
        shares: event.args.shares.toString(),
        timestamp: new Date(),
        rebalanceTriggered: event.args.assets.gte(this.depositThreshold)
      });
    } catch (error) {
      console.error('⚠️  Failed to log deposit:', error.message);
    }
  }

  async logRebalance(triggerBlock, depositAmount, txHash, confirmedBlock) {
    try {
      // Get current allocations
      const allocations = await this.strategyManager.getAllocations();
      
      await this.db.collection('rebalance_events').insertOne({
        triggerBlock: triggerBlock,
        depositAmount: depositAmount.toString(),
        transactionHash: txHash,
        confirmedBlock: confirmedBlock,
        timestamp: new Date(),
        triggeredBy: 'deposit_event',
        allocations: allocations.map(a => a.toString())
      });
    } catch (error) {
      console.error('⚠️  Failed to log rebalance:', error.message);
    }
  }

  // ========== AI Recommendation Functions ==========

  async getPendingRecommendations() {
    const recommendations = this.db.collection('recommendations');
    
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
      const onChainNonce = await this.strategyManager.getAgentNonce(recommendation.signer);
      const expectedNonce = recommendation.recommendation.nonce;
      
      console.log(`   🔍 Nonce check: on-chain=${onChainNonce}, recommendation=${expectedNonce}`);
      
      if (onChainNonce.toNumber() !== expectedNonce) {
        console.log(`   ⚠️  Nonce mismatch detected! Auto-fixing...`);
        
        recommendation.recommendation.nonce = onChainNonce.toNumber();
        
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
        console.log(`   ⚠️  Gas price too high (max: ${ethers.utils.formatUnits(this.maxGasPrice, 'gwei')} gwei)`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.log(`   ⚠️  Unable to check gas price: ${error.message}`);
      return true;
    }
  }

  async submitRecommendation(recommendation) {
    console.log('\n📤 Submitting AI recommendation to StrategyManager...');
    console.log(`   Recommendation ID: ${recommendation._id}`);
    console.log(`   Signer: ${recommendation.signer}`);
    console.log(`   Confidence: ${(recommendation.recommendation.confidence / 1e18 * 100).toFixed(1)}%`);
    
    console.log('   📊 Recommended Allocations:');
    recommendation.predictions.forEach(pred => {
      console.log(`      Strategy ${pred.index}: ${(pred.recommended_allocation / 100).toFixed(2)}%`);
    });

    await this.verifyAndFixNonce(recommendation);

    const gasOk = await this.checkGasPrice();
    if (!gasOk) {
      return { success: false, reason: 'gas_too_high' };
    }

    const now = Math.floor(Date.now() / 1000);
    if (recommendation.recommendation.deadline < now) {
      console.log('   ⚠️  Recommendation expired');
      await this.markAsExpired(recommendation._id);
      return { success: false, reason: 'expired' };
    }

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
      console.log('   📊 Estimating gas...');
      const gasEstimate = await this.strategyManager.estimateGas.submitAI(rec, signature);
      console.log(`   ⛽ Gas estimate: ${gasEstimate.toString()}`);

      // Submit AI recommendation (this updates allocations in StrategyManager)
      const tx = await this.strategyManager.submitAI(rec, signature, {
        gasLimit: gasEstimate.mul(120).div(100)
      });

      console.log(`   🔄 Transaction sent: ${tx.hash}`);
      console.log('   ⏳ Waiting for confirmation...');

      const receipt = await tx.wait();

      console.log(`   ✅ Confirmed in block ${receipt.blockNumber}`);
      console.log(`   ⛽ Gas used: ${receipt.gasUsed.toString()}`);
      console.log('   ✅ Strategy allocations updated in StrategyManager!');

      // Get updated allocations
      try {
        const newAllocations = await this.strategyManager.getAllocations();
        console.log('   📊 New allocations set:');
        newAllocations.forEach((alloc, i) => {
          console.log(`      Strategy ${i}: ${(alloc.toNumber() / 100).toFixed(2)}%`);
        });
      } catch (error) {
        console.log('   Unable to fetch updated allocations');
      }

      await this.markAsSubmitted(recommendation._id, {
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      });

      this.stats.recommendationsSubmitted++;
      this.stats.lastSubmissionTime = Date.now();

      console.log('\n   💡 Note: Future deposits will use these new allocations automatically');

      console.log('\n🔄 Triggering automatic vault rebalance after AI submission...');

      try {
        await this.triggerVaultRebalance(
          receipt.blockNumber,
          ethers.utils.parseUnits("0", 6) // no deposit, artificial trigger
        );
        console.log('   ✅ Auto-rebalance executed successfully after AI update!');
      } catch (err) {
        console.error('   ❌ Auto-rebalance failed:', err.message);
      }

      return { 
        success: true, 
        txHash: tx.hash,
        blockNumber: receipt.blockNumber 
      };

    } catch (error) {
      console.error(`   ❌ Submission failed: ${error.message}`);
      
      if (error.message.includes('execution reverted')) {
        const match = error.message.match(/execution reverted: (.*?)"/);
        if (match) {
          console.error(`   📋 Revert reason: ${match[1]}`);
        }
      }
      
      await this.markAsFailed(recommendation._id, error.message);
      
      return { success: false, reason: error.message };
    }
  }

  async markAsSubmitted(recommendationId, txData) {
    try {
      await this.db.collection('recommendations').updateOne(
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
      await this.db.collection('recommendations').updateOne(
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
      await this.db.collection('recommendations').updateOne(
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

  async checkAndSubmitRecommendations() {
    try {
      this.stats.checksPerformed++;
      this.stats.lastCheckTime = Date.now();

      const pending = await this.getPendingRecommendations();

      if (pending.length === 0) {
        return;
      }

      const recommendation = pending[0];
      console.log(`\n🤖 Found pending AI recommendation!`);

      const result = await this.submitRecommendation(recommendation);

      if (result.success) {
        console.log(`\n🎉 AI recommendation submitted successfully!`);
        console.log(`   TX Hash: ${result.txHash}`);
        console.log(`   Block: ${result.blockNumber}`);
        console.log(`   📊 StrategyManager allocations updated`);
        console.log(`   🔄 Future deposits will use new allocations`);
      } else {
        console.log(`\n⚠️  Submission skipped: ${result.reason}`);
      }

    } catch (error) {
      console.error(`\n❌ Error processing recommendations: ${error.message}`);
      this.stats.errors++;
    }
  }

  // ========== Main Loop ==========

  async mainLoop() {
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      // Task 1: Monitor deposit events and trigger YieldVault.rebalance()
      // await this.monitorDepositEvents();
      
      // Task 2: Check and submit AI recommendations to StrategyManager
      await this.checkAndSubmitRecommendations();
      
      // Simple status update (only if nothing happened)
      if (this.stats.checksPerformed % 10 === 0) {
        console.log(`⏳ ${timestamp} - System running (checks: ${this.stats.checksPerformed})`);
      }

    } catch (error) {
      console.error(`\n❌ Error in main loop: ${error.message}`);
      this.stats.errors++;
    }
  }

  printStats() {
    const uptime = Math.floor((Date.now() - this.stats.startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    console.log('\n' + '='.repeat(60));
    console.log('📊 Enhanced Keeper Statistics');
    console.log('='.repeat(60));
    console.log(`   Uptime: ${hours}h ${minutes}m ${seconds}s`);
    console.log(`   Checks performed: ${this.stats.checksPerformed}`);
    console.log(`   AI recommendations submitted: ${this.stats.recommendationsSubmitted}`);
    console.log(`   Deposits detected: ${this.stats.depositsDetected}`);
    console.log(`   Vault rebalances triggered: ${this.stats.rebalancesTriggered}`);
    console.log(`   Errors encountered: ${this.stats.errors}`);
    if (this.stats.lastCheckTime) {
      console.log(`   Last check: ${new Date(this.stats.lastCheckTime).toLocaleTimeString()}`);
    }
    if (this.stats.lastSubmissionTime) {
      console.log(`   Last AI submission: ${new Date(this.stats.lastSubmissionTime).toLocaleTimeString()}`);
    }
    if (this.stats.lastRebalanceTime) {
      console.log(`   Last vault rebalance: ${new Date(this.stats.lastRebalanceTime).toLocaleTimeString()}`);
    }
    console.log('='.repeat(60) + '\n');
  }

  async run() {
    try {
      await this.initialize();

      // Print stats every hour
      const statsInterval = setInterval(() => {
        this.printStats();
      }, 3600000); // 1 hour

      // Main loop - runs forever
      while (this.running) {
        await this.mainLoop();
        
        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, this.pollInterval));
      }

      clearInterval(statsInterval);

    } catch (error) {
      console.error('\n💥 Fatal error:', error);
      throw error;
    }
  }

  async stop() {
    console.log('\n⏹️  Shutting down keeper...');
    this.running = false;
    
    this.printStats();
    
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

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Run if called directly
if (require.main === module) {
  keeper = new EnhancedKeeper();
  
  keeper.run().catch(async (error) => {
    console.error('Fatal error:', error);
    if (keeper) {
      await keeper.stop();
    }
    process.exit(1);
  });
}

module.exports = EnhancedKeeper;