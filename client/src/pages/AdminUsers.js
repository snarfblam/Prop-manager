import React from 'react';
import Template from './Template';
import './page.css'
import { Select } from '../components/Bootstrap';
import { Table } from '../components/Table';
import Button from '../components/Bootstrap/Button';
import NewUser from './modals/NewUser/NewUser';
import Spinner from './modals/Spinner'

class AdminUsers extends Template {
    constructor(props) {
        super(props)
        this.state = {
            userList: [
                { value: 'would be an id 1', text: 'Anthony' },
                { value: 'would be an id 2', text: 'Don' },
                { value: 'would be an id 3', text: 'Clark' },
            ],
            selectedUserId: 'would be an id 2', // should correspond to a userList value
            newUserData: {},
        };

        this.onNewUserSubmit = this.onNewUserSubmit.bind(this);
    }

    onNewUserSubmit(data) {
        // this.hideModal();
        // this.showModal(<p>This is where we would make a request to our API</p>, "Cool Beans!");
        this.showModal(<Spinner />, "Working...");

        // Save the form data. If there is an error from the server, this allows the user to bring the form back
        // up with the entered data still in there instead of starting from scratch.
        
        this.state.newUserData = data;
        // TODO: reset newUserData upon a success result from the server
        
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
            columns: [
                { name: 'name', label: 'Name' },
                { name: 'value', label: 'Value' },
            ],
            items: [
                { name: 'Name', value: 'Don' },
                { name: 'Email', value: 'don@gmail.com' },
                { name: 'Address', value: 'Street Lane Drive' },
                { name: 'City', value: 'Portsmouth NH 03804' },
                { name: 'Unit(s)', value: '103' },
                { name: 'Auth Type', value: 'Google' },
            ]
        };

        return (
            <div>
                <h1>Users</h1>
                <Select items={this.state.userList} value={this.state.selectedUserId} onChange={(e) => { this.setState({ selectedUserId: e.target.value }) }} />
                <h3>Information</h3>
                <Table data={data} />
                <hr />
                <Button onClick={() => this.props.showModal(
                    <NewUser onSubmit={this.onNewUserSubmit} initialData={ this.state.newUserData} />, "New User" 
                )}>Create New User </Button>
            </div>
        );
    }
}

export default AdminUsers;