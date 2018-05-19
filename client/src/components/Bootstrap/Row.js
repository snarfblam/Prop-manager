import React from 'react';

export default props => (
    <div className={'row' + formatClassname(props.className)}>
        {props.children}    
    </div>
)

function formatClassname(clsStr) {
    return clsStr ? (' ' + clsStr) : '';
}