import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, ArrowUp, Wallet, TrendingUp, Activity, DollarSign, Gift, Info, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DefaultLayout from '@/layouts/default';
import vUSDTABI from '@/abis/vusdt.json';
import YIELD_VAULT_ABI from '@/abis/yieldVault.json';
import lendingStrategyAbi from '@/abis/lendingStrategy.json';
import liquidityStrategyAbi from '@/abis/liquidityStrategy.json';
import stakingStrategyAbi from '@/abis/stakingStrategy.json';
import { useAccount } from 'wagmi';
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from "@/config/config";
import { formatUnits, parseUnits } from 'viem';
import { parse } from 'path';
import {toast} from 'sonner';


export default function VaultPage() {
    
    const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
    const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;
    const LENDING_VAULT_ADDRESS = import.meta.env.VITE_LENDING_STRATEGY_ADDRESS as `0x${string}`;
    const LIQUIDITY_VAULT_ADDRESS = import.meta.env.VITE_LIQUIDITY_STRATEGY_ADDRESS as `0x${string}`;
    const STAKING_VAULT_ADDRESS = import.meta.env.VITE_STAKING_STRATEGY_ADDRESS as `0x${string}`;
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('vaultDarkMode');
        return stored !== null ? JSON.parse(stored) : true;
    });
    const [activeTab, setActiveTab] = useState('deposit');
    const [amount, setAmount] = useState('');
    const {address} = useAccount();
    const [airdropClaimed, setAirdropClaimed] = useState(false);
    const [walletBalance, setWalletBalance] = useState<string>("0.00");
    const [share, setShare] = useState<string>("0.00");
    const [TVL, setTVL] = useState<string>("0.00");
    const [sharePrice, setSharePrice] = useState<string>("0.00");
    const [isLoading, setIsLoading] = useState(false);
    const [hash, setHash] = useState<string | null>(null);
    const [totalTVL, setTotalTVL] = useState<string>("0.00");
    const [totalSupply, setTotalSupply] = useState<string>("0.00");
    const [lendingEstimatedAPY, setLendingEstimatedAPY] = useState<string>("0.00");
    const [liquidityEstimatedAPY, setLiquidityEstimatedAPY] = useState<string>("0.00");
    const [stakingEstimatedAPY, setStakingEstimatedAPY] = useState<string>("0.00");
    


    // User vault data
    // const vaultData = {
    //     totalVaultBalance: 12847563,
    //     userShares: 15420,
    //     userInvested: 50000,
    //     userAvailableBalance: 25000,
    //     userCurrentValue: 52845,
    //     userProfitLoss: 2845,
    //     userProfitPercent: 5.69,
    //     sharePrice: 3.43,
    //     totalShares: 3746890,
    //     vaultAPY: 18.42,
    //     walletAddress: '0x742d...4a9c'
    // };

    useEffect(() => {
      window.scroll(0, 0);
        
    });

    const poolAllocation = [
        { name: 'Lending Pool', allocation: 40, apy: lendingEstimatedAPY ? parseFloat(lendingEstimatedAPY) : 0 },
        { name: 'Liquidity Pool', allocation: 30, apy: liquidityEstimatedAPY ? parseFloat(liquidityEstimatedAPY) : 0 },
        { name: 'Strategy Pool', allocation: 30, apy: stakingEstimatedAPY ? parseFloat(stakingEstimatedAPY) : 0 }
    ];

    // Calculate weighted average APY
    const calculateWeightedAPY = () => {
        const totalAllocation = poolAllocation.reduce((sum, pool) => sum + pool.allocation, 0);
        const weightedSum = poolAllocation.reduce((sum, pool) => sum + (pool.apy * pool.allocation), 0);
        return totalAllocation > 0 ? (weightedSum / totalAllocation).toFixed(2) : "0.00";
    };

    const vaultAPY = calculateWeightedAPY();



    useEffect(() => {
    if (!address) {
      setAirdropClaimed(false);
      return;
    }

    let mounted = true;

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

    const vaultTVL = async () => {
            try {
              const vaultTVL = await readContract(config, {
                address: YIELD_VAULT_ADDRESS,
                abi: YIELD_VAULT_ABI,
                functionName: 'totalAssets',
                args: [],
              }) as bigint;
              if (mounted) {
                setTotalTVL(formatUnits(await vaultTVL, 18));
              }
            } catch (error) {
              console.error("Error fetching vault data:", error);
            }
          }
    
          const vaultShares = async () => { 
            try {
              const vaultApy = await readContract(config, {
                address: YIELD_VAULT_ADDRESS,
                abi: YIELD_VAULT_ABI,
                functionName: 'totalSupply',
                args: [],
              }) as bigint;
              if (mounted) {
                setTotalSupply(formatUnits(await vaultApy, 18));
              }
            } catch (error) {
              console.error("Error fetching vault APY:", error);
            }
          }

    const fetchBalance = async () => {
      try {
        console.log("Fetching balance for address:", address);
        const balance = await readContract(config, {
          address: VUSDT_ADDRESS,
          abi: vUSDTABI,
          functionName: "balanceOf",
          args: [address],
        }) as bigint;

        const formatted = formatUnits(balance, 18);
        console.log("Balance: ", formatted);
        if (mounted) setWalletBalance(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchVaultBalance = async () => {
      try {
        console.log("Fetching vault balance");
        
        const shares = (await readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "balanceOf",
          args: [address],
        })) as bigint;

        console.log("Vault Shares:", formatUnits(shares, 18));
        setShare(formatUnits(shares, 18));

        const underlyingAssets = (await readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "convertToAssets",
          args: [shares],
        })) as bigint;

        if (mounted) {
          const tvlFormatted = formatUnits(underlyingAssets, 18);
          setTVL(tvlFormatted);
          console.log("Total Assets in Vault:", tvlFormatted);

          // Calculate share price: TVL / shares owned
          const sharesFormatted = formatUnits(shares, 18);
          const sharePriceValue = parseFloat(sharesFormatted) > 0 
            ? (parseFloat(tvlFormatted) / parseFloat(sharesFormatted)).toFixed(2)
            : "0.00";
          setSharePrice(sharePriceValue);
          console.log("Share Price:", sharePriceValue);
        }
      } catch (err) {
        console.error("Error fetching vault balance:", err);
        if (mounted) setTVL("0");
      }
    };
    
    const fetchClaimed = async () => {
      try {
        const hasClaimed = await readContract(config, {
          address: VUSDT_ADDRESS,
          abi: vUSDTABI,
          functionName: "hasClaimed",
          args: [address],
        }) as boolean;
        
        if (mounted) setAirdropClaimed(hasClaimed);
        toast.success("Airdrop claim status fetched");
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchBalance();
    // fetchVaultBalance();
    // fetchClaimed();
    // vaultTVL();
    // vaultShares();
    // estimatedAPY();

    return () => {
      mounted = false;
    };
  }, [address]);

    const handleMaxAmount = () => {
        if (activeTab === 'deposit') {
            setAmount(walletBalance);
        } else if (activeTab === 'redeem') {
            setAmount(share);
        } else {
            setAmount(share);
        }
    };

    const handleAirdrop = async () => {
      if (!address) {
        toast.error("Please connect your wallet");
        return;
      }
      
      try {
        setIsLoading(true);
        setHash("Checking airdrop status...");

        // Check if user has already claimed
        const hasClaimed = await readContract(config, {
          address: VUSDT_ADDRESS,
          abi: vUSDTABI,
          functionName: "hasClaimed",
          args: [address],
        }) as boolean;

        if (hasClaimed) {
          setAirdropClaimed(true);
          toast.error("Airdrop already claimed for this wallet!");
          setHash(null);
          setIsLoading(false);
          return;
        }

        setHash("Processing airdrop claim...");

        // Call airdrop function - no arguments needed based on ABI
        const tx = await writeContract(config, {
          address: VUSDT_ADDRESS,
          abi: vUSDTABI,
          functionName: "airdrop",
          args: [],
        }) as `0x${string}`;

        setHash(tx);
        toast.loading("Transaction pending...", { id: "airdrop-tx" });

        // Wait for transaction confirmation with proper timeout
        const receipt = await waitForTransactionReceipt(config, { 
          hash: tx,
          timeout: 60000,
        });

        if (receipt.status === "success") {
          setAirdropClaimed(true);
          setHash("✓ Airdrop claimed successfully!");
          toast.success("Airdrop claimed successfully!", { id: "airdrop-tx" });
          
          // Refresh balance after successful claim
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setHash("✗ Airdrop claim failed!");
          toast.error("Airdrop claim failed! Transaction reverted.", { id: "airdrop-tx" });
        }
      } catch (err: any) {
        console.error("Airdrop error:", err);
        
        let errorMsg = "Failed to claim airdrop";
        
        if (err.message?.toLowerCase().includes("user rejected")) {
          errorMsg = "Transaction rejected by user";
        } else if (err.message?.toLowerCase().includes("already claimed")) {
          errorMsg = "Airdrop already claimed for this address";
        } else if (err.message?.toLowerCase().includes("insufficient")) {
          errorMsg = "Insufficient balance";
        } else if (err.message?.toLowerCase().includes("gas")) {
          errorMsg = "Gas estimation failed. Try again.";
        } else if (err.message?.toLowerCase().includes("timeout")) {
          errorMsg = "Transaction timeout. Please check pending transactions.";
        } else if (err.code === "CALL_EXCEPTION") {
          errorMsg = "Contract call failed. Check if you're eligible for airdrop.";
        } else {
          errorMsg = err?.message || "Unknown error occurred";
        }
        
        setHash(`✗ Error: ${errorMsg}`);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };


    const redeemShares = async () => {
    if (!amount || !address) return;
    
    setIsLoading(true);
    setHash("Processing redemption...");
    
    try {
      const redeemValue = parseFloat(amount);
      const availableShares = parseFloat(share || "0");
      
      if (redeemValue > availableShares) {
        setHash("✗ Error: Redeem amount exceeds available shares");
        setIsLoading(false);
        return;
      }

      const estimatedAssets = (await readContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "convertToAssets",
        args: [parseUnits(amount, 18)],
      })) as bigint;

      console.log("Estimated assets:", formatUnits(estimatedAssets, 18));

      const redeemTx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "redeem",
        args: [parseUnits(amount, 18), address, address],
      });

      console.log("Redeem tx:", redeemTx);
      setHash(redeemTx);

      const redeemReceipt = await waitForTransactionReceipt(config, { 
        hash: redeemTx,
        timeout: 60000,
      });

      if (redeemReceipt.status === "success") {
        setAmount("");
        setHash("✓ Redemption successful!");
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setHash("✗ Redemption failed!");
      }
    } catch (err: any) {
      console.error("Redeem error:", err);
      
      let errorMsg = "Transaction failed";
      
      if (err.message?.includes("Insufficient liquidity")) {
        errorMsg = "Vault has insufficient liquidity for this redemption. Try a smaller amount.";
      } else if (err.message?.includes("Insufficient balance")) {
        errorMsg = "Insufficient balance for redemption.";
      } else if (err.message?.includes("gas")) {
        errorMsg = "Gas estimation failed. Please try again.";
      } else if (err.message?.includes("User rejected")) {
        errorMsg = "Transaction rejected by user.";
      } else {
        errorMsg = err?.message || errorMsg;
      }
      
      setHash(`✗ Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };


  const withdrawFromVault = async () => {
    if (!amount || !address) return;

    setIsLoading(true);
    setHash("Processing withdrawal...");

    try {
      const withdrawTx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "withdraw",
        args: [parseUnits(amount, 18), address, address],
        // gas: 2000000n, // Increased gas limit
      });

      console.log("Withdraw tx:", withdrawTx);
      setHash(withdrawTx);

      const withdrawReceipt = await waitForTransactionReceipt(config, {
        hash: withdrawTx,
        timeout: 60000,
      });

      if (withdrawReceipt.status === "success") {
        setAmount("");
        setHash("✓ Withdrawal successful!");
        // setShowWithdrawModal(false);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setHash("Withdrawal failed!");
      }
    } catch (err: any) {
      console.error("Withdraw error:", err);
      setHash(`✗ Error: ${err?.message || "Transaction failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const depositToVault = async () => {
    if (!amount || !address) return;
    
    setIsLoading(true);
    setHash("Approving vUSDT...");
    
    try {
      const approvalAmount = parseUnits(amount, 18);
      
      const approveTx = await writeContract(config, {
        address: VUSDT_ADDRESS,
        abi: vUSDTABI,
        functionName: "approve",
        args: [YIELD_VAULT_ADDRESS, approvalAmount],
      });

      console.log("Approval tx:", approveTx);
      
      const approvalReceipt = await waitForTransactionReceipt(config, { 
        hash: approveTx,
        timeout: 60000,
      });

      if (approvalReceipt.status !== "success") {
        setHash("Approval failed!");
        setIsLoading(false);
        return;
      }

      console.log("Approval successful");
      setHash("Depositing to vault...");

      const depositTx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "deposit",
        args: [approvalAmount, address],
      });

      console.log("Deposit tx:", depositTx);
      setHash(depositTx);

      const depositReceipt = await waitForTransactionReceipt(config, { 
        hash: depositTx,
        timeout: 60000,
      });

      if (depositReceipt.status === "success") {
        setAmount("");
        setHash("✓ Deposit successful!");
        // setShowDepositModal(false);
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setHash("Deposit failed!");
      }
    } catch (err: any) {
      console.error("Deposit error:", err);
      setHash(`✗ Error: ${err?.message || "Transaction failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFunds = () => {
    if (activeTab === 'deposit') {
        depositToVault();
    } else if (activeTab === 'withdraw') {
        withdrawFromVault();
    } else if (activeTab === 'redeem') {
        redeemShares();
    }
  };

  // Loader Component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-muted/90 border border-foreground/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">Processing Transaction</h3>
          <p className="text-sm text-muted-foreground">{hash || "Please wait..."}</p>
        </div>
      </div>
    </div>
  );

  return (
    <DefaultLayout>
      {isLoading && <LoadingOverlay />}
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
                                    <h1 className="text-4xl md:text-5xl font-bold">Vault</h1>
                                    <p className="text-sm text-muted-foreground mt-1">Manage your deposits and earnings</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Your TVL</span>
                                </div>
                                <div className="text-3xl font-bold">${parseFloat(TVL).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground mt-2">vUSDT</div>
                            </div>

                            <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">INSIGHT Share Value</span>
                                </div>
                                <div className="text-3xl font-bold text-cyan-400">${parseFloat(sharePrice).toFixed(2)}</div>
                                <div className="flex items-center gap-1 text-xs mt-2">
                                    <span className="text-xs text-muted-foreground mt-2">vUSDT</span>
                                </div>
                            </div>

                            <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Share Hold</span>
                                </div>
                                <div className="text-3xl font-bold">${parseFloat(share).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground mt-2">INSIGHT</div>
                            </div>

                            <div className="bg-muted/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-foreground/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Wallet className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground text-sm">Available Balance</span>
                                </div>
                                <div className="text-3xl font-bold">${parseFloat(walletBalance).toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground mt-2">vUSDT</div>
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
                                            <span>{vaultAPY}% APY</span>
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
                                                    Available: ${activeTab === 'deposit' ? walletBalance.toLocaleString() : "Error"}
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full px-4 py-4 bg-muted border rounded-xl text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:[-moz-appearance:textfield]"
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
                                                <span className="font-medium">0.0%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">You will receive</span>
                                                <span className="font-medium">{amount ? (parseFloat(amount) * 1).toFixed(2) : '0.00'} {activeTab === 'redeem' ? 'USD' : 'shares'}</span>
                                            </div>
                                        </div>

                                        <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                                            <Button
                                                onClick={handleFunds}
                                                disabled={isLoading}
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
                                    <div className="text-3xl font-bold mb-4">$10,000</div>

                                    {(airdropClaimed) ? (
                                      <Button size="sm" variant="outline" className="w-full rounded-lg" disabled>
                                        <Gift className="mr-2 w-4 h-4" />
                                        Airdrop Claimed
                                    </Button>
                                     ) : (
                                      <Button size="sm" variant="outline" className="w-full rounded-lg" onClick={handleAirdrop} >
                                        <Gift className="mr-2 w-4 h-4" />
                                        Claim Airdrop
                                    </Button>
                                    )}

                                    
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
                                            <span className="font-semibold">${(parseFloat(totalTVL)/1000000).toFixed(2)}M</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Shares</span>
                                            <span className="font-semibold">{(parseFloat(totalSupply)/1000000).toFixed(2)} INSIGHT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Performance Fees</span>
                                            <span className="font-semibold">${10}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Withdrawal Fee</span>
                                            <span className="font-semibold">{0.5}%</span>
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                    </div>
                </div>
            </section>
        </main>
        </DefaultLayout>
    );
}