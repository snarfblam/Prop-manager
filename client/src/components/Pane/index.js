/*
    Pane: Similar to a bootstrap card, but simpler. Embed an <h3> for a styled header.
*/

import React from 'react';
import './Pane.css';
import { Row, Col } from '../Bootstrap';

export default props => (
    <Row center>
        <Col size={props.size || '12 md-8'} className='pane'>
          {props.children}    
        </Col>
    </Row>
);

// function getColClassName(props) {
//     if (props.size) {
        
//     } else {
//         return 
//     }
// }