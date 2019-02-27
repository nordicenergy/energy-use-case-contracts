const EnergyStore = artifacts.require('./EnergyStore.sol');
const config = require('../truffle-config');

module.exports = async (deployer, network) => {
  const energyStore = await EnergyStore.deployed();
  const consumers = [
    { address: '0x6890a27ef6e0418f62730b646fa05928439b6b26', auserID: 4 }
  ];

  return Promise.all(
    consumers.map(c => energyStore.registerConsumer.sendTransaction(c.address, c.auserID, {
      privateFor: config.networks[network].privateFor
    }))
  );
};
