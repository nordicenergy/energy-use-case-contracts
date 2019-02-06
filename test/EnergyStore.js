const EnergyStore = artifacts.require('./EnergyStore');
require('truffle-test-utils').init();
const web3Abi = require('web3-eth-abi');
const EnergyStoreAbi = EnergyStore.abi;
// the following could be extracted from EnergyStoreAbi, but it is
// easier to copy and paste it in:
const EnergyStoreConsumer_buy_energyAbi = {
  'constant': false,
  'inputs': [
    {
      'name': 'aproducer',
      'type': 'address'
    },
    {
      'name': 'aday',
      'type': 'uint32'
    },
    {
      'name': 'aprice',
      'type': 'uint32'
    },
    {
      'name': 'aenergy',
      'type': 'uint64'
    }
  ],
  'name': 'buy_energy',
  'outputs': [],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
};

contract('EnergyStore', async (accounts) => {

  async function getOffersCount(optional) {
    let instance = await EnergyStore.deployed();
    return await instance.getBidsCount.call(optional);
  }

  async function getConsumerChoiceCount(optional) {
    let instance = await EnergyStore.deployed();
    return await instance.getAsksCount.call(optional);
  }

  async function recordEnergyOffer(aday, aprice, aenergy, atimestamp, optional) {
    let instance = await EnergyStore.deployed();
    //let hrTime = process.hrtime();
    //let atimestamp = hrTime[0] * 1e9 + hrTime[1]; // current time in nanoseconds
    return await instance.offer_energy(aday, aprice, aenergy, atimestamp, optional);
  }

  async function registerConsumer(aconsumer, optional) {
    let instance = await EnergyStore.deployed();
    return await instance.registerConsumer(aconsumer, optional);
  }

  async function isRegisteredConsumer(aconsumer, optional) {
    let instance = await EnergyStore.deployed();
    return await instance.consumers.call(aconsumer, optional);
  }

  async function registerProducer(aproducer, optional) {
    let instance = await EnergyStore.deployed();
    return await instance.registerProducer(aproducer, optional);
  }

  async function isRegisteredProducer(aproducer, optional) {
    let instance = await EnergyStore.deployed();
    return await instance.producers.call(aproducer, optional);
  }

  async function getOfferByIndex(index, optional) {
    let instance = await EnergyStore.deployed();
    return await instance.bids.call(index, optional);
  }

  async function getOfferByProducerAndDay(producer, day, optional) {
    let instance = await EnergyStore.deployed();
    return await instance.getBidByProducerAndDay.call(producer, day, optional);
  }

  async function getConsumerChoiceByIndex(index, optional) {
    let instance = await EnergyStore.deployed();
    return await instance.asks.call(index, optional);
  }

  async function getConsumerChoiceByUserID(userID, optional) {
    let instance = await EnergyStore.deployed();
    return await instance.getAskByUserID.call(userID, optional);
  }

  async function recordConsumerChoice(aproducer, aday, aprice, aenergy, auserID, atimestamp, optional) {
    let instance = await EnergyStore.deployed();
    return await instance.buy_energy(aproducer, aday, aprice, aenergy, auserID, atimestamp, optional);
  }

  async function buy_energy_consumer(aproducer, aday, aprice, aenergy, optional) {
    let instance = await EnergyStore.deployed();
    const transferMethodTransactionData = web3Abi.encodeFunctionCall(
      EnergyStoreConsumer_buy_energyAbi,
      [
        aproducer,
        aday,
        aprice,
        aenergy
      ]
    );
    var opt = Object.assign({
      to: instance.address,
      data: transferMethodTransactionData,
      value: 0,
      gas: 200000
    }, optional || {});
    const txHash = await web3.eth.sendTransaction(opt);
    return {
      receipt: await web3.eth.getTransactionReceipt(txHash)
    };
    /* in future API web3js 1.0:
    return await instance.methods['buy_energy(address,uint32,uint32,uint64)'](aproducer, aday, aprice, aenergy, optional);
    */
  }

  let producer1 = accounts[1]; // use second address as first producer
  let producer2 = accounts[2];
  let consumer1 = accounts[3];
  let consumer2 = accounts[4];

  describe('Producer-side', () => {
    it('should be empty', async () => {
      assert.equal(await getOffersCount(), 0, 'nonzero number of offers');
    });

    it('should not take offers from an unregistered address', async () => {
      recordEnergyOffer('1', '1000', '1000000000', '1')
        .then(() => assert(false), () => assert(true));
    });

    it('should register producers', async () => {
      let resultOfRegistering1 = await registerProducer(producer1);
      assert.equal(resultOfRegistering1.receipt.status, '0x01', 'tx status should be success');

      let registered1 = await isRegisteredProducer(producer1);
      assert.equal(registered1, true, 'registered status should be true');

      let resultOfRegistering2 = await registerProducer(producer2);
      assert.equal(resultOfRegistering2.receipt.status, '0x01', 'tx status should be success');

      let registered2 = await isRegisteredProducer(producer2);
      assert.equal(registered2, true, 'registered status should be true');
    });

    it('should reject an offer < 1 kWh', async () => {
      recordEnergyOffer('1', '1000', '999999', '010100', {from: producer1})
        .then(() => assert(false), () => assert(true));
    });

    it('should accept an offer from the registered producer', async () => {
      let resultOfOffering = await recordEnergyOffer(
        '1', '1000', '1000000000', '010101',
        {from: producer1}
      );
      assert.equal(resultOfOffering.receipt.status, '0x01', 'tx status should be success');
      assert.web3Event(resultOfOffering, {
        event: 'BidMade',
        args: {
          producer: producer1,
          day: 1,
          price: 1000,
          energy: 1000000000
        }
      });
    });

    it('should reject an earlier offer for the same day', async () => {
      recordEnergyOffer('1', '1050', '99000000', '010100', {from: producer1})
        .then(() => assert(false), () => assert(true));
    });

    it('should store one offer', async () => {
      assert.equal(await getOffersCount(), 1, 'number of offers should be one');
    });

    it('should store the correct offer', async () => {
      // assert the content of the offer (with index 0)
      let offer = await getOfferByIndex(0);
      assert.equal(offer[0], producer1);
      assert.equal(offer[1], 1);
      assert.equal(offer[2], 1000);
      assert.equal(offer[3], 1000000000);
    });

    it('should accept an offer for day 2', async () => {
      let resultOfOffering = await recordEnergyOffer(
        '2', '2000', '1000000000', '010102',
        {from: producer1}
      );
      assert.equal(resultOfOffering.receipt.status, '0x01', 'tx status should be success');
      assert.web3Event(resultOfOffering, {
        event: 'BidMade',
        args: {
          producer: producer1,
          day: 2,
          price: 2000,
          energy: 1000000000
        }
      });
    });

    it('should store two offers', async () => {
      assert.equal(await getOffersCount(), 2, 'number of offers should be two');
    });

    it('should store the correct 2nd offer', async () => {
      // assert the content of the offer (with index 1)
      let offer = await getOfferByIndex(1);
      assert.equal(offer[0], producer1);
      assert.equal(offer[1], 2);
      assert.equal(offer[2], 2000);
      assert.equal(offer[3], 1000000000);
    });

    it('should accept a new offer for day 1', async () => {
      let resultOfOffering = await recordEnergyOffer(
        '1', '1001', '1000000001', '010103',
        {from: producer1}
      );
      assert.equal(resultOfOffering.receipt.status, '0x01', 'tx status should be success');
      assert.web3AllEvents(resultOfOffering, [{
        event: 'BidRevoked',
        args: {
          producer: producer1,
          day: 1,
          price: 1000,
          energy: 1000000000
        }
      }, {
        event: 'BidMade',
        args: {
          producer: producer1,
          day: 1,
          price: 1001,
          energy: 1000000001
        }
      }]);
    });

    it('should store three offers', async () => {
      assert.equal(await getOffersCount(), 3, 'number of offers should be three');
    });

    it('should continue to store the correct 1st offer', async () => {
      // assert the content of the offer (with index 0)
      let offer = await getOfferByIndex(0);
      assert.equal(offer[0], producer1);
      assert.equal(offer[1], 1);
      assert.equal(offer[2], 1000);
      assert.equal(offer[3], 1000000000);
    });

    it('should store the correct 3rd offer', async () => {
      // assert the content of the offer (with index 2)
      let offer = await getOfferByIndex(2);
      assert.equal(offer[0], producer1);
      assert.equal(offer[1], 1);
      assert.equal(offer[2], 1001);
      assert.equal(offer[3], 1000000001);
    });

    it('should accept a new offer for day 2', async () => {
      let resultOfOffering = await recordEnergyOffer(
        '2', '2001', '1000000002', '010104',
        {from: producer1}
      );
      assert.equal(resultOfOffering.receipt.status, '0x01', 'tx status should be success');
      assert.web3AllEvents(resultOfOffering, [{
        event: 'BidRevoked',
        args: {
          producer: producer1,
          day: 2,
          price: 2000,
          energy: 1000000000
        }
      }, {
        event: 'BidMade',
        args: {
          producer: producer1,
          day: 2,
          price: 2001,
          energy: 1000000002
        }
      }]);
    });

    it('should store four offers', async () => {
      assert.equal(await getOffersCount(), 4, 'number of offers should be four');
    });

    it('should store the correct 4th offer', async () => {
      // assert the content of the offer (with index 3)
      let offer = await getOfferByIndex(3);
      assert.equal(offer[0], producer1);
      assert.equal(offer[1], 2);
      assert.equal(offer[2], 2001);
      assert.equal(offer[3], 1000000002);
    });

    it('should retain the previous offer', async () => {
      // assert the content of the offer (with index 2)
      let offer = await getOfferByIndex(2);
      assert.equal(offer[0], producer1);
      assert.equal(offer[1], 1);
      assert.equal(offer[2], 1001);
      assert.equal(offer[3], 1000000001);
    });
  });

  describe('Lition on behalf of a consumer', () => {
    it('should store zero consumer choices', async () => {
      assert.equal(await getConsumerChoiceCount(), 0, 'nonzero number of consumer choices');
    });

    it('should let the owner record a consumer choice but not producer1', async() => {
      // let owner record consumer (userid 1) choice
      let resultOfChoiceOwner = await recordConsumerChoice(
        producer1, 1, 1001, 1000, 1, '010106'
      );
      assert.equal(resultOfChoiceOwner.receipt.status, '0x01', 'tx status should be success');
      assert.web3Event(resultOfChoiceOwner, {
        event: 'Deal',
        args: {
          producer: producer1,
          day: 1,
          price: 1001,
          energy: 1000,
          userID: 1
        }
      });

      // let producer1 try to record consumer (userid 1) choice (must fail)
      recordConsumerChoice(
        producer1, 1, 1001, 1000, 1, '010107',
        {from: producer1}
      ).then(() => assert(false), () => assert(true));
    });

    it('should reject an earlier consumer choice for the same day even if it is identical', async() => {
      recordConsumerChoice(
        producer1, 1, 1001, 1000, 1, '010105'
      ).then(() => assert(false), () => assert(true));
    });

    it('should store one consumer choice', async () => {
      assert.equal(await getConsumerChoiceCount(), 1, 'number of consumer choices should be one');
    });

    it('should store the correct consumer choice (by index)', async () => {
      let choice = await getConsumerChoiceByIndex(0);
      assert.equal(choice[0], producer1, 'producer');
      assert.equal(choice[1], 1, 'day');
      assert.equal(choice[2], 1001, 'price');
      assert.equal(choice[3], 1000, 'energy');
      assert.equal(choice[4], 1, 'userID');
      assert.equal(choice[5], 10106, 'timestamp');
    });

    it('should store the correct consumer choice (by userID)', async () => {
      let choice = await getConsumerChoiceByUserID(1);
      assert.equal(choice[0], producer1, 'producer');
      assert.equal(choice[1], 1, 'day');
      assert.equal(choice[2], 1001, 'price');
      assert.equal(choice[3], 1000, 'energy');
    });

    it('should accept a new consumer choice', async() => {
      // enter offer from competitor (producer2)
      let resultOfOffering = await recordEnergyOffer(
        '1', '1000', '100000000', '010105',
        {from: producer2}
      );
      assert.equal(resultOfOffering.receipt.status, '0x01', 'tx status should be success');

      // verify that the offer is now present
      let resultOffer = await getOfferByProducerAndDay(producer2, 1);
      assert.equal(resultOffer[0], 1000, 'price');
      assert.equal(resultOffer[1].toString(), '100000000', 'energy');

      // let owner record consumer (userid 1) choice
      let resultOfConsumerChoice = await recordConsumerChoice(
        producer2, 1, 1000, 2000, 1, '010108',
      );
      assert.equal(resultOfConsumerChoice.receipt.status, '0x01', 'tx status should be success');
      assert.web3Event(resultOfConsumerChoice, {
        event: 'DealRevoked',
        args: {
          producer: producer1,
          day: 1,
          price: 1001,
          energy: 1000,
          userID: 1
        }
      });
      assert.web3Event(resultOfConsumerChoice, {
        event: 'Deal',
        args: {
          producer: producer2,
          day: 1,
          price: 1000,
          energy: 2000,
          userID: 1
        }
      });

      // assert choice as read from the contract
      let choice = await getConsumerChoiceByUserID(1);
      assert.equal(choice[0], producer2, 'producer');
      assert.equal(choice[1], 1, 'day');
      assert.equal(choice[2], 1000, 'price');
      assert.equal(choice[3], 2000, 'energy');
    });
  });

  describe('Consumers making transactions themselves', () => {

    it('should cause buy_energy from an unregistered address to revert', async () => {
      buy_energy_consumer(producer1, '1', '1001', '2000')
        .then(() => assert(false), () => assert(true));
    });

    it('should let the owner register a consumer', async () => {
      let resultOfRegistering1 = await registerConsumer(consumer1, 1);
      assert.equal(resultOfRegistering1.receipt.status, '0x01', 'tx status should be success');
    });

    it('should accept an offer from the registered consumer', async () => {
      let instance = await EnergyStore.deployed();
      let eventDeal = instance.Deal({}, {fromBlock: 'pending', toBlock: 'latest'});
      let eventDealRevoked = instance.DealRevoked({}, {fromBlock: 'pending', toBlock: 'latest'});
      let resultOfOffering = await buy_energy_consumer(
        producer1, '1', '1001', '2000',
        {from: consumer1}
      );
      assert.equal(resultOfOffering.receipt.status, '0x01', 'tx status should be success');
      eventDeal.watch((error, result) => {
        if (error) {
          assert.notOk(true, err);
        } else {
          assert.equal(result.event, 'Deal', 'event name should be Deal');
          assert.equal(result.args.producer, producer1, 'producer should be producer1');
          assert.equal(result.args.day, 1);
          assert.equal(result.args.price, 1001);
          assert.equal(result.args.energy, 2000);
          assert.equal(result.args.userID, 1);
        }
        eventDeal.stopWatching();
      });
      eventDealRevoked.watch((error, result) => {
        if (error) {
          assert.notOk(true, err);
        } else {
          assert.equal(result.event, 'DealRevoked', 'event name should be DealRevoked');
          assert.equal(result.args.userID, 1);
        }
        eventDealRevoked.stopWatching();
      });
    });

    it('should let the owner register a second consumer', async () => {
      let resultOfRegistering2 = await registerConsumer(consumer2, 2);
      assert.equal(resultOfRegistering2.receipt.status, '0x01', 'tx status should be success');
    });

    it('should accept an offer from the second registered consumer', async () => {
      let instance = await EnergyStore.deployed();
      let eventDeal = instance.Deal({}, {fromBlock: 'pending', toBlock: 'latest'});
      let resultOfOffering = await buy_energy_consumer(
        producer2, '1', '1000', '5000',
        {from: consumer2}
      );
      assert.equal(resultOfOffering.receipt.status, '0x01', 'tx status should be success');
      eventDeal.watch((error, result) => {
        if (error) {
          assert.notOk(true, err);
        } else {
          assert.equal(result.event, 'Deal', 'event name should be Deal');
          assert.equal(result.args.producer, producer2, 'producer should be producer1');
          assert.equal(result.args.day, 1);
          assert.equal(result.args.price, 1000);
          assert.equal(result.args.energy, 5000);
          assert.equal(result.args.userID, 2);
        }
        eventDeal.stopWatching();
      });
    });

    it('should store four consumer choices', async () => {
      assert.equal(await getConsumerChoiceCount(), 4, 'number of consumer choices should be four');
    });

    it('should store the correct consumer choices (by index)', async () => {
      let choice1 = await getConsumerChoiceByIndex(2);
      assert.equal(choice1[0], producer1, 'producer');
      assert.equal(choice1[1], 1, 'day');
      assert.equal(choice1[2], 1001, 'price');
      assert.equal(choice1[3], 2000, 'energy');
      assert.equal(choice1[4], 1, 'userID');
      assert.equal(choice1[5], 0, 'timestamp');
      let choice2 = await getConsumerChoiceByIndex(3);
      assert.equal(choice2[0], producer2, 'producer');
      assert.equal(choice2[1], 1, 'day');
      assert.equal(choice2[2], 1000, 'price');
      assert.equal(choice2[3], 5000, 'energy');
      assert.equal(choice2[4], 2, 'userID');
      assert.equal(choice2[5], 0, 'timestamp');
    });

    it('should store the correct consumer choice (by userID)', async () => {
      let choice1 = await getConsumerChoiceByUserID(1);
      assert.equal(choice1[0], producer1, 'producer');
      assert.equal(choice1[1], 1, 'day');
      assert.equal(choice1[2], 1001, 'price');
      assert.equal(choice1[3], 2000, 'energy');
      let choice2 = await getConsumerChoiceByUserID(2);
      assert.equal(choice2[0], producer2, 'producer');
      assert.equal(choice2[1], 1, 'day');
      assert.equal(choice2[2], 1000, 'price');
      assert.equal(choice2[3], 5000, 'energy');
    });

  });
});
