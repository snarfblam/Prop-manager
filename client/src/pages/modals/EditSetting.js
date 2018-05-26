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
        }
    }

    render() {
        return (
            <div>
                <h3><tt>{this.props.settingName}</tt></h3>.
                <form>
                    <div className='input-group'>
                        <input className='form-control' value={this.state.value} onChange={(e) => { this.setState({ value: e.target.value });}} />
                        <div className='input-group-append'>
                            <button
                                className='btn btn-dark'
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (this.props.onSubmit) {
                                        console.log(e.target);
                                        this.props.onSubmit(this.props.settingName, this.state.value);
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