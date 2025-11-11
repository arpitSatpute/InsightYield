// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {I0GOracle} from "../interfaces/IReal0GOracle.sol";
import {IStrategy} from "../interfaces/IStrategy.sol";
import {Real0GOracle} from "./Real0GOracle.sol";
import {YieldVault} from "./YieldVault.sol";

contract StrategyManager {
    address public owner;
    Real0GOracle public zeroGOracle;
    YieldVault public vault;

    struct StrategyInfo {
        address strategy;
        uint256 allocation; // bps
        bool active;
    }

    StrategyInfo[] public strategies;
    uint256 public totalAllocation;

    event AllocationUpdated(uint256 indexed index, uint256 allocation);
    event AIRebalanceTriggered(string prompt, bytes metrics);

    constructor(address _owner, Real0GOracle _oracle) {
        owner = _owner;
        zeroGOracle = _oracle;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyVault() {
        require(msg.sender == address(vault), "Not vault");
        _;
    }

    function setVault(YieldVault _vault) external onlyOwner {
        vault = _vault;
    }

    function addStrategy(address strategy, uint256 allocation) external onlyOwner {
        strategies.push(StrategyInfo(strategy, allocation, true));
        totalAllocation += allocation;
    }

    function aiRebalanceStrategies(string calldata prompt, bytes calldata metrics) external onlyVault {
        emit AIRebalanceTriggered(prompt, metrics);
        zeroGOracle.requestAIReallocation(prompt, metrics);
    }

    function fulfillAIReallocation(
        uint256 requestId,
        I0GOracle.AllocationRecommendation[] calldata allocations,
        bytes calldata zkProof
    ) external {
        require(msg.sender == address(zeroGOracle), "Not oracle");

        uint256 newTotal = 0;
        for (uint256 i = 0; i < allocations.length; i++) {
            uint256 idx = allocations[i].strategyIndex; // strategyIndex
            uint256 alloc = allocations[i].recommendedAllocation; // recommendedAllocation
            require(idx < strategies.length && strategies[idx].active, "Invalid strategy");
            strategies[idx].allocation = alloc;
            newTotal += alloc;
            emit AllocationUpdated(idx, alloc);
        }
        require(newTotal == 10000, "Total must be 10000");
        totalAllocation = newTotal;
    }

    function getStrategy(uint256 index) external view returns (address, uint256, bool) {
        StrategyInfo memory s = strategies[index];
        return (s.strategy, s.allocation, s.active);
    }

    function getStrategyCount() external view returns (uint256) {
        return strategies.length;
    }

    function getTotalAllocation() external view returns (uint256) {
        return totalAllocation;
    }

    function getTotalTVL() external view returns (uint256) {
        uint256 tvl = 0;
        for (uint256 i = 0; i < strategies.length; i++) {
            if (strategies[i].active) {
                tvl += IStrategy(strategies[i].strategy).totalAssets();
            }
        }
        return tvl;
    }

    function getPoolData() external view returns (
        uint256[] memory apys,
        uint256[] memory risks,
        uint256[] memory tvls
    ) {
        uint256 len = strategies.length;
        apys = new uint256[](len);
        risks = new uint256[](len);
        tvls = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            apys[i] = 400 + i * 400; // Mock
            risks[i] = 50;
            tvls[i] = IStrategy(strategies[i].strategy).totalAssets();
        }
    }
}