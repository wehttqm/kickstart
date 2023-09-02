import React from 'react'; 
import { Container } from 'semantic-ui-react';
import Header from './header';

export default props => {
    return (
        <Container>
            <link async rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"/>
            <script src="https://cdn.jsdelivr.net/npm/semantic-ui-react/dist/umd/semantic-ui-react.min.js"></script>
            <Header/>
            {props.children}
        </Container>
    );
};