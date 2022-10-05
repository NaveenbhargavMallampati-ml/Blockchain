// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract GovernanceTimeLock is TimeLockController {
        constructor(
                uint256 minDelay,
            address[] memory proposers,
            address[] memory executors
        ) 
          TimeLockController(minDelay,proposers,executors) {}
        
}