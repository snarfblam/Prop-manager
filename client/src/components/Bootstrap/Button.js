import React from 'react';

export default props => (
    <button {...props} className={'btn btn-' + (props.color || 'dark')}>
        {props.children}    
    </button>
)