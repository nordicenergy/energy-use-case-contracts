const EnergyStore = artifacts.require('./EnergyStore.sol');
const config = require('../truffle-config');

module.exports = async (deployer, network) => {
  const energyStore = await EnergyStore.deployed();
  const producers = [
    '0xc937d285696123f5cef233a356d03a2a87a0d9f8',
    '0x09b89f95d8b6047e629b9a62715409c63d0cae1e',
    '0x54eec6b183b4369c1f3dff596aaa3877e9598f82',
    '0x7a557be4e001324d1cc81774788eab1cfa14ac99',
    '0xa466878267434a2d15b6a9dd8ccb83aec2f72cfb',
    '0x63942b9eb0c6784505112e690b66acd4336b9a46',
    '0xd3e99a90ab01ec630c0b248dbf768c91aab1dd00',
  ];

  return Promise.all(
    producers.map(p => energyStore.registerProducer.sendTransaction(p, {
      privateFor: config.networks[network].privateFor
    }))
  );
};
