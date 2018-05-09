import React from 'react';
import NavLink from './NavLink';
import NavItem from './NavItem';

export default props => (
    <NavItem>
        <NavLink to={props.to}>
            {props.children}    
        </NavLink>
    </NavItem>
)