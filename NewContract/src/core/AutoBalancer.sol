// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { YieldVault } from "./YieldVault.sol";

contract AutoRebalancer {
    YieldVault public immutable vault;
    uint256 public constant INTERVAL = 5 minutes;
    uint256 public lastTrigger;

    constructor(YieldVault _vault) {
        vault = _vault;
        lastTrigger = block.timestamp;
    }

    function trigger() external {
        require(block.timestamp >= lastTrigger + INTERVAL, "Too soon");
        vault.rebalance();
        lastTrigger = block.timestamp;
    }
}