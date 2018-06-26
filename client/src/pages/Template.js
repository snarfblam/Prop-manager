/*

    Template for other pages

    Props:
        navItems: either (collection of JSX NavItem or NavLinkItem objects) or (array of objects {path: string, text: string})
        content: collection of JSX items

*/

import React from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import './page.css'
import LoginLink from './modals/Login/LoginLink';
import Login from './modals/Login'
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import PassReset from './modals/PassReset';
import * as api from '../api';


class Template extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        };

        this.showModal = this.props.showModal;
        this.hideModal = this.props.hideModal;
        this.redirect = null;

        this.adminNavLinks = [
            { path: '/admin/overview', text: 'Overview', altPaths: ['/'] },
            { path: '/admin/maint', text: 'Maintenance' },
            { path: '/admin/payments', text: 'Payments' },
            { path: '/admin/users', text: 'Users' },
            { path: '/admin/units', text: 'Units' },
            { path: '/admin/settings', text: 'Settings' },
        ];
        this.tenantNavLinks = [
            { path: '/tenant', text: 'Home', altPaths: ['/'] },
            { path: '/tenant/payments', text: 'Payment History' },
            { path: '/tenant/account', text: 'Account', altPaths: ['tenant/activate/']},
            // { path: '/tenant', text: 'Pay Rent' },
            // { path: '/tenant', text: 'Request Maintenance' },
        ];

        this.refreshUser = this.props.refreshUser;
    }
 
    toNavItems(navList) {
        var index = 0;
        var thisPath = (this.props.match || {}).path || '';
        return navList.map(item => {
            var active = (thisPath === item.path);
            if (item.altPaths) active = (active || item.altPaths.includes(thisPath));

            var className = active ? 'activeNavTab' : null;

            if (item.path && item.text) {
                if (active) {
                    return <NavLinkItem active to={item.path} key={index++}>{item.text}</NavLinkItem>
                } else {
                    return <NavLinkItem to={item.path} key={index++}>{item.text}</NavLinkItem>
                }
            } else {
                return item;
            }
        });
    }

    redirectTo = (path) => {
        this.setState({ redirect: path });
    };



    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div className={this.props.className}>
                <Navbar>
                    <Container>
                        <NavbarBrand>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-emblem"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>
                            {this.props.bannerText || '132 Chapel St'}
                        </NavbarBrand>
                        <NavbarNav>
                            {this.toNavItems(
                                // this.props.navItems
                                this.getNavItems()
                            )}
                        </NavbarNav>
                        <NavbarNav>
                            {/* <NavLinkItem to='/'>
                                Login
                            </NavLinkItem> */}
                            <LoginLink
                                loggedAs={this.props.loggedAs}    
                                onLogin={() => this.onLoginClicked()}
                                onLogout={() => this.onLogoutClicked()}
                            />
                        </NavbarNav>
                    </Container>
                </Navbar>

                {/* {this.props.content} */}
                {this.getContent()}

            </div>
        );
        }
    
    submitPasswordResetRequest = (user) => {
        api.resetPassword(user)
            .then(responseBody => {
                var result = responseBody.result;
                //  'reset' - The operation succeeded and an email was sent to the user
                //  'not found' - The username wasn't found
                //  'reset pending' - The operation failed because there is already a password reset for this account
                //  'error' - Unknown error
                if (result == 'reset') {
                    this.showModal(<p>An email has been sent to reset your password.</p>, "Password Reset");
                } else if (result == 'not found') {
                    this.showModal(<p>The user account specified was not found.</p>, "Password Reset");
                } else if (result == 'reset pending') {
                    this.showModal(<p>An email has been sent to reset your password.</p>, "Password Reset");
                } else if (result == 'error') {
                    this.showModal(<p>An error occured trying to reset the password.</p>, "Password Reset");
                }
            });
    }
    
    showPasswordReset = () => {
        this.showModal(<PassReset onRequestReset={this.submitPasswordResetRequest} />, "Reset Password");
    }
            
    onLoginClicked() {
        this.showModal(
            <Login onPasswordReset={this.showPasswordReset} />,
            "Log In"
        );
    }
    onLogoutClicked() {
        // window.location.href = '/auth/logout';
        Axios.post('/auth/logout', {}).then(this.props.onLogOut());
        this.redirectTo('/');
        // this.showModal(
        //     <p>will be implemented some day</p>,
        //     "Log Out"
        // );
    }

    // getNavItems() {
    //     throw Error("getNavItems not implemented");
    // }

    
    // getContent() {
    //     throw Error("getNavItems not implemented");
    // }

    
}

export default Template;