import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, CheckList, CheckListState } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import { Table } from '../components/Table';
import Button from '../components/Bootstrap/Button';
import Fas from '../components/Fas';
import * as api from '../api';
import Pane from '../components/Pane';
import Spinner from './modals/Spinner';

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
                items: null,
            },
            maintTableNeedsToRefresh: false
        };

    }
    componentDidMount() {        
        this.requestMaintData();
    }
    componentDidUpdate() {
        if (this.state.maintTableNeedsToRefresh) {
            this.requestMaintData();
        }
    }

    changeStatusMaintRequest = (id, value) => {
        api
            .changeStatusMaintRequest(id, value)
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
        const buttonStyle = {marginLeft: '5px'};
        var ackButtonDone = <Button style={buttonStyle} onClick={() => this.changeStatusMaintRequest(item.id, false)}><Fas icon='check' />&emsp;Mark Done</Button>
        var ackButtonUncompleted = <Button style={buttonStyle} onClick={() => this.changeStatusMaintRequest(item.id, true)}><Fas icon='check' />&emsp;Mark Uncompleted</Button>
        if (col == 'message') {
            return value
        } else if (col === 'unit') {
            return item.Unit.unitName;
        } else if (col == 'status') {
            if (value) {
                return ["Open", ackButtonDone ] // value = "Open"                
            } else {
                return ["Completed", ackButtonUncompleted] //value = "Completed"
            }  
        } else if (col== 'createdAt') {
            return new Date(value).toLocaleDateString();
        } 
    }
    
    requestMaintData() {
        let where = {};
        
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
                maintTableNeedsToRefresh: false
            })
        }

        api.getAllMaintRequests(where).then(maintRequests => {
            this.setState({
                maintTable: {
                    columns: this.maintRequestColumns,
                    items: maintRequests
                },
                maintTableNeedsToRefresh: false
            });
        });
    }

    getNavItems() {
        return this.adminNavLinks;
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
            <Container>
                <Pane size='12'>
                    <h3>Maintenance Requests</h3>
                    <CheckList 
                        items={this.filterOptions}
                        state={this.state.filterState}
                        inline
                        onChange={newState => this.setState({
                          filterState: newState,
                          maintTableNeedsToRefresh: true
                        })}
                    />    
                    {/* <Table data={this.state.maintTable} /> */}
                    {this.getMaintTable()}
                </Pane>    
            </Container>
        );
    }

    getMaintTable() {
        if (this.state.maintTable.items == null) return <Spinner />;
        if (this.state.maintTable.items.length === 0) return <p>No items to display</p>;
        return <Table data={this.state.maintTable} transform={this.maintRequestTransform} />;
    }
}

export default AdminMaint;