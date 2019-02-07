const EnergyStore = artifacts.require('./EnergyStore.sol');

module.exports = (deployer) => {
  deployer.deploy(EnergyStore);
};
