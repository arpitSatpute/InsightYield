import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, ArrowUp, Wallet, TrendingUp, Activity, DollarSign, Gift, Info, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DefaultLayout from '@/layouts/default';

export default function VaultPage() {
    const [isDark, setIsDark] = useState(true);
    const [activeTab, setActiveTab] = useState('deposit');
    const [amount, setAmount] = useState('');
    
    // User vault data
    const vaultData = {
        totalVaultBalance: 12847563,
        userShares: 15420,
        userInvested: 50000,
        userAvailableBalance: 25000,
        userCurrentValue: 52845,
        userProfitLoss: 2845,
        userProfitPercent: 5.69,
        sharePrice: 3.43,
        totalShares: 3746890,
        vaultAPY: 18.42,
        walletAddress: '0x742d...4a9c'
    };

    const recentTransactions = [
        { type: 'Deposit', amount: 10000, date: '2024-11-03', hash: '0xabc...123' },
        { type: 'Withdraw', amount: 5000, date: '2024-11-01', hash: '0xdef...456' },
        { type: 'Airdrop Claimed', amount: 250, date: '2024-10-28', hash: '0xghi...789' }
    ];

    const poolAllocation = [
        { name: 'Lending Pool', allocation: 40, apy: 12.8, value: 21138 },
        { name: 'Liquidity Pool', allocation: 35, apy: 24.5, value: 18496 },
        { name: 'Strategy Pool', allocation: 25, apy: 19.2, value: 13211 }
    ];

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const handleMaxAmount = () => {
        if (activeTab === 'deposit') {
            setAmount(vaultData.userAvailableBalance.toString());
        } else {
            setAmount(vaultData.userInvested.toString());
        }
    };

    return (
      <DefaultLayout>
        <main className="overflow-hidden bg-background min-h-screen">
            {/* Theme Toggle */}
            

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
                                    <Wallet className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold">My Vault</h1>
                                    <p className="text-sm text-muted-foreground mt-1">Manage your deposits and earnings</p>
                                </div>
                            </div>
                            
                            {/* Wallet Address */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border text-sm">
                                <span className="text-muted-foreground">Connected:</span>
                                <span className="font-mono">{vaultData.walletAddress}</span>
                                <button className="hover:text-primary transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Main Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Your Investment</span>
                                </div>
                                <div className="text-3xl font-bold">${vaultData.userInvested.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground mt-2">Principal amount</div>
                            </div>

                            <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Current Value</span>
                                </div>
                                <div className="text-3xl font-bold">${vaultData.userCurrentValue.toLocaleString()}</div>
                                <div className="flex items-center gap-1 text-xs mt-2">
                                    <span className="text-cyan-400 dark:text-cyan-400">+${vaultData.userProfitLoss.toLocaleString()}</span>
                                    <span className="text-cyan-400 dark:text-cyan-400">(+{vaultData.userProfitPercent}%)</span>
                                </div>
                            </div>

                            <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Shares Owned</span>
                                </div>
                                <div className="text-3xl font-bold">{vaultData.userShares.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground mt-2">${vaultData.sharePrice} per share</div>
                            </div>

                            <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Wallet className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Available Balance</span>
                                </div>
                                <div className="text-3xl font-bold">${vaultData.userAvailableBalance.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground mt-2">In your wallet</div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Deposit/Withdraw Card */}
                            <div className="lg:col-span-2 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold">Manage Vault</h2>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-400/10 rounded-full text-sm text-cyan-400 dark:text-cyan-400">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>{vaultData.vaultAPY}% APY</span>
                                        </div>
                                    </div>

                                    {/* Tab Buttons */}
                                    <div className="flex gap-2 mb-6">
                                        <button
                                            onClick={() => setActiveTab('deposit')}
                                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                                                activeTab === 'deposit'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted hover:bg-muted/80'
                                            }`}>
                                            <ArrowDown className="w-4 h-4 inline mr-2" />
                                            Deposit
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('withdraw')}
                                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                                                activeTab === 'withdraw'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted hover:bg-muted/80'
                                            }`}>
                                            <ArrowUp className="w-4 h-4 inline mr-2" />
                                            Withdraw
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('redeem')}
                                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                                                activeTab === 'redeem'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted hover:bg-muted/80'
                                            }`}>
                                            <Activity className="w-4 h-4 inline mr-2" />
                                            Redeem
                                        </button>
                                    </div>

                                    {/* Input Section */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm text-muted-foreground">
                                                    {activeTab === 'deposit' ? 'Amount to Deposit' : activeTab === 'withdraw' ? 'Amount to Withdraw' : 'Shares to Redeem'}
                                                </label>
                                                <span className="text-xs text-muted-foreground">
                                                    Available: ${activeTab === 'deposit' ? vaultData.userAvailableBalance.toLocaleString() : vaultData.userInvested.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full px-4 py-4 bg-muted border rounded-xl text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                                <button
                                                    onClick={handleMaxAmount}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-medium text-primary transition-colors">
                                                    MAX
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Transaction Fee</span>
                                                <span className="font-medium">0.1%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">You will receive</span>
                                                <span className="font-medium">{amount ? (parseFloat(amount) * 0.999).toFixed(2) : '0.00'} {activeTab === 'redeem' ? 'USD' : 'shares'}</span>
                                            </div>
                                        </div>

                                        <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                                            <Button
                                                size="lg"
                                                className="w-full rounded-xl text-base">
                                                {activeTab === 'deposit' ? 'Deposit to Vault' : activeTab === 'withdraw' ? 'Withdraw from Vault' : 'Redeem Shares'}
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Airdrop Card */}
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden rounded-2xl border border-primary/20 shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                            <Gift className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Airdrop Rewards</h3>
                                            <p className="text-xs text-muted-foreground">Claim your rewards</p>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold mb-4">$1,247</div>
                                    <Button size="sm" variant="outline" className="w-full rounded-lg">
                                        <Gift className="mr-2 w-4 h-4" />
                                        Claim Airdrop
                                    </Button>
                                </div>

                                {/* Vault Info Card */}
                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Info className="w-5 h-5 text-primary" />
                                        <h3 className="font-bold">Vault Information</h3>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Vault TVL</span>
                                            <span className="font-semibold">${(vaultData.totalVaultBalance / 1000000).toFixed(2)}M</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Shares</span>
                                            <span className="font-semibold">{vaultData.totalShares.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Share Price</span>
                                            <span className="font-semibold">${vaultData.sharePrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Your Ownership</span>
                                            <span className="font-semibold">{((vaultData.userShares / vaultData.totalShares) * 100).toFixed(3)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pool Allocation */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-6">Your Pool Allocation</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {poolAllocation.map((pool, index) => (
                                    <div key={index} className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold">{pool.name}</h3>
                                            <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold">{pool.allocation}%</span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">APY</span>
                                                <span className="font-semibold text-cyan-400 dark:text-cyan-400">{pool.apy}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Your Value</span>
                                                <span className="font-semibold">${pool.value.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
                            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b">
                                            <tr>
                                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Type</th>
                                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Amount</th>
                                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Date</th>
                                                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Transaction</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentTransactions.map((tx, index) => (
                                                <tr key={index} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                                            tx.type === 'Deposit' ? 'bg-cyan-400/10 text-cyan-400 dark:text-cyan-400' :
                                                            tx.type === 'Withdraw' ? 'bg-orange-500/10 text-orange-500 dark:text-orange-400' :
                                                            'bg-blue-500/10 text-blue-500 dark:text-blue-400'
                                                        }`}>
                                                            {tx.type === 'Deposit' ? <ArrowDown className="w-3 h-3" /> :
                                                             tx.type === 'Withdraw' ? <ArrowUp className="w-3 h-3" /> :
                                                             <Gift className="w-3 h-3" />}
                                                            {tx.type}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-semibold">${tx.amount.toLocaleString()}</td>
                                                    <td className="p-4 text-sm text-muted-foreground">{tx.date}</td>
                                                    <td className="p-4">
                                                        <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                                            <span className="font-mono">{tx.hash}</span>
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        </DefaultLayout>
    );
}