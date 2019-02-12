const EnergyStore = artifacts.require('./EnergyStore.sol');

module.exports = (deployer) => {
  deployer.deploy(EnergyStore, {privateFor: ['+M2bZ0x66ITulGcl9ytecSYIGRC4GGWxC/GphLS8bjo=']});
};
