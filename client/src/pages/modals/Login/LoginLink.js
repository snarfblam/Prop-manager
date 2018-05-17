import React from 'react';
import * as api from '../../../api';

/**
 * Log in/log out link
 * Props:
 *      onLogin: function -
 *      onLogout: function -
 */

// var knownRoles = ['logged out', 'tenant', 'admin'];
// function toKnownRole(role) {
//     if (knownRoles.includes(role)) return role;
//     return knownRoles[0];
// }

class LoginLink extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     role: 'logged out', // should only be values listed in knownRoles
        // }

        this.stateContent = {
            "logged out": (
                <a href='/login' onClick={(e) => {
                    onLogin(e, this.props.onLogin);
                }}>Login</a>
            ),
            "tenant": (
                <a href='/logout' onClick={(e) => {
                    onLogout(e, this.props.onLogout);
                }}>Log out</a>
            ),
            "user": (
                <a href='/logout' onClick={(e) => {
                    onLogout(e, this.props.onLogout);
                }}>Log out</a>
            ),
        };
    }

    // componentDidMount() {
    //     api
    //         .getUserStatus()
    //         .then(response => {
    //             this.setState({
    //                 role: toKnownRole(response.status),
    //             });
    //         });
    // }

    render() {
        // return (
        //     <a href='/login' onClick={(e) => {
        //         onLogin(e, this.props.onLogin);
        //     }}>Login</a>
        // );
        return this.stateContent[this.props.loggedAs];
    }
    
}
function onLogin(event, handler) {
    event.preventDefault();
    // if (handler) handler();
    if(handler) handler();
}

function onLogout(event, handler) {
    event.preventDefault();
    if(handler) handler();
}

// export default props => (
//     <a href='/login' onClick={(e) => {
//         onLogin(e, this.props.onClick);
//     }}>Login</a>
// )
export default LoginLink;