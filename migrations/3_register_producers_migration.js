const EnergyStore = artifacts.require('./EnergyStore.sol');
const request = require('request-promise-native');

module.exports = async (deployer) => {
  const energyStore = await EnergyStore.deployed();
  const accounts = await Promise.all(
    [1, 2, 3].map(p =>
      request.get(`http://127.0.0.1:20${p}04/getAccounts`, { json: true })
    )
  );

  const batch = new web3.BatchRequest();
  const results = accounts.map(a => new Promise((resolve, reject) => {
    batch.add(energyStore.methods.registerProducer(a.accountAddress).send.request({
      from: accounts[0].accountAddress,
    }, (e, r) => e ? reject(e) : resolve(r)));
  }));
  batch.execute();
  return Promise.all(results);
};
