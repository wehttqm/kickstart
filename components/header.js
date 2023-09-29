import React, { Component } from 'react';
import { Menu, Segment, Icon, } from 'semantic-ui-react';
import { Link, Router } from '../routes';
import web3 from '../ethereum/web3';

class Header extends Component {
    state ={
        icon: 'x',
        status: 'Disconnected',
        isConnected: false
    }

    getStatus = async () => {
        const accounts = await web3.eth.getAccounts();
        if (accounts[0]) {
            this.setState({icon: 'check', status: 'Connected', isConnected: true});


        } else {
            this.setState({icon: 'x', status: 'Disconnected', isConnected: false});
            this.setState({isConnected: true})
        }
    }

    render() {
        this.getStatus();
        return (
            <Menu secondary style={{marginTop: '10px'}}>
                <Link route='/'>    
                    <a className="item">
                        CrowdCoin
                    </a>
                </Link>

                <Link route='/campaigns/new'>    
                    <a className="item">+</a>
                </Link>

                <Menu.Menu position="right">
                    {this.state.isConnected && <Segment basic floated='right'>
                        <Icon name={this.state.icon}></Icon>
                        {this.state.status}
                    </Segment> }
                </Menu.Menu>
            </Menu>
        );
    }
}

export default Header;