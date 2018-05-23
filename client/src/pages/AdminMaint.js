import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, CheckList, CheckListState } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import { Table } from '../components/Table';
import Button from '../components/Bootstrap/Button';
import Fas from '../components/Fas';
import * as api from '../api';

class AdminMaint extends Template {
    constructor(props) {
        super(props)

        this.filterOptions = [
            {name: 'complete', label: 'Completed',  },
            {name: 'incomplete', label: 'Not Completed', checked: true}, 
        ];
        this.maintRequestColumns = [
            { name: 'message', label: 'Message' },
            { name: 'unit', label: 'Unit' },
            { name: 'createdAt', label: 'Date Submited'},
            { name: 'status', label: 'Status'}
        ] 

        this.state = {
            filterState: new CheckListState(this.filterOptions),
            maintTable: {
                columns: this.maintRequestColumns,
                items: []
            },
            maintTableNeedsToRefeash: false
        };

    }
    componentDidMount() {        
        this.requestMaintData();
    }
    componentDidUpdate() {
        if (this.state.maintTableNeedsToRefeash) {
            this.requestMaintData();
        }
    }

    completeMaintItem = (id) => {
        api
            .completeMaintRequest(id)
            .then(response => {
                this.requestMaintData(); // refresh table here
        })
    }

        /**
     * Converts values from this.state.paymentTable to JSX
     * @param {*} col - column name
     * @param {*} value - column value
     * @param {*} item - item being displayed
     */
    maintRequestTransform = (col,value,item) => {
        var ackButton = <Button onClick={() => this.completeMaintItem(item.id)}><Fas icon='check' />&emsp;Done</Button>
        if (col == 'message') {
            return value
        } else if (col === 'unit') {
            return item.Unit.unitName;
        } else if (col == 'status') {
            if (value) {
                return ackButton // value = "Open"                
            } else {
                return value = "Completed"
            }  
        } else if (col== 'createdAt') {
            return new Date(value).toLocaleDateString();
        } 
    }
    
    requestMaintData() {
        let where = {};
        
        console.log("THis is the  Check box State", this.state.filterState)
        if (this.state.filterState.complete) {
            where.open = false;
        } 
        if (this.state.filterState.incomplete) {
            where.open = true;
        }
        if (this.state.filterState.incomplete && this.state.filterState.complete ) {
           delete where.open;
        }
        if (!this.state.filterState.incomplete && !this.state.filterState.complete) {
            return this.setState({
                maintTable: {
                    columns: this.maintRequestColumns,
                    items: []
                },
                maintTableNeedsToRefeash: false
            })
        }

        console.log("Where obj", where)
        api.getAllMaintRequests(where).then(maintRequests => {
            this.setState({
                maintTable: {
                    columns: this.maintRequestColumns,
                    items: maintRequests
                },
                maintTableNeedsToRefeash: false
            });
        });
    }

    getNavItems() {
        return [
            { path: '/admin/overview', text: 'Overview' },
            { path: '/admin/units', text: 'Units' },
            { path: '/admin/maint', text: 'Maintenance' },
            { path: '/admin/payments', text: 'Payments' },
            { path: '/admin/users', text: 'Users' },
        ];
    }
    

    getContent() {

        // var data = {
        //     columns: [
        //         { name: 'unit', label: 'Unit' },
        //         { name: 'date', label: 'Date' },
        //         { name: 'message', label: 'Message' },
        //         { name: 'status', label: '' },
        //     ],
        //     items: [
        //         { unit: 103, date: '5/10/2018', message: 'Just saying hi!', status: ackButton },
        //         { unit: 101, date: '5/8/2018', message: 'heater is on fire, please send help', status: ackButton },
        //         { unit: 102, date: '4/29/2018', message: 'roof is leaking, documents ruined, electronics destroyed, seeking compensation. lawsuit pending, please await legal correspondence.', status: ackButton }
        //     ]
        // };

        return (
            <div>
                <h2>Maintenance Requests</h2>
                <CheckList 
                    items={this.filterOptions}
                    state={this.state.filterState}
                    inline
                    onChange={newState => {
                        
                        this.setState({
                        filterState: newState,
                        maintTableNeedsToRefeash: true
                    })}}
                />    
                {/* <Table data={this.state.maintTable} /> */}
                <Table data={this.state.maintTable} transform={this.maintRequestTransform} />  
            </div>
        );
    }
}

export default AdminMaint;