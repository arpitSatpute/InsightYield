import React, { useEffect, useState } from "react";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Gift, TrendingUp, Shield, Zap, ChevronRight, X, PieChart, LogOut } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import DefaultLayout from "@/layouts/default";
import { readContract, writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/config/config";
import vUSDTABI from "../abis/vUSDTAbi.json"
import yieldVaultAbi from "../abis/YieldVaultAbi.json";
import { parseUnits } from "ethers/lib/utils";
import { formatUnits } from "viem";

export default function Vault() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [airdropClaimed, setAirdropClaimed] = useState(false);
  const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS as `0x${string}`;
  const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;
  const [hash, setHash] = useState<string | null>(null);
  const [vaultBalance, setVaultBalance] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [redeemAmount, setRedeemAmount] = useState<string>("");
  const [vUSDTBalance, setVUSDTBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [share, setShare] = useState<string>("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  useEffect(() => {
    if (!address) {
      setAirdropClaimed(false);
      return;
    }

    let mounted = true;

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
        if (mounted) setVUSDTBalance(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchVaultBalance = async () => {
      try {
        console.log("Fetching vault balance");
        
        const shares = (await readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: yieldVaultAbi,
          functionName: "balanceOf",
          args: [address],
        })) as bigint;

        console.log("Vault Shares:", formatUnits(shares, 18));
        setShare(formatUnits(shares, 18));

        const underlyingAssets = (await readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: yieldVaultAbi,
          functionName: "convertToAssets",
          args: [shares],
        })) as bigint;

        if (mounted) {
          setVaultBalance(formatUnits(underlyingAssets, 18));
          console.log("Total Assets in Vault:", formatUnits(underlyingAssets, 18));
        }
      } catch (err) {
        console.error("Error fetching vault balance:", err);
        if (mounted) setVaultBalance("0");
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
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchBalance();
    fetchVaultBalance();
    fetchClaimed();

    return () => {
      mounted = false;
    };
  }, [address]);
 
  const handleAirdrop = async () => {
    console.log("Airdrop button clicked");
    if (!address) return;
    
    try {
      const hasClaimed = await readContract(config, {
        address: VUSDT_ADDRESS,
        abi: vUSDTABI,
        functionName: "hasClaimed",
        args: [address],
      }) as boolean;

      if (hasClaimed) {
        setAirdropClaimed(true);
        return;
      }

      const tx = await writeContract(config, {
        address: VUSDT_ADDRESS,
        abi: vUSDTABI,
        functionName: "airdrop",
      });

      setHash(tx);
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setAirdropClaimed(true);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    setter(e.target.value);
  };

  const depositToVault = async () => {
    if (!depositAmount || !address) return;
    
    setIsLoading(true);
    setHash("Approving vUSDT...");
    
    try {
      const approvalAmount = parseUnits(depositAmount, 18);
      
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
        abi: yieldVaultAbi,
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
        setDepositAmount("");
        setHash("✓ Deposit successful!");
        setShowDepositModal(false);
        
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

  const withdrawFromVault = async () => {
    if (!withdrawAmount || !address) return;
    
    setIsLoading(true);
    setHash("Processing withdrawal...");
    
    try {
      const withdrawTx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: yieldVaultAbi,
        functionName: "withdraw",
        args: [parseUnits(withdrawAmount, 18), address, address],
      });

      console.log("Withdraw tx:", withdrawTx);
      setHash(withdrawTx);

      const withdrawReceipt = await waitForTransactionReceipt(config, { 
        hash: withdrawTx,
        timeout: 60000,
      });

      if (withdrawReceipt.status === "success") {
        setWithdrawAmount("");
        setHash("✓ Withdrawal successful!");
        setShowWithdrawModal(false);
        
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

  const redeemShares = async () => {
    if (!redeemAmount || !address) return;
    
    setIsLoading(true);
    setHash("Processing redemption...");
    
    try {
      const redeemTx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: yieldVaultAbi,
        functionName: "redeem",
        args: [parseUnits(redeemAmount, 18), address, address],
      });

      console.log("Redeem tx:", redeemTx);
      setHash(redeemTx);

      const redeemReceipt = await waitForTransactionReceipt(config, { 
        hash: redeemTx,
        timeout: 60000,
      });

      if (redeemReceipt.status === "success") {
        setRedeemAmount("");
        setHash("✓ Redemption successful!");
        setShowRedeemModal(false);
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setHash("Redemption failed!");
      }
    } catch (err: any) {
      console.error("Redeem error:", err);
      setHash(`✗ Error: ${err?.message || "Transaction failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950/10 to-gray-950 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-500/20">
                <Wallet className="w-12 h-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Vault</h1>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">Connect your wallet to start earning yields on your assets</p>
            <button onClick={() => connect({ connector: connectors[0] })} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
              Connect Wallet
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950/5 to-gray-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-500/30">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">Vault</h1>
                <p className="text-gray-400 text-sm mt-1">Secure • Transparent • Rewarding</p>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {hash && (
            <div className={`mb-6 p-4 rounded-xl text-center font-medium text-sm border backdrop-blur-sm ${
              hash.includes("✗")
                ? "bg-red-900/20 text-red-300 border-red-700/30"
                : hash.includes("✓")
                ? "bg-emerald-900/20 text-emerald-300 border-emerald-700/30"
                : "bg-blue-900/20 text-blue-300 border-blue-700/30"
            }`}>
              {hash}
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Left Column - Large Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Total Investment Card */}
              <div className="group bg-gradient-to-br from-blue-900/20 via-blue-900/10 to-transparent rounded-2xl p-8 border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Total Share Value</p>
                    </div>
                    <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-2">
                      {parseFloat(vaultBalance || "0").toFixed(2)}
                    </h2>
                    <p className="text-gray-500 text-lg">vUSDT</p>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-10 h-10 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Wallet Balance Card */}
              <div className="group bg-gradient-to-br from-emerald-900/20 via-emerald-900/10 to-transparent rounded-2xl p-8 border border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-300 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="w-5 h-5 text-emerald-400" />
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Available Balance</p>
                    </div>
                    <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-2">
                      {parseFloat(vUSDTBalance || "0").toFixed(2)}
                    </h2>
                    <p className="text-gray-500 text-lg">vUSDT</p>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center border border-emerald-600/30 group-hover:scale-110 transition-transform duration-300">
                    <Wallet className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Airdrop, Wallet & Share Holdings */}
            <div className="lg:col-span-1 space-y-4 flex flex-col">
              
              {/* Airdrop Mini Card */}
              <div className="bg-gradient-to-br from-purple-900/30 via-purple-900/10 to-transparent rounded-2xl p-4 border border-purple-700/40 hover:border-purple-600/60 transition-all duration-300 shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-bold text-white">Airdrop</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">10,000 vUSDT</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${
                      airdropClaimed 
                        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40' 
                        : 'bg-purple-900/40 text-purple-300 border-purple-700/40'
                    }`}>
                      {airdropClaimed ? '✓ Claimed' : '● Available'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAirdrop}
                  disabled={airdropClaimed}
                  className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs shadow-lg shadow-purple-600/30"
                >
                  {airdropClaimed ? 'Claimed' : 'Claim'}
                </button>
              </div>

              {/* Share Holdings Card - Fills Remaining Space */}
              <div className="flex-1 bg-gradient-to-br from-indigo-900/30 via-indigo-900/10 to-transparent rounded-2xl p-4 border border-indigo-700/40 shadow-lg shadow-indigo-900/20 flex flex-col justify-between hover:border-indigo-600/60 transition-all duration-300 hover:shadow-indigo-900/40">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-lg flex items-center justify-center border border-indigo-600/40">
                      <PieChart className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Your Shares</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Total Holdings</p>
                      <p className="text-3xl font-bold text-indigo-300">{parseFloat(share || "0").toFixed(4)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-700/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-900/40 text-indigo-300 border border-indigo-700/40 rounded text-xs font-semibold">
                      ● Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Buttons Section - Creative Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Deposit Button Card */}
            <button
              onClick={() => setShowDepositModal(true)}
              className="group bg-gradient-to-br from-blue-900/15 to-transparent rounded-2xl p-6 border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/30 text-left hover:scale-105 transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-600/30 group-hover:scale-110 transition-transform">
                  <ArrowDownCircle className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Deposit</h3>
                  <p className="text-sm text-gray-400">Add funds to vault</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-blue-400 transition-colors" />
              </div>
            </button>

            {/* Withdraw Button Card */}
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="group bg-gradient-to-br from-red-900/15 to-transparent rounded-2xl p-6 border border-red-700/30 hover:border-red-600/50 transition-all duration-300 shadow-lg shadow-red-900/10 hover:shadow-red-900/30 text-left hover:scale-105 transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-xl flex items-center justify-center border border-red-600/30 group-hover:scale-110 transition-transform">
                  <ArrowUpCircle className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Withdraw</h3>
                  <p className="text-sm text-gray-400">Withdraw from vault</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-red-400 transition-colors" />
              </div>
            </button>

            {/* Redeem Button Card */}
            <button
              onClick={() => setShowRedeemModal(true)}
              className="group bg-gradient-to-br from-amber-900/15 to-transparent rounded-2xl p-6 border border-amber-700/30 hover:border-amber-600/50 transition-all duration-300 shadow-lg shadow-amber-900/10 hover:shadow-amber-900/30 text-left hover:scale-105 transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 rounded-xl flex items-center justify-center border border-amber-600/30 group-hover:scale-110 transition-transform">
                  <LogOut className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Redeem</h3>
                  <p className="text-sm text-gray-400">Burn shares for assets</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-amber-400 transition-colors" />
              </div>
            </button>
          </div>

          {/* Deposit Modal */}
          {showDepositModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 w-full max-w-md shadow-2xl animate-in fade-in scale-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-600/30">
                      <ArrowDownCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Deposit</h2>
                  </div>
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Amount (vUSDT)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-gray-800/80 text-white placeholder-gray-600 transition-all"
                      value={depositAmount}
                      onChange={(e) => handleInputChange(e, setDepositAmount)}
                    />
                    <p className="text-xs text-gray-500 mt-2">Available: {parseFloat(vUSDTBalance || "0").toFixed(2)} vUSDT</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDepositModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={depositToVault}
                      disabled={isLoading || !depositAmount}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30"
                    >
                      {isLoading ? "Processing..." : "Confirm Deposit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Withdraw Modal */}
          {showWithdrawModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 w-full max-w-md shadow-2xl animate-in fade-in scale-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-xl flex items-center justify-center border border-red-600/30">
                      <ArrowUpCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Withdraw</h2>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Amount (vUSDT)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-red-600 focus:bg-gray-800/80 text-white placeholder-gray-600 transition-all"
                      value={withdrawAmount}
                      onChange={(e) => handleInputChange(e, setWithdrawAmount)}
                    />
                    <p className="text-xs text-gray-500 mt-2">Available: {parseFloat(vaultBalance || "0").toFixed(2)} vUSDT</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowWithdrawModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={withdrawFromVault}
                      disabled={isLoading || !withdrawAmount}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-600/30"
                    >
                      {isLoading ? "Processing..." : "Confirm Withdraw"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Redeem Modal */}
          {showRedeemModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 w-full max-w-md shadow-2xl animate-in fade-in scale-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 rounded-xl flex items-center justify-center border border-amber-600/30">
                      <LogOut className="w-6 h-6 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Redeem Shares</h2>
                  </div>
                  <button
                    onClick={() => setShowRedeemModal(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Amount (Shares)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-gray-800/80 text-white placeholder-gray-600 transition-all"
                      value={redeemAmount}
                      onChange={(e) => handleInputChange(e, setRedeemAmount)}
                    />
                    <p className="text-xs text-gray-500 mt-2">Available: {parseFloat(share || "0").toFixed(4)} Shares</p>
                  </div>

                  <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">You will receive</p>
                    <p className="text-2xl font-bold text-amber-300">
                      {redeemAmount ? (parseFloat(redeemAmount)).toFixed(2) : "0.00"} vUSDT
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRedeemModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={redeemShares}
                      disabled={isLoading || !redeemAmount}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-600/30"
                    >
                      {isLoading ? "Processing..." : "Confirm Redeem"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}