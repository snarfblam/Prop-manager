import React from 'react';
import GoogleSvg from '../../../components/svg/GoogleSvg';
import { Form, Input } from '../../../components/Bootstrap';
import './Login.css';

export default props => (
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
                value=''
                label='Username'
            />
            <Input
                password
                name='pass'
                value=''
                label='Password'
            />
            <button className='btn btn-dark'>Log in</button>
        </Form>

    </div>
);

function loginGoogle() {
    window.location.href = '/auth/google';
}