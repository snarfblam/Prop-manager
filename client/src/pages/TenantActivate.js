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
            accountStatus: 'checking', // 'checking', 'new', 'local reset', 'full reset'
            username: '',
            password: ''
        };

        // this.createSubStates();
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleCreateAccount = (event) => {
        event.preventDefault();

        var validInput =
            this.state.password && 
            (this.state.accountStatus == 'local reset' || this.state.username);

        if (validInput) {
            api.
                setLocalCreds({username: this.state.username, password: this.state.password})
                .then(data => {
                    var result = data.result;
                    if (result == 'success') {
                        api
                        .localLogin(this.state.username, this.state.password)
                        .then(loggedIn => {
                            console.log(loggedIn);
                            window.location.href = '/';
                            // success: navigate to '/'
                            // failure:( activation succeeded but login failed )
                        })
                    } else if (result == 'duplicate') {
                        // username specified is not unique
                        this.showModal(<p>The username specified is not unique. Please choose a different username.</p>, "Error");
                    } else if (result == 'not found') {
                        // invalid activation code
                        this.showModal(<p>The activation code used is not valid.</p>, "Error");
                        this.setState({ activationCodeStatus: 'error' });
                    }

                console.log(data)

            }).catch(err => {
                console.log(err)
            })
        }
    };


    componentDidMount() {
        api
            .activateUser({ activationCode: this.activationCode })
            .then(result => {
                console.log(result);

                if (result.result == 'success') {
                    // this.hideModal();
                    this.setState({ activationCodeStatus: 'verified', accountStatus: result.accountStatus });
                } else {
                    var err = result.error || 'unknown error';
                    this.setState({ activationCodeStatus: 'error', accountStatus: 'checking' });
                    this.showModal(<p>There was an error finding your account: {err}</p>, "Error");
                }
            });
    }

    getNavItems() {
        return [...(this.tenantNavLinks), { path: this.props.match.path, text: 'Activate Account' }];
    }

    getPageLabels() {
        if (this.state.accountStatus == 'new') {
            return {
                google: 'Activate with Google',
                googleInner: 'Activate your account with',
                local: 'Create Username and Password',
                password: 'Create Account',
            }            
        } else if (this.state.accountStatus == 'local reset') {
            return {
                google: 'Log in with Google',
                googleInner: 'Set your login method',
                local: 'Change Password',
                password: 'Update Password',
            }     
        } else {
            return {
                google: 'Log in with Google',
                googleInner: 'Set your login method',
                local: 'Create Username and Password',
                password: 'Create Username',
            }     
        }
    }

    getContent() {
        var labels = this.getPageLabels();

        switch (this.state.activationCodeStatus) {
          case 'verified':
                return (<Container>
                    <Pane>
                        <h3>{labels.google}</h3>
                        <p>
                            {labels.googleInner}
                                </p>
                        <a className='login-link' href='/auth/google'>
                            <button className='btn btn-dark'><GoogleSvg className="googlogo" /></button>
                        </a>
                    </Pane>

                    <Pane>
                        <h3>{labels.local}</h3>
                        <Form className="container-400">
                            {(this.state.accountStatus == 'new' || this.state.accountStatus == 'full_reset') ? 
                                <Input
                                    name='username'
                                    value={this.state.username}
                                    label='User Name'
                                    onChange={this.handleInputChange}
                                />
                                : null
                            }    
                            <Input
                                password
                                name='password'
                                value={this.state.password}
                                label='Password'
                                onChange={this.handleInputChange}
                            />
                            <Button onClick={this.handleCreateAccount}>{labels.password}</Button>
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