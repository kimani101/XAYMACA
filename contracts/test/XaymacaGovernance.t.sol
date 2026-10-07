// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {XaymacaToken} from "../src/XaymacaToken.sol";
import {XaymacaGovernor} from "../src/XaymacaGovernor.sol";
import {XaymacaTimelock} from "../src/XaymacaTimelock.sol";

contract XaymacaGovernanceTest {
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

    function _governance()
        private
        returns (
            XaymacaToken token,
            XaymacaTimelock timelock,
            XaymacaGovernor governor
        )
    {
        token = _token();
        timelock = new XaymacaTimelock(address(this));
        governor = new XaymacaGovernor(token, timelock);
    }

    function testGovernorConfigurationMatchesFinalBlueprint() public {
        (, XaymacaTimelock timelock, XaymacaGovernor governor) =
            _governance();

        require(governor.votingDelay() == 7_200, "wrong voting delay");
        require(governor.votingPeriod() == 50_400, "wrong voting period");
        require(governor.proposalThreshold() == 0, "wrong threshold");
        require(governor.quorumNumerator() == 15, "wrong quorum");
        require(governor.maxVotePercent() == 2, "wrong vote cap");
        require(governor.timelock() == address(timelock), "wrong timelock");
        require(timelock.getMinDelay() == 3_600, "wrong timelock delay");
    }

    function testMaxVotePercentCannotBeChangedDirectly() public {
        (, , XaymacaGovernor governor) = _governance();

        bool reverted;
        try governor.setMaxVotePercent(3) {
            reverted = false;
        } catch {
            reverted = true;
        }

        require(reverted, "vote cap must be governance-only");
        require(governor.maxVotePercent() == 2, "vote cap changed");
    }

    function testTimelockTemporaryAdminCanWireRoles() public {
        XaymacaTimelock timelock = new XaymacaTimelock(address(this));

        require(
            timelock.hasRole(timelock.DEFAULT_ADMIN_ROLE(), address(this)),
            "temporary admin missing"
        );
        require(timelock.getMinDelay() == 3_600, "wrong delay");
    }
}
