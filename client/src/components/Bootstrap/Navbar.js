import React from 'react';
import './bootstrap.css';

export default props => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        {props.children}    
    </nav>    
);