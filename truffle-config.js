/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('truffle-hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
     host: '127.0.0.1',     // Localhost (default: none)
     port: 20100,            // Standard Ethereum port (default: none)
     network_id: '*',       // Any network (default: none)
     gasPrice: 0,
    },

    staging: {
      host: '40.113.129.13',
      port: 22000,
      network_id: '*',
      gasPrice: 0,
      privateFor: [
        '82L7GALbOQ0+AaWSevznxbEUkS9O5l6uaZ4xA44zNkQ=',
        '0WHnPIQfh2AW1G8WodDTIYDUdVtsJbp0ggdJI1iJBgA=',
        'BJf3QT3pKHRJtLWBxQK9JCfVxTZKCdSPx0EofSmaK2g=',
        'n31HOZPLZgVslPdxk8EMLe1WyoXvB1dywlhDVZSCfGY=',
        'NRbsAeLSR2NyStEE8OLQ/9oYOddWYQQhaSZrTtknEl4=',
        '/jJ/8UbnOSerPtRz0GopIxEPjQoNDLzBSNqCKNZUlkk=',
        'HUMOVDczfCK56CxdrOfmnchTnWIm61Is/ZgnZhXfGU0=',
        'whFEkLfQhHDQgl+i07nEl4AcxsQHNJL4qF8gpCsMLnU=',
        '3iQXRLWAVOmQp5GqNTmEIzAtH06LUkyqQ4AO8sLHmxA=',
      ]
    },

    prod: {
      host: '40.113.129.13',
      port: 32000,
      network_id: '*',
      gasPrice: 0,
      privateFor: [
        'rppVj7BMrvWeIqOHc/PclMkZHinGn0iB9RF5dlFtFE0=',
        'zN1smWlD88Nf5wNgo6fMhelnKIFRjNpH83FEuv7X/0c=',
        'qTWufcyKvssczRrVNZn9cc173Saov8QL2To/oo3vrSI=',
        '3tyIHSeAZ9Ub4xcYSUTWnxROOIGKm5ktwTW1zR/V/mY=',
        'aeb5i8CpJvvAX6HTaIWetNt2n4fiLI1wmFwd5UEk6ww=',
        '6jtZHgqb1wwDMtNzu8w9+E8Al2/el+Cz+iDP+rcpazo=',
        '6zLYS6VGyuN/QZInl49B05Xkrcfxw9Kxtq0yucrHSls=',
        'WUGeqhUK15++sRgaeh+dPgt1GLTERHL0KCsVsd/Qsng=',
        'kf8Qo0bXXnYTitAfR0u/r5K4OPTaZ1Alh3kUWamBDUo=',
      ]
    },

    // Another network with more advanced options...
    // advanced: {
      // port: 8777,             // Custom port
      // network_id: 1342,       // Custom network
      // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
      // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
      // from: <address>,        // Account to send txs from (default: accounts[0])
      // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
      // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraKey}`),
      // network_id: 3,       // Ropsten's id
      // gas: 5500000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },

    // Useful for private networks
    // private: {
      // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
      // network_id: 2111,   // This network is yours, in the cloud.
      // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.4.24',    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};
