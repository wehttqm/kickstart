const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider({ 
    logging: {
      logger: {
        log: () => {} // disables the verbose shitstorm 
      }
    }
  }));

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts; 
let factory; 
let manager; 
let campaign1;
let campaign2;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts(compiledFactory.interface);
    factory = await new web3.eth.Contract(compiledFactory.abi).deploy({data: compiledFactory.evm.bytecode.object}).send({from: accounts[0], gas: '10000000'});

    await factory.methods.createCampaign('100', accounts[0]).send({from: accounts[0], gas: '10000000'});
    await factory.methods.createCampaign('100', accounts[0]).send({from: accounts[0], gas: '10000000'});
    const addresses = await factory.methods.getDeployedCampaigns().call();

    campaign1 = await new web3.eth.Contract(compiledCampaign.abi, addresses[0]);
    campaign2 = await new web3.eth.Contract(compiledCampaign.abi, addresses[1]);
    
    manager = await campaign1.methods.manager().call();
});

describe('Campaigns', () => {
    it('deploys a factory and two campaigns', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign1.options.address);
        assert.ok(campaign2.options.address);
    });
    it('marks caller as the campaign manager', async () => {
        assert.equal(manager, accounts[0]);
    });
    it('allows people to contribute money and marks them as a contributor', async () => {
        await campaign1.methods.contribute().send({from: accounts[0], value: '1000'});
        const isContributor = await campaign1.methods.contributors(accounts[0]).call(); // cannot get an entire mapping, must specify a specific key. in this case, accounts[0] is the key in the 'contributors' mapping in campaign.sol
        assert(isContributor); 
    });
    it('requires a minimum contribution', async () => {
        try{
            await campaign1.methods.contribute().send({from: accounts[0], value: '99'}); // one wei less than the min. contribution
            assert(false); // in case the above call works, which it shouldn't. 
        } catch (err) {
            assert(err);
        }
    });
    it('allows a manager to make a payment request', async () => {
        await campaign1.methods
        .createRequest('Buy batteries', 100, accounts[1])
        .send({from: manager, gas: '1000000'});

        const request = await campaign1.methods.requests(0).call();
        assert.equal('Buy batteries', request.description);
    });
    it('processes requests', async () => {
        await campaign1.methods.contribute().send({from: accounts[0], value: web3.utils.toWei(10, 'ether')});
        await campaign1.methods
        .createRequest('Buy something', web3.utils.toWei(5, 'ether'), accounts[1])
        .send({from: manager, gas: '1000000'});
        await campaign1.methods.approveRequest(0).send({from: manager, gas: '1000000'});
        await campaign1.methods.finalizeRequest(0).send({from: manager, gas: '1000000'});

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = Number(balance);
        assert(balance > 103);
        
    });
    it('has test accounts with 1000 test ether', async() => {
        let balance = await web3.eth.getBalance(accounts[4]);
        balance = web3.utils.fromWei(balance, 'ether');
        assert(balance = 1000);
    })
})