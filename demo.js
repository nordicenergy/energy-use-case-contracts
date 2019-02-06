const Web3 = require('web3');
const EnergyStore = require('./build/contracts/EnergyStore');
const config = require('./truffle-config');

(async () => {
  const network = 'development';
  const web3 = new Web3(`http://${config.networks[network].host}:${config.networks[network].port}`);
  const energyStore = new web3.eth.Contract(EnergyStore.abi, EnergyStore.networks[config.networks[network].network_id].address);
  const accounts = await web3.eth.getAccounts();
  await web3.eth.personal.unlockAccount(accounts[0]);

  await energyStore.methods.registerProducer(accounts[0]).send({
    from: accounts[0],
    privateFor: config.networks[network].privateFor,
  });
})();
