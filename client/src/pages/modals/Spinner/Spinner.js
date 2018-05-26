import React from 'react';
import './Spinner.css';

/*
    Props: {
        size?: height CSS value, e.g. 20px, 2rem, etc
    }
*/
export default props => {
    if (props.size) {
        return <img className='hamspin' src={require('./working.gif')} style={{height: props.size, width: 'auto'}} />
    } else {
        return <img className='hamspin' src={require('./working.gif')} />
    }    
};