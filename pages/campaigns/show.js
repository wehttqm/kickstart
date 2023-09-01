import React, { Component } from 'react'; 
import { Card } from 'semantic-ui-react';
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();

        return {
            minimumContribution: Number(summary[0]),
            balance: Number(summary[1]),
            requestsCount: Number(summary[2]),
            contributorsCount: Number(summary[3]),
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            contributorsCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution, 
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become an approver'
            },
            {
                header: requestsCount, 
                meta: 'Number of Requests', 
                description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.'
            },
            {
                header: contributorsCount, 
                meta: 'Number of Contributors', 
                description: 'Number of people who have already donated to this campaign'
            },
            {
                header: Number(web3.utils.fromWei(balance, 'ether')),
                meta: 'Campaign Balnace (ether)',
                descrption: 'The balance is how much money this campaign has left to spend.'
            }

        ]
        return <Card.Group items={items} />;
    }

    render() {
        return (
        <Layout>
            <h3>Campaign Show</h3>
            {this.renderCards()}
        </Layout>
        )
    }
}

export default CampaignShow; 