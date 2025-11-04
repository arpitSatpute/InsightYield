import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAccount } from "wagmi";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { formatUnits, parseUnits } from "viem";
import YIELD_VAULT_ABI from "../abis/YieldVaultAbi.json";
import { config } from "@/config/config";
import { Lock, Settings, Zap, AlertCircle, CheckCircle, Loader, RotateCw, Shield } from "lucide-react";

const ADMIN_WALLET_ADDRESS = import.meta.env.VITE_ADMIN_WALLET_ADDRESS  as `0x${string}`;
const YIELD_VAULT_ADDRESS = import.meta.env.VITE_YIELD_VAULT_ADDRESS as `0x${string}`;

interface VaultSettings {
  performanceFee: number;
  withdrawalFee: number;
  liquidityBufferBps: number;
  feeRecipient: string;
  isPaused: boolean;
  totalDeposited: number;
  totalWithdrawn: number;
  lastRebalance: number;
}

export default function AdminPage() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);

  // Form states
  const [performanceFee, setPerformanceFee] = useState<string>("1000");
  const [withdrawalFee, setWithdrawalFee] = useState<string>("50");
  const [liquidityBuffer, setLiquidityBuffer] = useState<string>("500");
  const [feeRecipient, setFeeRecipient] = useState<string>("");
  const [vaultSettings, setVaultSettings] = useState<VaultSettings | null>(null);

  // Check if user is admin
    const isAdmin = !!(address && ADMIN_WALLET_ADDRESS && address.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase());

  // Auto-load settings when component mounts
  useEffect(() => {
    if (isAdmin && address) {
      loadVaultSettings();
    }
  }, [isAdmin, address]);

  // ==================== Admin Functions ====================

  const loadVaultSettings = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const [perfFee, withFee, buffer, recipient, paused, totalDep, totalWith, lastRebal] = await Promise.all([
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "performanceFee",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "withdrawalFee",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "liquidityBufferBps",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "feeRecipient",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "paused",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "totalDeposited",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "totalWithdrawn",
        }),
        readContract(config, {
          address: YIELD_VAULT_ADDRESS,
          abi: YIELD_VAULT_ABI,
          functionName: "lastRebalance",
        }),
      ]);

      setVaultSettings({
        performanceFee: Number(perfFee),
        withdrawalFee: Number(withFee),
        liquidityBufferBps: Number(buffer),
        feeRecipient: recipient as string,
        isPaused: paused as boolean,
        totalDeposited: Number(totalDep),
        totalWithdrawn: Number(totalWith),
        lastRebalance: Number(lastRebal),
      });

      setPerformanceFee(perfFee?.toString() || "1000");
      setWithdrawalFee(withFee?.toString() || "50");
      setLiquidityBuffer(buffer?.toString() || "500");
      setFeeRecipient((recipient as string) || "");
    } catch (err: any) {
      setError("Failed to load vault settings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const setPerformanceFeeFunc = async () => {
    if (!address) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "setPerformanceFee",
        args: [BigInt(performanceFee)],
        account: address,
      });

      setHash(tx);
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setSuccess(`Performance fee updated to ${(Number(performanceFee) / 100).toFixed(2)}%`);
        await loadVaultSettings();
      } else {
        setError("Transaction failed");
      }
    } catch (err: any) {
      setError("Failed to set performance fee: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const setWithdrawalFeeFunc = async () => {
    if (!address) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "setWithdrawalFee",
        args: [BigInt(withdrawalFee)],
        account: address,
      });

      setHash(tx);
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setSuccess(`Withdrawal fee updated to ${(Number(withdrawalFee) / 100).toFixed(2)}%`);
        await loadVaultSettings();
      } else {
        setError("Transaction failed");
      }
    } catch (err: any) {
      setError("Failed to set withdrawal fee: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const setLiquidityBufferBpsFunc = async () => {
    if (!address) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "setLiquidityBufferBps",
        args: [BigInt(liquidityBuffer)],
        account: address,
      });

      setHash(tx);
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setSuccess(`Liquidity buffer updated to ${(Number(liquidityBuffer) / 100).toFixed(2)}%`);
        await loadVaultSettings();
      } else {
        setError("Transaction failed");
      }
    } catch (err: any) {
      setError("Failed to set liquidity buffer: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const setFeeRecipientFunc = async () => {
    if (!address || !feeRecipient) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "setFeeRecipient",
        args: [feeRecipient as `0x${string}`],
        account: address,
      });

      setHash(tx);
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setSuccess(`Fee recipient updated to ${feeRecipient}`);
        await loadVaultSettings();
      } else {
        setError("Transaction failed");
      }
    } catch (err: any) {
      setError("Failed to set fee recipient: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const rebalanceVault = async () => {
    if (!address) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "rebalance",
        account: address,
      });

      setHash(tx);
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setSuccess("Vault rebalanced successfully");
        await loadVaultSettings();
      } else {
        setError("Transaction failed");
      }
    } catch (err: any) {
      setError("Failed to rebalance vault: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const pauseVault = async () => {
    if (!address) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "pause",
        account: address,
      });

      setHash(tx);
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setSuccess("Vault paused successfully");
        await loadVaultSettings();
      } else {
        setError("Transaction failed");
      }
    } catch (err: any) {
      setError("Failed to pause vault: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const unpauseVault = async () => {
    if (!address) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "unpause",
        account: address,
      });

      setHash(tx);
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setSuccess("Vault unpaused successfully");
        await loadVaultSettings();
      } else {
        setError("Transaction failed");
      }
    } catch (err: any) {
      setError("Failed to unpause vault: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const emergencyWithdraw = async () => {
    if (!address) return;
    if (!window.confirm("Are you sure you want to perform emergency withdrawal? This action cannot be undone.")) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const tx = await writeContract(config, {
        address: YIELD_VAULT_ADDRESS,
        abi: YIELD_VAULT_ABI,
        functionName: "emergencyWithdrawAll",
        account: address,
      });

      setHash(tx);
      const receipt = await waitForTransactionReceipt(config, { hash: tx });

      if (receipt.status === "success") {
        setSuccess("Emergency withdrawal completed");
      } else {
        setError("Transaction failed");
      }
    } catch (err: any) {
      setError("Failed to perform emergency withdrawal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp || timestamp === 0) return "Never";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // ==================== Render ====================

  if (!address) {
    return (
      <DefaultLayout>
        <section className="overflow-hidden bg-background min-h-screen">
          {/* Background Effects */}
          <div
            aria-hidden
            className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
            <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
            <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          </div>

          <section className="relative py-24 md:py-36">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex flex-col items-center justify-center gap-6 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-muted/50 backdrop-blur-sm mb-6">
                  <span className="text-sm">🔐 Restricted Access</span>
                </div>
                <h1 className={title()}>Admin Dashboard</h1>
                <div className="p-8 bg-muted border border-muted-foreground/20 rounded-2xl text-center max-w-md">
                  <p className="text-lg font-semibold text-foreground">
                    Please connect your wallet to access this page
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </DefaultLayout>
    );
  }

  if (!isAdmin) {
    return (
      <DefaultLayout>
        <section className="overflow-hidden bg-background min-h-screen">
          {/* Background Effects */}
          <div
            aria-hidden
            className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
            <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
            <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          </div>

          <section className="relative py-24 md:py-36">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex flex-col items-center justify-center gap-6 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-muted/50 backdrop-blur-sm mb-6">
                  <span className="text-sm">🔐 Access Denied</span>
                </div>
                <h1 className={title()}>Admin Dashboard</h1>
                <div className="p-8 bg-muted border border-muted-foreground/20 rounded-2xl text-center max-w-md">
                  <div className="flex justify-center mb-4">
                    <Lock className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-3">
                    Unauthorized Access
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    You are not authorized to access this page. Only the admin wallet can view this page.
                  </p>
                  <p className="text-xs text-muted-foreground break-all bg-background p-3 rounded border border-muted-foreground/20">
                    Connected: {address}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="overflow-hidden bg-background min-h-screen">
        {/* Background Effects */}
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        </div>

        <div className="relative py-12 md:py-16 mt-10">
          <div className="mx-auto max-w-7xl px-6">
            {/* Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-muted/50 backdrop-blur-sm mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-sm">🔐 Admin Control</span>
              </div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className={title()}>Admin Dashboard</h1>
                  <p className="text-muted-foreground mt-2">
                    Manage YieldVault parameters, settings, and perform administrative actions
                  </p>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 bg-muted border border-muted-foreground/20 rounded-xl flex gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-muted border border-muted-foreground/20 rounded-xl flex gap-3 animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Success</p>
                  <p className="text-sm text-muted-foreground">{success}</p>
                  {hash && (
                    <p className="text-xs text-muted-foreground mt-2 break-all">
                      Tx: {hash}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Rebalance Section */}
            <div className="mb-12 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-gradient-to-br from-primary/5 to-primary/0 relative overflow-hidden rounded-2xl border border-primary/20 shadow-lg shadow-zinc-950/15 ring-1 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <RotateCw className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Rebalance Vault</h2>
                  </div>
                  <p className="text-muted-foreground">
                    Harvest yields and rebalance assets across all strategies according to their allocations
                  </p>
                  {vaultSettings && (
                    <p className="text-sm text-muted-foreground mt-3">
                      Last rebalanced: {formatTimestamp(vaultSettings.lastRebalance)}
                    </p>
                  )}
                </div>
                <Button
                  onClick={rebalanceVault}
                  disabled={loading}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground min-w-fit">
                  {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rebalance Now
                </Button>
              </div>
            </div>

            {/* Fee Configuration Cards */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Fee Configuration</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Fee */}
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6 hover:ring-primary/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Performance Fee</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Current Value</label>
                        <span className="text-sm font-semibold text-primary">
                          {vaultSettings ? `${(vaultSettings.performanceFee / 100).toFixed(2)}%` : "Loading..."}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={performanceFee}
                        onChange={(e) => setPerformanceFee(e.target.value)}
                        placeholder="1000"
                        className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        In basis points (100 = 1%). Max: 2000 (20%)
                      </p>
                    </div>
                    <Button
                      onClick={setPerformanceFeeFunc}
                      disabled={loading}
                      className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                      Update Performance Fee
                    </Button>
                  </div>
                </div>

                {/* Withdrawal Fee */}
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6 hover:ring-primary/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Withdrawal Fee</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Current Value</label>
                        <span className="text-sm font-semibold text-primary">
                          {vaultSettings ? `${(vaultSettings.withdrawalFee / 100).toFixed(2)}%` : "Loading..."}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={withdrawalFee}
                        onChange={(e) => setWithdrawalFee(e.target.value)}
                        placeholder="50"
                        className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        In basis points (100 = 1%). Max: 500 (5%)
                      </p>
                    </div>
                    <Button
                      onClick={setWithdrawalFeeFunc}
                      disabled={loading}
                      className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                      Update Withdrawal Fee
                    </Button>
                  </div>
                </div>

                {/* Liquidity Buffer */}
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6 hover:ring-primary/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Liquidity Buffer</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Current Value</label>
                        <span className="text-sm font-semibold text-primary">
                          {vaultSettings ? `${(vaultSettings.liquidityBufferBps / 100).toFixed(2)}%` : "Loading..."}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={liquidityBuffer}
                        onChange={(e) => setLiquidityBuffer(e.target.value)}
                        placeholder="500"
                        className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        In basis points (100 = 1%). Max: 2000 (20%)
                      </p>
                    </div>
                    <Button
                      onClick={setLiquidityBufferBpsFunc}
                      disabled={loading}
                      className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                      Update Liquidity Buffer
                    </Button>
                  </div>
                </div>

                {/* Fee Recipient */}
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/15 ring-1 p-6 hover:ring-primary/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Fee Recipient</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Current Address</label>
                        <span className="text-xs font-mono text-primary">
                          {vaultSettings ? vaultSettings.feeRecipient.slice(0, 6) + "..." : "Loading..."}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={feeRecipient}
                        onChange={(e) => setFeeRecipient(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter complete wallet address
                      </p>
                    </div>
                    <Button
                      onClick={setFeeRecipientFunc}
                      disabled={loading || !feeRecipient}
                      className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                      Update Fee Recipient
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vault Statistics */}
            {vaultSettings && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Vault Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-gradient-to-br from-primary/5 to-primary/0 relative overflow-hidden rounded-2xl border border-primary/20 shadow-lg shadow-zinc-950/15 ring-1 p-6">
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <p className={`text-2xl font-bold ${vaultSettings.isPaused ? "text-muted-foreground" : "text-primary"}`}>
                      {vaultSettings.isPaused ? "🔴 Paused" : "🟢 Active"}
                    </p>
                  </div>
                  <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-gradient-to-br from-primary/5 to-primary/0 relative overflow-hidden rounded-2xl border border-primary/20 shadow-lg shadow-zinc-950/15 ring-1 p-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Deposited</p>
                    <p className="text-2xl font-bold text-primary">${(vaultSettings.totalDeposited / 1e18).toFixed(2)}</p>
                  </div>
                  <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-gradient-to-br from-primary/5 to-primary/0 relative overflow-hidden rounded-2xl border border-primary/20 shadow-lg shadow-zinc-950/15 ring-1 p-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Withdrawn</p>
                    <p className="text-2xl font-bold text-primary">${(vaultSettings.totalWithdrawn / 1e18).toFixed(2)}</p>
                  </div>
                  <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-gradient-to-br from-primary/5 to-primary/0 relative overflow-hidden rounded-2xl border border-primary/20 shadow-lg shadow-zinc-950/15 ring-1 p-6">
                    <p className="text-sm text-muted-foreground mb-2">Last Rebalance</p>
                    <p className="text-sm font-bold text-primary break-all">{formatTimestamp(vaultSettings.lastRebalance)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Actions */}
            <div className="mb-12 inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-gradient-to-br from-primary/5 to-primary/0 relative overflow-hidden rounded-2xl border border-primary/20 shadow-lg shadow-zinc-950/15 ring-1 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">🚨 Emergency Actions</h2>
                <p className="text-sm text-muted-foreground">
                  Use these actions only in critical situations. They may have irreversible effects.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={pauseVault}
                  disabled={loading || vaultSettings?.isPaused}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                  {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  Pause Vault
                </Button>
                <Button
                  onClick={unpauseVault}
                  disabled={loading || !vaultSettings?.isPaused}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                  {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  Unpause Vault
                </Button>
                <Button
                  onClick={emergencyWithdraw}
                  disabled={loading}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                  {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  Emergency Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
