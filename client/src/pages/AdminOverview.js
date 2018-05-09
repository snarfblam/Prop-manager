import React from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'

class AdminOverview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        };
    }

    render() {
        return (
            <Template
            navItems={[
                { path: '/admin/overview', text: 'Overview' },
                { path: '/admin/units', text: 'Units'},
                { path: '/admin/maint', text: 'Maintenance' },
                { path: '/admin/payments', text: 'Payments'},
                { path: '/admin/users', text: 'Users' },
            ]}
                content={
                    <div>
                        <h1>Overview</h1>
                        <h2>Maintenance</h2>
                        table goes here
                        <h2>Payments</h2>
                        table goes here
                    </div>
                }
            />
        )

    }
}

export default AdminOverview;