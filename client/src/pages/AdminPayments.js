import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, CheckList, CheckListState } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import { Table } from '../components/Table';
import * as api from '../api';
import Pane from '../components/Pane';

class AdminPayments extends Template {
    constructor(props) {
        super(props)
        this.filterOptions = [
            {name: 'paid', label: 'Paid', checked: true},
            {name: 'unpaid', label: 'Unpaid', checked: true}, 
        ]; 
        this.state = {
            filterState: new CheckListState(this.filterOptions),
            paymentItems: [
                { unit: '103', due: '5/1/2018', amount: '$9001.00', payment: 'xxxx-xxxx-xxxx-4096'},
                { unit: '102', due: '5/1/2018', amount: '$42.00', payment: 'xxxx-xxxx-xxxx-2048'},
                { unit: '101', due: '5/1/2018', amount: '$0.01', payment: 'NOT PAID'},
                { unit: '103', due: '4/1/2018', amount: '$9001.00', payment: 'xxxx-xxxx-xxxx-4096'},
                { unit: '102', due: '4/1/2018', amount: '$42.00', payment: 'xxxx-xxxx-xxxx-2048'},
                { unit: '101', due: '4/1/2018', amount: '$0.01', payment: 'xxxx-xxxx-xxxx-1024'},
            ],
        };

    }

    componentDidMount() {
        // var options = {};
        // if(this.state.filterState.)
        // api.getAllPayments();
        console.log(this.state.filterState);
    }

    getNavItems() {
        return this.adminNavLinks;
    }

    getContent() {
        var data = {
            columns: [
                { name: 'unit', label: 'Unit' },
                { name: 'due', label: 'Due' },
                { name: 'amount', label: 'Amount' },
                { name: 'payment', label: 'Payment' },
            ],
            items: this.state.paymentItems,
        };

        return (
            <Container>
                <Pane size='12'>
                    <h3>Payments</h3>
                    <CheckList inline items={this.filterOptions} state={this.state.filterState} onChange={state => this.setState({filterState: state})} />
                    <Table data={data} />
                </Pane>    
            </Container>
        );
    }
}

export default AdminPayments;