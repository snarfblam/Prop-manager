import React from 'react';
// import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'

class AdminUnits extends Template {
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
                        <h1>Units</h1>
                        unit &lt;select&gt; goes here
                        <h3>Information</h3>
                        unit info table goes here
                    </div>
        );
    }
}

export default AdminUnits;