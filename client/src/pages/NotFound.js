import React from 'react';

import Template from './Template';

class NotFound extends Template {
    constructor(props) {
        super(props);
    }


    getNavItems() {
        return [
            { path: '/', text: 'Home' },
        ];
    }

    getContent() {
        return (
            <div>
                <h1>Error</h1>
                <p>The requested content was not found</p>
            </div>    
        );
    }
}

export default NotFound;