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
    <div className={props.className ? ('form-group ' + props.className) : 'form-group'}>
        <label htmlFor={'input-' + props.name}>
            {props.label}
            <span className={props.errorText ? 'input-error-text' : 'input-error-text-hidden'}>
                &emsp;<Fas icon='exclamation-circle' /> {props.errorText}
            </span>
        </label>
        <div className='input-group'>
            {getInputInnerLabel(props.innerPrepend, 'prepend')}    
            <input
                className={getInputClass(props)}
                type={props.password ? 'password' : (props.type || 'text')}
                name={props.name}
                id={'input-' + props.name}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                min={props.min}
                max={props.max}
                step={props.step}
                />
            {getInputInnerLabel(props.innerAppend, 'append')}    
        </div>    
    </div>    
);

function getInputClass(props) {
    var result = 'form-control';
    if (props.align == 'center') result += ' text-center';
    if (props.align == 'right') result += ' text-right';
    return result;
}

function getInputInnerLabel(labelText, type) {
    if (!labelText) return null;

    return (<div className={"input-group-" + type}>
        <span className="input-group-text">{labelText}</span>
        </div>);
}