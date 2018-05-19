import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Table from '../components/Table';
import Template from './Template';
import './page.css';
import * as api from '../api';
import Spinner from './modals/Spinner';

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
            return value ? "no" : "yes";
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
            return value ? "yes" : "no";
        } else if (col === 'due_date') {
            return (new Date(value)).toLocaleDateString();
        } else {    
            return value;
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
        return [
            { path: '/admin/overview', text: 'Overview' },
            { path: '/admin/units', text: 'Units'},
            { path: '/admin/maint', text: 'Maintenance' },
            { path: '/admin/payments', text: 'Payments'},
            { path: '/admin/users', text: 'Users' },
        ];
    }

    getContent() {
        return (
            <div>
                <h1>Overview</h1>
                <h2>Maintenance</h2>
                {this.getMaintTable()}
                <h2>Payments</h2>
                {this.getPaymentTable()}    
                
            </div>
        );
    }

    getMaintTable() {
        if (this.state.maintItems == null) return <Spinner />;

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