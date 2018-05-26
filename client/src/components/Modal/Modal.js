import React from 'react';
import './Modal.css';

// props.state: {text, title, visible}
//      .onRequestClose
//      .fluid: boolean (default) - explicitly marks a modal as 'fluid'. If set, overrides 'fixed'
//      .fixed: boolean - marks a modal as fixed-size 
export default props => (
    <div className={'modal-container' + (props.state.visible ? ' modal-container-visible' : '')} onClick={(e) => {
        var targetClass = (e.target.className || '').toString(); // sometimes .className is not a string (e.g. 'Google' svg used in buttons)
        if (targetClass.startsWith('modal-container')) {
            props.onRequestClose();
        }
    }}>
        <div className={(props.state.fluid || !props.state.fixed) ? 'modal-content' : 'modal-content modal-fixed'}>
            <h2 className='modal-title'>    
                <span className='modal-close'><a onClick={(e) => {
                    e.preventDefault();
                    props.onRequestClose();
                }}>&times;</a></span>
                {props.state.title}
            </h2>
            <hr />
            <div className='modal-body'>
                {props.state.content}
            </div>
        </div>
    </div>
);

