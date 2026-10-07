// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {GovernorTimelockControl} from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

/// @title XaymacaGovernor
/// @notice XAYMACA DAO governor using XAY voting power and a TimelockController.
/// @dev Historical final parameters: 7,200-block delay, 50,400-block voting
///      period, 15% quorum, zero proposal threshold, and 2% max counted voting
///      weight per address.
contract XaymacaGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    uint256 public maxVotePercent = 2;

    error InvalidMaxVotePercent(uint256 requested);

    event MaxVotePercentUpdated(uint256 oldPercent, uint256 newPercent);

    constructor(
        IVotes token_,
        TimelockController timelock_
    )
        Governor("Xaymaca Governor")
        GovernorSettings(7_200, 50_400, 0)
        GovernorVotes(token_)
        GovernorVotesQuorumFraction(15)
        GovernorTimelockControl(timelock_)
    {}

    /// @notice Governance may adjust the per-address counted vote cap.
    function setMaxVotePercent(uint256 newPercent) external onlyGovernance {
        if (newPercent == 0 || newPercent > 100) {
            revert InvalidMaxVotePercent(newPercent);
        }

        uint256 oldPercent = maxVotePercent;
        maxVotePercent = newPercent;
        emit MaxVotePercentUpdated(oldPercent, newPercent);
    }

    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    /// @dev Caps the voting weight counted from any one address at the configured
    /// percentage of the proposal-snapshot total supply.
    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 totalWeight,
        bytes memory params
    )
        internal
        override(Governor, GovernorCountingSimple)
        returns (uint256)
    {
        uint256 snapshotSupply = token().getPastTotalSupply(
            proposalSnapshot(proposalId)
        );
        uint256 cap = (snapshotSupply * maxVotePercent) / 100;
        uint256 countedWeight = totalWeight > cap ? cap : totalWeight;

        return
            super._countVote(
                proposalId,
                account,
                support,
                countedWeight,
                params
            );
    }

    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint48)
    {
        return
            super._queueOperations(
                proposalId,
                targets,
                values,
                calldatas,
                descriptionHash
            );
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(
            proposalId,
            targets,
            values,
            calldatas,
            descriptionHash
        );
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
}
