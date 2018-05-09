import React from 'react';
import { Link } from 'react-router-dom';

export default props => (
    <Link to={props.to} className='nav-link'>
        {props.children}    
    </Link>
)