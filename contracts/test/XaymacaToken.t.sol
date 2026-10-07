// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {XaymacaToken} from "../src/XaymacaToken.sol";

contract TokenActor {}

contract XaymacaTokenTest {
    uint256 private constant UNIT = 1 ether;
    uint256 private constant FLOOR = 30_000_000 * UNIT;

    function _deploySeparated()
        private
        returns (
            XaymacaToken token,
            TokenActor treasury,
            TokenActor staking,
            TokenActor ecosystem,
            TokenActor team
        )
    {
        treasury = new TokenActor();
        staking = new TokenActor();
        ecosystem = new TokenActor();
        team = new TokenActor();

        token = new XaymacaToken(
            address(this),
            address(treasury),
            address(staking),
            address(ecosystem),
            address(team),
            FLOOR
        );
    }

    function _deployAllHere() private returns (XaymacaToken token) {
        token = new XaymacaToken(
            address(this),
            address(this),
            address(this),
            address(this),
            address(this),
            FLOOR
        );
    }

    function testMetadataAndFixedSupply() public {
        (XaymacaToken token,,,,) = _deploySeparated();
        require(
            keccak256(bytes(token.name())) == keccak256(bytes("Xaymaca")),
            "wrong name"
        );
        require(
            keccak256(bytes(token.symbol())) == keccak256(bytes("XAY")),
            "wrong symbol"
        );
        require(token.decimals() == 18, "wrong decimals");
        require(token.MAX_SUPPLY() == 1_300_000_000 * UNIT, "wrong cap");
        require(token.totalSupply() == token.MAX_SUPPLY(), "wrong initial supply");
        require(token.minimumSupply() == FLOOR, "wrong floor");
    }

    function testInitialAllocation() public {
        (
            XaymacaToken token,
            TokenActor treasury,
            TokenActor staking,
            TokenActor ecosystem,
            TokenActor team
        ) = _deploySeparated();

        require(token.balanceOf(address(this)) == 400_000_000 * UNIT, "wrong public allocation");
        require(token.balanceOf(address(treasury)) == 250_000_000 * UNIT, "wrong treasury allocation");
        require(token.balanceOf(address(staking)) == 450_000_000 * UNIT, "wrong staking allocation");
        require(token.balanceOf(address(ecosystem)) == 100_000_000 * UNIT, "wrong ecosystem allocation");
        require(token.balanceOf(address(team)) == 100_000_000 * UNIT, "wrong team allocation");
    }

    function testOrdinaryTransferBurnsOnePercent() public {
        (XaymacaToken token,,,,) = _deploySeparated();
        TokenActor recipient = new TokenActor();
        uint256 supplyBefore = token.totalSupply();

        token.transfer(address(recipient), 100 * UNIT);

        require(token.balanceOf(address(recipient)) == 99 * UNIT, "recipient should receive net amount");
        require(token.totalSupply() == supplyBefore - UNIT, "one percent should burn");
    }

    function testAutomaticBurnStopsAtFloor() public {
        XaymacaToken token = _deployAllHere();
        token.burn(token.MAX_SUPPLY() - FLOOR);
        require(token.totalSupply() == FLOOR, "floor setup failed");

        TokenActor recipient = new TokenActor();
        token.transfer(address(recipient), 100 * UNIT);

        require(token.totalSupply() == FLOOR, "automatic burn crossed floor");
        require(token.balanceOf(address(recipient)) == 100 * UNIT, "full transfer expected at floor");
    }


    function testAutomaticBurnAdjustsAtFloor() public {
        XaymacaToken token = _deployAllHere();
        token.burn(token.MAX_SUPPLY() - FLOOR - (UNIT / 2));

        TokenActor recipient = new TokenActor();
        token.transfer(address(recipient), 100 * UNIT);

        require(token.totalSupply() == FLOOR, "burn should stop exactly at floor");
        require(
            token.balanceOf(address(recipient)) == (100 * UNIT) - (UNIT / 2),
            "recipient should receive amount minus remaining burn"
        );
    }

    function testManualBurnCannotCrossFloor() public {
        XaymacaToken token = _deployAllHere();
        token.burn(token.MAX_SUPPLY() - FLOOR);

        bool reverted;
        try token.burn(UNIT) {
            reverted = false;
        } catch {
            reverted = true;
        }

        require(reverted, "burn below floor should revert");
    }

    function testDelegationActivatesVotingPower() public {
        (XaymacaToken token,,,,) = _deploySeparated();
        uint256 holderBalance = token.balanceOf(address(this));

        token.delegate(address(this));

        require(token.getVotes(address(this)) == holderBalance, "delegated votes should equal balance");
    }

    function testInvalidFloorReverts() public {
        bool reverted;
        try new XaymacaToken(
            address(this),
            address(this),
            address(this),
            address(this),
            address(this),
            1_300_000_001 * UNIT
        ) {
            reverted = false;
        } catch {
            reverted = true;
        }

        require(reverted, "floor above supply should revert");
    }
}
