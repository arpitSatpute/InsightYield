// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract vUSDT is ERC20, Ownable {
    uint256 public constant AIRDROP_AMOUNT = 10_000e18;
    mapping(address => bool) public hasClaimed;

    event Airdropped(address indexed user, uint256 amount);

    constructor() ERC20("virtual USDT", "vUSDT") Ownable(msg.sender) {}

    function airdrop() public {
        require(!hasClaimed[msg.sender], "Already claimed");
        hasClaimed[msg.sender] = true;
        _mint(msg.sender, AIRDROP_AMOUNT);
        emit Airdropped(msg.sender, AIRDROP_AMOUNT);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}