const Migrations = artifacts.require('./Migrations.sol');
const config = require('../truffle-config');

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Migrations, { privateFor: config.networks[network].privateFor });
};
