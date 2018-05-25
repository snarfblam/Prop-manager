import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './pages/Landing';
import AdminOverview from './pages/AdminOverview';
import AdminUnits from './pages/AdminUnits';
import AdminMaint from './pages/AdminMaint';
import AdminPayments from './pages/AdminPayments';
import AdminUsers from './pages/AdminUsers';
import Tenant from './pages/Tenant';
import TenantPayments from './pages/TenantPayments';
import NotFound from './pages/NotFound';
import TenantActivate from './pages/TenantActivate';
import { Modal, ModalState } from './components/Modal';
import * as api from './api';
import Axios from 'axios';
import TenantVerifyACH from './pages/TenantVerifyACH';
import TenantAccount from './pages/TenantAccount';

var knownRoles = ['logged out', 'tenant', 'admin'];
function toKnownRole(role) {
    if (knownRoles.includes(role)) return role;
    return knownRoles[0];
}


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: new ModalState(false, null, "Hi, I'm a modal"),
            role: '',
            user: null,
        };
    }

    getUser() {
        return this.state.user;
    }
    componentDidMount() {
        api
            .getUserStatus()
            .then(response => {
                this.setState({
                    role: toKnownRole(response.status),
                    user: response,
                });
            });
    }

    onLoginClicked() {
        this.setState({
            modal: this.state.modal.show((
                <div>modal test </div>
            ), "Login"),
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                <Switch>    
                    <Route exact path='/' render={(props) => this.renderLanding(props)} />
                    <Route exact path='/admin/overview' render={(props) => this.renderPage(AdminOverview, props)} />
                    <Route exact path='/admin/units' render={(props) => this.renderPage(AdminUnits, props)} />
                    <Route exact path='/admin/maint' render={(props) => this.renderPage(AdminMaint, props)} />
                    <Route exact path='/admin/payments' render={(props) => this.renderPage(AdminPayments, props)} />
                    <Route exact path='/admin/users' render={(props) => this.renderPage(AdminUsers, props)} />
                    <Route path='/tenant/activate/:code' render={(props) => this.renderPage(TenantActivate, props)} />
                    <Route path='/tenant/verifyach/' render={(props) => this.renderPage(TenantVerifyACH, props)} />
                    <Route exact path='/tenant' render={(props) => this.renderPage(Tenant, props)} />
                    <Route exact path='/tenant/payments' render={(props) => this.renderPage(TenantPayments, props)} />
                    <Route exact path='/tenant/account' render={(props) => this.renderPage(TenantAccount, props)} />
                    <Route path='*' render={(props) => this.renderPage(NotFound, props)} />
                </Switch>
                    <Modal state={this.state.modal} onRequestClose={() => this.setState({ modal: this.state.modal.hide() })} />
                </div>
            </BrowserRouter>
        );
    }

    renderLanding(props) {
        if (this.state.role == 'admin') {
            return this.renderPage(AdminOverview, props);
        } else if (this.state.role == 'tenant') {
            return this.renderPage(Tenant, props);
        } else if (this.state.role == 'logged out') {
            return this.renderPage(Landing, props);
        } else {
            return <div />
        }
    }

    renderPage(Page, props) {
        var match = (props || {}).match || null;
        return (
            <Page
                showModal={
                    (content, title) => {
                        this.setState({
                            modal: this.state.modal.show(content, title),
                        });
                    }
                }
                hideModal={() =>
                    this.setState({ modal: this.state.modal.hide() })
                }
                match={match}
                loggedAs={this.state.role}
                user={this.state.user}
                onLogOut={() => {
                    Axios.post('/auth/logout', {}).then(() => {
                        this.setState({ role: 'logged out' });
                    });
                }}
            />
        );
    }
}

export default App;
