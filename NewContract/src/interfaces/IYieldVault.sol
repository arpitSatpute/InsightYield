// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IYieldVault {
    function asset() external view returns (address);
    function previewWithdraw(uint256 assets) external view returns (uint256);
}