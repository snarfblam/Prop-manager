import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, Row, Col } from '../components/Bootstrap';
import Table from '../components/Table';
import Template from './Template';
import './page.css';
import * as api from '../api';
import Spinner from './modals/Spinner';
import Pane from '../components/Pane';
import { Link } from 'react-router-dom';
import moment from 'moment';

class AdminOverview extends Template {
    constructor(props) {
        super(props);

        this.maintColumns = [
            { name: 'unit', label: 'Unit' },
                { name: 'message', label: 'Message' },
            { name: 'createdAt', label: 'Date' },
            { name: 'status', label: 'Resolved' },
        ];
        this.paymentColumns = [
            { name: 'unit', label: 'Unit' },
            { name: 'amount', label: 'Amount' },
            { name: 'due_date', label: 'Due' },
            { name: 'paid', label: 'Paid' },
        ];
        this.state = {
            maintItems: null,
            paymentItems: null,
        };
    }

    transformMaintItems(col, value, item) {
        if (col === 'unit') {
            return item.Unit.unitName;
        } else if (col === 'status') {
            return value ? "No" : "Yes";
        } else if (col === 'createdAt') {
            return (new Date(value)).toLocaleDateString();
        } else {    
            return value;
        }
    }

    transformPaymentItems(col, value, item) {
        if (col === 'unit') {
            return item.Unit.unitName;
        } else if (col === 'paid') {
            return value ? "Yes" : "No";
        } else if (col === 'due_date') {
            // return (new Date(value)).toLocaleDateString();
            return moment.utc(value).format('MM-DD-YYYY');

        } else {    
            return '$' + value.toFixed(2);
        }
    }
    
    componentDidMount() {
        api.getAllMaintRequests({open: true})
            .then(items => {
                this.setState({maintItems: items})
            });
        api.getAllPayments({ paid: false })
            .then(items => {
                this.setState({ paymentItems: items });
            });
    }

    getNavItems() {
        return this.adminNavLinks;
    }

    getContent() {
        return (
            <div>
                <h1>At a Glance</h1>
                <Container>
                    <Pane size='12'>
                        <h3>Maintenance</h3>
                        {this.getMaintTable()}
                        <p><Link to='/admin/maint'>View all maintenance items</Link></p>
                    </Pane>
                </Container>    
                <Container>
                    <Pane size='12'>
                        <h3>Payments</h3>
                        {this.getPaymentTable()}    
                        <p><Link to='/admin/payments'>View all invoices</Link></p>
                    </Pane>
                </Container>    
                 
            </div>
        );
    }

    getMaintTable() {
        if (this.state.maintItems == null) return <Spinner />;

        if(this.state.maintItems.length == 0) return <p>No open maintenance requests.</p>
        return (
            <Table
                data={{
                    columns: this.maintColumns,
                    items: this.state.maintItems || [],
                }}
                transform={this.transformMaintItems}
            />
        ) ;
    }

    getPaymentTable() {
        if (this.state.paymentItems == null) return <Spinner />;

        if(this.state.paymentItems.length == 0) return <p>No payment records.</p>
        
        return (
            <Table
                data={{
                    columns: this.paymentColumns,
                    items: this.state.paymentItems || [],
                }}
                transform={this.transformPaymentItems}
            />
        ) ;
    }
}

export default AdminOverview;