import React from 'react';
import axios from 'axios';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, Input } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import Button from '../components/Bootstrap/Button';
import * as api from '../api';
import { Table } from '../components/Table';
import RequestAch from './modals/RequestAch';
import Pane from '../components/Pane';
import Spinner from './modals/Spinner';

class Tenant extends Template {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
        this.paymentTransform = this.paymentTransform.bind(this);
        this.requestRentData = this.requestRentData.bind(this);

        this.rentColumns = [
            { name: 'unitName', label: 'Unit' },
            { name: 'amount', label: 'Amount' },
            { name: 'due', label: 'Due' },
            { name: 'paid', label: 'Paid' },
        ]

        this.state = {
            ownedMaintRequest: '',
            paymentTable: {
                columns: this.rentColumns,
                items: null,
            },
            message: '',
            processingPayment: false,
        };

    }

    componentDidMount() {
        this.requestRentData();
    }


    requestRentData() {
        this.setState({
            paymentTable: {
                columns: this.rentColumns,
                items: null,
            },
            processingPayment: false,
        });
    
        api
            .getAllOwnUnitPayments()
            .then(invoices => {
                this.setState({
                    paymentTable: {
                        columns: this.rentColumns,
                        items: invoices,
                    },
                    processingPayment: false,
                });
            });
    }




    paymentTransform(col, value, item) {
        console.log(item);
        if (col === 'paid') {
            return value ? 'Paid' : 'Unpaid';
        } else if (col === 'amount') {
            return this.formatDollars(value);
        } else if (col === 'due') {
            return new Date(value).toLocaleDateString();
        } else {
            return value;
        }
    }

    /** Formats a number as a dollar amount */
    formatDollars(value) {
        return '$' + parseFloat(value).toFixed(2);
    }

    getNavItems() {
        return this.tenantNavLinks;
    }


    handleChange(event) {
        this.setState({ message: event.target.value });
    }

    getContent() {
        return (
            <Container>
                <Pane>
                    <h3>Invoices</h3>

                    {this.getRentTable()}
                </Pane>
            </Container>
        );
    }

    getRentTable() {
        if (this.state.paymentTable.items === null) return <Spinner />;
        if (this.state.paymentTable.items.length === 0) return <p>You have no payments due.</p>;
        
        console.log(this.state.paymentTable);
        return (
            <Table
                data={this.state.paymentTable}
                transform={this.paymentTransform}
            />
        );
    }

}

export default Tenant;
