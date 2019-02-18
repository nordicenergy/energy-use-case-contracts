const EnergyStore = artifacts.require('./EnergyStore.sol');

module.exports = (deployer) => {
  deployer.deploy(EnergyStore, {privateFor: ['4i9VJoVQbypbQ9znw8S3sTnEELTTKSrQxSwmY/QN+10=']});
};
