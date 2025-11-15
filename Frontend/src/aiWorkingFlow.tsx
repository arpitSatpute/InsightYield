import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Database, Brain, FileSignature, Upload, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';

const SystemFlow = () => {
  const [expandedSection, setExpandedSection] = useState('overview');

  const toggleSection = (section: any) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-4">
            🤖 InsightYield AI Strategy Manager
          </h1>
          <p className="text-purple-200 text-lg">
            Automated DeFi portfolio rebalancing using machine learning predictions and blockchain verification
          </p>
        </div>

        {/* Overview Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('overview')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold"
          >
            <span>📊 System Overview</span>
            {expandedSection === 'overview' ? <ChevronDown /> : <ChevronRight />}
          </button>
          
          {expandedSection === 'overview' && (
            <div className="mt-6 space-y-4 text-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-500/20 p-4 rounded-lg">
                  <Brain className="w-8 h-8 mb-2 text-purple-300" />
                  <h3 className="font-bold mb-2">AI Prediction</h3>
                  <p className="text-sm">ML model analyzes strategy performance and predicts optimal allocations</p>
                </div>
                <div className="bg-blue-500/20 p-4 rounded-lg">
                  <FileSignature className="w-8 h-8 mb-2 text-blue-300" />
                  <h3 className="font-bold mb-2">Cryptographic Signing</h3>
                  <p className="text-sm">AI agent signs recommendations using EIP-712 for verification</p>
                </div>
                <div className="bg-green-500/20 p-4 rounded-lg">
                  <Upload className="w-8 h-8 mb-2 text-green-300" />
                  <h3 className="font-bold mb-2">Blockchain Execution</h3>
                  <p className="text-sm">Keeper service submits verified recommendations to smart contract</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Flow Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('flowchart')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold mb-6"
          >
            <span>🔄 Complete System Flow</span>
            {expandedSection === 'flowchart' ? <ChevronDown /> : <ChevronRight />}
          </button>

          {expandedSection === 'flowchart' && (
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="flex-1 bg-purple-500/20 rounded-lg p-4">
                    <h3 className="text-white font-bold mb-2 flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Data Collection (Continuous)
                    </h3>
                    <ul className="text-purple-100 text-sm space-y-1 ml-4">
                      <li>• DeFi strategies collect performance metrics (TVL, APY, returns)</li>
                      <li>• Data stored in MongoDB: strategies, performance collections</li>
                      <li>• Minimum 10 data points per strategy (last 30 days)</li>
                    </ul>
                    <div className="mt-2 text-xs text-purple-200 bg-purple-900/30 p-2 rounded">
                      <strong>Collections:</strong> strategies, performance
                    </div>
                  </div>
                </div>
                <div className="ml-6 h-8 w-0.5 bg-purple-400"></div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="flex-1 bg-blue-500/20 rounded-lg p-4">
                    <h3 className="text-white font-bold mb-2 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      AI Prediction Engine (Scheduled/Manual)
                    </h3>
                    <ul className="text-blue-100 text-sm space-y-1 ml-4">
                      <li>• <strong>Runs:</strong> predict_and_sign.py</li>
                      <li>• Fetches performance data from MongoDB</li>
                      <li>• Calculates features (Sharpe ratio, volatility, momentum, etc.)</li>
                      <li>• ML model predicts optimal allocation scores</li>
                      <li>• Normalizes to 100% total allocation (min 5%, max 40% per strategy)</li>
                      <li>• Calculates confidence score (70-95%)</li>
                    </ul>
                    <div className="mt-2 text-xs text-blue-200 bg-blue-900/30 p-2 rounded">
                      <strong>Trigger:</strong> Cron job (e.g., daily at 2 AM) or manual execution
                    </div>
                  </div>
                </div>
                <div className="ml-6 h-8 w-0.5 bg-blue-400"></div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="flex-1 bg-indigo-500/20 rounded-lg p-4">
                    <h3 className="text-white font-bold mb-2 flex items-center">
                      <FileSignature className="w-5 h-5 mr-2" />
                      Cryptographic Signing (EIP-712)
                    </h3>
                    <ul className="text-indigo-100 text-sm space-y-1 ml-4">
                      <li>• AI agent creates structured data (allocations, timestamp, nonce)</li>
                      <li>• Signs using private key with EIP-712 standard</li>
                      <li>• Generates verifiable signature</li>
                      <li>• Increments nonce (prevents replay attacks)</li>
                    </ul>
                    <div className="mt-2 text-xs text-indigo-200 bg-indigo-900/30 p-2 rounded font-mono">
                      signature = sign(hash(recommendation_data))
                    </div>
                  </div>
                </div>
                <div className="ml-6 h-8 w-0.5 bg-indigo-400"></div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div className="flex-1 bg-cyan-500/20 rounded-lg p-4">
                    <h3 className="text-white font-bold mb-2 flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Save to MongoDB
                    </h3>
                    <ul className="text-cyan-100 text-sm space-y-1 ml-4">
                      <li>• Stores recommendation in 'recommendations' collection</li>
                      <li>• Status: 'pending', submitted: false</li>
                      <li>• Includes: allocations, signature, confidence, timestamp</li>
                    </ul>
                    <div className="mt-2 text-xs text-cyan-200 bg-cyan-900/30 p-2 rounded">
                      <strong>Collection:</strong> recommendations
                    </div>
                  </div>
                </div>
                <div className="ml-6 h-8 w-0.5 bg-cyan-400"></div>
              </div>

              {/* Step 5 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    5
                  </div>
                  <div className="flex-1 bg-green-500/20 rounded-lg p-4">
                    <h3 className="text-white font-bold mb-2 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Keeper Service (Continuous Polling)
                    </h3>
                    <ul className="text-green-100 text-sm space-y-1 ml-4">
                      <li>• <strong>Runs:</strong> keeper/keeper.js (always running)</li>
                      <li>• Polls MongoDB every 60 seconds for pending recommendations</li>
                      <li>• Checks gas price (skips if too high)</li>
                      <li>• Validates deadline hasn't expired</li>
                      <li>• Verifies confidence meets minimum threshold</li>
                    </ul>
                    <div className="mt-2 text-xs text-green-200 bg-green-900/30 p-2 rounded">
                      <strong>Trigger:</strong> Run as background service (systemd, pm2, or Docker)
                    </div>
                  </div>
                </div>
                <div className="ml-6 h-8 w-0.5 bg-green-400"></div>
              </div>

              {/* Step 6 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                    6
                  </div>
                  <div className="flex-1 bg-yellow-500/20 rounded-lg p-4">
                    <h3 className="text-white font-bold mb-2 flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Blockchain Submission
                    </h3>
                    <ul className="text-yellow-100 text-sm space-y-1 ml-4">
                      <li>• Keeper calls: contract.executeAIRecommendation(recommendation, signature)</li>
                      <li>• Smart contract verifies signature using ecrecover</li>
                      <li>• Checks: agent authorized, nonce valid, deadline not expired</li>
                      <li>• If valid: Updates strategy allocations on-chain</li>
                      <li>• Emits event: RecommendationExecuted</li>
                    </ul>
                    <div className="mt-2 text-xs text-yellow-200 bg-yellow-900/30 p-2 rounded">
                      <strong>Gas Cost:</strong> ~150,000 - 300,000 gas
                    </div>
                  </div>
                </div>
                <div className="ml-6 h-8 w-0.5 bg-yellow-400"></div>
              </div>

              {/* Step 7 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    7
                  </div>
                  <div className="flex-1 bg-emerald-500/20 rounded-lg p-4">
                    <h3 className="text-white font-bold mb-2 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Update Status & Monitor
                    </h3>
                    <ul className="text-emerald-100 text-sm space-y-1 ml-4">
                      <li>• Keeper updates MongoDB: status='executed', submitted=true</li>
                      <li>• Stores transaction hash and block number</li>
                      <li>• On failure: status='failed', retry or alert</li>
                      <li>• Monitoring dashboard shows success rate</li>
                    </ul>
                    <div className="mt-2 text-xs text-emerald-200 bg-emerald-900/30 p-2 rounded">
                      <strong>Loop continues:</strong> Back to Step 1 for continuous optimization
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Deployment & Triggering */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('deployment')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold mb-6"
          >
            <span>🚀 Deployment & Triggering</span>
            {expandedSection === 'deployment' ? <ChevronDown /> : <ChevronRight />}
          </button>

          {expandedSection === 'deployment' && (
            <div className="space-y-6">
              <div className="bg-purple-500/20 rounded-lg p-4">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Production Deployment Steps
                </h3>
                <div className="space-y-4 text-purple-100 text-sm">
                  <div>
                    <strong className="text-white">1. Deploy Smart Contract</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Deploy StrategyManager.sol to Ethereum/L2</li>
                      <li>• Add AI agent address: addAgent(agentAddress)</li>
                      <li>• Verify contract on Etherscan</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-white">2. Setup Server/VPS</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Provision server (AWS EC2, DigitalOcean, etc.)</li>
                      <li>• Install: Node.js, Python, MongoDB</li>
                      <li>• Clone repository</li>
                      <li>• Configure .env with production values</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-white">3. Train ML Model</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Collect historical strategy data</li>
                      <li>• Run: python train_model.py</li>
                      <li>• Generate: strategy_model.pkl</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-white">4. Setup Scheduled Jobs</strong>
                    <div className="bg-purple-900/30 p-3 rounded mt-2 font-mono text-xs">
                      <div># Crontab for AI Prediction (daily at 2 AM)</div>
                      <div>0 2 * * * cd /path/to/project && python backend/models/predict_and_sign.py</div>
                      <div className="mt-2"># Or use systemd timer, AWS Lambda, etc.</div>
                    </div>
                  </div>

                  <div>
                    <strong className="text-white">5. Run Keeper Service</strong>
                    <div className="bg-purple-900/30 p-3 rounded mt-2 font-mono text-xs">
                      <div># Using PM2 (recommended)</div>
                      <div>pm2 start keeper/keeper.js --name "insight-keeper"</div>
                      <div>pm2 save</div>
                      <div>pm2 startup</div>
                      <div className="mt-2"># Or using systemd</div>
                      <div>sudo systemctl enable insight-keeper</div>
                      <div>sudo systemctl start insight-keeper</div>
                    </div>
                  </div>

                  <div>
                    <strong className="text-white">6. Monitoring & Alerts</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Setup logging (Winston, Datadog)</li>
                      <li>• Configure alerts (email, Slack, PagerDuty)</li>
                      <li>• Monitor: gas prices, success rate, errors</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/20 rounded-lg p-4">
                <h3 className="text-white font-bold mb-3">⏰ How It Triggers</h3>
                <div className="space-y-3 text-blue-100 text-sm">
                  <div>
                    <strong className="text-white">Option 1: Scheduled (Recommended)</strong>
                    <p className="ml-4 mt-1">Cron job runs predict_and_sign.py daily/hourly → Keeper picks it up automatically</p>
                  </div>
                  <div>
                    <strong className="text-white">Option 2: Event-Based</strong>
                    <p className="ml-4 mt-1">Triggered on market events, volatility spikes, or significant strategy performance changes</p>
                  </div>
                  <div>
                    <strong className="text-white">Option 3: Manual</strong>
                    <p className="ml-4 mt-1">Admin runs: python predict_and_sign.py manually when needed</p>
                  </div>
                  <div>
                    <strong className="text-white">Option 4: API Endpoint</strong>
                    <p className="ml-4 mt-1">Create REST API → Frontend dashboard triggers predictions on demand</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Architecture */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('architecture')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold mb-6"
          >
            <span>🏗️ System Architecture</span>
            {expandedSection === 'architecture' ? <ChevronDown /> : <ChevronRight />}
          </button>

          {expandedSection === 'architecture' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-3">🐍 Python Components</h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li><strong>predict_and_sign.py</strong><br/>ML prediction & signing</li>
                    <li><strong>train_model.py</strong><br/>Model training pipeline</li>
                    <li><strong>setup_database.py</strong><br/>Database initialization</li>
                    <li><strong>debug_database.py</strong><br/>Data validation</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-3">🟢 Node.js Components</h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li><strong>keeper.js</strong><br/>Blockchain submission service</li>
                    <li><strong>verify-env.js</strong><br/>Environment validation</li>
                    <li><strong>ethers.js</strong><br/>Web3 interactions</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-3">🗄️ Database (MongoDB)</h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li><strong>strategies</strong><br/>Strategy metadata & allocations</li>
                    <li><strong>performance</strong><br/>Historical performance data</li>
                    <li><strong>recommendations</strong><br/>AI predictions & signatures</li>
                    <li><strong>agent_nonces</strong><br/>Replay attack prevention</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-3">⛓️ Smart Contract</h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li><strong>StrategyManager.sol</strong><br/>Main contract</li>
                    <li><strong>executeAIRecommendation()</strong><br/>Verify & execute</li>
                    <li><strong>Access Control</strong><br/>Agent authorization</li>
                    <li><strong>EIP-712</strong><br/>Signature verification</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Features */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('security')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold mb-6"
          >
            <span>🔒 Security Features</span>
            {expandedSection === 'security' ? <ChevronDown /> : <ChevronRight />}
          </button>

          {expandedSection === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                <h3 className="text-red-200 font-bold mb-2">🛡️ Agent Authorization</h3>
                <p className="text-red-100 text-sm">Only whitelisted addresses can submit recommendations</p>
              </div>
              <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
                <h3 className="text-orange-200 font-bold mb-2">🔢 Nonce Management</h3>
                <p className="text-orange-100 text-sm">Prevents replay attacks with incrementing nonces</p>
              </div>
              <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                <h3 className="text-yellow-200 font-bold mb-2">⏱️ Deadline Validation</h3>
                <p className="text-yellow-100 text-sm">Recommendations expire after 1 hour</p>
              </div>
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-green-200 font-bold mb-2">✍️ EIP-712 Signatures</h3>
                <p className="text-green-100 text-sm">Cryptographically verifiable recommendations</p>
              </div>
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <h3 className="text-blue-200 font-bold mb-2">📊 Confidence Threshold</h3>
                <p className="text-blue-100 text-sm">Minimum 70% confidence required</p>
              </div>
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-purple-200 font-bold mb-2">⛽ Gas Price Limits</h3>
                <p className="text-purple-100 text-sm">Skips submission if gas too high</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Reference */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-white/20">
          <h2 className="text-white text-2xl font-bold mb-4">⚡ Quick Reference Commands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-bold mb-2">Setup & Testing</h3>
              <div className="font-mono text-xs text-purple-100 space-y-1">
                <div>python setup_database.py</div>
                <div>python debug_database.py</div>
                <div>node verify-env.js</div>
                <div>node test-keeper-setup.js</div>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-bold mb-2">Production</h3>
              <div className="font-mono text-xs text-blue-100 space-y-1">
                <div>python predict_and_sign.py</div>
                <div>pm2 start keeper/keeper.js</div>
                <div>pm2 logs insight-keeper</div>
                <div>pm2 restart insight-keeper</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Timeline */}
        <div className="mt-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-white/20">
          <h2 className="text-white text-2xl font-bold mb-4">📅 Typical Daily Flow</h2>
          <div className="space-y-2 text-emerald-100">
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">00:00</span>
              <span>→ Strategies collect performance data continuously</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">02:00</span>
              <span>→ Cron triggers predict_and_sign.py</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">02:01</span>
              <span>→ AI analyzes data, predicts allocations, signs recommendation</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">02:02</span>
              <span>→ Recommendation saved to MongoDB (status: pending)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">02:03</span>
              <span>→ Keeper detects pending recommendation</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">02:04</span>
              <span>→ Keeper checks gas price, validates deadline</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">02:05</span>
              <span>→ Submits transaction to blockchain</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">02:06</span>
              <span>→ Smart contract verifies signature & executes</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">02:07</span>
              <span>→ Strategy allocations updated on-chain ✅</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-mono">02:08</span>
              <span>→ MongoDB updated (status: executed)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-purple-300 text-sm">
          <p>Built with Python, Node.js, MongoDB, Solidity & Machine Learning</p>
          <p className="mt-2">🤖 Automated • 🔒 Secure • 📊 Data-Driven</p>
        </div>
      </div>
    </div>
  );
};

export default SystemFlow;