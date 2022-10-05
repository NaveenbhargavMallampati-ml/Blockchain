
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
contract Box is Ownable{

    uint256 private value;

    event  ValueChanged(uint256 newValue);

    function Store( uint256 newValue)  public onlyOwnable {
        value = newValue;
        emit ValueChanged(newValue);
    }

    function retrieve() public view return(uint256 ) {
        return value;
    }
    constructor() {
    }
}