/*  
    Select element.

    Props:
        name: string - input name
        value: string - selected value
        items?: - optional array will be rendered as options. Alternatively, native <option> objects may be nested inside the <Select> object 
                  items can be strings or {value: string, text: string}
        onChange: function
*/

import React from 'react';

// props.name
//      .value
//      .label
export default props => (
    <div className={'form-group ' + props.className}>
        {props.label ? (
        <label htmlFor={'input-' + props.name}>
            {props.label}    
            </label>
        ) : (null)}        
        <select className='form-control' type='text' name={props.name} id={'input-' + props.name} value={props.value} onChange={props.onChange}>
            {props.children}
            {(props.items || []).map((item, index) => (
                <option key={index} value={item.value || item}>
                    {item.text || item}    
                </option>
            ))}
        </select>    
    </div>    
);