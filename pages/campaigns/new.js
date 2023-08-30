import React, { Component } from 'react'; 
import Layout from '../../components/layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
            .createCampaign(this.state.minimumContribution, accounts[0])
            .send({from: accounts[0]});
        } catch (err) {
            this.setState({ errorMessage: err.message});
        }
        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input label="wei" 
                        labelPosition="right" 
                        placeholder='ex. 1000000000'
                        value={this.state.minimumContribution}
                        onChange={event => this.setState({minimumContribution: event.target.value})}/>
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
            
        )
    }
}

export default CampaignNew;