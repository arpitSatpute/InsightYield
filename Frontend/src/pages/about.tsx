import React, { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { config } from "@/config/config";
import DefaultLayout from "@/layouts/default";
import { writeContract, readContract } from "@wagmi/core";
import { useAccount } from "wagmi";
import { utils } from "ethers";
import vusdtAbi from "@/abis/vusdt.json";
import lendingStrategyAbi from "@/abis/lendingStrategy.json"
import { Button } from "@heroui/button";
import { formatUnits, parseUnits } from 'viem';



export default function DocsPage() {

  const VUSDT_ADDRESS = import.meta.env.VITE_VUSDT_ADDRESS;
  const LENDING_STRATEGY_ADDRESS = import.meta.env.VITE_LENDING_STRATEGY_ADDRESS;
  

  const { address } = useAccount();
  const [balance, setBalance] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string>("TOKEN");
  const [decimals, setDecimals] = useState<number>(18);
  const [balLoading, setBalLoading] = useState(false);


  useEffect(() => {
    async function loadBalance() {
      
      if (!VUSDT_ADDRESS || !address) {
        setBalance(null);
        return;
      }
      setBalLoading(true);
      try {
        const rawBal = await readContract(config,{
            address: VUSDT_ADDRESS as `0x${string}`,
            abi: vusdtAbi,
            functionName: "balanceOf",
            args: [address],
          }) as bigint;
         
          setBalance(formatUnits(rawBal, 18));
       
      } catch (err) {
        console.error("loadBalance error", err);
        setBalance(null);
      } finally {
        setBalLoading(false);
      }
    }
    loadBalance();
  }, [VUSDT_ADDRESS, address]);

  const handleAirdrop = async() => {
    console.log("Button click Airdrop");
    try{
      const tx = await writeContract(config,{
        address: VUSDT_ADDRESS,
        abi: vusdtAbi,
        functionName: "airdrop",
      });

      console.log(tx);
    }
    catch(err) {
      console.log(err);
    }
  }

  const handleTotalAssets = async() => {
    try{
      const tx = await readContract(config, {
        address: LENDING_STRATEGY_ADDRESS,
        abi: lendingStrategyAbi,
        functionName: "totalAssets",
      }) as bigint;
      const formatted = formatUnits(tx, 18);

      console.log(formatted);
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <DefaultLayout>
      {/* Info box: show connected user balance */}
      <div className="max-w-3xl mx-auto mt-6 mb-4 p-4 rounded-lg border bg-muted/75 text-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Your VUSDT balance</div>
            <div className="text-xs text-muted-foreground">
              {address ? (
                <code className="break-all">{address}</code>
              ) : (
                "Wallet not connected"
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium">
              {balLoading ? "Loading..." : balance ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">{symbol}</div>
          </div>
        </div>
      </div>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>About</h1>
        </div>

        <Button onPress={handleAirdrop}>Airdrop</Button>
        <Button onPress={handleTotalAssets}>Lending Assets</Button>
      </section>
    </DefaultLayout>
  );
}
