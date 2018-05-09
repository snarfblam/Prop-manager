import React from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'

class Tenant extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        };
    }

    render() {
        return (
            <Template
            navItems={[
                { path: '/tenant', text: 'Home' },
                { path: '/tenant', text: 'Pay Rent'},
                { path: '/tenant', text: 'Request Maintenance' },
            ]}
                content={
                    <div>
                        <h3>Rent</h3>
                        <p>
                            Your have rent due:
                        </p>
                        <p>
                            <span className='rent-amount'>$850</span> on <span className='rent-date'>April 1, 2019</span>
                        </p>
                        <button>Pay Rent</button>
                        <h3>Maintenance Requests</h3>
                        <p>[request table here]</p>
                        <button>Request Maintenance</button>

                    </div>
                }
            />
        )

    }
}

export default Tenant;