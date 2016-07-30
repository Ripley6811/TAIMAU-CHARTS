/**
 * @overview Main Container that will hold all other containers.
 * This container includes the navigation "Sidebar".
 */
import React, { Component, PropTypes } from 'react';
/**
 * Helmet is a library for automating <head> construction.
 */
import Helmet from 'react-helmet';
import AppSidebar from './AppSidebar/AppSidebar';

import { fetchDepartments } from './Template/template.actions';


class AppLayout extends Component {
    // Server-side data retrieval (for server rendering).
    static need = [fetchDepartments]
    
    static propTypes = {
        children: PropTypes.object.isRequired,
    }

    /**
     * Used for both the sidebar and padding for main window.
     */
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
        <AppSidebar width={this.sidebarWidth} />
        
        <div id="main-window" style={{paddingLeft: this.sidebarWidth}} >
            { this.props.children }
        </div>
      </div>
        );
    }
}

// Inject `dispatch` and don't listen to store
export default AppLayout;
