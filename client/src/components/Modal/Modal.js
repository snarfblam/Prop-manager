import React from 'react';
import './Modal.css';

// props.state: {text, title, visible}
//      .onRequestClose
export default props => (
    <div className={'modal-container' + (props.state.visible ? ' modal-container-visible' : '')} onClick={(e) => {
        if (e.target.className.startsWith('modal-container')) {
            props.onRequestClose();
        }
    }}>
        <div className='modal-content'>
            <h2 className='modal-title'>    
                <span className='modal-close'><a onClick={(e) => {
                    e.preventDefault();
                    props.onRequestClose();
                }}>&times;</a></span>
                {props.state.title}
            </h2>
            <div className='modal-body'>
                {props.state.content}
                {console.log(props.state.content)}
            </div>
        </div>
    </div>
);
