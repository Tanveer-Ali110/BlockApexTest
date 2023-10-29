// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Modifiers.sol";
import "./Oracle.sol";

contract OrderPlace is Modifiers {
    ChainLinkOracle public oracle;

    enum ConditionType {
        TimeBased,
        EventBased,
        PriceBased
    }

    struct Order {
        address user;
        address assetToBuy;
        address assetToSell;
        uint256 amount;
        ConditionType conditionType;
        uint256 executionTime;
        bool orderExecuted;
    }
    Order[] public orders;

    constructor(address _chainLinkAddress) {
        owner = msg.sender;
        oracle = new ChainLinkOracle(_chainLinkAddress);
    }

    function togglePause() external onlyOwner {
        isPause = !isPause;
    }

    function placeOrder(
        address _assetToBuy,
        address _assetToSell,
        uint256 _amount,
        ConditionType _conditionType,
        uint256 _executionTime
    ) external isPaused {
        Order memory newOrder = Order({
            user: msg.sender,
            assetToBuy: _assetToBuy,
            assetToSell: _assetToSell,
            amount: _amount,
            conditionType: _conditionType,
            executionTime: _executionTime,
            orderExecuted: false
        });
        orders.push(newOrder);
    }

    function executeOrders(uint256 orderIndex) public isPaused {
        Order storage order = orders[orderIndex];

        require(!order.orderExecuted, "Order already executed");

        bool conditionsMet = checkConditions(order);
        if (conditionsMet) {
            order.orderExecuted = true;
        }
    }

    function executeOrdersBatch() external isPaused {
        for (uint256 i = 0; i < orders.length; i++) {
            executeOrders(i);
        }
    }

    function checkConditions(Order memory order) internal view returns (bool) {
        if (order.conditionType == ConditionType.TimeBased) {
            return block.timestamp >= order.executionTime;
        } else if (order.conditionType == ConditionType.EventBased) {
            // need to work here
            return false;
        } else if (order.conditionType == ConditionType.PriceBased) {
            int256 price = oracle.getLatestPrice();
            return uint256(price) == order.amount;
        }
        return false;
    }
}
