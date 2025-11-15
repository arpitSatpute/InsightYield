 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.20;
 import "./BaseStrategy.sol";
 
 contract LiquidityStrategy is BaseStrategy {
    constructor(IERC20 _asset) 
        BaseStrategy(
            _asset, 
            "Liquidity Strategy Vault", 
            "lpVault", 
            1200 // 12% base APY
        ) 
    {}
}