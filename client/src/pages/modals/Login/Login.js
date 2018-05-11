import React from 'react';
import GoogleSvg from '../../../components/svg/GoogleSvg';
import { Form, Input } from '../../../components/Bootstrap';

export default props => (
    <div>
        <p>
            Log in with
        </p>
        <button className='btn btn-dark'>
            <GoogleSvg className="googlogo" />
        </button>

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