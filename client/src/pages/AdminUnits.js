import React from 'react';
// import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import { Select } from '../components/Bootstrap';
import { Table } from '../components/Table';
import * as api from '../api';
import Button from '../components/Bootstrap/Button';
import NewUnit from './modals/NewUnit';
import Spinner from './modals/Spinner';
import FakeAnchor from '../components/FakeAnchor';
import Axios from 'axios';

class AdminUnits extends Template {
    constructor(props) {
        super(props)
        this.state = {
            // unitNames: ['101', '102', '103', '104', '201', '202'],
            // selectedUnit: '103',
            units: [],
            newUnitData: {},
        };

        this.editingUnit = null;

        this.unitColumns = [
            { name: 'unitName', label: 'Unit' },
            { name: 'rate', label: 'Rent' },
            { name: 'users', label: 'Tenant(s)' },
        ];

        this.tableTransform = this.tableTransform.bind(this);
        this.showNewUnitModal = this.showNewUnitModal.bind(this);
        this.onNewUnitSubmit = this.onNewUnitSubmit.bind(this);
        this.requestUnitData = this.requestUnitData.bind(this);
        this.showEditUnitModal = this.showEditUnitModal.bind(this);
        this.onEditUnitSubmit = this.onEditUnitSubmit.bind(this);
    }

    componentDidMount() {
        this.requestUnitData();
    }


    requestUnitData() {
        this.setState({ units: [] });
        api.getUnitList()
            .then(response => {
                this.setState({ units: response.units });
            }).catch(err => {
                console.log(err);
            });
    }

    showNewUnitModal() {
        this.showModal(
            <NewUnit
                onSubmit={this.onNewUnitSubmit}
                initialData={this.state.newUnitData} />
            , "New User"
        );
    }

    showEditUnitModal(unitId) {
        var unit = this.state.units.find(item => item.id === unitId);
        this.editingUnit = unit;

        this.showModal(
            <NewUnit
                edit    
                onSubmit={this.onEditUnitSubmit}
                initialData={{
                    unitName: unit.unitName,
                    rate: unit.rate,
                    user: unit.users[0].id,
                }}
            />, "Edit Unit"
        );

    }


    
    onNewUnitSubmit(data) {
        // this.hideModal();
        // this.showModal(<p>This is where we would make a request to our API</p>, "Cool Beans!");
        this.state.newUnitData = data;
        var newUnitData = { ...data, users: [data.user] };
        this.showModal(<Spinner />, "Working...");
        api
            .createNewUnit(newUnitData)
            .then(response => {
                if (response.error) {
                    this.showModal(
                        <div>
                            <p>There was an error creating the unit:</p>
                            <p>{response.error}</p>
                        </div>,
                        'Error'
                    );
                } else {
                    this.showModal(
                        <p>
                            The unit has been successfully added.
                        </p>,
                        "Unit Added"
                    );
                    this.setState({ newUserData: {} });
                    this.requestUnitData();
                }
            });

        // Save the form data. If there is an error from the server, this allows the user to bring the form back
        // up with the entered data still in there instead of starting from scratch.

        // TODO: reset newUserData upon a success result from the server

    }

    onEditUnitSubmit(data) {
        debugger;
        var id = this.editingUnit.id;
        api.editUnit(id, data)
            .then(result => {
                if (result.error) {
                    this.showModal(<p>There was an error updating the unit data: {result.error.toString()}</p>, 'Error');
                } else {
                    // this.showModal(<p>Your changes have been saved.</p>, 'Saved');
                    this.hideModal();
                    this.requestUnitData();
                }
            });
    }

    tableTransform(col, val, item) {
        if (col == 'unitName') {
            return <FakeAnchor
                onClick={() => { this.showEditUnitModal(item.id) }}
                href='editUnit'>
                {val}
            </FakeAnchor>
        }
        if (col == 'rate') return '$' + val.toFixed(2);
        if (col == 'users') return val.map(user => user.fullname).join(', ');
        return val;
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
        var data = {
            columns: this.unitColumns,
            items: this.state.units,
        };

        return (
            <div>
                <h1>Units</h1>
                {/* <Select
                    items={this.state.unitNames}
                    value={this.state.selectedUnit}
                    onChange={() => { }}
                /> */}
                <Table data={data} transform={this.tableTransform}/>    
                <p />
                <Button onClick={this.showNewUnitModal}>Add New Unit</Button>
            </div>
        );
    }
}

export default AdminUnits;