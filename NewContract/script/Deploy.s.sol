// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {vUSDT} from "../src/tokens/vUSDT.sol";
import {Real0GOracle} from "../src/core/Real0GOracle.sol";
import {StrategyManager} from "../src/core/StrategyManager.sol";
import {YieldVault} from "../src/core/YieldVault.sol";
import {LendingStrategy} from "../src/strategies/LendingStrategy.sol";
import {LiquidityStrategy} from "../src/strategies/LiquidityStrategy.sol";
import {StakingStrategy} from "../src/strategies/StakingStrategy.sol";

contract Deploy is Script {
    vUSDT public vusdt;
    Real0GOracle public oracle;
    StrategyManager public manager;
    YieldVault public vault;
    LendingStrategy public lending;
    LiquidityStrategy public liquidity;
    StakingStrategy public staking;

    address public deployer;

    function setUp() public {
        deployer = vm.addr(vm.envUint("PRIVATE_KEY"));
        console.log("Deployer:", deployer);
    }

    function run() external {
        // Ensure broadcast uses the same PRIVATE_KEY used in setUp()
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        // 1. vUSDT
        vusdt = new vUSDT();
        console.log("vUSDT:", address(vusdt));

        // 2. Real0GOracle (REAL AI)
        oracle = new Real0GOracle();
        console.log("Real0GOracle:", address(oracle));

    // 3. StrategyManager
    manager = new StrategyManager(deployer, oracle);
        console.log("StrategyManager:", address(manager));

        // 4. Strategies
    lending   = new LendingStrategy(IERC20(address(vusdt)), address(oracle));
    liquidity = new LiquidityStrategy(IERC20(address(vusdt)), address(oracle));
    staking   = new StakingStrategy(IERC20(address(vusdt)), address(oracle));
        console.log("Lending:", address(lending));
        console.log("Liquidity:", address(liquidity));
        console.log("Staking:", address(staking));

        // 5. YieldVault
    vault = new YieldVault(IERC20(address(vusdt)), manager);
        console.log("YieldVault:", address(vault));

        // 6. Wire up
    manager.setVault(vault);
        console.log("Vault & Oracle linked");

        // 7. Add strategies (~33.33% each)
        uint256 alloc = uint256(10_000) / 3; // 3333 bps
        manager.addStrategy(address(lending),   alloc);
        manager.addStrategy(address(liquidity), alloc);
        manager.addStrategy(address(staking),   alloc);
        console.log("Strategies added:", alloc, "bps each");

        // 8. Fee recipient
        vault.setFeeRecipient(deployer);
        console.log("Fee recipient set");

        // 9. Airdrop vUSDT
        vusdt.airdrop();
        console.log("Airdropped 10,000 vUSDT");

        vm.stopBroadcast();

        // ——— SUMMARY —————————————————————
        console.log("\nDEPLOYED ON 0G GALILEO TESTNET");
        console.log("Chain ID: 16601");
        console.log("RPC: https://evmrpc-testnet.0g.ai");
        console.log("Explorer: https://explorer.0g.ai\n");

        console.log("vUSDT:", address(vusdt));
        console.log("Real0GOracle:", address(oracle));
        console.log("StrategyManager:", address(manager));
        console.log("YieldVault:", address(vault));
        console.log("Lending:", address(lending));
        console.log("Liquidity:", address(liquidity));
        console.log("Staking:", address(staking));

        console.log("\nNEXT: Run fulfiller.js -> Real AI will activate");
    }
}