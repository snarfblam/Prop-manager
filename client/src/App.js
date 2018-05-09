import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Landing from './pages/Landing';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Landing />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
