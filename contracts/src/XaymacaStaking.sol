// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title XaymacaStaking
/// @notice Funded, fixed-rate staking for either XAY itself or a DEX LP token.
/// @dev Rewards are transferred into this contract up front. No token minting occurs here.
contract XaymacaStaking is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 private constant PRECISION = 1e18;

    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    uint256 public totalStaked;
    uint256 public rewardRate;
    uint256 public periodFinish;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address account => uint256 amount) public balanceOf;
    mapping(address account => uint256 paid) public userRewardPerTokenPaid;
    mapping(address account => uint256 reward) public rewards;

    error ZeroAmount();
    error ZeroDuration();
    error InsufficientStake(uint256 requested, uint256 available);
    error NoTokensReceived();
    error CompoundRequiresSameToken();
    error RewardScheduleTooLarge(uint256 required, uint256 available);

    event Staked(address indexed account, uint256 requested, uint256 credited);
    event Withdrawn(address indexed account, uint256 amount);
    event RewardPaid(address indexed account, uint256 amount);
    event RewardCompounded(address indexed account, uint256 amount);
    event RewardAdded(
        uint256 requested,
        uint256 received,
        uint256 duration,
        uint256 rewardRate,
        uint256 periodFinish
    );

    constructor(
        IERC20 stakingToken_,
        IERC20 rewardToken_,
        address initialOwner
    ) Ownable(initialOwner) {
        stakingToken = stakingToken_;
        rewardToken = rewardToken_;
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();

        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        uint256 now_ = _clock();
        return now_ < periodFinish ? now_ : periodFinish;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }

        uint256 elapsed = lastTimeRewardApplicable() - lastUpdateTime;
        return
            rewardPerTokenStored +
            ((elapsed * rewardRate * PRECISION) / totalStaked);
    }

    function earned(address account) public view returns (uint256) {
        return
            ((balanceOf[account] *
                (rewardPerToken() - userRewardPerTokenPaid[account])) /
                PRECISION) +
            rewards[account];
    }

    /// @notice Stake XAY or LP tokens. Fee-on-transfer tokens are credited by actual receipt.
    function stake(
        uint256 amount
    ) external nonReentrant whenNotPaused updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();

        uint256 beforeBalance = stakingToken.balanceOf(address(this));
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = stakingToken.balanceOf(address(this)) - beforeBalance;

        if (received == 0) revert NoTokensReceived();

        balanceOf[msg.sender] += received;
        totalStaked += received;

        emit Staked(msg.sender, amount, received);
    }

    /// @notice Withdraw principal at any time. Pausing never traps user principal.
    function withdraw(
        uint256 amount
    ) public nonReentrant updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();

        uint256 staked = balanceOf[msg.sender];
        if (amount > staked) revert InsufficientStake(amount, staked);

        balanceOf[msg.sender] = staked - amount;
        totalStaked -= amount;

        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward == 0) return;

        rewards[msg.sender] = 0;
        rewardToken.safeTransfer(msg.sender, reward);

        emit RewardPaid(msg.sender, reward);
    }

    /// @notice Convert earned rewards directly into principal when XAY is both stake and reward token.
    /// @dev No token transfer occurs, so compounding does not incur XAY's transfer burn.
    function compoundReward()
        external
        nonReentrant
        updateReward(msg.sender)
    {
        if (address(stakingToken) != address(rewardToken)) {
            revert CompoundRequiresSameToken();
        }

        uint256 reward = rewards[msg.sender];
        if (reward == 0) return;

        rewards[msg.sender] = 0;
        balanceOf[msg.sender] += reward;
        totalStaked += reward;

        emit RewardCompounded(msg.sender, reward);
    }

    /// @notice Fund and start a fixed-rate reward schedule.
    /// @dev The schedule uses the amount actually received, supporting XAY's transfer burn.
    function notifyRewardAmount(
        uint256 amount,
        uint256 duration
    ) external onlyOwner nonReentrant updateReward(address(0)) {
        if (amount == 0) revert ZeroAmount();
        if (duration == 0) revert ZeroDuration();

        uint256 beforeBalance = rewardToken.balanceOf(address(this));
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = rewardToken.balanceOf(address(this)) - beforeBalance;

        if (received == 0) revert NoTokensReceived();

        uint256 now_ = _clock();
        uint256 totalReward;

        if (now_ >= periodFinish) {
            totalReward = received;
        } else {
            uint256 remaining = periodFinish - now_;
            uint256 leftover = remaining * rewardRate;
            totalReward = received + leftover;
        }

        rewardRate = totalReward / duration;
        periodFinish = now_ + duration;
        lastUpdateTime = now_;

        uint256 available = rewardToken.balanceOf(address(this));
        if (address(rewardToken) == address(stakingToken)) {
            available -= totalStaked;
        }

        uint256 required = rewardRate * duration;
        if (required > available) {
            revert RewardScheduleTooLarge(required, available);
        }

        emit RewardAdded(amount, received, duration, rewardRate, periodFinish);
    }

    function exit() external {
        uint256 staked = balanceOf[msg.sender];
        if (staked > 0) {
            withdraw(staked);
        }
        getReward();
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /// @dev Overridable clock makes reward accounting deterministic in tests.
    function _clock() internal view virtual returns (uint256) {
        return block.timestamp;
    }
}
