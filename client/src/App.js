import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './pages/Landing';
import AdminOverview from './pages/AdminOverview';
import AdminUnits from './pages/AdminUnits';
import AdminMaint from './pages/AdminMaint';
import AdminPayments from './pages/AdminPayments';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import Tenant from './pages/Tenant';
import TenantPayments from './pages/TenantPayments';
import TenantActivate from './pages/TenantActivate';
import TenantVerifyACH from './pages/TenantVerifyACH';
import TenantAccount from './pages/TenantAccount';
import NotFound from './pages/NotFound';

import { Modal, ModalState } from './components/Modal';
import Axios from 'axios';
import * as api from './api';
import Spinner from './pages/modals/Spinner';

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
                document.title = response.appTitle || document.title;
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
        if(!this.state.role) return <div className='text-center'><Spinner /></div>
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
                    <Route exact path='/admin/settings' render={(props) => this.renderPage(AdminSettings, props)} />
                    <Route path='/tenant/activate/:code' render={(props) => this.renderPage(TenantActivate, props)} />
                    <Route path='/tenant/verifyach/' render={(props) => this.renderPage(TenantVerifyACH, props)} />
                    <Route exact path='/tenant' render={(props) => this.renderPage(Tenant, props)} />
                    <Route exact path='/tenant/payments' render={(props) => this.renderPage(TenantPayments, props)} />
                    <Route exact path='/tenant/account' render={(props) => this.renderPage(TenantAccount, props)} />
                    <Route path='*' render={(props) => this.renderPage(NotFound, props)} status={404} />
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
                    (content, title, fixed) => {
                        this.setState({
                            modal: this.state.modal.show(content, title, fixed || false), // fixed should be false, not undefined, to overide previous value
                        });
                    }
                }
                hideModal={() =>
                    this.setState({ modal: this.state.modal.hide() })
                }
                match={match}
                loggedAs={this.state.role}
                user={this.state.user}
                bannerText={(this.state.user || {}).bannerText || null}
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
