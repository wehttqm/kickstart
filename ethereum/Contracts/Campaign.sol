// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;
    function createCampaign(uint minimum, address user) public {
        deployedCampaigns.push(address(new Campaign(minimum, user)));
    }
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient; 
        bool complete; 
        uint approvalCount;
        mapping(address => bool) approvals; 
    }

    modifier restricted()  {
        require(msg.sender == manager);
        _;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution; // in wei
    mapping(address => bool) public contributors;
    uint public participatingContributors;

    constructor(uint minimum, address user) {
        minimumContribution = minimum;
        manager = user;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        if (!contributors[msg.sender]) {
            participatingContributors++;
        }
        contributors[msg.sender] = true;
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient; 
        newRequest.complete = false; 
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        require(contributors[msg.sender]); // make sure sender is an active contributor
        require(!requests[index].approvals[msg.sender]); // make sure sender has not approved a requrest previously
        requests[index].approvals[msg.sender] = true; // stops sender from approving a request in the future
        requests[index].approvalCount++;
    }

    function finalizeRequest(uint index) public payable restricted {
        require(!requests[index].complete);
        require(requests[index].approvalCount > (participatingContributors / 2));
        
        requests[index].recipient.transfer(requests[index].value);

        requests[index].complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            participatingContributors,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
