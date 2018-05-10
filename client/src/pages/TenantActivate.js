import React from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, Form, Input } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import GoogleSvg from '../components/svg/GoogleSvg';

class TenantActivate extends Template {
    constructor(props) {
        super(props)
        this.state = {

        };
    }

  

    getNavItems() {
        return [
                   { path: '/tenant', text: 'Home' },
                { path: '/tenant', text: 'Pay Rent'},
                { path: '/tenant', text: 'Request Maintenance' },
     ];
    }

    getContent() {
        return (
                    <div>
                        <h2>Activate your account</h2>
                        <hr />                        
                        <p>
                            Activate your account with
                        </p>
                        <button>
                            <GoogleSvg className="googlogo"/>
                        </button>

                        <hr />                        
                        <p>Create a local account</p>
                        <Form className="container-400">
                            <Input
                                password
                                name='pass'
                                value='steven'
                                label='Password'
                            />
                            <button>Create Account</button>
                        </Form>    

                    </div>
        );
    }
}

export default TenantActivate;