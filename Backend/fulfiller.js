// fulfiller/fulfiller.js
require('dotenv').config();
const { ethers } = require('ethers');

// === CONFIG ===
const RPC_URL = process.env.RPC_URL || 'https://evmrpc-testnet.0g.ai';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ORACLE_ADDRESS = process.env.VITE_REAL0G_ORACLE_ADDRESS; // Real0GOracle address

if (!PRIVATE_KEY || !ORACLE_ADDRESS) {
  console.error('Set PRIVATE_KEY and ORACLE_ADDRESS in .env');
  process.exit(1);
}

// === PROVIDER & WALLET ===
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// === MOCK AI (Replace with real 0G SDK in production) ===
class MockZeroGSDK {
  async runInference() {
    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 1500));

    return {
      output: JSON.stringify({
        allocations: [
          { strategyIndex: 0, allocation: 2500 }, // Lending
          { strategyIndex: 1, allocation: 6000 }, // Liquidity
          { strategyIndex: 2, allocation: 1500 }  // Staking
        ]
      }),
      proof: "0x0000000000000000000000000000000000000000000000000000000000000000" // 32-byte mock
    };
  }
}

const sdk = new MockZeroGSDK();

// === ORACLE ABI (Only needed parts) ===
const ORACLE_ABI = [
  "event InferenceRequested(uint256 indexed requestId, string prompt, bytes metrics)",
  "function fulfillAIReallocation(uint256 requestId, uint256[] strategyIndices, uint256[] recommendedAllocations, bytes zkProof) external"
];

const oracle = new ethers.Contract(ORACLE_ADDRESS, ORACLE_ABI, wallet);

// === MAIN LISTENER ===
console.log(`\n0G AI FULFILLER STARTED`);
console.log(`Oracle: ${ORACLE_ADDRESS}`);
console.log(`Wallet: ${wallet.address}\n`);
console.log(`Listening for AI requests...`);

oracle.on('InferenceRequested', async (requestId, prompt, metrics, event) => {
  console.log(`\nAI REQUEST #${requestId}`);
  console.log(`Prompt: ${prompt}`);

  try {
    // Decode metrics (APYs, risks, TVLs)
    let apys, risks, tvls;
    try {
      const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
        ['uint256[]', 'uint256[]', 'uint256[]'],
        metrics
      );
      [apys, risks, tvls] = decoded;
      console.log(`APYs: [${apys.join(', ')}] bps`);
      console.log(`TVLs: [${tvls.map(t => Number(t) / 1e18).join(', ')}] vUSDT`);
    } catch {
      console.log("Metrics: [default]");
    }

    // Run AI
    console.log("Running AI model...");
    const aiResult = await sdk.runInference();
    const output = JSON.parse(aiResult.output.trim());

    // Extract allocations
    const strategyIndices = output.allocations.map(a => a.strategyIndex);
    const recommendedAllocations = output.allocations.map(a => a.allocation);

    // Validate total = 10000
    const total = recommendedAllocations.reduce((a, b) => a + b, 0);
    if (total !== 10000) {
      console.warn(`Invalid total: ${total} bps. Using fallback.`);
      // Fallback
      strategyIndices[0] = 0; strategyIndices[1] = 1; strategyIndices[2] = 2;
      recommendedAllocations[0] = 2500; recommendedAllocations[1] = 6000; recommendedAllocations[2] = 1500;
    }

    console.log(`AI Output: 60% Liquidity, 25% Lending, 15% Staking`);

    // Submit to oracle
    const tx = await oracle.fulfillAIReallocation(
      requestId,
      strategyIndices,
      recommendedAllocations,
      aiResult.proof,
      { gasLimit: 500000 }
    );

    console.log(`Submitted Tx: ${tx.hash}`);
    await tx.wait();
    console.log(`FULFILLED #${requestId} — AI ALLOCATED CAPITAL`);

  } catch (error) {
    console.error(`Fulfill failed for #${requestId}:`, error.message);
  }
});

// Keep alive
setInterval(() => {}, 1 << 30);