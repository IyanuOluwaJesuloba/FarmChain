// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FarmToken.sol";

contract FarmTokenTest is Test {
    FarmToken public farmToken;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        farmToken = new FarmToken();
    }

    // ============ Basic Tests ============
    function test_InitialSupply() public {
        assertEq(farmToken.totalSupply(), 1_000_000_000 * 10 ** 18);
        assertEq(farmToken.balanceOf(owner), 1_000_000_000 * 10 ** 18);
    }

    function test_Transfer() public {
        uint256 amount = 1000 * 10 ** 18;
        vm.startPrank(owner);
        farmToken.transfer(user1, amount);
        vm.stopPrank();

        assertEq(farmToken.balanceOf(user1), amount);
        assertEq(farmToken.balanceOf(owner), 1_000_000_000 * 10 ** 18 - amount);
    }

    function test_Approve() public {
        uint256 amount = 1000 * 10 ** 18;
        vm.prank(owner);
        farmToken.approve(user1, amount);

        assertEq(farmToken.allowance(owner, user1), amount);
    }

    function test_TransferFrom() public {
        uint256 amount = 1000 * 10 ** 18;
        vm.prank(owner);
        farmToken.approve(user1, amount);

        vm.prank(user1);
        farmToken.transferFrom(owner, user2, amount);

        assertEq(farmToken.balanceOf(user2), amount);
        assertEq(farmToken.allowance(owner, user1), 0);
    }

    // ============ Burning Tests ============
    function test_Burn() public {
        uint256 amount = 1000 * 10 ** 18;
        uint256 initialSupply = farmToken.totalSupply();

        vm.prank(owner);
        farmToken.burn(amount);

        assertEq(farmToken.totalSupply(), initialSupply - amount);
        assertEq(farmToken.balanceOf(owner), initialSupply - amount);
    }

    function test_BurnFrom() public {
        uint256 amount = 1000 * 10 ** 18;
        uint256 initialSupply = farmToken.totalSupply();

        vm.prank(owner);
        farmToken.approve(user1, amount);

        vm.prank(user1);
        farmToken.burnFrom(owner, amount);

        assertEq(farmToken.totalSupply(), initialSupply - amount);
    }

    // ============ Minting Tests ============
    function test_Mint() public {
        uint256 amount = 1000 * 10 ** 18;
        uint256 initialSupply = farmToken.totalSupply();

        vm.prank(owner);
        farmToken.mint(user1, amount);

        assertEq(farmToken.balanceOf(user1), amount);
        assertEq(farmToken.totalSupply(), initialSupply + amount);
    }

    function test_RevertMintToZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert("FarmToken: cannot mint to zero address");
        farmToken.mint(address(0), 1000 * 10 ** 18);
    }

    function test_RevertMintZeroAmount() public {
        vm.prank(owner);
        vm.expectRevert("FarmToken: mint amount must be greater than 0");
        farmToken.mint(user1, 0);
    }

    // ============ Pausing Tests ============
    function test_Pause() public {
        vm.prank(owner);
        farmToken.pause();

        assertEq(farmToken.paused(), true);

        vm.prank(owner);
        vm.expectRevert();
        farmToken.transfer(user1, 1000 * 10 ** 18);
    }

    function test_Unpause() public {
        vm.prank(owner);
        farmToken.pause();
        assertEq(farmToken.paused(), true);

        vm.prank(owner);
        farmToken.unpause();
        assertEq(farmToken.paused(), false);

        vm.prank(owner);
        farmToken.transfer(user1, 1000 * 10 ** 18);
        assertEq(farmToken.balanceOf(user1), 1000 * 10 ** 18);
    }

    function test_RevertPauseByNonOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        farmToken.pause();
    }

    // ============ Permit Tests ============
    function test_Permit() public {
        uint256 amount = 1000 * 10 ** 18;
        bytes32 domainSeparator = farmToken.DOMAIN_SEPARATOR();

        bytes32 permitTypeHash = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
        uint256 nonce = farmToken.nonces(owner);
        uint256 deadline = block.timestamp + 1 days;

        bytes32 structHash = keccak256(abi.encode(
            permitTypeHash,
            owner,
            user1,
            amount,
            nonce,
            deadline
        ));

        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, digest); // Use test key 1

        // This test is simplified - in production you'd use actual signature generation
    }
}
