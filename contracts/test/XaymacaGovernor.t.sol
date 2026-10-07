// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {XaymacaToken} from "../src/XaymacaToken.sol";
import {XaymacaGovernor} from "../src/XaymacaGovernor.sol";

contract XaymacaGovernorTest {
    uint256 private constant FLOOR = 30_000_000 ether;

    function _deploy()
        private
        returns (
            XaymacaToken token,
            TimelockController timelock,
            XaymacaGovernor governor
        )
    {
        token = new XaymacaToken(
            address(this),
            address(this),
            address(this),
            address(this),
            address(this),
            FLOOR
        );

        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](0);
        timelock = new TimelockController(
            2 days,
            proposers,
            executors,
            address(this)
        );

        governor = new XaymacaGovernor(
            token,
            timelock,
            7_200,
            50_400,
            1 ether,
            4
        );
    }

    function testGovernanceSettingsAreConstructorConfigured() public {
        (
            XaymacaToken token,
            TimelockController timelock,
            XaymacaGovernor governor
        ) = _deploy();

        require(
            keccak256(bytes(governor.name())) ==
                keccak256(bytes("Xaymaca Governor")),
            "wrong governor name"
        );
        require(governor.votingDelay() == 7_200, "wrong voting delay");
        require(governor.votingPeriod() == 50_400, "wrong voting period");
        require(governor.proposalThreshold() == 1 ether, "wrong threshold");
        require(governor.quorumNumerator() == 4, "wrong quorum");
        require(address(governor.token()) == address(token), "wrong token");
        require(governor.timelock() == address(timelock), "wrong timelock");
    }

    function testVotingSettingsCannotBeChangedDirectly() public {
        (,, XaymacaGovernor governor) = _deploy();

        bool reverted;
        try governor.setVotingDelay(1) {
            reverted = false;
        } catch {
            reverted = true;
        }

        require(reverted, "settings must require governance execution");
    }
}
