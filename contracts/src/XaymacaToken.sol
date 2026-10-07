// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

/// @title XaymacaToken
/// @notice Fixed-supply XAY token with a 1% transfer burn, burn floor, and vote delegation.
/// @dev There is intentionally no post-deployment mint function.
contract XaymacaToken is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    uint256 public constant PUBLIC_SALE_ALLOCATION = 400_000_000 ether;
    uint256 public constant DAO_TREASURY_ALLOCATION = 250_000_000 ether;
    uint256 public constant STAKING_REWARDS_ALLOCATION = 150_000_000 ether;
    uint256 public constant ECOSYSTEM_GROWTH_ALLOCATION = 100_000_000 ether;
    uint256 public constant TEAM_ADVISORS_ALLOCATION = 100_000_000 ether;

    uint256 public constant BURN_BPS = 100;
    uint256 public constant BPS_DENOMINATOR = 10_000;

    uint256 public immutable minimumSupply;

    error InvalidMinimumSupply(uint256 requested, uint256 maximum);
    error MinimumSupplyViolation(uint256 requestedBurn, uint256 availableToBurn);

    event TransferBurn(
        address indexed from,
        address indexed to,
        uint256 grossAmount,
        uint256 burnedAmount,
        uint256 netAmount
    );

    constructor(
        address publicSaleWallet,
        address daoTreasuryWallet,
        address stakingRewardsWallet,
        address ecosystemGrowthWallet,
        address teamAdvisorsWallet,
        uint256 minimumSupply_
    ) ERC20("Xaymaca", "XAY") ERC20Permit("Xaymaca") {
        if (minimumSupply_ > MAX_SUPPLY) {
            revert InvalidMinimumSupply(minimumSupply_, MAX_SUPPLY);
        }

        minimumSupply = minimumSupply_;

        _mint(publicSaleWallet, PUBLIC_SALE_ALLOCATION);
        _mint(daoTreasuryWallet, DAO_TREASURY_ALLOCATION);
        _mint(stakingRewardsWallet, STAKING_REWARDS_ALLOCATION);
        _mint(ecosystemGrowthWallet, ECOSYSTEM_GROWTH_ALLOCATION);
        _mint(teamAdvisorsWallet, TEAM_ADVISORS_ALLOCATION);
    }

    /// @dev Applies the historical 1% XAY burn to ordinary transfers.
    /// Minting is untaxed. Direct/manual burns are allowed only down to the floor.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Votes) {
        if (from == address(0)) {
            super._update(from, to, value);
            return;
        }

        if (to == address(0)) {
            uint256 supply = totalSupply();
            uint256 availableToBurn = supply > minimumSupply
                ? supply - minimumSupply
                : 0;

            if (value > availableToBurn) {
                revert MinimumSupplyViolation(value, availableToBurn);
            }

            super._update(from, to, value);
            return;
        }

        uint256 burnAmount = (value * BURN_BPS) / BPS_DENOMINATOR;
        uint256 currentSupply = totalSupply();

        if (burnAmount > 0 && currentSupply > minimumSupply) {
            uint256 availableToBurn = currentSupply - minimumSupply;
            if (burnAmount > availableToBurn) {
                burnAmount = availableToBurn;
            }
        } else {
            burnAmount = 0;
        }

        uint256 netAmount = value - burnAmount;

        if (burnAmount > 0) {
            super._update(from, address(0), burnAmount);
        }

        super._update(from, to, netAmount);
        emit TransferBurn(from, to, value, burnAmount, netAmount);
    }

    function nonces(
        address owner
    ) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
