import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, CheckList, CheckListState } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import { Table } from '../components/Table';
import * as api from '../api';
import Pane from '../components/Pane';
import Button from '../components/Bootstrap/Button';
import Spinner from './modals/Spinner';

class AdminPayments extends Template {
    constructor(props) {
        super(props)
        this.filterOptions = [
            { name: 'paid', label: 'Paid', checked: true },
            { name: 'unpaid', label: 'Unpaid', checked: true },
        ];

        this.paymentColumns = [
            { name: 'unit', label: 'Unit' },
            { name: 'due_date', label: 'Due' },
            { name: 'amount', label: 'Amount' },
            { name: 'paid', label: 'Status' },
        ];

        this.state = {
            filterState: new CheckListState(this.filterOptions),
            paymentItems: [],
            paymentTableNeedsRefresh: false,
        };

    }

    componentDidMount() {
        this.requestPaymentData();
    }

    componentDidUpdate() {
        if (this.state.paymentTableNeedsRefresh) {
            this.requestPaymentData();
        }
    }


    requestPaymentData() {
        let where = {};

        if (this.state.filterState.unpaid) {
            where.paid = false;
        }
        if (this.state.filterState.paid) {
            where.paid = true;
        }
        if (this.state.filterState.paid && this.state.filterState.unpaid) {
            delete where.paid;
        }
        if (!this.state.filterState.paid && !this.state.filterState.unpaid) {
            console.log('neither');
            return this.setState({
                paymentItems: [],
                paymentTableNeedsRefresh: false
            })
        }

        api.getAllPayments(where).then(paymentData => {
            this.setState({
                paymentItems: paymentData,
                paymentTableNeedsRefresh: false
            });            
        });
    }

    paymentTableTransform = (col, value, item) => {
        if (col == 'unit') {
            return item.Unit.unitName;
        } else if (col == 'paid') {
            return value ? 'Paid' : this.get_MarkPaid_button(item);
        } else if (col == 'due_date') {
            return new Date(value).toLocaleDateString();
        }
        return value;
    }

    get_MarkPaid_button = (item) => {
        var id = item.id;
        return (
            <Button
                onClick={(e) => {this.markPaid(id)}}    
                >
                Mark Paid
            </Button>
        );
    }

    markPaid = (id) => {
        api.markPaymentPaid(id)
            .then(() => {
                this.requestPaymentData();
            }).catch(console.error);
    }

    getNavItems() {
        return this.adminNavLinks;
    }

    getContent() {
        return (
            <Container>
                <Pane size='12'>
                    <h3>Payments</h3>
                    <CheckList
                        inline
                        items={this.filterOptions}
                        state={this.state.filterState}
                        onChange={state =>
                            this.setState({
                                filterState: state,
                                paymentTableNeedsRefresh: true,
                                paymentItems: null,
                            })
                        }
                    />
                    {this.getPaymentTable()}
                </Pane>
            </Container>
        );
    }

    getPaymentTable() {
        if (this.state.paymentItems === null) return <Spinner />;
        if (this.state.paymentItems.length === 0) return <p>There are no payments to display.</p>;

        var data = {
            columns: this.paymentColumns,
            items: this.state.paymentItems,
        };

        return (<Table
            data={data}
            transform={this.paymentTableTransform}
        />);
    }

}
    
export default AdminPayments;