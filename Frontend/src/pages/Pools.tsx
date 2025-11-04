import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, DollarSign, Percent, Calendar, BarChart3, PieChart, Lock, Zap, Info, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DefaultLayout from '@/layouts/default';

export default function PoolsPage() {
    const [isDark, setIsDark] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('year');

    const pools = [
        {
            id: 1,
            name: 'Lending Pool',
            protocol: 'Aave V3',
            icon: '🏦',
            allocation: 40,
            apy: 12.8,
            tvl: 5139025,
            yourDeposit: 21138,
            estimatedYearlyRevenue: 2706,
            estimatedMonthlyRevenue: 225,
            risk: 'Low',
            status: 'Active',
            lockPeriod: 'None',
            compounding: 'Auto',
            color: 'from-blue-500/20 to-cyan-500/20',
            borderColor: 'border-blue-500/30',
            performance24h: 2.3,
            performance7d: 8.7,
            performance30d: 15.2
        },
        {
            id: 2,
            name: 'Liquidity Pool',
            protocol: 'Uniswap V3',
            icon: '💧',
            allocation: 35,
            apy: 24.5,
            tvl: 4496647,
            yourDeposit: 18496,
            estimatedYearlyRevenue: 4531,
            estimatedMonthlyRevenue: 377,
            risk: 'Medium',
            status: 'Active',
            lockPeriod: 'None',
            compounding: 'Manual',
            color: 'from-purple-500/20 to-pink-500/20',
            borderColor: 'border-purple-500/30',
            performance24h: 3.1,
            performance7d: 12.4,
            performance30d: 22.8
        },
        {
            id: 3,
            name: 'Strategy Pool',
            protocol: 'Yearn Finance',
            icon: '⚡',
            allocation: 25,
            apy: 19.2,
            tvl: 3211891,
            yourDeposit: 13211,
            estimatedYearlyRevenue: 2537,
            estimatedMonthlyRevenue: 211,
            risk: 'Medium',
            status: 'Active',
            lockPeriod: '7 Days',
            compounding: 'Auto',
            color: 'from-emerald-500/20 to-teal-500/20',
            borderColor: 'border-emerald-500/30',
            performance24h: 1.8,
            performance7d: 10.2,
            performance30d: 18.5
        }
    ];

    const vaultInsights = {
        totalAPY: 18.42,
        totalTVL: 12847563,
        totalUsers: 8429,
        avgDeposit: 1524,
        totalRevenue24h: 4821,
        totalRevenue7d: 33547,
        totalRevenue30d: 143892,
        poolDiversification: 3,
        riskScore: 'Moderate',
        uptimePercentage: 99.8
    };

    const performanceHistory = [
        { month: 'May', revenue: 128450 },
        { month: 'Jun', revenue: 135820 },
        { month: 'Jul', revenue: 142190 },
        { month: 'Aug', revenue: 138750 },
        { month: 'Sep', revenue: 145320 },
        { month: 'Oct', revenue: 143892 }
    ];

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const totalYearlyRevenue = pools.reduce((sum, pool) => sum + pool.estimatedYearlyRevenue, 0);
    const totalMonthlyRevenue = pools.reduce((sum, pool) => sum + pool.estimatedMonthlyRevenue, 0);

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
                                    <PieChart className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold">Pool Analytics</h1>
                                    <p className="text-sm text-muted-foreground mt-1">Detailed insights into your yield strategies</p>
                                </div>
                            </div>
                        </div>

                        {/* Vault Insights Overview */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">Vault Performance</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground text-sm">Total APY</span>
                                    </div>
                                    <div className="text-3xl font-bold text-cyan-500 dark:text-cyan-400">{vaultInsights.totalAPY}%</div>
                                    <div className="text-xs text-muted-foreground mt-2">Weighted average</div>
                                </div>

                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground text-sm">Total TVL</span>
                                    </div>
                                    <div className="text-3xl font-bold">${(vaultInsights.totalTVL / 1000000).toFixed(2)}M</div>
                                    <div className="text-xs text-muted-foreground mt-2">Across all pools</div>
                                </div>

                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Activity className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground text-sm">Active Users</span>
                                    </div>
                                    <div className="text-3xl font-bold">{vaultInsights.totalUsers.toLocaleString()}</div>
                                    <div className="flex items-center gap-1 text-xs mt-2">
                                        <ArrowUpRight className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                                        <span className="text-cyan-500 dark:text-cyan-400">+12.3% this week</span>
                                    </div>
                                </div>

                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground text-sm">Avg. Deposit</span>
                                    </div>
                                    <div className="text-3xl font-bold">${vaultInsights.avgDeposit.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground mt-2">Per user</div>
                                </div>

                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground text-sm">Uptime</span>
                                    </div>
                                    <div className="text-3xl font-bold">{vaultInsights.uptimePercentage}%</div>
                                    <div className="text-xs text-muted-foreground mt-2">Last 30 days</div>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Stats */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">Revenue Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-cyan-500/10 to-emerald-500/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                                        <span className="text-muted-foreground text-sm">24 Hour Revenue</span>
                                    </div>
                                    <div className="text-3xl font-bold mb-2">${vaultInsights.totalRevenue24h.toLocaleString()}</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <ArrowUpRight className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                                        <span className="text-cyan-500 dark:text-cyan-400">+5.2% from yesterday</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                        <span className="text-muted-foreground text-sm">7 Day Revenue</span>
                                    </div>
                                    <div className="text-3xl font-bold mb-2">${vaultInsights.totalRevenue7d.toLocaleString()}</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <ArrowUpRight className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                                        <span className="text-cyan-500 dark:text-cyan-400">+8.7% from last week</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                        <span className="text-muted-foreground text-sm">30 Day Revenue</span>
                                    </div>
                                    <div className="text-3xl font-bold mb-2">${vaultInsights.totalRevenue30d.toLocaleString()}</div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <ArrowUpRight className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                                        <span className="text-cyan-500 dark:text-cyan-400">+15.2% from last month</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Projections */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Your Estimated Revenue</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedPeriod('month')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            selectedPeriod === 'month' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                                        }`}>
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setSelectedPeriod('year')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            selectedPeriod === 'year' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                                        }`}>
                                        Yearly
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                    <div className="text-sm text-muted-foreground mb-2">Total {selectedPeriod === 'year' ? 'Annual' : 'Monthly'} Revenue</div>
                                    <div className="text-4xl font-bold text-cyan-500 dark:text-cyan-400 mb-2">
                                        ${selectedPeriod === 'year' ? totalYearlyRevenue.toLocaleString() : totalMonthlyRevenue.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Based on current APY</div>
                                </div>

                                <div className="lg:col-span-3 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                    <div className="text-sm text-muted-foreground mb-4">6-Month Performance Trend</div>
                                    <div className="flex items-end justify-between gap-2 h-32">
                                        {performanceHistory.map((item, index) => (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                                <div
                                                    className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all duration-300 hover:from-primary/80"
                                                    style={{ height: `${(item.revenue / 150000) * 100}%` }}
                                                />
                                                <span className="text-xs text-muted-foreground">{item.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pools Detail */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Pool Details</h2>
                                <div className="text-sm text-muted-foreground">
                                    {pools.length} Active Pools
                                </div>
                            </div>

                            <div className="space-y-6">
                                {pools.map((pool) => (
                                    <div
                                        key={pool.id}
                                        className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 hover:ring-2 hover:ring-primary/20 transition-all duration-300">
                                        <div className="p-6">
                                            {/* Pool Header */}
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-5xl">{pool.icon}</div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold mb-1">{pool.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{pool.protocol}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 rounded-full text-xs font-semibold">
                                                        {pool.status}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        pool.risk === 'Low' ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400' :
                                                        'bg-orange-500/10 text-orange-500 dark:text-orange-400'
                                                    }`}>
                                                        {pool.risk} Risk
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Pool Stats Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Percent className="w-4 h-4 text-primary" />
                                                        <span className="text-xs text-muted-foreground">APY</span>
                                                    </div>
                                                    <div className="text-2xl font-bold text-cyan-500 dark:text-cyan-400">{pool.apy}%</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <PieChart className="w-4 h-4 text-primary" />
                                                        <span className="text-xs text-muted-foreground">Allocation</span>
                                                    </div>
                                                    <div className="text-2xl font-bold">{pool.allocation}%</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <DollarSign className="w-4 h-4 text-primary" />
                                                        <span className="text-xs text-muted-foreground">Pool TVL</span>
                                                    </div>
                                                    <div className="text-xl font-bold">${(pool.tvl / 1000000).toFixed(2)}M</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Activity className="w-4 h-4 text-primary" />
                                                        <span className="text-xs text-muted-foreground">Your Deposit</span>
                                                    </div>
                                                    <div className="text-xl font-bold">${pool.yourDeposit.toLocaleString()}</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Lock className="w-4 h-4 text-primary" />
                                                        <span className="text-xs text-muted-foreground">Lock Period</span>
                                                    </div>
                                                    <div className="text-xl font-bold">{pool.lockPeriod}</div>
                                                </div>

                                                <div className="bg-muted/50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Zap className="w-4 h-4 text-primary" />
                                                        <span className="text-xs text-muted-foreground">Compound</span>
                                                    </div>
                                                    <div className="text-xl font-bold">{pool.compounding}</div>
                                                </div>
                                            </div>

                                            {/* Revenue Projections */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div className="bg-gradient-to-br from-primary/5 to-primary/0 border rounded-xl p-4">
                                                    <div className="text-sm text-muted-foreground mb-2">Est. Monthly Revenue</div>
                                                    <div className="text-3xl font-bold mb-1">${pool.estimatedMonthlyRevenue.toLocaleString()}</div>
                                                    <div className="text-xs text-muted-foreground">From your ${pool.yourDeposit.toLocaleString()} deposit</div>
                                                </div>

                                                <div className="bg-gradient-to-br from-primary/5 to-primary/0 border rounded-xl p-4">
                                                    <div className="text-sm text-muted-foreground mb-2">Est. Yearly Revenue</div>
                                                    <div className="text-3xl font-bold mb-1">${pool.estimatedYearlyRevenue.toLocaleString()}</div>
                                                    <div className="text-xs text-muted-foreground">Based on {pool.apy}% APY</div>
                                                </div>
                                            </div>

                                            {/* Performance Metrics */}
                                            <div className="bg-muted/30 rounded-xl p-4">
                                                <div className="text-sm font-semibold mb-3">Performance</div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground mb-1">24 Hours</div>
                                                        <div className="flex items-center gap-1">
                                                            <ArrowUpRight className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                                                            <span className="text-sm font-semibold text-cyan-500 dark:text-cyan-400">+{pool.performance24h}%</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground mb-1">7 Days</div>
                                                        <div className="flex items-center gap-1">
                                                            <ArrowUpRight className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                                                            <span className="text-sm font-semibold text-cyan-500 dark:text-cyan-400">+{pool.performance7d}%</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground mb-1">30 Days</div>
                                                        <div className="flex items-center gap-1">
                                                            <ArrowUpRight className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                                                            <span className="text-sm font-semibold text-cyan-500 dark:text-cyan-400">+{pool.performance30d}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="mt-6">
                                                <Button variant="outline" className="w-full rounded-xl">
                                                    View Pool Details
                                                    <ChevronRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Info className="w-5 h-5 text-primary" />
                                    <h3 className="text-xl font-bold">Risk Distribution</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Low Risk</span>
                                            <span className="font-semibold">40%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 dark:bg-blue-400" style={{ width: '40%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Medium Risk</span>
                                            <span className="font-semibold">60%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 dark:bg-orange-400" style={{ width: '60%' }} />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <div className="text-sm text-muted-foreground">Overall Risk Score</div>
                                        <div className="text-2xl font-bold text-orange-500 dark:text-orange-400 mt-1">{vaultInsights.riskScore}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    <h3 className="text-xl font-bold">Diversification Score</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-2">Active Strategies</div>
                                        <div className="text-3xl font-bold mb-1">{vaultInsights.poolDiversification}</div>
                                        <div className="text-xs text-muted-foreground">Across multiple protocols</div>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <div className="text-muted-foreground mb-1">Lending</div>
                                                <div className="font-semibold">1 Pool</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground mb-1">Liquidity</div>
                                                <div className="font-semibold">1 Pool</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground mb-1">Strategy</div>
                                                <div className="font-semibold">1 Pool</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground mb-1">Protocols</div>
                                                <div className="font-semibold">3 Total</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Protocol Information */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-6">Protocol Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                    <div className="text-4xl mb-3">🏦</div>
                                    <h3 className="font-bold mb-2">Aave V3</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Leading decentralized lending protocol with proven track record and high security standards.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">Audited</span>
                                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">Battle-tested</span>
                                    </div>
                                </div>

                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                    <div className="text-4xl mb-3">💧</div>
                                    <h3 className="font-bold mb-2">Uniswap V3</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Top DEX with concentrated liquidity providing enhanced capital efficiency and yields.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">High Volume</span>
                                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">Liquid</span>
                                    </div>
                                </div>

                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6">
                                    <div className="text-4xl mb-3">⚡</div>
                                    <h3 className="font-bold mb-2">Yearn Finance</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Advanced yield optimization strategies with automated compounding and rebalancing.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">Auto-compound</span>
                                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">Optimized</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="mt-12 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden rounded-3xl border border-primary/20 shadow-lg shadow-zinc-950/15 ring-1 p-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Optimize Your Yields?</h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Start earning optimized returns across multiple DeFi protocols with automated allocation
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <div className="bg-foreground/10 rounded-[14px] border p-0.5 inline-block">
                                    <Button size="lg" className="rounded-xl px-8 text-base">
                                        Deposit Now
                                        <ArrowUpRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                                <Button size="lg" variant="outline" className="rounded-xl px-8">
                                    Learn More
                                    <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        </DefaultLayout>
    );
}