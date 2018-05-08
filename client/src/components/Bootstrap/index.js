/*
    Bootstrap grid components

    usage example:
        <Container>
            <Row>
                <Col size='12 sm-4'>
                    I take up 1/3, except on tiny devices where I'm full width
                </Col>
                <Col size='12 sm-8'>
                    I take up 2/3, except on tiny devices where I'm full width
                </Col>
            </Row>
        </Container>
*/

import Col from './Col';
import Row from './Row';
import Container from './Container';

export { Col, Row, Container };
export default { Col, Row, Container };
