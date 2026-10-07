// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

/// @title XaymacaTimelock
/// @notice One-hour execution delay for XAYMACA governance.
/// @dev Deployment uses a temporary admin only long enough to wire the Governor roles,
///      then the deployment flow renounces that admin role.
contract XaymacaTimelock is TimelockController {
    uint256 public constant INITIAL_MIN_DELAY = 3_600;

    constructor(
        address initialAdmin
    )
        TimelockController(
            INITIAL_MIN_DELAY,
            new address[](0),
            new address[](0),
            initialAdmin
        )
    {}
}
