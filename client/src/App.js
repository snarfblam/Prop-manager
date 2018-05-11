import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import AdminOverview from './pages/AdminOverview';
import AdminUnits from './pages/AdminUnits';
import AdminMaint from './pages/AdminMaint';
import AdminPayments from './pages/AdminPayments';
import AdminUsers from './pages/AdminUsers';
import Tenant from './pages/Tenant';
import TenantActivate from './pages/TenantActivate';
import { Modal, ModalState } from './components/Modal';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: new ModalState(false, null, "Hi, I'm a modal"),
        };
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
                    <Route exact path='/' render={() => this.renderPage(Landing)} />
                    <Route exact path='/admin/overview' render={() => this.renderPage(AdminOverview)} />
                    <Route exact path='/admin/units' render={() => this.renderPage(AdminUnits)} />
                    <Route exact path='/admin/maint' render={() => this.renderPage(AdminMaint)} />
                    <Route exact path='/admin/payments' render={() => this.renderPage(AdminPayments)} />
                    <Route exact path='/admin/users' render={() => this.renderPage(AdminUsers)} />
                    <Route exact path='/tenant' render={() => this.renderPage(Tenant)} />
                    <Route exact path='/tenant/activate' render={() => this.renderPage(TenantActivate)} />

                    {console.log("app", this.state.modal)}
                    <Modal state={this.state.modal} onRequestClose={() => this.setState({ modal: this.state.modal.hide() })} />
                </div>
            </BrowserRouter>
        );
    }

    renderPage(Page) {
        return (
            <Page
                showModal={
                    (content, title) => {
                        this.setState({
                            modal: this.state.modal.show(content, title),
                        });
                     }
                }
            />
        );
    }
}

export default App;
