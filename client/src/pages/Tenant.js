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

declare var StripeCheckout;

class Tenant extends Template {
    constructor(props) {
        super(props)

        this.payRentWithCreditCard = this.payRentWithCreditCard.bind(this);
        this.submitMaintenanceRequest = this.submitMaintenanceRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.paymentTransform = this.paymentTransform.bind(this);
        this.maintRequestTransform = this.maintRequestTransform.bind(this);
        this.paymentCheckChanged = this.paymentCheckChanged.bind(this);
        this.requestRentData = this.requestRentData.bind(this);

        this.rentColumns = [
            { name: 'unitName', label: 'Unit' },
            { name: 'amount', label: 'Amount' },
            { name: 'due', label: 'Due' },
            { name: 'payButton', label: 'Pay' },
        ]
        this.maintRequestColumns = [
            { name: 'message', label: 'Message' },
            { name: 'status', label: 'Status' },
            { name: 'createdAt', label: 'Date Submited'}
        ]

        this.state = {
            ownedMaintRequest: '',
            paymentTable: {
                columns: this.rentColumns,
                items: [],
            },
            checkedPaymentIds: [], // : number[]
            totalDue: 0,
            message: '',
            maintTable: {
                columns: this.maintRequestColumns,
                items: []
            },
            processingPayment: false,
        };

    }

    componentDidMount() {
        this.requestRentData();
        this.requestMaintData();
    }

    requestMaintData() {
        api.getOwnMaintRequest().then(maintRequests => {
            this.setState({
                maintTable: {
                    columns: this.maintRequestColumns,
                    items: maintRequests
                }
            });
        });
    }

