const { Web3 } = require('web3');
require('dotenv').config({path: '../.env'});
const compiledFactory = require('./build/CampaignFactory.json');
const provider = new Web3.providers.HttpProvider(process.env.SEPOLIA_RPC)
const web3 = new Web3(provider);

const deploy = async () => {
    try {
        const signer = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE);
        console.log('Attempting to deploy from account', signer.address);

        web3.eth.accounts.wallet.add(signer)
        const contract = new web3.eth.Contract(compiledFactory.abi);
        contract.options.data = compiledFactory.evm.bytecode.object;
        const deployTx = contract.deploy();
        const deployedContract = await deployTx
        .send({ from: signer.address, gas: await deployTx.estimateGas() })
        .on('error', (err) => {
            console.log(err)
        })
        .on('transactionHash', (tx) => {
            console.log(`Transaction: https://sepolia.etherscan.io/tx/${tx}`)
        })

        console.log('Contract deployed to', deployedContract.options.address);
    } catch (e) {
        console.log(e);
    }
};

deploy();