// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./PMToken.sol";

contract PomodoroManager {
    string public name = "Pomodoro Manager";
    PMToken public pmToken;

    address[] internal _doers; // users who complete pomodoros
    mapping(address => uint256) public pomodorosCompleted; // number of completed pomodoros per user
    mapping(address => uint256[]) internal _pomodorosTimes; // timestamp of all the completed pomodoros by a user

    event Redeemed(address indexed doer, uint256 time);

    constructor(PMToken _pmToken) {
        pmToken = _pmToken;
    }

    function redeemToken(address _doer) public {
        // TODO: should require to not be called by the same doer in less than 30 minutes
        pmToken.transfer(_doer, 1);
        _doers.push(_doer);
        uint256 time = block.timestamp;
        _pomodorosTimes[_doer].push(time);
        pomodorosCompleted[_doer] = pomodorosCompleted[_doer] + 1;
        emit Redeemed(_doer, time);
    }

    function getAllDoers() public view returns (address[] memory) {
        return _doers;
    }

    function getPomodorosTimestamp(address _doer)
        public
        view
        returns (uint256[] memory)
    {
        return _pomodorosTimes[_doer];
    }
}
