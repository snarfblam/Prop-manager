import React from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'

class AdminMaint extends React.Component {
    constructor() {
        super();
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
                        <h1>Maintenance</h1>
                        maint table goes here
                    </div>
                }
            />
        )

    }
}

export default AdminMaint;