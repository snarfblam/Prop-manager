import React from 'react';
import { Link } from 'react-router-dom';

/*
    Provides a navbar-nav container to house NavItem components

    Example:
        <NavbarBrand>
            <img src='/images/navbrand.png' />
        </NavbarBrand>

    props:
        to?: string - Path to navigate to, e.g. '/' or '/user/profile'. Defaults to '/'
*/

export default props => (
    // <div className="navbar-collapse">
        <ul className="navbar-nav">
            {props.children}
        </ul>
    // </div>
);