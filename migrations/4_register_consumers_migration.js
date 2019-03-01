const EnergyStore = artifacts.require('./EnergyStore.sol');
const config = require('../truffle-config');

module.exports = async (deployer, network) => {
  const energyStore = await EnergyStore.deployed();
  let consumers = [];
  switch (network) {
  case 'staging':
    consumers = [
      { address: '0xef8ed9be89bd2756cf7ba4f149f27dee92003174', auserID: 7 }
    ];
    break;
  case 'prod':
    consumers = [
      { address: '0xef8ed9be89bd2756cf7ba4f149f27dee92003174', auserID: 7 }
    ];
    break;
  }

  return Promise.all(
    consumers.map(c => energyStore.registerConsumer.sendTransaction(c.address, c.auserID, {
      privateFor: config.networks[network].privateFor
    }))
  );
};
