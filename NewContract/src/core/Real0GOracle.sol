// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {I0GOracle} from "../interfaces/IReal0GOracle.sol";

contract Real0GOracle {
    uint256 public requestId;
    mapping(uint256 => bool) public fulfilled;

    event InferenceRequested(uint256 indexed requestId, string prompt, bytes metrics);

    constructor() {}

    function requestAIReallocation(string calldata prompt, bytes calldata metrics) external {
        uint256 id = requestId++;
        emit InferenceRequested(id, prompt, metrics);
    }

    function fulfillAIReallocation(
        uint256 _requestId,
        uint256[] calldata strategyIndices,
        uint256[] calldata recommendedAllocations,
        bytes calldata zkProof
    ) external {
        require(!fulfilled[_requestId], "Already fulfilled");
        fulfilled[_requestId] = true;

        // Reconstruct AllocationRecommendation array (use struct instead of raw tuple)
        I0GOracle.AllocationRecommendation[] memory allocations = new I0GOracle.AllocationRecommendation[](
            strategyIndices.length
        );
        for (uint256 i = 0; i < strategyIndices.length; i++) {
            allocations[i] = I0GOracle.AllocationRecommendation({
                strategyIndex: strategyIndices[i],
                recommendedAllocation: recommendedAllocations[i]
            });
        }

        // Forward to StrategyManager (encoded as the equivalent tuple ABI)
        (bool success, ) = address(msg.sender).call(
            abi.encodeWithSignature(
                "fulfillAIReallocation(uint256,(uint256,uint256)[],bytes)",
                _requestId,
                allocations,
                zkProof
            )
        );
        require(success, "Callback failed");
    }
}