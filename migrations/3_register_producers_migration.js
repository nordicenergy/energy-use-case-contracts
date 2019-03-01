const EnergyStore = artifacts.require('./EnergyStore.sol');
const config = require('../truffle-config');

module.exports = async (deployer, network) => {
  const energyStore = await EnergyStore.deployed();
  let producers = [];
  switch (network) {
  case 'staging':
    producers = [
      '0xc937d285696123f5cef233a356d03a2a87a0d9f8',
      '0x09b89f95d8b6047e629b9a62715409c63d0cae1e',
      '0x54eec6b183b4369c1f3dff596aaa3877e9598f82',
      '0x7a557be4e001324d1cc81774788eab1cfa14ac99',
      '0xa466878267434a2d15b6a9dd8ccb83aec2f72cfb',
      '0x63942b9eb0c6784505112e690b66acd4336b9a46',
      '0xd3e99a90ab01ec630c0b248dbf768c91aab1dd00',
    ];
    break;
  case 'prod':
    producers = [
      '0x1fafe52df7c4c861528a6c20ec456dd7f5023789',
      '0xb71ee6bc8ca5d3446c68599f8482afe6027d937b',
      '0x502afff3db5d4437b214daa85e90c6feb43324f1',
      '0xe02733a67d778f75a3f2757de59977a9fd297cc3',
      '0x450967cdea14007cbc709045049be39f6fa4cc73',
      '0x6d4803dc40df5c589394202c8b92b276d191ef19',
      '0x18811e85554554346e09f34093c7c78f500da01e',
    ];
    break;
  }

  return Promise.all(
    producers.map(p => energyStore.registerProducer.sendTransaction(p, {
      privateFor: config.networks[network].privateFor
    }))
  );
};
