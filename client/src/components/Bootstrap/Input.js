import React from 'react';
import Fas from '../Fas';

// props.name
//      .value
//      .label
//      .password?
//      .placeholder
export default props => (
    <div className='form-group'>
        <label htmlFor={'input-' + props.name}>
            {props.label}
            <span className={props.errorText ? 'input-error-text' : 'input-error-text-hidden'}>
                &emsp;<Fas icon='exclamation-circle' /> {props.errorText}
            </span>
        </label>
        <input
            className='form-control'
            type={props.password ? 'password' : 'text'}
            name={props.name}
            id={'input-' + props.name}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
        />
    </div>    
);