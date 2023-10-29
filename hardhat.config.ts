import { HardhatUserConfig } from "hardhat/config";

import "@nomiclabs/hardhat-waffle";

require('dotenv').config();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.GOERLI_INFURA_KEY}`,
      chainId: 5,
      accounts: [String(process.env.PRIVATE_KEY)],
    },
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};

export default config;
