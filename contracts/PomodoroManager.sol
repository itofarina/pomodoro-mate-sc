// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./PMToken.sol";

contract PomodoroManager {
    string public name = "Pomodoro Manager";
    PMToken public pmToken;
    uint256 public sessionLengthMinutes; // the length of a pomodoro session in minutes

    address[] internal _doers; // users who complete pomodoros
    mapping(address => uint256) public pomodorosCompleted; // number of completed pomodoros per user
    mapping(address => uint256[]) internal _pomodorosTimes; // timestamp of all the completed pomodoros by a user

    event Redeemed(address indexed doer, uint256 time);

    constructor(PMToken _pmToken, uint256 _sessionLengthMinutes) {
        pmToken = _pmToken;
        sessionLengthMinutes = _sessionLengthMinutes;
    }

    function redeemToken(address _doer) public canRedeemToken(_doer) {
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

    modifier canRedeemToken(address _doer) {
        uint256[] memory pomodorosTimesByDoer = _pomodorosTimes[_doer];
        // set to higher than minimum, if no entries yet, this will apply
        uint256 secsSinceLast = (sessionLengthMinutes + 1) * 60;

        if (pomodorosTimesByDoer.length > 0) {
            uint256 lastPomodoroTimeStamp = pomodorosTimesByDoer[
                pomodorosTimesByDoer.length - 1
            ];

            secsSinceLast = block.timestamp - lastPomodoroTimeStamp;
        }

        require(
            secsSinceLast * 60 > sessionLengthMinutes,
            "Pomodoro Manager: Tokens can only be redeemed when a session is completed"
        );
        _;
    }

    function pomodorosTimes(address _doer)
        public
        view
        returns (uint256[] memory)
    {
        return _pomodorosTimes[_doer];
    }
}
