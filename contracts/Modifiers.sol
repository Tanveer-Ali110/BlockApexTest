// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Modifiers {
    address public owner;
    bool public isPause=false;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier isPaused() {
        require(!isPause, "Contract is in emergency stop");
        _;
    }
}
