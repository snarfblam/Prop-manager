import React from 'react';
import { Link } from 'react-router-dom';

/*
    Provides a navbar brand component to wrap the brand image or text.

    Example:
        <NavbarBrand>
            <img src='/images/navbrand.png' />
        </NavbarBrand>

    props:
        to?: string - Path to navigate to, e.g. '/' or '/user/profile'. Defaults to '/'
        useAnchor?: boolean - If true, an <a> tag will be used instead of 
*/

export default props => (
    <Link className="navbar-brand" to={props.to || '/'}>
        {props.children}    
    </Link>
);