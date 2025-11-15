import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Wallet, ArrowDown, Lock, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';

const DepositFlow = () => {
  const [expandedSection, setExpandedSection] = useState('userDeposit');

  const toggleSection = (section: any) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-4">
            💰 Yield Vault Deposit Flow
          </h1>
          <p className="text-blue-200 text-lg">
            Step-by-step function calls when a user deposits funds into the yield vault
          </p>
        </div>

        {/* Overview Diagram */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-white text-2xl font-bold mb-6">🎯 High-Level Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-500/20 p-4 rounded-lg text-center border border-green-500/30">
              <Wallet className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <div className="text-green-100 font-bold">User Deposits</div>
              <div className="text-green-200 text-sm">USDC → Vault</div>
            </div>
            <ArrowDown className="hidden md:block w-6 h-6 mx-auto mt-8 text-white" />
            <div className="bg-blue-500/20 p-4 rounded-lg text-center border border-blue-500/30">
              <Lock className="w-8 h-8 mx-auto mb-2 text-blue-300" />
              <div className="text-blue-100 font-bold">Funds Allocated</div>
              <div className="text-blue-200 text-sm">To Strategies</div>
            </div>
            <ArrowDown className="hidden md:block w-6 h-6 mx-auto mt-8 text-white" />
            <div className="bg-purple-500/20 p-4 rounded-lg text-center border border-purple-500/30">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-300" />
              <div className="text-purple-100 font-bold">Yield Generated</div>
              <div className="text-purple-200 text-sm">Passive Income</div>
            </div>
          </div>
        </div>

        {/* Step 1: User Initiates Deposit */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('userDeposit')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold mb-4"
          >
            <span>1️⃣ User Initiates Deposit (Frontend)</span>
            {expandedSection === 'userDeposit' ? <ChevronDown /> : <ChevronRight />}
          </button>

          {expandedSection === 'userDeposit' && (
            <div className="space-y-4">
              <div className="bg-green-900/30 rounded-lg p-4">
                <h3 className="text-green-300 font-bold mb-3">🌐 Frontend/User Wallet</h3>
                <div className="space-y-3">
                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-green-400 font-mono text-sm mb-2">Step 1.1: User approves USDC spending</div>
                    <code className="text-green-200 text-xs block">
                      await usdcContract.approve(vaultAddress, depositAmount)
                    </code>
                    <div className="text-green-300 text-xs mt-2">
                      📝 Gives vault permission to spend user's USDC
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-green-400 font-mono text-sm mb-2">Step 1.2: User calls deposit</div>
                    <code className="text-green-200 text-xs block">
                      await yieldVault.deposit(depositAmount, userAddress)
                    </code>
                    <div className="text-green-300 text-xs mt-2">
                      💰 Amount: e.g., 1000 USDC
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Vault Contract Processing */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('vaultProcessing')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold mb-4"
          >
            <span>2️⃣ Yield Vault Contract (deposit function)</span>
            {expandedSection === 'vaultProcessing' ? <ChevronDown /> : <ChevronRight />}
          </button>

          {expandedSection === 'vaultProcessing' && (
            <div className="space-y-4">
              <div className="bg-blue-900/30 rounded-lg p-4">
                <h3 className="text-blue-300 font-bold mb-3">🔷 YieldVault.sol</h3>
                
                <div className="space-y-3">
                  <div className="bg-black/30 p-3 rounded border-l-4 border-blue-500">
                    <div className="text-blue-400 font-mono text-sm mb-2">Function: deposit(uint256 assets, address receiver)</div>
                    <div className="text-blue-200 text-xs space-y-2">
                      <div>📥 <strong>Input:</strong> assets = 1000 USDC, receiver = user address</div>
                      <div>🔍 <strong>Validates:</strong> amount &gt; 0, contract not paused</div>
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-blue-400 font-mono text-sm mb-2">Step 2.1: Transfer USDC from user to vault</div>
                    <code className="text-blue-200 text-xs block">
                      IERC20(asset).transferFrom(msg.sender, address(this), assets)
                    </code>
                    <div className="text-blue-300 text-xs mt-2">
                      💸 Moves 1000 USDC: User Wallet → Vault Contract
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-blue-400 font-mono text-sm mb-2">Step 2.2: Calculate shares to mint</div>
                    <code className="text-blue-200 text-xs block">
                      shares = previewDeposit(assets)<br/>
                      // shares = (assets * totalSupply) / totalAssets<br/>
                      // Example: (1000 * 10000) / 10000 = 1000 shares
                    </code>
                    <div className="text-blue-300 text-xs mt-2">
                      🎫 Calculates vault shares based on current exchange rate
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-blue-400 font-mono text-sm mb-2">Step 2.3: Mint vault tokens to user</div>
                    <code className="text-blue-200 text-xs block">
                      _mint(receiver, shares)
                    </code>
                    <div className="text-blue-300 text-xs mt-2">
                      🪙 User receives 1000 yUSDC tokens (vault shares)
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-blue-400 font-mono text-sm mb-2">Step 2.4: Update total assets</div>
                    <code className="text-blue-200 text-xs block">
                      totalAssets += assets<br/>
                      // totalAssets: 10,000 → 11,000 USDC
                    </code>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-blue-400 font-mono text-sm mb-2">Step 2.5: Emit event</div>
                    <code className="text-blue-200 text-xs block">
                      emit Deposit(msg.sender, receiver, assets, shares)
                    </code>
                    <div className="text-blue-300 text-xs mt-2">
                      📡 Event logged on blockchain for tracking
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded border-l-4 border-green-500">
                    <div className="text-green-400 font-mono text-sm mb-2">✅ Return: shares (1000)</div>
                    <div className="text-green-300 text-xs">
                      Transaction complete! User now holds vault shares.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Automatic Rebalancing */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('rebalancing')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold mb-4"
          >
            <span>3️⃣ Automatic Fund Allocation (Background)</span>
            {expandedSection === 'rebalancing' ? <ChevronDown /> : <ChevronRight />}
          </button>

          {expandedSection === 'rebalancing' && (
            <div className="space-y-4">
              <div className="bg-purple-900/30 rounded-lg p-4">
                <h3 className="text-purple-300 font-bold mb-3">🔄 StrategyManager.sol</h3>

                <div className="bg-yellow-900/20 p-3 rounded mb-4 border border-yellow-500/30">
                  <div className="text-yellow-200 text-sm">
                    ⚠️ <strong>Note:</strong> This happens separately from deposit, typically triggered by:
                    <ul className="ml-4 mt-2 space-y-1">
                      <li>• Manual call by admin/keeper</li>
                      <li>• After certain deposit threshold reached</li>
                      <li>• AI recommendation system (as per your setup)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-black/30 p-3 rounded border-l-4 border-purple-500">
                    <div className="text-purple-400 font-mono text-sm mb-2">Triggered by: executeAIRecommendation() or rebalance()</div>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-purple-400 font-mono text-sm mb-2">Step 3.1: Get current allocations</div>
                    <code className="text-purple-200 text-xs block">
                      currentAllocations = getAllocations()<br/>
                      // Example: [2500, 2500, 2500, 2500] = 25% each
                    </code>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-purple-400 font-mono text-sm mb-2">Step 3.2: Calculate amounts for each strategy</div>
                    <code className="text-purple-200 text-xs block">
                      totalFunds = vault.totalAssets() // 11,000 USDC<br/>
                      <br/>
                      for each strategy:<br/>
                      &nbsp;&nbsp;amount = (totalFunds * allocation) / 10000<br/>
                      &nbsp;&nbsp;// Strategy 0: 11,000 * 2500 / 10000 = 2,750 USDC<br/>
                      &nbsp;&nbsp;// Strategy 1: 11,000 * 2500 / 10000 = 2,750 USDC<br/>
                      &nbsp;&nbsp;// Strategy 2: 11,000 * 2500 / 10000 = 2,750 USDC<br/>
                      &nbsp;&nbsp;// Strategy 3: 11,000 * 2500 / 10000 = 2,750 USDC
                    </code>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-purple-400 font-mono text-sm mb-2">Step 3.3: Deploy to strategies</div>
                    <code className="text-purple-200 text-xs block">
                      for each strategy:<br/>
                      &nbsp;&nbsp;vault.withdraw(amount, strategyAddress)<br/>
                      &nbsp;&nbsp;strategy.deposit(amount)
                    </code>
                    <div className="text-purple-300 text-xs mt-2 space-y-1">
                      <div>📤 2,750 USDC → Compound Strategy (lend USDC)</div>
                      <div>📤 2,750 USDC → Aave Strategy (supply USDC)</div>
                      <div>📤 2,750 USDC → Curve Strategy (provide liquidity)</div>
                      <div>📤 2,750 USDC → Yearn Strategy (deposit in vault)</div>
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <div className="text-purple-400 font-mono text-sm mb-2">Step 3.4: Update strategy balances</div>
                    <code className="text-purple-200 text-xs block">
                      strategyBalances[strategyId] = amount<br/>
                      totalDeployed += amount
                    </code>
                  </div>

                  <div className="bg-black/30 p-3 rounded border-l-4 border-green-500">
                    <div className="text-green-400 font-mono text-sm mb-2">✅ Funds now earning yield across 4 strategies!</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Strategy Execution */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('strategyExecution')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold mb-4"
          >
            <span>4️⃣ Individual Strategy Execution</span>
            {expandedSection === 'strategyExecution' ? <ChevronDown /> : <ChevronRight />}
          </button>

          {expandedSection === 'strategyExecution' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cyan-900/30 rounded-lg p-4">
                  <h3 className="text-cyan-300 font-bold mb-3">💎 Compound Strategy</h3>
                  <div className="space-y-2 text-cyan-200 text-sm">
                    <div className="bg-black/30 p-2 rounded">
                      <code className="text-xs">
                        function deposit(uint256 amount)<br/>
                        &nbsp;&nbsp;USDC.approve(cUSDC, amount)<br/>
                        &nbsp;&nbsp;cUSDC.mint(amount)<br/>
                        &nbsp;&nbsp;// Receives cUSDC tokens<br/>
                        &nbsp;&nbsp;// Starts earning ~4% APY
                      </code>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-900/30 rounded-lg p-4">
                  <h3 className="text-teal-300 font-bold mb-3">🏦 Aave Strategy</h3>
                  <div className="space-y-2 text-teal-200 text-sm">
                    <div className="bg-black/30 p-2 rounded">
                      <code className="text-xs">
                        function deposit(uint256 amount)<br/>
                        &nbsp;&nbsp;USDC.approve(aavePool, amount)<br/>
                        &nbsp;&nbsp;aavePool.supply(USDC, amount)<br/>
                        &nbsp;&nbsp;// Receives aUSDC tokens<br/>
                        &nbsp;&nbsp;// Starts earning ~3.5% APY
                      </code>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/30 rounded-lg p-4">
                  <h3 className="text-indigo-300 font-bold mb-3">📈 Curve Strategy</h3>
                  <div className="space-y-2 text-indigo-200 text-sm">
                    <div className="bg-black/30 p-2 rounded">
                      <code className="text-xs">
                        function deposit(uint256 amount)<br/>
                        &nbsp;&nbsp;USDC.approve(curvePool, amount)<br/>
                        &nbsp;&nbsp;curvePool.add_liquidity([amount,0,0])<br/>
                        &nbsp;&nbsp;// Receives LP tokens<br/>
                        &nbsp;&nbsp;// Earns trading fees + CRV
                      </code>
                    </div>
                  </div>
                </div>

                <div className="bg-violet-900/30 rounded-lg p-4">
                  <h3 className="text-violet-300 font-bold mb-3">🌾 Yearn Strategy</h3>
                  <div className="space-y-2 text-violet-200 text-sm">
                    <div className="bg-black/30 p-2 rounded">
                      <code className="text-xs">
                        function deposit(uint256 amount)<br/>
                        &nbsp;&nbsp;USDC.approve(yearnVault, amount)<br/>
                        &nbsp;&nbsp;yearnVault.deposit(amount)<br/>
                        &nbsp;&nbsp;// Receives yUSDC tokens<br/>
                        &nbsp;&nbsp;// Auto-compounds yield
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 5: Ongoing Operations */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <button
            onClick={() => toggleSection('ongoing')}
            className="w-full flex items-center justify-between text-white text-xl font-semibold mb-4"
          >
            <span>5️⃣ Ongoing Operations & Yield Accrual</span>
            {expandedSection === 'ongoing' ? <ChevronDown /> : <ChevronRight />}
          </button>

          {expandedSection === 'ongoing' && (
            <div className="space-y-4">
              <div className="bg-emerald-900/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="bg-black/30 p-3 rounded">
                    <h3 className="text-emerald-300 font-bold mb-2">📊 Performance Tracking</h3>
                    <code className="text-emerald-200 text-xs block">
                      // Periodically called by monitoring service<br/>
                      function updatePerformanceData()<br/>
                      &nbsp;&nbsp;for each strategy:<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;currentValue = strategy.totalAssets()<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;yield = currentValue - deployed<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;apy = calculateAPY(yield, timeElapsed)<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;saveToMongoDB(strategyAddress, currentValue, apy)
                    </code>
                    <div className="text-emerald-300 text-xs mt-2">
                      💾 Stored in MongoDB for AI analysis
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <h3 className="text-emerald-300 font-bold mb-2">🤖 AI Rebalancing (Daily)</h3>
                    <code className="text-emerald-200 text-xs block">
                      // Triggered by cron job at 2 AM<br/>
                      1. AI analyzes performance data<br/>
                      2. Predicts new optimal allocations<br/>
                      3. Signs recommendation<br/>
                      4. Keeper submits to blockchain<br/>
                      5. executeAIRecommendation() called<br/>
                      6. Funds rebalanced across strategies
                    </code>
                  </div>

                  <div className="bg-black/30 p-3 rounded">
                    <h3 className="text-emerald-300 font-bold mb-2">💰 Yield Accumulation</h3>
                    <div className="text-emerald-200 text-xs space-y-2 mt-2">
                      <div>• <strong>Compound:</strong> Interest compounds automatically in cUSDC</div>
                      <div>• <strong>Aave:</strong> aUSDC balance increases over time</div>
                      <div>• <strong>Curve:</strong> Trading fees + CRV rewards accumulate</div>
                      <div>• <strong>Yearn:</strong> Auto-harvests and compounds</div>
                      <div className="mt-3 p-2 bg-emerald-800/30 rounded">
                        📈 User's vault share value increases as strategies earn yield
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Complete Function Call Chain */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-white text-2xl font-bold mb-4">📋 Complete Function Call Chain</h2>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-blue-200 space-y-1">
            <div className="text-green-400">// USER ACTION</div>
            <div>1. USDC.approve(vaultAddress, 1000)</div>
            <div>2. YieldVault.deposit(1000, userAddress)</div>
            <div className="ml-4">↳ USDC.transferFrom(user, vault, 1000)</div>
            <div className="ml-4">↳ _calculateShares(1000) → 1000 shares</div>
            <div className="ml-4">↳ _mint(user, 1000)</div>
            <div className="ml-4">↳ emit Deposit(user, 1000, 1000)</div>
            
            <div className="text-yellow-400 mt-3">// BACKGROUND REBALANCING</div>
            <div>3. StrategyManager.executeAIRecommendation(rec, sig)</div>
            <div className="ml-4">↳ _verifySignature(rec, sig)</div>
            <div className="ml-4">↳ _updateAllocations([3195, 3295, 3510, 0])</div>
            <div className="ml-4">↳ _rebalanceStrategies()</div>
            <div className="ml-8">↳ YieldVault.withdraw(2750, strategy0)</div>
            <div className="ml-8">↳ Strategy0.deposit(2750)</div>
            <div className="ml-12">↳ cUSDC.mint(2750)</div>
            <div className="ml-8">↳ Strategy1.deposit(2750)</div>
            <div className="ml-12">↳ aavePool.supply(2750)</div>
            <div className="ml-8">↳ Strategy2.deposit(2750)</div>
            <div className="ml-12">↳ curvePool.add_liquidity([2750,0,0])</div>
            <div className="ml-8">↳ Strategy3.deposit(2750)</div>
            <div className="ml-12">↳ yearnVault.deposit(2750)</div>
            
            <div className="text-purple-400 mt-3">// ONGOING OPERATIONS</div>
            <div>4. [Continuous] Strategies earn yield</div>
            <div>5. [Daily] updatePerformanceData() → MongoDB</div>
            <div>6. [Daily 2AM] AI predicts new allocations</div>
            <div>7. [Every 60s] Keeper checks & submits</div>
            <div>8. [On execution] Rebalance to new allocations</div>
          </div>
        </div>

        {/* State Changes Summary */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-white/20">
          <h2 className="text-white text-2xl font-bold mb-4">📊 State Changes Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-green-300 font-bold mb-3">Before Deposit</h3>
              <div className="text-green-200 text-sm space-y-1">
                <div>User USDC: 5,000</div>
                <div>User yUSDC: 0</div>
                <div>Vault USDC: 10,000</div>
                <div>Total Shares: 10,000</div>
                <div>Share Price: 1.0</div>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-emerald-300 font-bold mb-3">After Deposit</h3>
              <div className="text-emerald-200 text-sm space-y-1">
                <div>User USDC: 4,000 ⬇️</div>
                <div>User yUSDC: 1,000 ⬆️</div>
                <div>Vault USDC: 11,000 ⬆️</div>
                <div>Total Shares: 11,000 ⬆️</div>
                <div>Share Price: 1.0 (same)</div>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 md:col-span-2">
              <h3 className="text-blue-300 font-bold mb-3">After Rebalancing to Strategies</h3>
              <div className="text-blue-200 text-sm space-y-1">
                <div>Vault USDC: ~0 (idle)</div>
                <div>Compound: 2,750 USDC → cUSDC</div>
                <div>Aave: 2,750 USDC → aUSDC</div>
                <div>Curve: 2,750 USDC → LP tokens</div>
                <div>Yearn: 2,750 USDC → yUSDC</div>
                <div className="text-blue-300 font-bold mt-2">Total Deployed: 11,000 USDC ✅</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-blue-300 text-sm">
          <p className="mb-2">💡 Key Points:</p>
          <p>✅ Deposit is instant • 🔄 Rebalancing happens separately • 📈 Yield accrues continuously</p>
          <p className="mt-2">🤖 AI optimizes allocations automatically every day</p>
        </div>
      </div>
    </div>
  );
};

export default DepositFlow;