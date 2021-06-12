// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PMToken is ERC20 {
    constructor(address initialAccount, uint256 initialBalance)
        ERC20("Pomodoro Mate Token", "PMT")
    {
        _mint(initialAccount, initialBalance);
    }
}
