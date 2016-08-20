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

import { fetchDepartments } from '../redux/state/deptLinks.redux';
import { fetchTankerTemplates } from '../redux/state/tankerTemplates.redux';
import { fetchTemplates as fetchBarrelTemplates } from '../redux/state/barrelTemplates.redux';
import { fetchBarrelShipments } from '../redux/state/barrelShipments.redux';
import { fetchTankerShipments } from '../redux/state/tankerShipments.redux';


class AppLayout extends Component {
    // Server-side data retrieval (for server rendering).
    static need = [fetchDepartments, 
                   fetchBarrelTemplates, fetchTankerTemplates, 
                   fetchBarrelShipments, fetchTankerShipments]

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
