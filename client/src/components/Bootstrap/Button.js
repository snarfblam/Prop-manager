import React from 'react';

export default props => (
    <button {...props} style={props.style} className={'btn btn-' + (props.color || 'dark')}>
        {props.children}    
    </button>
)