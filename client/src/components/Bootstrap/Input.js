import React from 'react';

// props.name
//      .value
//      .label
//      .password?
//      .placeholder
export default props => (
    <div className='form-group'>
        <label htmlFor={'input-' + props.name}>
            {props.label}    
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