import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, CheckList, CheckListState } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import { Table } from '../components/Table';

class AdminPayments extends Template {
    constructor(props) {
        super(props)
        this.filterOptions = [
            {name: 'paid', label: 'Paid', checked: true},
            {name: 'unpaid', label: 'Unpaid', checked: true}, 
        ]; 
        this.state = {
            filterState: new CheckListState(this.filterOptions),
        };
    }

    getNavItems() {
        return [
            { path: '/admin/overview', text: 'Overview' },
            { path: '/admin/units', text: 'Units' },
            { path: '/admin/maint', text: 'Maintenance' },
            { path: '/admin/payments', text: 'Payments' },
            { path: '/admin/users', text: 'Users' },
        ];
    }

    getContent() {
        var data = {
            columns: [
                { name: 'unit', label: 'Unit' },
                { name: 'due', label: 'Due' },
                { name: 'amount', label: 'Amount' },
                { name: 'payment', label: 'Payment' },
            ],
            items: [
                { unit: '103', due: '5/1/2018', amount: '$9001.00', payment: 'xxxx-xxxx-xxxx-4096'},
                { unit: '102', due: '5/1/2018', amount: '$42.00', payment: 'xxxx-xxxx-xxxx-2048'},
                { unit: '101', due: '5/1/2018', amount: '$0.01', payment: 'NOT PAID'},
                { unit: '103', due: '4/1/2018', amount: '$9001.00', payment: 'xxxx-xxxx-xxxx-4096'},
                { unit: '102', due: '4/1/2018', amount: '$42.00', payment: 'xxxx-xxxx-xxxx-2048'},
                { unit: '101', due: '4/1/2018', amount: '$0.01', payment: 'xxxx-xxxx-xxxx-1024'},
            ]
        };

        return (
            <div>
                <h1>Payments</h1>
                <CheckList inline items={this.filterOptions} state={this.state.filterState} onChange={state => this.setState({filterState: state})} />
                <Table data={data} />
            </div>
        );
    }
}

export default AdminPayments;