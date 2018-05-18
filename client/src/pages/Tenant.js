import React from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import Button from '../components/Bootstrap/Button';
import * as api from '../api';
import { Table } from '../components/Table';

declare var StripeCheckout;


class Tenant extends Template {
    constructor(props) {
        super(props)

        this.rentColumns = [
            { name: 'unitName', label: 'Unit' },
            { name: 'amount', label: 'Amount' },
            { name: 'due', label: 'Due' },
            { name: 'payButton', label: 'Pay' },
        ]

        this.state = {
            paymentTable: {
                columns: this.rentColumns,
                items: [],
            },
            totalDue: 0,
        };

        this.payRentWithCreditCard = this.payRentWithCreditCard.bind(this);
        this.paymentTransform = this.paymentTransform.bind(this);
    }

    componentDidMount() {
        api
            .getRentDue()
            .then(invoices => {
                var totalDue = invoices.reduce((acc, item) => acc + item.amount, 0);
                this.setState({
                    paymentTable: {
                        columns: this.rentColumns,
                        items: invoices,
                    },
                    totalDue: totalDue,
                });
            });
    }

    payRentWithCreditCard = (ev) => {
        var checkoutHandler = StripeCheckout.configure({
            key: "pk_test_edJT25Bz1YVCJKIMvmBGCS5Y",
            locale: "auto"
        });

        checkoutHandler.open({
            name: "132 Chapel St. LLC",
            description: "Rent Payment",
            token: this.handleTokenCard
        });
    }

    handleTokenCard = (token) => {
        fetch("/api/submitPayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(token)
        })
            .then(output => {
                if (output.status === "succeeded") {
                    console.log("successful payment");
                }
            })
    }

    /**
     * Converts values from this.state.paymentTable to JSX
     * @param {*} col - column name
     * @param {*} value - column value
     * @param {*} item - item being displayed
     */
    paymentTransform(col, value, item) {
        if (col == 'payButton') {
            return <Button>Pay</Button>;
        } else if (col == 'amount') {
            return this.formatDollars(value);
        } else if (col == 'due') {
            return new Date(value).toLocaleDateString();
        } else {
            return value;
        }
    }

    /** Formats a number as a dollar amount */
    formatDollars(value) {
        console.log(value, '<--', typeof value);
        return '$' + parseFloat(value).toFixed(2);
    }

    getNavItems() {
        return [
            { path: '/tenant', text: 'Home' },
            { path: '/tenant', text: 'Pay Rent' },
            { path: '/tenant', text: 'Request Maintenance' },
        ];
    }

    getContent() {
        return (
            <div>
                <h3>Rent Due</h3>
                <p>
                    Total:  <span className='rent-amount'>{this.formatDollars(this.state.totalDue || 0)}</span>
                    <br />
                    <Button
                        onClick={this.payRentWithCreditCard}
                    >
                        Pay Now
                    </Button>

                </p>

                <Table
                    data={this.state.paymentTable}
                    transform={this.paymentTransform}
                />

                <h3>Maintenance Requests</h3>
                <p>[request table here]</p>
                <Button>Request Maintenance</Button>

            </div>
        );
    }
}

export default Tenant;