import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import AdminOverview from './pages/AdminOverview';
import AdminUnits from './pages/AdminUnits';
import AdminMaint from './pages/AdminMaint';
import AdminPayments from './pages/AdminPayments';
import AdminUsers from './pages/AdminUsers';
import Tenant from './pages/Tenant';
import { Modal, ModalState } from './components/Modal';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: new ModalState(false, '', ''),
        };
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Route exact path='/' component={Landing} />
                    <Route exact path='/admin/overview' component={AdminOverview} />
                    <Route exact path='/admin/units' component={AdminUnits} />
                    <Route exact path='/admin/maint' component={AdminMaint} />
                    <Route exact path='/admin/payments' component={AdminPayments} />
                    <Route exact path='/admin/users' component={AdminUsers} />
                    <Route exact path='/tenant' component={Tenant} />

                    <Modal state={this.state.modal} onRequestClose={() => this.setState({ modal: this.state.modal.hide() })} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
