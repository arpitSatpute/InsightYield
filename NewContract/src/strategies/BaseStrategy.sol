// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IYieldVault} from "../interfaces/IYieldVault.sol";

abstract contract BaseStrategy is ERC20, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IYieldVault public immutable vault;
    IERC20 public immutable asset;
    address public immutable zeroGOracle;

    constructor(
        IERC20 _asset,
        address _oracle,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        asset = _asset;
        zeroGOracle = _oracle;
        vault = IYieldVault(msg.sender);
    }
    modifier onlyVault() {
        require(msg.sender == address(vault), "Not vault");
        _;
    }

    function deposit(uint256 assets, address receiver) external onlyVault nonReentrant returns (uint256) {
        asset.safeTransferFrom(msg.sender, address(this), assets);
        uint256 shares = _convertToShares(assets);
        _mint(receiver, shares);
        _generateYield();
        return shares;
    }

    // SKIP AI ON WITHDRAW — SAVE GAS
    function withdraw(uint256 assets, address receiver, address owner)
        external
        onlyVault
        nonReentrant
        returns (uint256)
    {
        require(assets <= maxWithdraw(owner), "Exceeds max");
        uint256 shares = _convertToShares(assets);
        _burn(owner, shares);
        asset.safeTransfer(receiver, assets);
        return shares;
    }

    function totalAssets() public view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function maxWithdraw(address) public view returns (uint256) {
        return totalAssets();
    }

    function _convertToShares(uint256 assets) internal view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? assets : (assets * supply) / totalAssets();
    }

    function _generateYield() internal virtual {
        // Override in child strategies
    }

    // No custom behavior needed for _mint/_burn — rely on ERC20 implementation.
}