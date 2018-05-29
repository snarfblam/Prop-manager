import React from 'react';
import GoogleSvg from '../../../components/svg/GoogleSvg';
import { Form, Input } from '../../../components/Bootstrap';
import './Login.css';
import * as api from '../../../api';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
        };
    }

    onInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    
    handleLogin = (event) => {
        event.preventDefault();
        
        api
            .localLogin(this.state.username, this.state.password)
            .then(request => {
                window.location.reload();
            })
    }

    render() {
        return  (
            <div>
                <p>
                    <a className='login-link' href='/auth/google'>
                        Log in with&ensp;<button className='btn btn-dark'><GoogleSvg className="googlogo" /></button>
                    </a>    
                </p>

                <hr />
                <p>Log in with username</p>
                <Form className="container-400">
                    <Input
                        name='username'
                        value={this.state.username}
                        label='Username'
                        onChange={this.onInputChange}
                    />
                    <Input
                        password
                        name='password'
                        value={this.state.password}
                        label='Password'
                        onChange={this.onInputChange}
                    />
                    <button onClick={this.handleLogin} className='btn btn-dark'>Log in</button>
                </Form>

            </div>
        );
    }
}

export default Login;
// export default props => (
//     <div>
//         <p>
//             <a className='login-link' href='/auth/google'>
//                 Log in with&ensp;<button className='btn btn-dark'><GoogleSvg className="googlogo" /></button>
//             </a>    
//         </p>

//         <hr />
//         <p>Log in with username</p>
//         <Form className="container-400">
//             <Input
//                 name='username'
//                 value=''
//                 label='Username'
//             />
//             <Input
//                 password
//                 name='pass'
//                 value=''
//                 label='Password'
//             />
//             <button className='btn btn-dark'>Log in</button>
//         </Form>

//     </div>
// );

function loginGoogle() {
    window.location.href = '/auth/google';
}