const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
require('dotenv').config();
const compiledFactory = require('./build/CampaignFactory.json');
 

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    'https://sepolia.infura.io/v3/4a4954ee87a64cb8a617c0fb4122712c'
)
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas:'1400000', from: accounts[0] })
    console.log('Contract deployed to', result.options.address);
};

deploy();