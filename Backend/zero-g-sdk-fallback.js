// Simple fallback/mock for ZeroGSDK when the real '@0g-ai/sdk' package isn't available.
// This is intended for local development/testing only — replace with the official SDK for production.
class ZeroGSDK {
  constructor(opts) {
    this.opts = opts || {};
    console.warn('[ZeroGSDK fallback] Using local fallback SDK. Replace with official @0g-ai/sdk for production.');
  }

  // Simulate an inference call. Returns an object similar to expected real SDK response.
  async runInference({ model, prompt, inputs, maxTokens, temperature } = {}) {
    // Simple deterministic fake output: returns a JSON string with one allocation
    const output = JSON.stringify({ allocations: [{ strategyIndex: 0, allocation: 10000 }] });
    const proof = '0x';
    const publicInput = [];
    return { output, proof, publicInput };
  }
}

module.exports = { ZeroGSDK };
