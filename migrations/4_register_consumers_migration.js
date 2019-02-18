const EnergyStore = artifacts.require('./EnergyStore.sol');

module.exports = async (deployer) => {
  const energyStore = await EnergyStore.deployed();
  const consumers = [{ address: '0x38814083b07be9b3b8c7315f13811c4f72411b97', auserID: 1 }];

  return Promise.all(
    consumers.map(c => energyStore.registerConsumer.sendTransaction(c.address, c.auserID, {
      privateFor: ['4i9VJoVQbypbQ9znw8S3sTnEELTTKSrQxSwmY/QN+10='],
    }))
  );
};
