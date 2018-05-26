import React from 'react';
import Template from './Template';
import './page.css'
import { Select, Container, Col, Row } from '../components/Bootstrap';
import { Table } from '../components/Table';
import Button from '../components/Bootstrap/Button';
import NewUser from './modals/NewUser/NewUser';
import Spinner from './modals/Spinner'
import * as api from '../api';
import Pane from '../components/Pane';

class AdminUsers extends Template {
    constructor(props) {
        super(props)
        this.state = {
            userList: null,
            selectedUserId: '0', // should correspond to a userList value
            newUserData: {}, // Temporarily store new-user-form data so we can re-populate the form on the modal if there is an error
        };

        this.cachedUsers = { "0": {}};
        this.onNewUserSubmit = this.onNewUserSubmit.bind(this);
        this.showNewUserModal = this.showNewUserModal.bind(this);
    }

    componentDidMount() {
        this.getUserList();
    }

    getActivationUrl(user) {
        if (!user.activationCode) return null;

        var port = (window.location.port == 80) ? '' : (':' + window.location.port.toString()); // get port only if not default

        return 'http://' + window.location.hostname + port + '/tenant/activate/' + user.activationCode;
    }

    getUserList() {
        api.getUserList()
            .then(userlist => {
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
            });
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

                this.getUserList();
            });


    }

    getNavItems() {
        return this.adminNavLinks;
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
        var activateUrl = this.getActivationUrl(displayedUser);
        var activateElement = activateUrl ? <p>Activation url: {activateUrl}</p> : null;

        var data = {
            columns: [
                { name: 'name', label: 'Name' },
                { name: 'value', label: 'Value' },
            ],
            items: displayedItems,
        };

        return (
            <Container>
                <Pane>
                    <h3>Users</h3>
                    {(this.state.userList == null) ? (
                        <Spinner />
                    ): (
                        <div>
                            <Container><Row className='row justify-content-center'><Col size='12 sm-8 md-6'>
                                <Select items={this.state.userList} value={this.state.selectedUserId} onChange={(e) => { this.setState({ selectedUserId: e.target.value }) }} />
                            </Col></Row></Container>
                            <Table data={data} />
                            {activateElement}
                            <hr />
                            <Button onClick={this.showNewUserModal}>Create New User </Button>
                        </div>      
                    )}
                </Pane>
            </Container>
        );
    }

}

export default AdminUsers;