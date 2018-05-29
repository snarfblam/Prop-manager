import React from 'react';

export default props => (
    <form className={props.className} method='post'>
        {props.children}
    </form>
);
