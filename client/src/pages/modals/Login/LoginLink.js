import React from 'react';

function onLogin(event, handler) {
    event.preventDefault();
    // if (handler) handler();
    handler();
}

export default props => (
    <a href='/login' onClick={(e) => {
        onLogin(e, props.onClick);
    }}>Login</a>
)