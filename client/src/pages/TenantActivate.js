import React from 'react';
// eslint-disable-next-line
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container, Form, Input } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import GoogleSvg from '../components/svg/GoogleSvg';
import Button from '../components/Bootstrap/Button';
import Spinner from './modals/Spinner';
import Pane from '../components/Pane'
import * as api from '../api';

class TenantActivate extends Template {
    constructor(props, match) {
        super(props, match);
        this.activationCode = props.match.params.code;

        this.state = {
            activationCodeStatus: 'checking', // 'checking', 'error', 'verified'
            username: '',
            password: ''
        };

        // this.createSubStates();
    }

    // createSubStates() {
    //     this.subStates = {
    //         verified:
    //             <Container>
    //                 <Pane>
    //                     <h3>Activate with Google</h3>
    //                     <p>
    //                         Activate your account with
    //                             </p>
    //                     <a className='login-link' href='/auth/google'>
    //                         <button className='btn btn-dark'><GoogleSvg className="googlogo" /></button>
    //                     </a>
    //                 </Pane>

    //                 <Pane>
    //                     <h3>Create Username and Password</h3>
    //                     <Form className="container-400">
    //                     <Input
    //                             name='username'
    //                             value={this.state.username}
    //                             label='User Name'
    //                             onChange={this.handleInputChange}
    //                         />
    //                     <Input
    //                             password
    //                             name='password'
    //                             value={this.state.password}
    //                             label='Password'
    //                             onChange={this.handleInputChange}
    //                         />
    //                         <Button onClick={this.handleCreateAccount}>Create Account</Button>
    //                     </Form>
    //                 </Pane>    
    //             </Container>,
    //         checking:
    //             <div>
    //                 <p>Accessing your account</p>
    //                 <Spinner />
    //             </div>,
    //         error:
    //             <div>
    //                 <p>Could not access the account.</p>
    //             </div>
    //     }
    // }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleCreateAccount = (event) => {
        if (this.state.username && this.state.password) {
            api.
                setLocalCreds({username: this.state.username, password: this.state.password})
            .then(data => {
                console.log(data)
            }).catch(err => {
                console.log(err)
            })
        }
    };


    componentDidMount() {
        // this.showModal(
        //     <Spinner />, 'Finding your account'
        // );

        api
            .activateUser({ activationCode: this.activationCode })
            .then(result => {
                console.log(result);
                if (result.result == 'success') {
                    // this.hideModal();
                    this.setState({ activationCodeStatus: 'verified' });
                } else {
                    var err = result.error || 'unknown error';
                    this.setState({ activationCodeStatus: 'error' });
                    this.showModal(<p>There was an error finding your account: {err}</p>, "Error");
                }
            });
    }

    getNavItems() {
        return [...(this.tenantNavLinks), { path: this.props.match.path, text: 'Activate Account' }];
    }

    getContent() {
        switch (this.state.activationCodeStatus) {
          case 'verified':
                return (<Container>
                    <Pane>
                        <h3>Activate with Google</h3>
                        <p>
                            Activate your account with
                                </p>
                        <a className='login-link' href='/auth/google'>
                            <button className='btn btn-dark'><GoogleSvg className="googlogo" /></button>
                        </a>
                    </Pane>

                    <Pane>
                        <h3>Create Username and Password</h3>
                        <Form className="container-400">
                            <Input
                                name='username'
                                value={this.state.username}
                                label='User Name'
                                onChange={this.handleInputChange}
                            />
                            <Input
                                password
                                name='password'
                                value={this.state.password}
                                label='Password'
                                onChange={this.handleInputChange}
                            />
                            <Button onClick={this.handleCreateAccount}>Create Account</Button>
                        </Form>
                    </Pane>
                </Container>);
            case 'checking':
                return (<div>
                    <p>Accessing your account</p>
                    <Spinner />
                </div>);
            case 'error':
                return (<div>
                    <p>Could not access the account.</p>
                </div>);
        }
        // return this.subStates[this.state.activationCodeStatus];
    }
}

export default TenantActivate;