import React from 'react';

export default props => (
    <li className={props.active ? "nav-item activeNavTab" : "nav-item"}>
        {props.children}    
    </li>
)