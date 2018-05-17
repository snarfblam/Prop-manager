import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'

class AdminOverview extends Template {
    constructor(props) {
        super(props)
        this.state = {

        };
    }


    getNavItems() {
        return [
            { path: '/admin/overview', text: 'Overview' },
            { path: '/admin/units', text: 'Units'},
            { path: '/admin/maint', text: 'Maintenance' },
            { path: '/admin/payments', text: 'Payments'},
            { path: '/admin/users', text: 'Users' },
        ];
    }

    getContent() {
        return (
            <div>
                <h1>Overview</h1>
                <h2>Maintenance</h2>
                table goes here
                <h2>Payments</h2>
                table goes here
            </div>
        );
    }
}

export default AdminOverview;