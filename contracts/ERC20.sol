// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract MARI is ERC20 {
    constructor() public ERC20("Marie Coin", "MARI") {
        console.log("Token Contract constructed");
        _mint(msg.sender, 100 ether);
    }
}
