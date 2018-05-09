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

class App extends Component {
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
                    {/* <Landing /> */}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
