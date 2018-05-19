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


class Template extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        };

        this.showModal = this.props.showModal;
        this.hideModal = this.props.hideModal;
    }
 
    toNavItems(navList) {
        var index = 0;
        return navList.map(item => {
            if (item.path && item.text) {
                return <NavLinkItem to={item.path} key={index++}>{item.text}</NavLinkItem>
            } else {
                return item;
            }
        });
    }


    render() {
        return (
            <div>
                <Navbar>
                    <Container>
                        <NavbarBrand>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-emblem"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>
                            132 Chapel St
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

    onLoginClicked() {
        this.showModal(
            <Login />,
            "Log In"
        );
    }
    onLogoutClicked() {
        // window.location.href = '/auth/logout';
        Axios.post('/auth/logout', {}).then(this.props.onLogOut());
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