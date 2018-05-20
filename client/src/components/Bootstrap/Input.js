import React from 'react';
import Fas from '../Fas';

// props.name
//      .value
//      .label
//      .innerPrepend
//      .innerAppend
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
        <div className='input-group'>
            {getInputInnerLabel(props.innerLabel, 'prepend')}    
            <input
                className='form-control'
                type={props.password ? 'password' : 'text'}
                name={props.name}
                id={'input-' + props.name}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                />
            {getInputInnerLabel(props.innerLabel, 'append')}    
        </div>    
    </div>    
);

function getInputInnerLabel(labelText, type) {
    if (!labelText) return null;

    return (<div className={"input-group-" + type}>
        <span className="input-group-text">{labelText}</span>
        </div>);
}