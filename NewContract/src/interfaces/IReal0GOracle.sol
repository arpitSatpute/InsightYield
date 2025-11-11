// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface I0GOracle {
    struct AllocationRecommendation {
        uint256 strategyIndex;
        uint256 recommendedAllocation; // basis points (10000 = 100%)
    }

    struct YieldRecommendation {
        uint256 recommendedAPY; // basis points
    }

    function requestAIReallocation(
        uint256 requestId,
        bytes calldata metrics
    ) external returns (bool);

    function fulfillAIReallocation(
        uint256 requestId,
        AllocationRecommendation[] calldata allocations
    ) external;

    function requestAIYieldEstimate(
        uint256 requestId,
        uint256 strategyIndex,
        bytes calldata currentMetrics
    ) external returns (bool);

    function fulfillAIYieldEstimate(
        uint256 requestId,
        YieldRecommendation calldata apy
    ) external;

    event AIReallocationRequested(uint256 indexed requestId, bytes metrics);
    event AIReallocationFulfilled(uint256 indexed requestId, AllocationRecommendation[] allocations);
    event AIYieldRequested(uint256 indexed requestId, uint256 strategyIndex, bytes metrics);
    event AIYieldFulfilled(uint256 indexed requestId, uint256 apy);
}

// Backwards-compatible alias: some contracts reference IReal0GOracle
interface IReal0GOracle is I0GOracle {}