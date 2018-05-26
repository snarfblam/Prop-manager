/*
    FakeAnchor renders to an <a> tag with no 
*/

import React from 'react';

export default props => {
    var aProps = { ...props };
    var clickHandler = props.onClick || (() => { });

    return (
        <a {...props} onClick={(e) => { e.preventDefault(); clickHandler(e);}}>
            {props.children}    
        </a>    
    )
};