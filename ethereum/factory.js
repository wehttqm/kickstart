import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi, 
    "0x47D579d0F94fBB64A26328D236F81BbF9553C822"
);


export default instance;