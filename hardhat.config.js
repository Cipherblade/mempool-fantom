require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "fantom",
  networks: {
    fantom: {
      url: "http://10.0.0.8:5050",
    }
  }
};
