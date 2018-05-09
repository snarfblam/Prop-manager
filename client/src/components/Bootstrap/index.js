/*
    Bootstrap components

    grid components example:
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

// grid
import Col from './Col';
import Row from './Row';
import Container from './Container';

// nav
import Navbar from './Navbar';
import NavbarBrand from './NavbarBrand';
import NavbarNav from './NavbarNav';
import NavItem from './NavItem';
import NavLink from './NavLink';
import NavLinkItem from './NavLinkItem';


export {
    Col, Row, Container,
    Navbar, NavbarBrand, NavbarNav, NavItem, NavLink, NavLinkItem
};

export default {
    Col, Row, Container,
    Navbar, NavbarBrand, NavbarNav, NavItem, NavLink, NavLinkItem
};
