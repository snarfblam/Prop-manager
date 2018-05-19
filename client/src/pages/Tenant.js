import React from 'react';
import axios from 'axios';
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
      
        this.payRentWithCreditCard = this.payRentWithCreditCard.bind(this);
        this.submitMaintenanceRequest =this.submitMaintenanceRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.paymentTransform = this.paymentTransform.bind(this);
        this.maintRequestTransform = this.maintRequestTransform.bind(this);

        this.rentColumns = [
            { name: 'unitName', label: 'Unit' },
            { name: 'amount', label: 'Amount' },
            { name: 'due', label: 'Due' },
            { name: 'payButton', label: 'Pay' },
        ]
        this.maintRequestColumns = [
            { name: 'message', label: 'Message' },
            { name: 'status', label: 'Status' }
        ]

        this.state = {
            ownedMaintRequest: '',
            paymentTable: {
                columns: this.rentColumns,
                items: [],
            },
            totalDue: 0,
            message: '',
            maintTable: {
                columns: this.maintRequestColumns,
                items: []
            }
        };

    }

    componentDidMount() {
        axios.get('/api/getOwnMaintRequest', function(maintRequest) {
            this.setState({ownedMaintRequest: maintRequest});
        });
    
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
        api.getOwnMaintRequest().then(maintRequests => {
            this.setState({
                maintTable: {
                    columns: this.maintRequestColumns,
                    items: maintRequests
                }
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
        token.paymentIDs = [1, 2, 3];
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
        .catch(function (error) {
            console.log(error);
        });
      }

    /**
     * Converts values from this.state.paymentTable to JSX
     * @param {*} col - column name
     * @param {*} value - column value
     * @param {*} item - item being displayed
     */
    maintRequestTransform (col,value,item) {
        if (col == 'message') {
            return value
        } else if (col == 'status') {
            if (value) {
                return value = "Open"
            } else {
                return value = "Completed"
            }            
        } 
    }
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
        return '$' + parseFloat(value).toFixed(2);
    }

    getNavItems() {
        return [
            { path: '/tenant', text: 'Home' },
            { path: '/tenant', text: 'Pay Rent' },
            { path: '/tenant', text: 'Request Maintenance' },
        ];
    }


    handleChange(event) {
        this.setState({message: event.target.value});
    }
    
    submitMaintenanceRequest(event) {
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        
        axios.post('/api/postMaintRequest', {
            message: this.state.message
        }).then(function(resMaint) { 
            console.log("Post Maintenance Request works!");
        });
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
                <form>
                  <label>
                      What is Wrong ?
                      <input type="text" value={this.state.message} onChange={this.handleChange} />
                  </label>                            
                 <Button onClick={this.submitMaintenanceRequest}>Request Maintenance</Button>
              </form>
                <Table
                    data={this.state.maintTable}
                    transform={this.maintRequestTransform}
                />            
            </div>
        );
    }
}

export default Tenant;