import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi, 
    "0xcbde8CB50ee31bcF3452990F962F8517f65657c8"
);


export default instance;