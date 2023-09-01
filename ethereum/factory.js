import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi, 
    "0x332f6AF1d97440E28a04cc390597Bef8bD6F0e9E"
);


export default instance;