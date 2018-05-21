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
import NotFound from './pages/NotFound';
import TenantActivate from './pages/TenantActivate';
import { Modal, ModalState } from './components/Modal';
import * as api from './api';
import Axios from 'axios';

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
        };
    }

    componentDidMount() {
        api
            .getUserStatus()
            .then(response => {
                this.setState({
                    role: toKnownRole(response.status),
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
                    <Route exact path='/' render={() => this.renderLanding()} />
                    <Route exact path='/admin/overview' render={() => this.renderPage(AdminOverview)} />
                    <Route exact path='/admin/units' render={() => this.renderPage(AdminUnits)} />
                    <Route exact path='/admin/maint' render={() => this.renderPage(AdminMaint)} />
                    <Route exact path='/admin/payments' render={() => this.renderPage(AdminPayments)} />
                    <Route exact path='/admin/users' render={() => this.renderPage(AdminUsers)} />
                    <Route path='/tenant/activate/:code' render={(props) => this.renderPage(TenantActivate, props)} />
                    <Route exact path='/tenant' render={() => this.renderPage(Tenant)} />
                    <Route path='*' render={() => this.renderPage(NotFound)} />
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
