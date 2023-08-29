import Web3 from 'web3';
 
let web3; 

try {
    // attempts to load injected web3 assuming we are in the browser and metamask is running. 
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} catch (e) {
    if (e instanceof ReferenceError) {
        // we are on the server *OR* the user is not running metamask.
        const provider = new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/4a4954ee87a64cb8a617c0fb4122712c");
        web3 = new Web3(provider);
    }
}

export default web3;