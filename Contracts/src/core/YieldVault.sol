// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
  YieldVault.sol (Auto-Rebalancing Version)
  - Automatically rebalances after deposit, mint, withdraw, or redeem
  - Proportional rebalance across all strategies
  - Proportional withdraw/redeem logic
  - Harvest and performance fee logic included
*/

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../interfaces/IStrategy.sol";
import "./StrategyManager.sol";

contract YieldVault is ERC4626, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    StrategyManager public immutable strategyManager;

    uint256 public totalDeposited;
    uint256 public totalWithdrawn;
    uint256 public lastRebalance;

    uint256 public rebalanceInterval = 1 days;
    uint256 public performanceFee = 1000; // 10%
    uint256 public withdrawalFee = 50; // 0.5%
    uint256 public liquidityBufferBps = 500; // 5%

    uint256 private constant BASIS_POINTS = 10000;
    uint256 private constant MAX_PERFORMANCE_FEE = 2000;
    uint256 private constant MAX_WITHDRAWAL_FEE = 500;
    uint256 private constant MAX_BUFFER_BPS = 2000;

    address public feeRecipient;

    // ---------------- Events ----------------
    event Deposited(address indexed user, uint256 assets, uint256 shares);
    event Withdrawn(address indexed user, uint256 assets, uint256 shares);
    event Rebalanced(uint256 timestamp, uint256 totalAssets);
    event Harvested(uint256 totalYield);
    event FeesCollected(uint256 amount, string feeType);
    event StrategyWithdrawError(address indexed strategy, string reason);
    event StrategyWithdrawn(address indexed strategy, uint256 amount);
    event LiquidityBufferUpdated(uint256 newBps);

    constructor(IERC20 _asset, address _strategyManager)
        ERC4626(_asset)
        ERC20("Insight", "INSIGHT")
        Ownable(msg.sender)
    {
        require(_strategyManager != address(0), "Invalid strategy manager");
        strategyManager = StrategyManager(_strategyManager);
        feeRecipient = msg.sender;
        lastRebalance = block.timestamp;
    }

    // ---------------- Deposit / Mint ----------------
    function deposit(uint256 assets, address receiver)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256)
    {
        require(assets > 0, "Cannot deposit 0");
        uint256 shares = super.deposit(assets, receiver);
        totalDeposited += assets;
        emit Deposited(receiver, assets, shares);

        _safeRebalance();
        return shares;
    }

    function mint(uint256 shares, address receiver)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256)
    {
        require(shares > 0, "Cannot mint 0");
        uint256 assets = super.mint(shares, receiver);
        totalDeposited += assets;
        emit Deposited(receiver, assets, shares);

        _safeRebalance();
        return assets;
    }

    // ---------------- Withdraw / Redeem ----------------
    function withdraw(uint256 assets, address receiver, address owner)
        public
        override
        nonReentrant
        returns (uint256)
    {
        require(assets > 0, "Cannot withdraw 0");

        uint256 shares = convertToShares(assets);
        require(balanceOf(owner) >= shares, "Insufficient shares");

        uint256 fee = (assets * withdrawalFee) / BASIS_POINTS;
        uint256 assetsAfterFee = assets - fee;

        _proportionalWithdrawFromStrategies(assets);
        _burn(owner, shares);

        IERC20(asset()).safeTransfer(receiver, assetsAfterFee);

        if (fee > 0 && feeRecipient != address(0)) {
            IERC20(asset()).safeTransfer(feeRecipient, fee);
            emit FeesCollected(fee, "withdrawal");
        }

        totalWithdrawn += assets;
        emit Withdrawn(receiver, assetsAfterFee, shares);

        _safeRebalance();
        return shares;
    }

    function redeem(uint256 shares, address receiver, address owner)
        public
        override
        nonReentrant
        returns (uint256)
    {
        require(shares > 0, "Cannot redeem 0");
        require(balanceOf(owner) >= shares, "Insufficient shares");

        uint256 assets = convertToAssets(shares);
        uint256 fee = (assets * withdrawalFee) / BASIS_POINTS;
        uint256 assetsAfterFee = assets - fee;

        _proportionalWithdrawFromStrategies(assets);
        _burn(owner, shares);

        IERC20(asset()).safeTransfer(receiver, assetsAfterFee);

        if (fee > 0 && feeRecipient != address(0)) {
            IERC20(asset()).safeTransfer(feeRecipient, fee);
            emit FeesCollected(fee, "withdrawal");
        }

        totalWithdrawn += assets;
        emit Withdrawn(receiver, assetsAfterFee, shares);

        _safeRebalance();
        return assetsAfterFee;
    }

    // ---------------- Proportional Withdraw Logic ----------------
    function _proportionalWithdrawFromStrategies(uint256 totalAmount) internal {
        uint256 count = strategyManager.getStrategyCount();
        uint256 totalAllocated = 0;

        for (uint256 i = 0; i < count; i++) {
            (, uint256 allocation, bool active) = strategyManager.getStrategy(i);
            if (active && allocation > 0) totalAllocated += allocation;
        }

        for (uint256 i = 0; i < count; i++) {
            (address strategy, uint256 allocation, bool active) = strategyManager.getStrategy(i);
            if (!active || allocation == 0) continue;

            uint256 portion = (totalAmount * allocation) / totalAllocated;
            if (portion == 0) continue;

            uint256 beforeBal = IERC20(asset()).balanceOf(address(this));
            try IStrategy(strategy).withdraw(portion, address(this), address(this)) returns (uint256 withdrawn) {
                uint256 afterBal = IERC20(asset()).balanceOf(address(this));
                uint256 received = afterBal > beforeBal ? afterBal - beforeBal : withdrawn;
                emit StrategyWithdrawn(strategy, received);
            } catch Error(string memory reason) {
                emit StrategyWithdrawError(strategy, reason);
                continue;
            } catch {
                emit StrategyWithdrawError(strategy, "withdraw reverted");
                continue;
            }
        }

        require(
            IERC20(asset()).balanceOf(address(this)) >= totalAmount,
            "YieldVault: insufficient liquidity after proportional withdrawals"
        );
    }

    // ---------------- Rebalance Logic ----------------
    function _safeRebalance() internal {
        try this.rebalance() {
            // ignore success output
        } catch {
            // do nothing if rebalance fails
        }
    }

    function rebalance() public onlyOwner nonReentrant {
        uint256 count = strategyManager.getStrategyCount();
        if (count == 0) return;

        _harvestAll();

        uint256 vaultBalance = IERC20(asset()).balanceOf(address(this));
        if (vaultBalance == 0) return;

        uint256 buffer = (vaultBalance * liquidityBufferBps) / BASIS_POINTS;
        uint256 investable = vaultBalance > buffer ? vaultBalance - buffer : 0;
        if (investable == 0) return;

        uint256 totalAlloc = 0;
        for (uint256 i = 0; i < count; i++) {
            (, uint256 allocation, bool active) = strategyManager.getStrategy(i);
            if (active && allocation > 0) totalAlloc += allocation;
        }

        for (uint256 i = 0; i < count; i++) {
            (address strategy, uint256 allocation, bool active) = strategyManager.getStrategy(i);
            if (!active || allocation == 0) continue;

            uint256 toDeposit = (investable * allocation) / totalAlloc;
            if (toDeposit == 0) continue;

            IERC20(asset()).approve(strategy, toDeposit);
            try IStrategy(strategy).deposit(toDeposit, address(this)) {
                // success
            } catch {
                emit StrategyWithdrawError(strategy, "deposit reverted");
                continue;
            }
        }

        lastRebalance = block.timestamp;
        emit Rebalanced(block.timestamp, totalAssets());
    }

    // ---------------- Harvest Logic ----------------
    function _harvestAll() internal returns (uint256 totalYield) {
        uint256 count = strategyManager.getStrategyCount();
        for (uint256 i = 0; i < count; i++) {
            (address strategy, , bool active) = strategyManager.getStrategy(i);
            if (!active) continue;
            try IStrategy(strategy).harvest() returns (uint256 yieldAmount) {
                totalYield += yieldAmount;
            } catch {
                continue;
            }
        }

        if (totalYield > 0) {
            uint256 fee = (totalYield * performanceFee) / BASIS_POINTS;
            if (fee > 0 && feeRecipient != address(0)) {
                IERC20(asset()).safeTransfer(feeRecipient, fee);
                emit FeesCollected(fee, "performance");
            }
            emit Harvested(totalYield);
        }
        return totalYield;
    }

    // ---------------- Emergency ----------------
    function emergencyWithdrawAll() external onlyOwner {
        uint256 count = strategyManager.getStrategyCount();
        for (uint256 i = 0; i < count; i++) {
            (address strategy, , bool active) = strategyManager.getStrategy(i);
            if (!active) continue;
            try IStrategy(strategy).withdrawAll() {} catch {}
        }
    }

    // ---------------- View Functions ----------------
    function totalAssets() public view override returns (uint256) {
        uint256 total = IERC20(asset()).balanceOf(address(this));
        uint256 count = strategyManager.getStrategyCount();
        for (uint256 i = 0; i < count; i++) {
            (address strategy, , bool active) = strategyManager.getStrategy(i);
            if (!active) continue;
            try IStrategy(strategy).balanceOf() returns (uint256 stratBal) {
                total += stratBal;
            } catch {}
        }
        return total;
    }

    // ---------------- Admin ----------------
    function setLiquidityBufferBps(uint256 bps) external onlyOwner {
        require(bps <= MAX_BUFFER_BPS, "Too high");
        liquidityBufferBps = bps;
        emit LiquidityBufferUpdated(bps);
    }

    function setPerformanceFee(uint256 fee) external onlyOwner {
        require(fee <= MAX_PERFORMANCE_FEE, "Too high");
        performanceFee = fee;
    }

    function setWithdrawalFee(uint256 fee) external onlyOwner {
        require(fee <= MAX_WITHDRAWAL_FEE, "Too high");
        withdrawalFee = fee;
    }

    function setFeeRecipient(address recipient) external onlyOwner {
        require(recipient != address(0), "Invalid");
        feeRecipient = recipient;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
