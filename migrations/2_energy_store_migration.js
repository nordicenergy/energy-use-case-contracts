const EnergyStore = artifacts.require('./EnergyStore.sol');
const config = require('../truffle-config');

module.exports = (deployer, network) => {
  deployer.deploy(EnergyStore, {
    privateFor: config.networks[network].privateFor
  });
};
