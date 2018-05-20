import React from 'react';
import { Form, Input, Select } from '../../../components/Bootstrap';
import './NewUnit.css';
import Button from '../../../components/Bootstrap/Button';
import Spinner from '../Spinner';
import * as api from '../../../api';

class NewUnit extends React.Component {
    constructor(props) {
        super(props);

        var initialData = props.initialData || {};
        this.state = {
            unitName: '',
            rate: 0,
            user: 1, // selected UnitId
            userList: null,
            errors: {

            },
            ...initialData,
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getError = this.getError.bind(this);
        this.onReset = this.onReset.bind(this);
    }

    onInputChange(e) {
        var name = e.target.name;
        var value = e.target.value;
        if (name == 'rate') value = parseInt(value) || 0;
        this.setState({
            [name]: value,
        });
    }

    componentDidMount() {
        api.getUserList().then(result => {
            this.setState({
                userList: result.map(user => ({
                    value: user.id,
                    text: user.fullname,
                })),
            });

        }).catch(err => {
            alert('There was an error accessing the server.');
            console.log(err);
            // TODO: something better than an alert (we don't have access to showModal right here)
        });
    }
    

    componentWillReceiveProps(nextProps) {
        var unitData = nextProps.initialData;
        this.setState(unitData);
    }

    onSubmit(e) {
        e.preventDefault();

        var errors = {};

        if (this.state.unitName.trim().length == 0) errors.unitName = 'Required';
        if (parseInt(this.state.rate) < 0) errors.rate = "Must be zero or greater";

        this.setState({ errors: errors });

        var hasErrors = Object.getOwnPropertyNames(errors).length > 0;

        if (!hasErrors) {
            var submitEvent = this.props.onSubmit;
            if (submitEvent) submitEvent({
                unitName: this.state.unitName,
                rate: this.state.rate,
                user: this.state.user,
            });
        }
    }

    onReset(e) {
        e.preventDefault();

        this.setState({
            errors: {},
            unitName: '',
            rate: 0,
        });
    }

    normalizeState(str) {
        return str.trim().toUpperCase();
    }

    getError(name) {
        return this.state.errors[name] || null;
    }

    render() {
        return (
            <div className='new-unit-modal'>
                {this.state.userList ? (
                    <Form>
                        <Select label="Primary User" name='user' items={this.state.userList} value={this.state.user} onChange={this.onInputChange} />
                        <Input label='Unit Name' name='unitName' value={this.state.unitName} placeholder='' onChange={this.onInputChange} errorText={this.getError('unitName')} />
                        <Input type='number' label='Unit Rent' min={0} align='right' innerAppend='.00' innerPrepend='$' name='rate' value={this.state.rate} placeholder='' onChange={this.onInputChange} errorText={this.getError('rate')} />
                        <Button onClick={this.onSubmit}>{this.props.edit ? 'Save Unit' : 'Create Unit'}</Button>
                        &emsp;
                        {this.props.edit ? null : <Button onClick={this.onReset}>Reset Form</Button>}
                    </Form>
                ) : (
                    <Spinner />
                )}

            </div>
        );
    }
}

export default NewUnit;