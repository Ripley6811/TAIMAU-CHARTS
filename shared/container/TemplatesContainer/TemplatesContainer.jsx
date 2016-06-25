import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// Components
import OptionsListView from '../../container/OptionsListView/OptionsListView';

import * as Actions from '../../redux/actions/actions';


class TemplatesContainer extends Component {
    constructor(props, context) {
        super();
    }

    render() {
        return (
                <div className="container">
                    <OptionsListView />
                </div>
        );
    }
}

TemplatesContainer.need = [() => { return Actions.fetchTemplates(); }]

export default connect()(TemplatesContainer);