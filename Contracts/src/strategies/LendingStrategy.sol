// SPDX-License-Identifier: MIT
 pragma solidity ^0.8.20;
 import "./BaseStrategy.sol";

 contract LendingStrategy is BaseStrategy {
    constructor(IERC20 _asset) 
        BaseStrategy(
            _asset, 
            "Lending Strategy Vault", 
            "lsVault", 
            400 // 4% base APY
        ) 
    {}
}