import React from 'react';

import Template from './Template';
import { Container } from '../components/Bootstrap';
import Pane from '../components/Pane';
import * as api from '../api';
import Spinner from './modals/Spinner';
import { Table } from '../components/Table';
import Fas from '../components/Fas';
import FakeAnchor from '../components/FakeAnchor';
import EditSetting from './modals/EditSetting';

class AdminSettings extends Template {
    constructor(props) {
        super(props);

        this.state = {
            settings: null,
            pendingSettings: [], // settings which the user has set a new value for, where we're waiting for the server to confirm the setting has been updated
        }

        this.settingsColumns = [
            {name: 'name', label: 'Name'},
            {name: 'value', label: 'Value'},
            {name: 'editButton', label: 'Edit'},
        ]
    }

    componentDidMount() {
        api.getAppSettings()
            .then(response => {
                this.setState({ settings: response.settings });
            });
    }

    getNavItems() {
        return this.adminNavLinks;
    }

    getContent() {
        return (
            <Container>
                <Pane size='12'>
                    <h3>Site Settings</h3>
                    <p>Warning: tinkering under the hood may cause things to break.</p>
                    <hr />
                    {this.getSettingsTable()}
                </Pane>
            </Container>
        );
    }

    getSettingsTable = () => {
        if (this.state.settings == null) return <Spinner />
        
        return <Table data={{ columns: this.settingsColumns, items: this.state.settings }} transform={this.transformSettings} />;
    }

    transformSettings = (col, value, item) => {
        if (col == 'editButton') {
            return this.state.pendingSettings.includes(item.name) ? ( // 'pending settings' show an 
                <Spinner size='12px' />
            ) : (
                <FakeAnchor
                    href='/editSetting'
                    onClick={e => this.editSetting(item)}>
                    <Fas icon='pen-square' />
                </FakeAnchor>
            );
        }
        
        return value;
    }

    editSetting = (item) => {
        this.showModal(
            <EditSetting
                settingName={item.name}
                initialValue={item.value}
                initialDescription={item.description || ''}
                onSubmit={this.onSettingSubmitted}
            />, "Change Setting", true);
    }

    onSettingSubmitted = (name, value, description) => {
        this.hideModal();

        var pending = [...this.state.pendingSettings, name];
        this.setState({pendingSettings: pending});

        api
            .changeAppSetting(name, value, description)
            .then(response => ({result: 'success'}))
            .catch(err => ({result: 'error', error: err})) // forward err to .then
            .then(response => {
                var newPending = this.state.pendingSettings;
                var index = newPending.indexOf(name);
                if (index >= 0) newPending.splice(index, 1);
                
                if (response.result == 'success') {
                    var newList = this.state.settings;
                    var newItem = (newList.find(item => item.name == name) || {});
                    newItem.value = value;
                    newItem.description = description;
                    
                    this.setState({
                        pendingSettings: newPending,
                        settings: newList,
                    });
                } else {
                    this.setState({
                        pendingSettings: newPending,
                    });

                    this.showModal(<p>Could not change the setting.</p>, "Error", true);
                }
            });
    }
}

export default AdminSettings;