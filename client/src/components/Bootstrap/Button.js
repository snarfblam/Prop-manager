import React from 'react';

export default props => (
    <button className={'btn btn-' + (props.color || 'dark')}>
        {props.children}    
    </button>
)