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
        {getLabel(props, true, false)}
        <div className='input-group'>
            {getInputInnerLabel(props.innerPrepend, 'prepend')}    
            <input
                className={getInputClass(props)}
                type={props.password ? 'password' : (props.type || 'text')}
                name={props.name}
                id={'input-' + props.name}
                onChange={props.onChange}
                placeholder={props.placeholder}
                min={props.min}
                max={props.max}
                step={props.step}
                value={props.value}
                //  {...getValueAttribute(props)}    
            />
            {getLabel(props, false, true)}
            
            {getInputInnerLabel(props.innerAppend, 'append')}    
        </div>    
    </div>    
);

function getLabel(props, before, after) {
    if (!props.label) return null;

    if (isCheckOrRadio(props)) {
        if (before) return null;
    } else {
        if (after) return null;
    }

    return (
        <label htmlFor={'input-' + props.name}>
            {props.label}
            <span className={props.errorText ? 'input-error-text' : 'input-error-text-hidden'}>
                &emsp;<Fas icon='exclamation-circle' /> {props.errorText}
            </span>
        </label>
    );
}

function isCheckOrRadio(props) {
    if (!props.type) return false;
    var type = props.type.toLowerCase();
    return type === 'checkbox' || type === 'radio';
}

// function getValueAttribute(props) {
//     var type = (props.type || '').toLowerCase();
//     // Does not current handle radios
//     if (type.toLowerCase() === 'checkbox' || type.toLowerCase() === 'radio') {
//         return { checked: props.value };
//     }
//     return { value: props.value };
// }

function getInputClass(props) {
    var checkOrRadio = isCheckOrRadio(props);

    var result = checkOrRadio ? 'mt-1 mr-2' : 'form-control';
    if (props.align == 'center') result += ' text-center';
    if (props.align == 'right') result += ' text-right';
    if (checkOrRadio) result += ' d-inline';
    return result;
}

// For labels embedded in text boxes
function getInputInnerLabel(labelText, type) {
    if (!labelText) return null;

    return (<div className={"input-group-" + type}>
        <span className="input-group-text">{labelText}</span>
        </div>);
}