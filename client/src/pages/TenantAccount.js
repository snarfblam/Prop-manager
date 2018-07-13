import React from 'react';
import axios from 'axios';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, Input } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import Button from '../components/Bootstrap/Button';
import * as api from '../api';
import { Table } from '../components/Table';
import RequestAch from './modals/RequestAch';
import Pane from '../components/Pane';
import Spinner from './modals/Spinner';

class TenantAccount extends Template {
    constructor(props) {
        super(props)

        this.userDataColumns = [
            {name: 'name', label: 'Property'},
            {name: 'value', label: 'Value'},
        ]

        this.state = {
            unitList: null,
        };


    }

    componentDidMount() {
        this.getUnitList();
    }

    getUnitList = () => {
        api.getOwnUnits()
            .then(response => {
                this.setState({ unitList: response || []});
            });
    }

    getNavItems() {
        return this.tenantNavLinks;
    }


    getContent() {
        return (
            <Container>
                <Pane>
                    <h3>Account</h3>

                    {this.getUserTable()}
                </Pane>
            </Container>
        );
    }

    getUserTable = () => {
        if (this.props.user == null) return <Spinner />

        var units = <Spinner size='16px' />;
        if (this.state.unitList) {
            units = (this.state.unitList.length) ? (this.state.unitList.map(unit => unit.unitName).join(', ')) : '(none)';
        }

        var dataItems = [
            { name: 'Log-in type', value: this.props.user.authtype || 'not found' },
            { name: 'Email', value: this.props.user.email },
            { name: 'ACH verified', value: this.props.user.stripeACHVerified ? "Yes" : "No" },
            { name: 'Unit(s)', value: units },
        ];
        
        return <Table data={{ columns: this.userDataColumns, items: dataItems }} />
    }
}

export default TenantAccount;
