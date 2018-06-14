import React from 'react';
import { Input, Container, Row, Col, Button } from '../../components/Bootstrap';
/*
    Settings editor

    props:
        settingsName: name of value being edited
        initialValue: text initially displayed
        onSubmit: function(name, value) callback
*/
class EditSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.initialValue,
            description: props.initialDescription,
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.initialValue,
            description: newProps.initialDescription,
        });
    }

    render() {
        return (
            <div>
                <h3><tt>{this.props.settingName}</tt></h3>
                <form>
                    Description
                    <textarea className='form-control mb-2' value={this.state.description} onChange={(e) => { this.setState({ description: e.target.value }); }} />
                    Value
                    <div className='input-group'>
                        <input className='form-control' value={this.state.value} onChange={(e) => { this.setState({ value: e.target.value });}} />
                        <div className='input-group-append'>
                            <button
                                className='btn btn-dark'
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (this.props.onSubmit) {
                                        console.log(e.target);
                                        this.props.onSubmit(this.props.settingName, this.state.value, this.state.description);
                                    }
                                }}>
                                Submit
                        </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
export default EditSettings;