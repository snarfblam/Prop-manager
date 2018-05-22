import React from 'react';
import { Form, Input } from '../../../components/Bootstrap';
import Button from '../../../components/Bootstrap/Button';

class RequestAch extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            accountType: 'individual',
        };
    }

    inputChanged = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        return (
            <div>
                <Form>
                    <Input label='Account holder name' name='accountName' value={this.state.accountName} onChange={this.inputChanged}/>
                    <Input label='Account type' name='accountType' value={this.state.accountType} onChange={this.inputChanged}/>
                    <Input label='Routing number' name='accountRouting' value={this.state.accountRouting} onChange={this.inputChanged}/>
                    <Input label='Account number' name='accountNumber' value={this.state.accountNumber} onChange={this.inputChanged} />
                    
                    <Button onClick='makeRequest'>Request ACH</Button>
                </Form>
            </div>
        );
    }
}

export default RequestAch;