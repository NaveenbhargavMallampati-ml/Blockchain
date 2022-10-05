// staking the tokens means to deposit the tokens to the contract
// withdraw the tokens that are staked
// claim the reward if any applicable
// SPDX-License-Identifier:MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error Staking_Transferfailed();
error staking_MoreThanzeroFailed();
contract Staking {

    IERC20 public s_staking_token;
    IERC20 public s_reward_token;
    // map someones address to amount of tokens they have
    mapping ( address => uint) public s_balances;
    mapping ( address => uint) public  s_rewards;
    mapping ( address => uint) public s_userTokensPaid;
    uint256 public s_tokenRewardRate ;
    uint256 public s_totalsupplies;
    uint256 public s_lastTimeStamp;
    uint256 public constant RewardRate = 100;
    constructor(address stakingtoken , address rewardtoken) {
        s_staking_token = IERC20(stakingtoken);
        s_reward_token = IERC20(rewardtoken);
    }

    function rewardToken() public view returns(uint256) {

        if(s_totalsupplies == 0){
            return s_tokenRewardRate;
        }
        return s_tokenRewardRate + (((block.timestamp - s_lastTimeStamp) * RewardRate * 1e18)/s_totalsupplies );

    }
    modifier  UpdateReward(address account) {
        s_tokenRewardRate = rewardToken();
        s_lastTimeStamp = block.timestamp;
        s_rewards[account] = earned(account);
        s_userTokensPaid[account] = s_tokenRewardRate;
        _;
        
    }

    modifier MoreThanZero(uint amount) {
        if(amount == 0){
            revert staking_MoreThanzeroFailed();
        }
        _;
    }

    function earned(address account) public view returns(uint256)
    {

        uint256 currentBalance = s_balances[account];
        uint256 amontpaid = s_userTokensPaid[account];
        uint256 currentReward = rewardToken();
        uint256 pastrewards = s_rewards[account];

        uint256 earned1 = ((currentBalance * (currentReward - amontpaid))/1e18) + pastrewards ;
        return earned1;

    }
    // only allow specific token 
    // if mulitiple then need to convert prices and do some chainlink stuff
    function stake(uint256 amount ) external UpdateReward(msg.sender) MoreThanZero(amount) {
       // amount they have staked, total tokens they already got , transfer the tokens to the contract
       s_balances[msg.sender] = s_balances[msg.sender] + amount; 
       s_totalsupplies = s_totalsupplies+amount;

       bool success = s_staking_token.transferFrom(msg.sender,address(this),amount);
      // require(success,"failed")
        if(!success){
            //gas effectient way than require
            revert Staking_Transferfailed();
        }
    }

    function withdraw(uint256 amount) external UpdateReward(msg.sender) MoreThanZero(amount){
          // amount they have staked, total tokens they already got , transfer the tokens to the contract
       s_balances[msg.sender] = s_balances[msg.sender] -  amount; 
       s_totalsupplies = s_totalsupplies-amount;

       bool success = s_staking_token.transfer(msg.sender,amount);
      // require(success,"failed")
        if(!success){
            //gas effectient way than require
            revert Staking_Transferfailed();
        }
    }

    function claimReward() external  UpdateReward(msg.sender) {
        // emit x coins for each second
        // send the rewards to each staker
        // and add the math mechanism for the reward finalization and claiming
        uint256 myreward = s_rewards[msg.sender];

        bool success = s_reward_token.transfer(msg.sender,myreward);

        if(!success){
            revert Staking_Transferfailed();
        }


    }
}
