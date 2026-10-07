// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {XaymacaToken} from "../src/XaymacaToken.sol";
import {XaymacaStaking} from "../src/XaymacaStaking.sol";

contract MockLpToken is ERC20 {
    constructor(address holder) ERC20("XAY LP", "XAY-LP") {
        _mint(holder, 1_000_000 ether);
    }
}

contract TestableXaymacaStaking is XaymacaStaking {
    uint256 private mockTime;

    constructor(
        IERC20 stakingToken_,
        IERC20 rewardToken_,
        address initialOwner
    ) XaymacaStaking(stakingToken_, rewardToken_, initialOwner) {
        mockTime = 1_000;
    }

    function setTime(uint256 timestamp) external {
        mockTime = timestamp;
    }

    function _clock() internal view override returns (uint256) {
        return mockTime;
    }
}

contract UnauthorizedScheduler {
    function schedule(
        XaymacaStaking staking,
        uint256 amount,
        uint256 duration
    ) external {
        staking.notifyRewardAmount(amount, duration);
    }
}

contract XaymacaStakingTest {
    uint256 private constant UNIT = 1 ether;
    uint256 private constant FLOOR = 30_000_000 * UNIT;

    function _token() private returns (XaymacaToken token) {
        token = new XaymacaToken(
            address(this),
            address(this),
            address(this),
            address(this),
            address(this),
            FLOOR
        );
    }

    function testDirectXayStakeCreditsActualReceivedAfterBurn() public {
        XaymacaToken token = _token();
        TestableXaymacaStaking staking = new TestableXaymacaStaking(
            IERC20(address(token)),
            IERC20(address(token)),
            address(this)
        );

        token.approve(address(staking), type(uint256).max);
        staking.stake(100 * UNIT);

        require(staking.balanceOf(address(this)) == 99 * UNIT, "stake should credit net XAY received");
        require(staking.totalStaked() == 99 * UNIT, "wrong total stake");
    }

    function testFundedRewardsAccrueAndCanBeClaimedAnytime() public {
        XaymacaToken token = _token();
        TestableXaymacaStaking staking = new TestableXaymacaStaking(
            IERC20(address(token)),
            IERC20(address(token)),
            address(this)
        );

        token.approve(address(staking), type(uint256).max);
        staking.stake(100 * UNIT);

        staking.notifyRewardAmount(1_000 * UNIT, 1_000);
        require(staking.rewardRate() == (990 * UNIT) / 1_000, "schedule must use actual funded amount");

        staking.setTime(1_500);
        require(staking.earned(address(this)) == 495 * UNIT, "wrong accrued reward");

        uint256 beforeClaim = token.balanceOf(address(this));
        staking.getReward();
        uint256 received = token.balanceOf(address(this)) - beforeClaim;

        require(received == (495 * UNIT * 99) / 100, "claim should reflect XAY transfer burn");
        require(staking.earned(address(this)) == 0, "claim should clear reward");
    }

    function testDirectXayRewardsCanCompoundWithoutExtraTransferBurn() public {
        XaymacaToken token = _token();
        TestableXaymacaStaking staking = new TestableXaymacaStaking(
            IERC20(address(token)),
            IERC20(address(token)),
            address(this)
        );

        token.approve(address(staking), type(uint256).max);
        staking.stake(100 * UNIT);
        staking.notifyRewardAmount(200 * UNIT, 200);

        staking.setTime(1_100);
        uint256 earnedBefore = staking.earned(address(this));
        uint256 stakeBefore = staking.balanceOf(address(this));

        staking.compoundReward();

        require(staking.balanceOf(address(this)) == stakeBefore + earnedBefore, "compound should add earned XAY");
        require(staking.earned(address(this)) == 0, "compound should clear reward");
    }

    function testWithdrawHasNoLockOrPenaltyInStakingContract() public {
        XaymacaToken token = _token();
        TestableXaymacaStaking staking = new TestableXaymacaStaking(
            IERC20(address(token)),
            IERC20(address(token)),
            address(this)
        );

        token.approve(address(staking), type(uint256).max);
        staking.stake(100 * UNIT);
        uint256 credited = staking.balanceOf(address(this));

        staking.withdraw(credited);

        require(staking.balanceOf(address(this)) == 0, "withdraw should clear stake");
        require(staking.totalStaked() == 0, "total stake should clear");
    }

    function testLpTokenStakingIsSupported() public {
        XaymacaToken rewards = _token();
        MockLpToken lp = new MockLpToken(address(this));
        TestableXaymacaStaking staking = new TestableXaymacaStaking(
            IERC20(address(lp)),
            IERC20(address(rewards)),
            address(this)
        );

        lp.approve(address(staking), type(uint256).max);
        staking.stake(500 * UNIT);

        require(staking.balanceOf(address(this)) == 500 * UNIT, "LP stake should not be taxed by staking logic");
    }

    function testOnlyOwnerCanScheduleRewards() public {
        XaymacaToken token = _token();
        TestableXaymacaStaking staking = new TestableXaymacaStaking(
            IERC20(address(token)),
            IERC20(address(token)),
            address(this)
        );
        UnauthorizedScheduler outsider = new UnauthorizedScheduler();

        bool reverted;
        try outsider.schedule(staking, UNIT, 100) {
            reverted = false;
        } catch {
            reverted = true;
        }

        require(reverted, "non-owner reward scheduling should revert");
    }

    function testPauseStopsNewStakesButNotWithdrawals() public {
        XaymacaToken token = _token();
        TestableXaymacaStaking staking = new TestableXaymacaStaking(
            IERC20(address(token)),
            IERC20(address(token)),
            address(this)
        );

        token.approve(address(staking), type(uint256).max);
        staking.stake(100 * UNIT);
        uint256 credited = staking.balanceOf(address(this));

        staking.pause();

        bool stakeReverted;
        try staking.stake(UNIT) {
            stakeReverted = false;
        } catch {
            stakeReverted = true;
        }
        require(stakeReverted, "paused staking should reject new stakes");

        staking.withdraw(credited);
        require(staking.balanceOf(address(this)) == 0, "withdraw must remain available while paused");
    }
}
