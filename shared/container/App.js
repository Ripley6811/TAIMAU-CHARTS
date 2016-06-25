import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
/**
 * Helmet is a library for automating <head> construction.
 */
import Helmet from 'react-helmet';
import Sidebar from './Sidebar/Sidebar';

import * as Actions from '../redux/actions/actions';

class App extends Component {
  constructor(props, context) {
    super(props, context);
  }
    
  get sidebarWidth() {
      return '200px';
  }

  render() {
    return (
      <div>
        <Helmet
          title="Taimau Charts"
          meta={[
            { charset: 'utf-8' },
            {
              'http-equiv': 'X-UA-Compatible',
              content: 'IE=edge',
            },
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
          ]}
        />
        <Sidebar width={this.sidebarWidth} />
        
        <div id="main-window" style={{paddingLeft: this.sidebarWidth}} >
            { this.props.children }
        </div>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in server side.
App.need = [() => { return Actions.fetchDeptLinks(); }];

App.propTypes = {
  children: PropTypes.object.isRequired,
};

/**
 * Inject just `dispatch` and don't listen to store
 */
export default connect()(App);
