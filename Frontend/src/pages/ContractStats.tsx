import { useState } from 'react';
import { TrendingUp, Activity, DollarSign, Percent, Shield, Clock, Users, Info, Settings, CheckCircle, ArrowUpRight, ArrowDownRight, RefreshCw, Gauge } from 'lucide-react';
import DefaultLayout from '@/layouts/default';

export default function ContractStatsPage() {
    const [selectedContract, setSelectedContract] = useState('vault');

    // Vault Contract Stats
    const vaultStats = {
        contractAddress: '0x742d...4a9c',
        totalDeposited: 12847563,
        totalWithdrawn: 4235890,
        totalAssets: 8611673,
        totalShares: 2510823,
        sharePrice: 3.43,
        performanceFee: 1000, // 10%
        withdrawalFee: 50, // 0.5%
        liquidityBuffer: 500, // 5%
        lastRebalance: '2 hours ago',
        rebalanceInterval: '24 hours',
        feeRecipient: '0x89ab...def1',
        isPaused: false,
        totalUsers: 8429
    };

    // Strategy Manager Stats
    const strategyManagerStats = {
        contractAddress: '0x3f8c...7b2d',
        totalStrategies: 3,
        activeStrategies: 3,
        totalAllocation: 10000, // 100%
        vaultConnected: true
    };

    // Individual Strategy Stats
    const strategies = [
        {
            id: 1,
            name: 'Lending Strategy',
            contractAddress: '0x5a1b...9c3e',
            protocol: 'Aave V3',
            icon: '🏦',
            allocation: 4000,
            baseAPY: 1280,
            estimatedAPY: 1330,
            totalAssets: 3444669,
            totalHarvested: 125430,
            lastHarvest: '6 hours ago',
            accumulatedYield: 8234,
            active: true,
            lastYieldUpdate: '1 hour ago',
            totalDeposits: 3400000,
            totalWithdrawals: 980000,
            sharePrice: 1.013
        },
        {
            id: 2,
            name: 'Liquidity Strategy',
            protocol: 'Uniswap V3',
            contractAddress: '0x7e4f...2d8a',
            icon: '💧',
            allocation: 3500,
            baseAPY: 2450,
            estimatedAPY: 2580,
            totalAssets: 3014085,
            totalHarvested: 198540,
            lastHarvest: '4 hours ago',
            accumulatedYield: 12456,
            active: true,
            lastYieldUpdate: '45 mins ago',
            totalDeposits: 2900000,
            totalWithdrawals: 760000,
            sharePrice: 1.042
        },
        {
            id: 3,
            name: 'Strategy Pool',
            protocol: 'Yearn Finance',
            contractAddress: '0x9b2c...4f7e',
            icon: '⚡',
            allocation: 2500,
            baseAPY: 1920,
            estimatedAPY: 2010,
            totalAssets: 2152919,
            totalHarvested: 87320,
            lastHarvest: '8 hours ago',
            accumulatedYield: 6782,
            active: true,
            lastYieldUpdate: '30 mins ago',
            totalDeposits: 2100000,
            totalWithdrawals: 450000,
            sharePrice: 1.025
        }
    ];

    // Contract Functions Activity
    const recentActivity = [
        { function: 'deposit()', user: '0x742d...4a9c', amount: 5000, timestamp: '5 mins ago', status: 'success' },
        { function: 'withdraw()', user: '0x89ab...def1', amount: 2500, timestamp: '12 mins ago', status: 'success' },
        { function: 'rebalance()', user: 'Owner', amount: null, timestamp: '2 hours ago', status: 'success' },
        { function: 'harvest()', user: 'Vault', amount: null, timestamp: '4 hours ago', status: 'success' },
        { function: 'redeem()', user: '0x3f8c...7b2d', amount: 1500, timestamp: '6 hours ago', status: 'success' }
    ];

    const formatBasisPoints = (bp: number) => {
        return (bp / 100).toFixed(2) + '%';
    };

    const formatAPY = (apy: number) => {
        return (apy / 100).toFixed(2) + '%';
    };

    return (
        <DefaultLayout>
            <main className="overflow-hidden bg-background min-h-screen">
                {/* Background Effects */}
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                </div>

                <section className="relative">
                    <div className="relative pt-24 md:pt-36 pb-24">
                        <div className="absolute inset-0 -z-20">
                            <img
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                                width="3276"
                                height="4095"
                            />
                        </div>
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        
                        <div className="mx-auto max-w-7xl px-6">
                            {/* Header */}
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-bold">Contract Analytics</h1>
                                        <p className="text-sm text-muted-foreground mt-1">Smart contract statistics and monitoring</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contract Selector */}
                            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                                <button
                                    onClick={() => setSelectedContract('vault')}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                                        selectedContract === 'vault'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'
                                    }`}>
                                    Yield Vault
                                </button>
                                <button
                                    onClick={() => setSelectedContract('manager')}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                                        selectedContract === 'manager'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'
                                    }`}>
                                    Strategy Manager
                                </button>
                                <button
                                    onClick={() => setSelectedContract('strategies')}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                                        selectedContract === 'strategies'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'
                                    }`}>
                                    Base Strategies
                                </button>
                                <button
                                    onClick={() => setSelectedContract('activity')}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                                        selectedContract === 'activity'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'
                                    }`}>
                                    Activity Log
                                </button>
                            </div>

                            {/* Vault Contract View */}
                            {selectedContract === 'vault' && (
                                <>
                                    {/* Contract Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center">
                                                    <CheckCircle className="w-5 h-5 text-cyan-400 dark:text-cyan-400" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Contract Status</span>
                                            </div>
                                            <div className="text-2xl font-bold text-cyan-400 dark:text-cyan-400">Active</div>
                                            <div className="text-xs text-muted-foreground mt-2">{vaultStats.isPaused ? 'Paused' : 'Running'}</div>
                                        </div>

                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Total Users</span>
                                            </div>
                                            <div className="text-3xl font-bold">{vaultStats.totalUsers.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground mt-2">Active depositors</div>
                                        </div>

                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Last Rebalance</span>
                                            </div>
                                            <div className="text-2xl font-bold">{vaultStats.lastRebalance}</div>
                                            <div className="text-xs text-muted-foreground mt-2">Interval: {vaultStats.rebalanceInterval}</div>
                                        </div>

                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <Shield className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Liquidity Buffer</span>
                                            </div>
                                            <div className="text-3xl font-bold">{formatBasisPoints(vaultStats.liquidityBuffer)}</div>
                                            <div className="text-xs text-muted-foreground mt-2">Reserved in vault</div>
                                        </div>
                                    </div>

                                    {/* Main Vault Stats */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                        <div className="lg:col-span-2 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-2xl font-bold">Vault Metrics</h2>
                                                <div className="px-3 py-1 bg-muted rounded-lg font-mono text-xs">{vaultStats.contractAddress}</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <ArrowDownRight className="w-4 h-4 text-cyan-400 dark:text-cyan-400" />
                                                        <span className="text-sm text-muted-foreground">Total Deposited</span>
                                                    </div>
                                                    <div className="text-3xl font-bold mb-1">${(vaultStats.totalDeposited / 1000000).toFixed(2)}M</div>
                                                    <div className="text-xs text-muted-foreground">Lifetime deposits</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <ArrowUpRight className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                                                        <span className="text-sm text-muted-foreground">Total Withdrawn</span>
                                                    </div>
                                                    <div className="text-3xl font-bold mb-1">${(vaultStats.totalWithdrawn / 1000000).toFixed(2)}M</div>
                                                    <div className="text-xs text-muted-foreground">Lifetime withdrawals</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <DollarSign className="w-4 h-4 text-primary" />
                                                        <span className="text-sm text-muted-foreground">Total Assets</span>
                                                    </div>
                                                    <div className="text-3xl font-bold mb-1">${(vaultStats.totalAssets / 1000000).toFixed(2)}M</div>
                                                    <div className="text-xs text-muted-foreground">Current TVL</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Activity className="w-4 h-4 text-primary" />
                                                        <span className="text-sm text-muted-foreground">Total Shares</span>
                                                    </div>
                                                    <div className="text-3xl font-bold mb-1">{(vaultStats.totalShares / 1000).toFixed(1)}K</div>
                                                    <div className="text-xs text-muted-foreground">${vaultStats.sharePrice} per share</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fee Configuration */}
                                        <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <Settings className="w-5 h-5 text-primary" />
                                                <h3 className="text-xl font-bold">Fee Configuration</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm text-muted-foreground">Performance Fee</span>
                                                        <Info className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="text-2xl font-bold">{formatBasisPoints(vaultStats.performanceFee)}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">On harvested yield</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm text-muted-foreground">Withdrawal Fee</span>
                                                        <Info className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="text-2xl font-bold">{formatBasisPoints(vaultStats.withdrawalFee)}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">On withdraw/redeem</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="text-sm text-muted-foreground mb-2">Fee Recipient</div>
                                                    <div className="font-mono text-sm break-all">{vaultStats.feeRecipient}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contract Functions */}
                                    <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6 mb-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Available Functions</h2>
                                            <span className="text-sm text-muted-foreground">ERC4626 Standard</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {['deposit()', 'withdraw()', 'mint()', 'redeem()', 'rebalance()', 'harvest()', 'emergencyWithdrawAll()', 'pause()'].map((func, index) => (
                                                <div key={index} className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors cursor-pointer">
                                                    <div className="font-mono text-sm font-semibold">{func}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Strategy Manager View */}
                            {selectedContract === 'manager' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <Activity className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Total Strategies</span>
                                            </div>
                                            <div className="text-4xl font-bold">{strategyManagerStats.totalStrategies}</div>
                                            <div className="text-xs text-muted-foreground mt-2">Registered</div>
                                        </div>

                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center">
                                                    <CheckCircle className="w-5 h-5 text-cyan-400 dark:text-cyan-400" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Active Strategies</span>
                                            </div>
                                            <div className="text-4xl font-bold text-cyan-400 dark:text-cyan-400">{strategyManagerStats.activeStrategies}</div>
                                            <div className="text-xs text-muted-foreground mt-2">Currently running</div>
                                        </div>

                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <Percent className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Total Allocation</span>
                                            </div>
                                            <div className="text-4xl font-bold">{formatBasisPoints(strategyManagerStats.totalAllocation)}</div>
                                            <div className="text-xs text-muted-foreground mt-2">Fully allocated</div>
                                        </div>

                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <Shield className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Vault Connection</span>
                                            </div>
                                            <div className="text-2xl font-bold text-cyan-400 dark:text-cyan-400">Connected</div>
                                            <div className="text-xs text-muted-foreground mt-2 font-mono">{vaultStats.contractAddress}</div>
                                        </div>
                                    </div>

                                    <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6 mb-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Strategy Manager Contract</h2>
                                            <div className="px-3 py-1 bg-muted rounded-lg font-mono text-xs">{strategyManagerStats.contractAddress}</div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <h3 className="text-lg font-semibold">Allocation Breakdown</h3>
                                            {strategies.map((strategy) => (
                                                <div key={strategy.id} className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{strategy.icon}</span>
                                                            <div>
                                                                <div className="font-semibold">{strategy.name}</div>
                                                                <div className="text-xs text-muted-foreground font-mono">{strategy.contractAddress}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold">{formatBasisPoints(strategy.allocation)}</div>
                                                            <div className="text-xs text-muted-foreground">Allocation</div>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                                                            style={{ width: `${strategy.allocation / 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t pt-6">
                                            <h3 className="text-lg font-semibold mb-4">Available Functions</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {['addStrategy()', 'removeStrategy()', 'updateAllocation()', 'getActiveStrategies()', 'getTotalAllocation()', 'setVault()'].map((func, index) => (
                                                    <div key={index} className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors cursor-pointer">
                                                        <div className="font-mono text-sm font-semibold">{func}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Base Strategies View */}
                            {selectedContract === 'strategies' && (
                                <>
                                    <div className="space-y-6 mb-8">
                                        {strategies.map((strategy) => (
                                            <div key={strategy.id} className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-5xl">{strategy.icon}</div>
                                                        <div>
                                                            <h3 className="text-2xl font-bold mb-1">{strategy.name}</h3>
                                                            <p className="text-sm text-muted-foreground mb-1">{strategy.protocol}</p>
                                                            <p className="text-xs font-mono text-muted-foreground">{strategy.contractAddress}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 dark:text-cyan-400 rounded-full text-xs font-semibold">
                                                            Active
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Strategy Stats Grid */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                    <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="text-xs text-muted-foreground mb-2">Base APY</div>
                                                        <div className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">{formatAPY(strategy.baseAPY)}</div>
                                                    </div>

                                                    <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="text-xs text-muted-foreground mb-2">Estimated APY</div>
                                                        <div className="text-2xl font-bold text-cyan-400 dark:text-cyan-400">{formatAPY(strategy.estimatedAPY)}</div>
                                                    </div>

                                                    <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="text-xs text-muted-foreground mb-2">Total Assets</div>
                                                        <div className="text-2xl font-bold">${(strategy.totalAssets / 1000000).toFixed(2)}M</div>
                                                    </div>

                                                    <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="text-xs text-muted-foreground mb-2">Share Price</div>
                                                        <div className="text-2xl font-bold">${strategy.sharePrice}</div>
                                                    </div>
                                                </div>

                                                {/* Yield Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                    <div className="bg-gradient-to-br from-primary/5 to-primary/0 border rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <RefreshCw className="w-4 h-4 text-primary" />
                                                            <span className="text-sm text-muted-foreground">Total Harvested</span>
                                                        </div>
                                                        <div className="text-2xl font-bold">${(strategy.totalHarvested / 1000).toFixed(1)}K</div>
                                                        <div className="text-xs text-muted-foreground mt-1">Last harvest: {strategy.lastHarvest}</div>
                                                    </div>

                                                    <div className="bg-gradient-to-br from-cyan-400/5 to-cyan-400/0 border border-cyan-400/20 rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <TrendingUp className="w-4 h-4 text-cyan-400" />
                                                            <span className="text-sm text-muted-foreground">Accumulated Yield</span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-cyan-400">${(strategy.accumulatedYield / 1000).toFixed(1)}K</div>
                                                        <div className="text-xs text-muted-foreground mt-1">Updated: {strategy.lastYieldUpdate}</div>
                                                    </div>

                                                    <div className="bg-gradient-to-br from-indigo-500/5 to-indigo-500/0 border border-indigo-500/20 rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Gauge className="w-4 h-4 text-indigo-500" />
                                                            <span className="text-sm text-muted-foreground">Allocation Weight</span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-indigo-500">{formatBasisPoints(strategy.allocation)}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">Of total vault</div>
                                                    </div>
                                                </div>

                                                {/* Deposit/Withdrawal Stats */}
                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                                    <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ArrowDownRight className="w-4 h-4 text-cyan-400" />
                                                            <span className="text-sm text-muted-foreground">Total Deposits</span>
                                                        </div>
                                                        <div className="text-xl font-bold">${(strategy.totalDeposits / 1000000).toFixed(2)}M</div>
                                                    </div>

                                                    <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ArrowUpRight className="w-4 h-4 text-orange-500" />
                                                            <span className="text-sm text-muted-foreground">Total Withdrawals</span>
                                                        </div>
                                                        <div className="text-xl font-bold">${(strategy.totalWithdrawals / 1000000).toFixed(2)}M</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Activity Log View */}
                            {selectedContract === 'activity' && (
                                <>
                                    <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6 mb-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Recent Activity</h2>
                                            <span className="text-sm text-muted-foreground">Last 5 transactions</span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Function</th>
                                                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">User</th>
                                                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Amount</th>
                                                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Time</th>
                                                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentActivity.map((activity, index) => (
                                                        <tr key={index} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                                            <td className="p-4">
                                                                <span className="font-mono text-sm font-semibold">{activity.function}</span>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="font-mono text-sm text-muted-foreground">{activity.user}</span>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="text-sm">{activity.amount ? `$${activity.amount.toLocaleString()}` : '-'}</span>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-400/10 text-cyan-400 dark:text-cyan-400 rounded-full text-xs font-semibold">
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    {activity.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Activity Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <Activity className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Total Transactions</span>
                                            </div>
                                            <div className="text-4xl font-bold">{recentActivity.length}</div>
                                            <div className="text-xs text-muted-foreground mt-2">Recent activity</div>
                                        </div>

                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center">
                                                    <CheckCircle className="w-5 h-5 text-cyan-400 dark:text-cyan-400" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Success Rate</span>
                                            </div>
                                            <div className="text-4xl font-bold text-cyan-400">100%</div>
                                            <div className="text-xs text-muted-foreground mt-2">All transactions confirmed</div>
                                        </div>

                                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <DollarSign className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="text-muted-foreground text-sm">Total Volume</span>
                                            </div>
                                            <div className="text-4xl font-bold">$9.0M</div>
                                            <div className="text-xs text-muted-foreground mt-2">Last 30 days</div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </DefaultLayout>
    );
}
