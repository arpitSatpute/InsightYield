import { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, TrendingUp, Wallet, Activity, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';

export default function YieldAggregatorLanding() {

    const {isConnected} = useAccount();
    const [connectionStatus, setConnectionStatus] = useState(false);

    const [totalDeposited] = useState(12847563);
    const [totalYieldGenerated, setTotalYieldGenerated] = useState(847291);
    const [currentAPY] = useState(18.42);

    // Track wallet connection status changes
    useEffect(() => {
        setConnectionStatus(isConnected);
    }, [isConnected]);

    const pools = [
        {
            id: 1,
            name: 'Lending Pool',
            protocol: 'Aave V3',
            apy: 12.8,
            allocation: 40,
            tvl: 5139025,
            icon: '🏦'
        },
        {
            id: 2,
            name: 'Liquidity Pool',
            protocol: 'Uniswap V3',
            apy: 24.5,
            allocation: 35,
            tvl: 4496647,
            icon: '💧'
        },
        {
            id: 3,
            name: 'Strategy Pool',
            protocol: 'Yearn Finance',
            apy: 19.2,
            allocation: 25,
            tvl: 3211891,
            icon: '⚡'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTotalYieldGenerated(prev => prev + Math.random() * 10);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="overflow-hidden bg-background min-h-screen">
            {/* Theme Toggle */}
            

            <div
                aria-hidden
                className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
            </div>

            <section>
                <div className="relative pt-24 md:pt-36">
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
                        <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                            <a
                                href="#link"
                                className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                <span className="text-foreground text-sm">🚀 Automated Yield Optimization</span>
                                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                        <span className="flex size-6">
                                            <ArrowRight className="m-auto size-3" />
                                        </span>
                                        <span className="flex size-6">
                                            <ArrowRight className="m-auto size-3" />
                                        </span>
                                    </div>
                                </div>
                            </a>
                
                            <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                Maximize Your Crypto Yields
                            </h1>
                            <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                                Deposit once, earn everywhere. Our smart vault automatically spreads your assets across top DeFi protocols for optimized returns.
                            </p>

                            <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                {!connectionStatus ? (
                                    <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                                        <Button
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Wallet className="mr-2 size-4" />
                                            <span className="text-nowrap">Connect Wallet</span>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                                        <Button
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <TrendingUp className="mr-2 size-4" />
                                            <span className="text-nowrap">Start Earning</span>
                                        </Button>
                                    </div>
                                )}
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="h-10.5 rounded-xl px-5">
                                    <span className="text-nowrap">View Strategies</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="mx-auto max-w-7xl px-6 mt-16 md:mt-24">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1 bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Current APY</span>
                                </div>
                                <div className="text-4xl font-bold text-cyan-400 dark:text-cyan-400">{currentAPY.toFixed(2)}%</div>
                                <div className="text-xs text-muted-foreground mt-2">Optimized across 3 pools</div>
                            </div>

                            <div className="flex-1 bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Total Value Locked</span>
                                </div>
                                <div className="text-4xl font-bold">${(totalDeposited / 1000000).toFixed(2)}M</div>
                                <div className="text-xs text-muted-foreground mt-2">Across all vaults</div>
                            </div>

                            <div className="flex-1 bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Yield Generated</span>
                                </div>
                                <div className="text-4xl font-bold">${(totalYieldGenerated / 1000).toFixed(1)}K</div>
                                <div className="text-xs text-muted-foreground mt-2">Last 30 days</div>
                            </div>
                        </div>
                    </div>

                    {/* Pools Section */}
                    <div className="mx-auto max-w-7xl px-6 mt-20 md:mt-32">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Diversified Pool Strategies</h2>
                            <p className="text-lg text-muted-foreground">Your deposits are automatically allocated for maximum returns</p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6">
                            {pools.map((pool) => (
                                <div
                                    key={pool.id}
                                    className="flex-1 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border p-6 shadow-lg shadow-zinc-950/15 ring-1 hover:ring-2 hover:ring-primary/20 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-4xl">{pool.icon}</div>
                                        <div className="px-3 py-1 bg-muted rounded-full text-xs font-semibold">
                                            {pool.allocation}% Allocation
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-1">{pool.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{pool.protocol}</p>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">APY</span>
                                            <span className="text-2xl font-bold text-cyan-400 dark:text-cyan-400">{pool.apy}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Pool TVL</span>
                                            <span className="font-semibold">${(pool.tvl / 1000000).toFixed(2)}M</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Your Allocation</span>
                                            <span className="font-medium">${((totalDeposited * pool.allocation / 100) / 1000).toFixed(1)}K</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="mx-auto max-w-7xl px-6 mt-20 md:mt-32">
                        <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-8 md:p-12">
                            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Wallet className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-semibold mb-2 text-lg">1. Deposit</h4>
                                    <p className="text-sm text-muted-foreground">Connect wallet and deposit your crypto tokens into the vault</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Activity className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-semibold mb-2 text-lg">2. Auto-Allocate</h4>
                                    <p className="text-sm text-muted-foreground">Smart vault spreads funds across 3 optimized pools</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-semibold mb-2 text-lg">3. Earn Yield</h4>
                                    <p className="text-sm text-muted-foreground">Generate returns from lending, liquidity & strategies</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <DollarSign className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-semibold mb-2 text-lg">4. Withdraw</h4>
                                    <p className="text-sm text-muted-foreground">Claim your principal plus yield anytime</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mx-auto max-w-7xl px-6 mt-20 md:mt-32 pb-24">
                        <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-3xl border p-12 shadow-lg shadow-zinc-950/15 ring-1 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Maximize Your Yields?</h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Join thousands of DeFi users earning optimized returns with our automated yield aggregator
                            </p>
                            <div className="bg-foreground/10 rounded-[14px] border p-0.5 inline-block">
                                <Button size="lg" className="rounded-xl px-8 text-base">
                                    Launch App
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customers Section */}
            <section className="bg-background pb-16 pt-16 md:pb-32">
                <div className="group relative m-auto max-w-5xl px-6">
                    <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                        <a
                            href="/"
                            className="block text-sm duration-150 hover:opacity-75">
                            <span>Trusted by Leading Protocols</span>
                            <ChevronRight className="ml-1 inline-block size-3" />
                        </a>
                    </div>
                    <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                        <div className="flex">
                            <img
                                className="mx-auto h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                alt="Nvidia Logo"
                                height="20"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/column.svg"
                                alt="Column Logo"
                                height="16"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/github.svg"
                                alt="GitHub Logo"
                                height="16"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nike.svg"
                                alt="Nike Logo"
                                height="20"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                alt="Lemon Squeezy Logo"
                                height="20"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/laravel.svg"
                                alt="Laravel Logo"
                                height="16"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-7 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lilly.svg"
                                alt="Lilly Logo"
                                height="28"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-6 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/openai.svg"
                                alt="OpenAI Logo"
                                height="24"
                                width="auto"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}