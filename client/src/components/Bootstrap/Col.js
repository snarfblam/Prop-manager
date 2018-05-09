/*
    Implements a bootstrap column element.
*/

// props.size : string -- space separated list of bootstrap size classes, without the col-prefix
//                        e.g. size='6 md-4 xl-2' -> class='col-6 col-md-4 col-xl-2'

import React from 'react';

export default props => {
    var sizes = (props.size || '').split(' ').filter(i => i);
    var classname;
    
    if (sizes.length == 0) {
        classname = 'col'        
    } else {
        classname = sizes.map(size => 'col-' + size).join(' ');
    }
    
    if (props.className) classname += ' ' + props.className;

    return <div className={classname}>{props.children}</div>;
}