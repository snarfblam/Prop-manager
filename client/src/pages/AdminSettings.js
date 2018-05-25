import React from 'react';

import Template from './Template';
import { Container } from '../components/Bootstrap';
import Pane from '../components/Pane';
import * as api from '../api';
import Spinner from './modals/Spinner';
import { Table } from '../components/Table';
import Fas from '../components/Fas';
import FakeAnchor from '../components/FakeAnchor';

class AdminSettings extends Template {
    constructor(props) {
        super(props);

        this.state = {
            settings: null,
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
                <Pane>
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
        if (col == 'editButton') return <FakeAnchor href='/editSetting'><Fas icon='pen-square' /></FakeAnchor>
        return value;
    }
}

export default AdminSettings;