import React from 'react';
import GoogleSvg from '../../../components/svg/GoogleSvg';
import { Form, Input } from '../../../components/Bootstrap';
import * as api from '../../../api';

class PassReset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
        };
    }

    onInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    
    handleReset = (event) => {
        event.preventDefault();
        if (this.props.onRequestReset) {
            this.props.onRequestReset(this.state.username)
        }
    }

    render() {
        return  (
            <div>
                <p>Enter your username.</p>
                <p>A link will be sent to the email address on file that will allow you to set a new password.</p>
                <Form className="container-400">
                    <Input
                        name='username'
                        value={this.state.username}
                        onChange={this.onInputChange}
                    />
                    <div className='text-center'>
                        <button onClick={this.handleReset} className='btn btn-dark text-center'>Reset Password</button>
                    </div>
                </Form>

            </div>
        );
    }
}

export default PassReset;
