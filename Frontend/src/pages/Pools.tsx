import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, DollarSign, Percent, Calendar, BarChart3, PieChart, Lock, Zap, Info, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RefreshCw, Gauge, Landmark } from 'lucide-react';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from "@/config/config";
import { formatUnits, parseUnits } from 'viem';
import yieldVaultAbi from '@/abis/yieldVault.json';
import lendingStrategyAbi from '@/abis/lendingStrategy.json';
import liquidityStrategyAbi from '@/abis/liquidityStrategy.json';
import stakingStrategyAbi from '@/abis/stakingStrategy.json';
import strategyManagerAbi from "@/abis/strategyManager.json";


import DefaultLayout from '@/layouts/default';


export default function PoolsPage() {

    const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;
    const LENDING_VAULT_ADDRESS = import.meta.env.VITE_LENDING_STRATEGY_ADDRESS as `0x${string}`;
    const LIQUIDITY_VAULT_ADDRESS = import.meta.env.VITE_LIQUIDITY_STRATEGY_ADDRESS as `0x${string}`;
    const STAKING_VAULT_ADDRESS = import.meta.env.VITE_STAKING_STRATEGY_ADDRESS as `0x${string}`;
    const STRATEGY_MANAGER_ADDRESS = import.meta.env.VITE_STRATEGY_MANAGER_ADDRESS as `0x${string}`;
    


    const [isDark, setIsDark] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('year');
    const [totalTVL, setTotalTVL] = useState<string>("0.00");
    const [totalAPY, setTotalAPY] = useState<string>("0.00");
    
    const [lendingTotalAssets, setLendingTotalAssets] = useState<string>("0.00");
    const [liquidityTotalAssets, setLiquidityTotalAssets] = useState<string>("0.00");
    const [stakingTotalAssets, setStakingTotalAssets] = useState<string>("0.00");
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [lendingLastYieldUpdate, setLendingLastYieldUpdate] = useState<number | null>(null);
    const [liquidityLastYieldUpdate, setLiquidityLastYieldUpdate] = useState<number | null>(null);
    const [stakingLastYieldUpdate, setStakingLastYieldUpdate] = useState<number | null>(null);

    
    const [lendingAllocation, setLendingAllocation] = useState<string>("0.00");
    const [liquidityAllocation, setLiquidityAllocation] = useState<string>("0.00");
    const [stakingAllocation, setStakingAllocation] = useState<string>("0.00");

    const [lendingBaseAPY, setLendingBaseAPY] = useState<string>("0.00");
    const [liquidityBaseAPY, setLiquidityBaseAPY] = useState<string>("0.00");
    const [stakingBaseAPY, setStakingBaseAPY] = useState<string>("0.00");

    const [lendingEstimatedAPY, setLendingEstimatedAPY] = useState<string>("0.00");
    const [liquidityEstimatedAPY, setLiquidityEstimatedAPY] = useState<string>("0.00");
    const [stakingEstimatedAPY, setStakingEstimatedAPY] = useState<string>("0.00");

    const [lendingAccumulatedYield, setLendingAccumulatedYield] = useState<string>("0.00");
    const [liquidityAccumulatedYield, setLiquidityAccumulatedYield] = useState<string>("0.00");
    const [stakingAccumulatedYield, setStakingAccumulatedYield] = useState<string>("0.00");

    const [lendingBalance, setLendingBalance] = useState<string>("0.00");
    const [liquidityBalance, setLiquidityBalance] = useState<string>("0.00");
    const [stakingBalance, setStakingBalance] = useState<string>("0.00");

    const [lendingTotalSupply, setLendingTotalSupply] = useState<string>("0.00");
    const [liquidityTotalSupply, setLiquidityTotalSupply] = useState<string>("0.00");
    const [stakingTotalSupply, setStakingTotalSupply] = useState<string>("0.00");

    useEffect(() => {
      window.scroll(0, 0);
      let mounted = true;

      const vaultTVL = async () => {
        try {
          const tvl = await readContract(config, {
            address: YIELD_VAULT_ADDRESS,
            abi: yieldVaultAbi,
            functionName: 'totalAssets',
          }) as bigint;
          if (mounted) setTotalTVL(formatUnits(tvl, 18));
        } catch (error) {
          console.error("Error fetching vault data:", error);
        }
      };

      const vaultAPY = async () => {
        try {
          const supply = await readContract(config, {
            address: YIELD_VAULT_ADDRESS,
            abi: yieldVaultAbi,
            functionName: 'totalSupply',
          }) as bigint;
          if (mounted) setTotalAPY(formatUnits(supply, 18));
        } catch (error) {
          console.error("Error fetching vault APY:", error);
        }
      };

      const getAllocations = async () => {
        try {
          const lend = await readContract(config, {
            address: STRATEGY_MANAGER_ADDRESS,
            abi: strategyManagerAbi,
            functionName: "getStrategy",
            args: [0],
          }) as [string, bigint, boolean];
          console.log(lend[1]);
          if (mounted) setLendingAllocation(formatUnits(await lend[1], 2)); 
          
          // allocation is index 1

          const liquidity = await readContract(config, {
            address: STRATEGY_MANAGER_ADDRESS,
            abi: strategyManagerAbi,
          functionName: "getStrategy",
            args: [1],
          }) as [string, bigint, boolean];

          if (mounted) setLiquidityAllocation(formatUnits(await liquidity[1], 2));

          const staking = await readContract(config, {
            address: STRATEGY_MANAGER_ADDRESS,
            abi: strategyManagerAbi,
            functionName: "getStrategy",
            args: [2],
          }) as [string, bigint, boolean];

          if (mounted) setStakingAllocation(formatUnits(await staking[1], 2));

        } catch (err) {
          console.error("Error allocations:", err);
        }
      };

      const accumulateYield = async () => {
        try {
          const lending = await readContract(config, {
            address: LENDING_VAULT_ADDRESS,
            abi: lendingStrategyAbi,
            functionName: 'accumulatedYield',
          }) as bigint;
          if (mounted) setLendingAccumulatedYield(formatUnits(lending, 18));

          const liquidity = await readContract(config, {
            address: LIQUIDITY_VAULT_ADDRESS,
            abi: liquidityStrategyAbi,
            functionName: 'accumulatedYield',
          }) as bigint;
          if (mounted) setLiquidityAccumulatedYield(formatUnits(liquidity, 18));

          const staking = await readContract(config, {
            address: STAKING_VAULT_ADDRESS,
            abi: stakingStrategyAbi,
            functionName: 'accumulatedYield',
          }) as bigint;
          if (mounted) setStakingAccumulatedYield(formatUnits(staking, 18));

        } catch (err) {
          console.error("Error accumulating yield:", err);
        }
      };

      const baseAPY = async () => {
        try {
          const lendingApy = await readContract(config, {
            address: LENDING_VAULT_ADDRESS,
            abi: lendingStrategyAbi,
            functionName: 'baseAPY',
            args: [],
          }) as bigint;
          if (mounted) {
            setLendingBaseAPY(formatUnits(await lendingApy, 2));
          }
          const liquidityApy = await readContract(config, {
            address: LIQUIDITY_VAULT_ADDRESS,
            abi: liquidityStrategyAbi,
            functionName: 'baseAPY',
            args: [],
          }) as bigint;
          if (mounted) {
            setLiquidityBaseAPY(formatUnits(await liquidityApy, 2));
          }
          const stakingApy = await readContract(config, {
            address: STAKING_VAULT_ADDRESS,
            abi: stakingStrategyAbi,
            functionName: 'baseAPY',
            args: [],
          }) as bigint;
          if (mounted) {
            setStakingBaseAPY(formatUnits(await stakingApy, 2));
          }

        } catch (error) {
          console.error("Error fetching base APY:", error);
        }
      }

      const totalAssets = async () => {
        try {
          const lendingAssets = await readContract(config, {
            address: LENDING_VAULT_ADDRESS,
            abi: lendingStrategyAbi,
            functionName: 'totalAssets',
          }) as bigint;
          if (mounted) {
            setLendingTotalAssets(formatUnits(lendingAssets, 18));
            console.log(lendingTotalAssets);
          }
        } catch (error) {
          console.warn("Lending totalAssets not available, using fallback");
        }

        try {
          const liquidityAssets = await readContract(config, {
            address: LIQUIDITY_VAULT_ADDRESS,
            abi: liquidityStrategyAbi,
            functionName: 'totalAssets',
            args: [],
          }) as bigint;
          if (mounted) {
            setLiquidityTotalAssets(formatUnits(liquidityAssets, 18));
            console.log(liquidityTotalAssets);

          }
        } catch (error) {
          console.warn("Liquidity totalAssets not available, using fallback");
        }

        try {
          const stakingAssets = await readContract(config, {
            address: STAKING_VAULT_ADDRESS,
            abi: stakingStrategyAbi,
            functionName: 'totalAssets',
            args: [],
          }) as bigint;
          if (mounted) {
            setStakingTotalAssets(formatUnits(stakingAssets, 18));
            console.log(stakingTotalAssets);
          }
        } catch (error) {
          console.warn("Staking totalAssets not available, using fallback");
        }
      }

      const lastYieldUpdate = async () => {
        try {
          // Last Yield Update (store raw timestamp)
            const lendTs = await readContract(config, {
              address: LENDING_VAULT_ADDRESS,
              abi: lendingStrategyAbi,
              functionName: "lastYieldUpdate"
            }) as bigint;
            setLendingLastYieldUpdate(Number(lendTs));

            const liqTs = await readContract(config, {
              address: LIQUIDITY_VAULT_ADDRESS,
              abi: liquidityStrategyAbi,
              functionName: "lastYieldUpdate"
            }) as bigint;
            setLiquidityLastYieldUpdate(Number(liqTs));

            const stakeTs = await readContract(config, {
              address: STAKING_VAULT_ADDRESS,
              abi: stakingStrategyAbi,
              functionName: "lastYieldUpdate"
            }) as bigint;
            setStakingLastYieldUpdate(Number(stakeTs));
        } catch (error) {
          console.error("Error fetching last yield update:", error);
        }
      }

      const estimatedAPY = async () => {
        try {
          const lendingApy = await readContract(config, {
            address: LENDING_VAULT_ADDRESS,
            abi: lendingStrategyAbi,
            functionName: 'estimatedAPY',
            args: [],
          }) as bigint;
          if (mounted) {
            setLendingEstimatedAPY(formatUnits(await lendingApy, 2));
          }
          const liquidityApy = await readContract(config, {
            address: LIQUIDITY_VAULT_ADDRESS,
            abi: liquidityStrategyAbi,
            functionName: 'estimatedAPY',
            args: [],
          }) as bigint;
          if (mounted) {
            setLiquidityEstimatedAPY(formatUnits(await liquidityApy, 2));
          }
          const stakingApy = await readContract(config, {
            address: STAKING_VAULT_ADDRESS,
            abi: stakingStrategyAbi,
            functionName: 'estimatedAPY',
            args: [],
          }) as bigint;
          if (mounted) {
            setStakingEstimatedAPY(formatUnits(await stakingApy, 2));
          }

        } catch (error) {
          console.error("Error fetching estimated APY:", error);
        }
      }

      const totalSupply = async () => {
        try {
          const lendingSupply = await readContract(config, {
            address: LENDING_VAULT_ADDRESS,
            abi: lendingStrategyAbi,
            functionName: 'totalSupply',
            args: [],
          }) as bigint;
          if (mounted) {
            setLendingTotalSupply(formatUnits(await lendingSupply, 18));
          }
          const liquiditySupply = await readContract(config, {
            address: LIQUIDITY_VAULT_ADDRESS,
            abi: liquidityStrategyAbi,
            functionName: 'totalSupply',
            args: [],
          }) as bigint;
          if (mounted) {
            setLiquidityTotalSupply(formatUnits(await liquiditySupply, 18));
          }
          const stakingSupply = await readContract(config, {
            address: STAKING_VAULT_ADDRESS,
            abi: stakingStrategyAbi,
            functionName: 'totalSupply',
            args: [],
          }) as bigint;
          if (mounted) {
            setStakingTotalSupply(formatUnits(await stakingSupply, 18));
          }

        } catch (error) {
          console.error("Error fetching total supply:", error);
        }
      }

      const balances = async () => {
        try {
          const lendingBal = await readContract(config, {
            address: LENDING_VAULT_ADDRESS,
            abi: lendingStrategyAbi,
            functionName: 'balanceOf',
            args: [],
          }) as bigint;
          if (mounted) {
            setLendingBalance(formatUnits(await lendingBal, 18));
          }
          const liquidityBal = await readContract(config, {
            address: LIQUIDITY_VAULT_ADDRESS,
            abi: liquidityStrategyAbi,
            functionName: 'balanceOf',
            args: [],
          }) as bigint;
          if (mounted) {
            setLiquidityBalance(formatUnits(await liquidityBal, 18));
          }
          const stakingBal = await readContract(config, {
            address: STAKING_VAULT_ADDRESS,
            abi: stakingStrategyAbi,
            functionName: 'balanceOf',
            args: [],
          }) as bigint;
          if (mounted) {
            setStakingBalance(formatUnits(await stakingBal, 18));
          }

        } catch (error) {
          console.error("Error fetching balances:", error);
        }
      }


      vaultTVL();
      vaultAPY();
      getAllocations();
      accumulateYield();
      baseAPY();
      totalAssets();
      lastYieldUpdate();
      estimatedAPY();
      totalSupply();
      balances();

      return () => {
        mounted = false;
      };
    }, [LENDING_VAULT_ADDRESS, LIQUIDITY_VAULT_ADDRESS, STAKING_VAULT_ADDRESS]);


    function formatTimestamp(ts: number | null) {
      if (!ts) return "-";
      return new Date(ts * 1000).toLocaleString();
    }

    function timeAgo(ts: number | null) {
      if (!ts) return "-";
      const diff = Date.now() - ts * 1000;

      const sec = Math.floor(diff / 1000);
      if (sec < 60) return `${sec}s ago`;

      const min = Math.floor(sec / 60);
      if (min < 60) return `${min}m ago`;

      const hr = Math.floor(min / 60);
      if (hr < 24) return `${hr}h ago`;

      const day = Math.floor(hr / 24);
      return `${day}d ago`;
    }


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
            icon: 'Landmark',
            allocation: lendingAllocation ? parseFloat(lendingAllocation) : 0,
            baseAPY: lendingBaseAPY ? parseFloat(lendingBaseAPY) : 0,
            estimatedAPY: lendingEstimatedAPY ? parseFloat(lendingEstimatedAPY) : 0,
            totalAssets: lendingTotalAssets ? parseFloat(lendingTotalAssets) : 0,
            lastYieldUpdate: lendingLastYieldUpdate ? timeAgo(lendingLastYieldUpdate) : "--/--/----",
            accumulatedYield: lendingAccumulatedYield ? parseFloat(lendingAccumulatedYield) : 0,
            active: true,
            totalBalance: lendingBalance ? parseFloat(lendingBalance) : 0,
            totalSupply: lendingTotalSupply ? parseFloat(lendingTotalSupply) : 0,
        },
        {
            id: 2,
            name: 'Liquidity Strategy',
            icon: 'Gauge',
            allocation: liquidityAllocation,
            baseAPY: liquidityBaseAPY ? parseFloat(liquidityBaseAPY) : 0,
            estimatedAPY: liquidityEstimatedAPY ? parseFloat(liquidityEstimatedAPY) : 0,
            totalAssets: liquidityTotalAssets ? parseFloat(liquidityTotalAssets) : 0,
            lastYieldUpdate: liquidityLastYieldUpdate ? timeAgo(liquidityLastYieldUpdate) : 0,
            accumulatedYield: liquidityAccumulatedYield ? parseFloat(liquidityAccumulatedYield) : 0,
            active: true,
            totalBalance: liquidityBalance ? parseFloat(liquidityBalance) : 0,
            totalSupply: liquidityTotalSupply ? parseFloat(liquidityTotalSupply) : 0,
        },
        {
            id: 3,
            name: 'Staking Strategy',
            icon: 'Zap',
            allocation: stakingAllocation,
            baseAPY: stakingBaseAPY ? parseFloat(stakingBaseAPY) : 0,
            estimatedAPY: stakingEstimatedAPY ? parseFloat(stakingEstimatedAPY) : 0,
            totalAssets: stakingTotalAssets ? parseFloat(stakingTotalAssets) : 0,
            lastYieldUpdate: stakingLastYieldUpdate ? timeAgo(stakingLastYieldUpdate) : 0,
            accumulatedYield: stakingAccumulatedYield ? parseFloat(stakingAccumulatedYield) : 0,
            active: true,
            totalBalance: stakingBalance ? parseFloat(stakingBalance) : 0,
            totalSupply: stakingTotalSupply ? parseFloat(stakingTotalSupply) : 0,
        }
    ];

    

   

    // Helper: format APY values provided in basis points (e.g. 1280 -> 12.80%)
   

    // Helper: format allocation/weight values provided in basis points (e.g. 2500 -> 25.00%)
    function formatBasisPoints(bp: number | undefined | null) {
        if (bp === null || bp === undefined || Number.isNaN(bp)) return '-';
        return `${(bp / 100).toFixed(2)}%`;
    }

    // Helper: render icon based on icon name
    function renderIcon(iconName: string, size: number = 24) {
        const iconProps = { width: size, height: size, className: 'text-primary' };
        switch (iconName) {
            case 'Landmark':
                return <Landmark {...iconProps} />;
            case 'Gauge':
                return <Gauge {...iconProps} />;
            case 'Zap':
                return <Zap {...iconProps} />;
            default:
                return <Landmark {...iconProps} />;
        }
    }


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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground text-sm">Total Vault Shares</span>
                                    </div>
                                    <div className="text-3xl font-bold text-cyan-500 dark:text-cyan-400">{parseFloat(totalAPY).toFixed(2)}</div>
                                    <div className="text-xs text-muted-foreground mt-2">Weighted average</div>
                                </div>

                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground text-sm">Total TVL</span>
                                    </div>
                                    <div className="text-3xl font-bold">${(parseFloat(totalTVL)).toFixed(2)}</div>
                                    <div className="text-xs text-muted-foreground mt-2">Across all pools</div>
                                </div>

                                <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground text-sm">Uptime</span>
                                    </div>
                                    <div className="text-3xl font-bold">{99.8}%</div>
                                    <div className="text-xs text-muted-foreground mt-2">Last 30 days</div>
                                </div>
                                
                            </div>
                        </div>
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Pool Details</h2>
                                <div className="text-sm text-muted-foreground">
                                    {3} Active Pools
                                </div>
                            </div>

                             <div className="space-y-6 mb-8">
                                        {strategies.map((strategy) => (
                                            <div key={strategy.id} className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                                            {renderIcon(strategy.icon, 32)}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-bold mb-1">{strategy.name}</h3>
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
                                                        <div className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">{(strategy.baseAPY).toFixed(2)}%</div>
                                                    </div>

                                                    <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="text-xs text-muted-foreground mb-2">Estimated APY</div>
                                                        <div className="text-2xl font-bold text-cyan-400 dark:text-cyan-400">{(strategy.estimatedAPY).toFixed(2)}%</div>
                                                    </div>

                                                    <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="text-xs text-muted-foreground mb-2">Total Assets</div>
                                                        <div className="text-2xl font-bold">${(strategy.totalAssets).toFixed(2)}</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-indigo-500/5 to-indigo-500/0 border border-indigo-500/20 rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Gauge className="w-4 h-4 text-indigo-500" />
                                                            <span className="text-sm text-muted-foreground">Allocation Weight</span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-indigo-500">{strategy.allocation} %</div>
                                                        {/* <div className="text-xs text-muted-foreground mt-1">Of total vault</div> */}
                                                    </div>
                                                    
                                                </div>

                                                {/* Yield Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                    <div className="bg-gradient-to-br from-primary/5 to-primary/0 border rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <RefreshCw className="w-4 h-4 text-primary" />
                                                            <span className="text-sm text-muted-foreground">Last Yield Update</span>
                                                        </div>
                                                        <div className="text-2xl font-bold">{(strategy.lastYieldUpdate) || "--/--/----"}</div>
                                                        {/* <div className="text-xs text-muted-foreground mt-1">Last harvest: {strategy.lastHarvest}</div> */}
                                                    </div>
                                                      <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ArrowDownRight className="w-4 h-4 text-cyan-400" />
                                                            <span className="text-sm text-muted-foreground">Total Balance</span>
                                                        </div>
                                                        <div className="text-xl font-bold">${(strategy.totalBalance).toFixed(2)}</div>
                                                    </div>

                                                    <div className="bg-muted/50 rounded-xl p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ArrowUpRight className="w-4 h-4 text-orange-500" />
                                                            <span className="text-sm text-muted-foreground">Total Shares</span>
                                                        </div>
                                                        <div className="text-xl font-bold">${(strategy.totalSupply).toFixed(2)}</div>
                                                    </div>

                                                   
                                                </div>

                                                {/* Deposit/Withdrawal Stats */}
                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                          </div>

                        {/* Additional Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            

                            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    <h3 className="text-xl font-bold">Diversification Score</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-2">Active Strategies: 3</div>
                                        {/* <div className="text-3xl font-bold mb-1">{vaultInsights.poolDiversification}</div> */}
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

                                           </div>
                </div>
            </section>
        </main>
        </DefaultLayout>
    );
}