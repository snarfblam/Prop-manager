/*
    Font-awesome icon component

    usage example: 
        <button>
            <Fas icon='plus' /> Add Item
        </button>
*/

import React from 'react';

export default props => (
    <span className={'fas fa-' + props.icon}></span>
);