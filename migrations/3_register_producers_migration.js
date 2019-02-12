const EnergyStore = artifacts.require('./EnergyStore.sol');
const request = require('request-promise-native');

module.exports = async (deployer) => {
  const energyStore = await EnergyStore.deployed();
  const accounts = await Promise.all(
    [1, 2, 3].map(p =>
      request.get(`http://127.0.0.1:20${p}04/getAccounts`, { json: true })
    )
  );

  return Promise.all(
    accounts.map(a => energyStore.registerProducer.sendTransaction(a[0].accountAddress, {
      privateFor: ['+M2bZ0x66ITulGcl9ytecSYIGRC4GGWxC/GphLS8bjo='],
    }))
  );
};