    requestRentData() {
        this.setState({
            paymentTable: {
                columns: this.rentColumns,
                items: [],
            },
            totalDue: 0,
            checkedPaymentIds: [],
            processingPayment: false,
        });
    
        api
            .getRentDue()
            .then(invoices => {
                var totalDue = invoices.reduce((acc, item) => acc + item.amount, 0);
                var checkedPayments = invoices.map(invoice => invoice.id);

                this.setState({
                    paymentTable: {
                        columns: this.rentColumns,
                        items: invoices,
                    },
                    totalDue: totalDue,
                    checkedPaymentIds: checkedPayments,
                    processingPayment: false,
                });
            });
        // api.getOwnMaintRequest().then(maintRequests => {
        //     this.setState({
        //         maintTable: {
        //             columns: this.maintRequestColumns,
        //             items: maintRequests
        //         }
        //     });
        // });
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

    requestACH = (data) => {
        api.setupACH(data)
            .then(response => {
                if (response.result == 'success') {
                    this.showModal(<p>Your account details have been submitted. An email will be sent with instructions to verify the account.</p>, "Account Submitted");
                } else {
                    console.log(response.result.error || 'setupACH returned an unexpected value');
                    this.showModal(<p>There was an error submitting your account information.</p>, "Error");
                }
            });
    }

    payRentWithACH = (ev) => {
        api.payACH()
            .then(response => {
                if (response.result == 'paid') {
                    this.showModal(<p>Your payment has been submitted via ACH.</p>, 'Payment Submitted');
                } else if (response.result == 'needs verification') {
                    this.showModal(<p>Your account has not been verified. Please see the email that was sent when you requested ACH service.</p>, 'ACH Not Verified');
                } else if (response.result == 'needs setup') {
                    this.showModal(<RequestAch onRequestAch={this.requestACH} />, 'Request ACH Service');
                } else {
                    this.showModal(<p>There was an error submitting the request. Please contact your property manager for more information.</p>, 'Error');
                }
            });
    }
    

    handleTokenCard = (token) => {
        token.invoiceList = this.state.checkedPaymentIds;

        this.setState({ processingPayment: true });

        axios.post("/api/submitPayment", token)
            .then(response => {
                var output = response.data;
                
                console.log(output);

                this.requestRentData(); // Refresh rent due table
                if (output.status === "succeeded") {
                    console.log("successful payment");
                    this.showModal(<p>Your payments has been submitted.</p>, "Payment");
                } else {
                    throw Error('')
                }
            }).catch(error => {
                console.log(error);

                this.requestRentData();
                this.showModal(<p>There was an error with your payment.</p>, "Error");
        });
    }

    paymentCheckChanged(event) {
        var checked = event.target.checked || false;
        var id = parseInt(event.target.name);

        var checkedIds = this.state.checkedPaymentIds.slice();

        if (checked) { // Ensure it's in the list
            if (!this.state.checkedPaymentIds.includes(id)) {
                checkedIds.push(id);
            }
        } else { // Ensure it's NOT in the list
            var indexOf = checkedIds.indexOf(id);
            if (indexOf >= 0) checkedIds.splice(indexOf, 1);
        }

        var selectedPayments =
            this.state.paymentTable.items.filter(item => checkedIds.includes(item.id));

        this.setState({
            checkedPaymentIds: checkedIds,
            totalDue: selectedPayments.reduce((total, item) => total + item.amount, 0)
        });
    }

    getSelectedPayments() {
        var allShownPayments = this.state.paymentTable.items.slice();
        var allCheckedPayments = allShownPayments.filter(payment => this.state.checkedPaymentIds.includes(payment.id));

        return allCheckedPayments;
    }

    /**
     * Converts values from this.state.paymentTable to JSX
     * @param {*} col - column name
     * @param {*} value - column value
     * @param {*} item - item being displayed
     */
    maintRequestTransform (col,value,item) {
        if (col === 'message') {
            return value
        } else if (col === 'status') {
            if (value) {
                return value = "Open"
            } else {
                return value = "Completed"
            }            
        } else if (col === 'createdAt') {
            return new Date(value).toLocaleDateString();
        } 
    }
     paymentTransform(col, value, item) {
        if (col === 'payButton') {
            return <input
                type='checkbox'
                checked={this.state.checkedPaymentIds.includes(item.id)}
                onChange={this.paymentCheckChanged}
                disabled={this.state.processingPayment}
                name={item.id}
            />;
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

    submitMaintenanceRequest(event) {
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();

        axios.post('/api/postMaintRequest', {
            message: this.state.message
        }).then((resMaint) => {
            console.log("Post Maintenance Request works!");
            this.requestMaintData();        
        });
        this.setState({ message: '' });                          
    }


    getContent() {
        return (
            <Container>
                <Pane>
                    <h3>Rent Due</h3>

                    <Table
                        data={this.state.paymentTable}
                        transform={this.paymentTransform}
                    />
                    <hr />
                    <p>
                        Total:  <span className='rent-amount'>{this.formatDollars(this.state.totalDue || 0)}</span>
                        <br />
                        <Button
                            disabled={this.state.processingPayment || (this.state.totalDue === 0)}
                            onClick={this.payRentWithCreditCard}
                        >
                            Pay by card
                        </Button>
                        &emsp;
                        <Button
                            disabled={this.state.processingPayment || (this.state.totalDue === 0)}
                            onClick={this.payRentWithACH}
                        >
                            Pay by ACH
                        </Button>
                    </p>
                </Pane>
                <Pane>
                    <h3>Maintenance Requests</h3>
                    <form>
                        <label>
                            Please explain your request for maintenance:
                            <br></br>
                            <Input type="text" value={this.state.message} onChange={this.handleChange} />
                        </label>
                        <br></br>
                        <Button onClick={this.submitMaintenanceRequest}>Request Maintenance</Button>
                    </form>
                    <hr></hr>
                    {this.getMaintTable()}
                </Pane>    
            </Container>
        );
    }

    getMaintTable() {
        if (this.state.maintTable.items === null) return <Spinner />;
        if (this.state.maintTable.items.length === 0) return <p>You have no open maintenance items.</p>;
        return (
            <Table
                data={this.state.maintTable}
                transform={this.maintRequestTransform}
            />
        );
    }
}

export default Tenant;
