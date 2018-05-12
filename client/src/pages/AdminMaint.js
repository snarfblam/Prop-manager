import React from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, CheckList, CheckListState } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import { Table } from '../components/Table';
import Button from '../components/Bootstrap/Button';
import Fas from '../components/Fas';

class AdminMaint extends Template {
    constructor(props) {
        super(props)

        this.filterOptions = [
            {name: 'complete', label: 'Completed', checked: true},
            {name: 'incomplete', label: 'Not completed'},
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
        var ackButton = <Button><Fas icon='check' />&emsp;Done</Button>
        var data = {
            columns: [
                { name: 'unit', label: 'Unit' },
                { name: 'date', label: 'Date' },
                { name: 'message', label: 'Message' },
                { name: 'status', label: '' },
            ],
            items: [
                { unit: 5, date: '5/10/2018', message: 'Just saying hi!', status: ackButton },
                { unit: 1, date: '5/8/2018', message: 'heater is on fire, please send help', status: ackButton },
                { unit: 5, date: '4/29/2018', message: 'roof is leaking, documents ruined, electronics destroyed, seeking compensation. lawsuit pending, please await legal correspondence.', status: ackButton },
            ]
        };

        return (
            <div>
                <h2>Maintenance Requests</h2>
                <CheckList 
                    items={this.filterOptions}
                    state={this.state.filterState}
                    inline
                    stateChanged={newState => this.setState({
                        filterState: newState
                    })}
                />    
                <Table data={data} />
            </div>
        );
    }
}

export default AdminMaint;