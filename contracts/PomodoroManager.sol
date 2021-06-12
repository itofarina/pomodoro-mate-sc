// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./PMToken.sol";

contract PomodoroManager {
    string public name = "Pomodoro Manager";
    address public owner;
    PMToken public pmToken;

    address[] public doers; // people who completes pomodoros
    mapping(address => uint256) public pomodorosCompleted;

    constructor(PMToken _pmToken) {
        pmToken = _pmToken;
        owner = msg.sender;
    }

    function redeemToken(address _doer) public {
        // TODO: should require to not be called by the same doer in less than 30 minutes
        pmToken.transferFrom(owner, _doer, 1 * 10**18);
        doers.push(_doer);
        pomodorosCompleted[_doer] = pomodorosCompleted[_doer] + 1;
    }
}
