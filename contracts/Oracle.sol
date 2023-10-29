// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainLinkOracle {
    address public chainlinkOracleAddress;

    constructor(address _chainlinkOracleAddress) {
        chainlinkOracleAddress = _chainlinkOracleAddress;
    }

    function getLatestPrice() external view returns (int256) {
        require(chainlinkOracleAddress != address(0), "Oracle address not set");
        AggregatorV3Interface aggregator = AggregatorV3Interface(
            chainlinkOracleAddress
        );
        (, int256 price, , , ) = aggregator.latestRoundData();
        require(price > 0, "Invalid oracle response");
        return price;
    }
}
