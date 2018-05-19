import React from 'react';
import Template from './Template';
import './page.css'
import { Select } from '../components/Bootstrap';
import { Table } from '../components/Table';
import Button from '../components/Bootstrap/Button';
import NewUser from './modals/NewUser/NewUser';
import Spinner from './modals/Spinner'
import * as api from '../api';

class AdminUsers extends Template {
    constructor(props) {
        super(props)
        this.state = {
            userList: [
                { value: '0', text: 'Loading' },
            ],
            selectedUserId: '0', // should correspond to a userList value
            newUserData: {}, // Temporarily store new-user-form data so we can re-populate the form on the modal if there is an error
        };

        this.cachedUsers = { "0": {}};
        this.onNewUserSubmit = this.onNewUserSubmit.bind(this);
        this.showNewUserModal = this.showNewUserModal.bind(this);
    }

    componentDidMount() {
        api.getUserList()
            .then(userlist => {
                console.log(userlist);
                this.cachedUsers = {};
                userlist.forEach(user => this.cachedUsers[user.id] = user);
                var newUserSelectionList = userlist.map(user => ({ value: user.id, text: user.fullname }));
                var selectedUserId = userlist[0].id;

                this.setState({
                    userList: newUserSelectionList,
                    selectedUserId: selectedUserId,
                })
            }).catch(err => {
                console.log(err);
            })
    }

    showNewUserModal() {
        this.props.showModal(
            <NewUser
                onSubmit={this.onNewUserSubmit}
                initialData={this.state.newUserData} />
            , "New User"
        );
    }

    onNewUserSubmit(data) {
        // this.hideModal();
        // this.showModal(<p>This is where we would make a request to our API</p>, "Cool Beans!");
        this.state.newUserData = data;
        this.showModal(<Spinner />, "Working...");
        api
            .createNewUser(data)
            .then(response => {
                if (response.error || !response.activationCode) {
                    this.showModal(
                        <div>
                            <p>There was an error creating the user:</p>
                            <p>{response.error}</p>
                        </div>,
                        'Error'
                    );
                } else {
                    var port = (window.location.port == 80) ? '' : (':' + window.location.port.toString()); // get port only if not default

                    var activateUrl = 'http://' + window.location.hostname + port + '/tenant/activate/' + response.activationCode;
                    this.showModal(
                        <p>
                            The user account was created. The user can activate the account at: {activateUrl}
                        </p>,
                        "User Created"
                    );
                    this.setState({ newUserData: {} });
                }
            });

        // Save the form data. If there is an error from the server, this allows the user to bring the form back
        // up with the entered data still in there instead of starting from scratch.

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
        var displayedUser = this.cachedUsers[this.state.selectedUserId];
        var displayedItems = displayedUser ? [
            { name: 'Account Type', value: displayedUser.role },
            { name: 'Name', value: displayedUser.fullname },
            { name: 'Email', value: displayedUser.email },
            { name: 'Phone', value: displayedUser.phone },
            { name: 'Address', value: displayedUser.address },
            { name: 'City', value: `${displayedUser.city} ${displayedUser.state} ${displayedUser.zip}` },
            // { name: 'Unit(s)', value:  displayedUser.},
            { name: 'Auth Type', value: displayedUser.authtype },
        ] : [];

        var data = {
            columns: [
                { name: 'name', label: 'Name' },
                { name: 'value', label: 'Value' },
            ],
            items: displayedItems,
        };

        return (
            <div>
                <h1>Users</h1>
                <Select items={this.state.userList} value={this.state.selectedUserId} onChange={(e) => { this.setState({ selectedUserId: e.target.value }) }} />
                <h3>Information</h3>
                <Table data={data} />
                <hr />
                <Button onClick={this.showNewUserModal}>Create New User </Button>
            </div>
        );
    }
}

export default AdminUsers;