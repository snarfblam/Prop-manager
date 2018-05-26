import React from 'react';
import { Form, Input, Container, Row, Select } from '../../../components/Bootstrap';
import Button from '../../../components/Bootstrap/Button';

const routingRegex = /^((0[0-9])|(1[0-2])|(2[1-9])|(3[0-2])|(6[1-9])|(7[0-2])|80)([0-9]{7})$/;
const accountNoRegex = /^\w{1,17}$/;

class RequestAch extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            accountType: 'individual',
            accountName: 'Clark McDermith',
            accountRouting: '110000000',
            accountNumber: '000123456789',
            errors: {},
        };
    }

    inputChanged = (e) => {
        console.log(this.state);
        // var value = e.target.checked;
        // if (value === undefined) value = e.target.value;

        this.setState({
            [e.target.name]: this.getTargetValue(e),
        });
    };

    getTargetValue(e) {
        if ((e.target.type || '').toLowerCase() == 'checkbox') {
            return e.target.checked;
        } else {
            return e.target.value;
        }
    }

    requestAchService = (e) => { 
        e.preventDefault();

        var errors = {};
        if (!routingRegex.test(this.state.accountRouting)) {
            errors.accountRouting = "Not a valid routing number";
        }
        if (!accountNoRegex.test(this.state.accountNumber || '')) {
            errors.accountNumber = "Not a valid account number";
        }
        if ((this.state.accountName || '').trim().length == 0) {
            errors.accountName = "Required";
        }

        this.setState({ errors: errors });
        var noErrors = (Object.getOwnPropertyNames(errors).length == 0);

        if (noErrors && this.props.onRequestAch) this.props.onRequestAch({
            name: this.state.accountName,
            accountType: this.state.accountType,
            accountNumber: this.state.accountNumber,
            accountRouting: this.state.accountRouting,
        });
        
    }

    render() {
        return (
            <div>
                <Form>
                    <Container className='text-left'>
                        <Row>
                            <p className='col-12 col-xl-6 mx-auto'>
                                You do not have a bank account associated with your rented unit on this site. 
                                Submit your account information to request ACH service.
                                You will need to follow the directions emailed to you to verify this account
                                before using it for payments.
                            </p>    
                        </Row>      
                        <Row>
                            <Input label='Account holder name' name='accountName' value={this.state.accountName} onChange={this.inputChanged} className='col-12 col-md-6' errorText={this.state.errors.accountName} />
                            {/* <Input label='Account type' name='accountType' value={this.state.accountType} onChange={this.inputChanged} className='col-12 col-md-6' /> */}
                            <Select label='Account type' items={[{ value: 'individual', text: 'Individual' }, {value: 'business', text:'Business'}]} name='accountType' onChange={this.inputChanged} className='col-12 col-md-6' />
                            <Input label='Routing number' name='accountRouting' value={this.state.accountRouting} onChange={this.inputChanged} className='col-12 col-md-6' errorText={this.state.errors.accountRouting} />
                            <Input label='Account number' name='accountNumber' value={this.state.accountNumber} onChange={this.inputChanged} className='col-12 col-md-6' errorText={this.state.errors.accountNumber} />
                        </Row>
                        <Row>
                            <p className='col-12 col-xl-6 mx-auto'>
                                Your account information will be used to collect future payments. 
                                Individual payments will only be collected from this account only at your request. 
                                The account information is stored and processed by a third party (<a target='_blank' href='https://stripe.com/us/privacy'>Stripe</a>).
                            </p>    
                        </Row>        
                        <Row>
                            <Input label='I understand and agree to these terms' type='checkbox' name='agree' checked={this.state.agree} onChange={this.inputChanged} className='col-12 col-xl-6 mx-auto' />
                        </Row>
                    </Container>
                    <Button onClick={this.requestAchService} disabled={!this.state.agree}>Request ACH</Button>
                </Form>
            </div>
        );
    }
}

export default RequestAch;