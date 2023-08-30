import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi, 
    "0x4FC012E0217f205C2D9D266E3E6c835F0e81d83B"
);


export default instance;