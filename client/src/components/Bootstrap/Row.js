import React from 'react';

export default props => (
    <div className={getClassName(props)}>
        {props.children}    
    </div>
)

function getClassName(props) {
    var result = 'row ' + (props.className || '');
    if (props.center) result += ' justify-content-center';
    return result;
}