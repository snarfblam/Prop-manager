/*
    Implements a bootstrap container element.
*/

import React from 'react';

export default props => (
    <div className={"container" + (props.className ? (' ' + props.className) : '')}>
        {props.children}
    </div>
);