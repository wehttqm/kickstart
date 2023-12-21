const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
require('dotenv').config({path: '../.env'});
const compiledFactory = require('./build/CampaignFactory.json');
 

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    'https://sepolia.infura.io/v3/63c9b0b9b19b4f2bb4d8b0c5bbf1e7db'
)
const web3 = new Web3(provider);

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('Attempting to deploy from account', accounts[1]);
        const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ gas:'1400000', from: accounts[1] })
        console.log('Contract deployed to', result.options.address);
    } catch (e) {
        console.log(e)
    }
};

deploy();