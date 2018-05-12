import React from 'react';
// import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import { Select } from '../components/Bootstrap';
import { Table } from '../components/Table';

class AdminUnits extends Template {
    constructor(props) {
        super(props)
        this.state = {
            // unitNames: ['101', '102', '103', '104', '201', '202'],
            // selectedUnit: '103',
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
                { name: 'tenants', label: 'Tenant(s)' },
                { name: 'rent', label: 'Rent' },
            ],
            items: [
                { unit: 101, tenants: 'Clark', rent: '$0'},
                { unit: 102, tenants: 'Anthony', rent: '$42'},
                { unit: 103, tenants: 'Don', rent: '$9001' },
            ]
        };

        return (
            <div>
                <h1>Units</h1>
                {/* <Select
                    items={this.state.unitNames}
                    value={this.state.selectedUnit}
                    onChange={() => { }}
                /> */}
                <Table data={data}/>    
                
            </div>
        );
    }
}

export default AdminUnits;