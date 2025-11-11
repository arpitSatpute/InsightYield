// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {StrategyManager} from "./StrategyManager.sol";
import {IStrategy} from "../interfaces/IStrategy.sol";

contract YieldVault is ERC4626, ReentrancyGuard {
    using SafeERC20 for IERC20;

    StrategyManager public immutable strategyManager;
    uint256 public constant REBALANCE_INTERVAL = 5 minutes;
    uint256 public lastRebalance;
    uint256 public constant WITHDRAWAL_FEE_BPS = 50; // 0.5%
    uint256 public constant BASIS_POINTS = 10000;
    address public feeRecipient;

    // ERC4626 already defines Deposit and Withdraw events; do not redeclare to avoid conflicts.
    event AIRebalanceTriggered(uint256 timestamp);

    constructor(
        IERC20 _asset,
        StrategyManager _strategyManager
    ) ERC4626(_asset) ERC20("AI Yield Vault", "AIYV") {
        strategyManager = _strategyManager;
        feeRecipient = msg.sender;
        lastRebalance = block.timestamp;
    }

    // DEPOSIT: AI REBALANCE ON EVERY DEPOSIT
    function deposit(uint256 assets, address receiver) public override nonReentrant returns (uint256) {
        require(assets > 0, "Zero assets");
        uint256 shares = previewDeposit(assets);
        require(shares > 0, "Zero shares");

    IERC20(asset()).safeTransferFrom(msg.sender, address(this), assets);
        _mint(receiver, shares);

        emit Deposit(msg.sender, receiver, assets, shares);

        _safeRebalance(); // AI TRIGGERS

        return shares;
    }

    function mint(uint256 shares, address receiver) public override nonReentrant returns (uint256) {
        uint256 assets = previewMint(shares);
    IERC20(asset()).safeTransferFrom(msg.sender, address(this), assets);
        _mint(receiver, shares);
        emit Deposit(msg.sender, receiver, assets, shares);
        _safeRebalance();
        return assets;
    }

    // WITHDRAW: SKIP AI → SAVE GAS
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public override nonReentrant returns (uint256) {
        require(assets <= maxWithdraw(owner), "Exceeds max");

        uint256 fee = (assets * WITHDRAWAL_FEE_BPS) / BASIS_POINTS;
        uint256 assetsAfterFee = assets - fee;

        uint256 shares = previewWithdraw(assets);
        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        _burn(owner, shares);
        _proportionalWithdrawFromStrategies(assetsAfterFee);

        IERC20(asset()).safeTransfer(receiver, assetsAfterFee);
        if (fee > 0) {
            IERC20(asset()).safeTransfer(feeRecipient, fee);
        }

        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        return shares;
    }

    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public override nonReentrant returns (uint256) {
        require(shares <= maxRedeem(owner), "Exceeds max");
        uint256 assets = previewRedeem(shares);

        uint256 fee = (assets * WITHDRAWAL_FEE_BPS) / BASIS_POINTS;
        uint256 assetsAfterFee = assets - fee;

        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        _burn(owner, shares);
        _proportionalWithdrawFromStrategies(assetsAfterFee);

        IERC20(asset()).safeTransfer(receiver, assetsAfterFee);
        if (fee > 0) {
            IERC20(asset()).safeTransfer(feeRecipient, fee);
        }

        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        return assets;
    }

    // AUTO-REBALANCE EVERY 5 MINUTES
    function rebalance() external {
        require(block.timestamp >= lastRebalance + REBALANCE_INTERVAL, "Too soon");
        _aiRebalance();
        lastRebalance = block.timestamp;
        emit AIRebalanceTriggered(block.timestamp);
    }

    function _aiRebalance() internal {
        (uint256[] memory apys, uint256[] memory risks, uint256[] memory tvls) = strategyManager.getPoolData();
        bytes memory metrics = abi.encode(apys, risks, tvls);
        string memory prompt = "Optimize DeFi yield allocations to maximize return and minimize risk. Input: APYs (bps), risks (1-100), TVLs (USD). Output JSON: [{strategyIndex:0, allocation:4000}, ...] total 10000 bps.";
        strategyManager.aiRebalanceStrategies(prompt, metrics);
    }

    function _safeRebalance() internal {
        if (block.timestamp >= lastRebalance + REBALANCE_INTERVAL) {
            _aiRebalance();
            lastRebalance = block.timestamp;
        }
    }

    // WITHDRAW FROM STRATEGIES — NO AI CALL
    function _proportionalWithdrawFromStrategies(uint256 totalAmount) internal {
        uint256 count = strategyManager.getStrategyCount();
        uint256 totalAllocated = strategyManager.getTotalAllocation();
        uint256 withdrawn = 0;

        for (uint256 i = 0; i < count; i++) {
            (address strategy, uint256 allocation, bool active) = strategyManager.getStrategy(i);
            if (!active || allocation == 0) continue;

            uint256 portion = (totalAmount * allocation) / totalAllocated;
            if (portion == 0) continue;

            uint256 before = IERC20(asset()).balanceOf(address(this));
            try IStrategy(strategy).withdraw(portion, address(this), address(this)) {
                withdrawn += IERC20(asset()).balanceOf(address(this)) - before;
            } catch {}
        }

        require(withdrawn >= totalAmount * 90 / 100, "Insufficient liquidity");
    }

    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this)) + strategyManager.getTotalTVL();
    }

    function setFeeRecipient(address _feeRecipient) external {
        require(msg.sender == feeRecipient, "Unauthorized");
        feeRecipient = _feeRecipient;
    }
}