/**
 * @overview Page for viewing and editing (CRUD) of "shipment templates".
 * Shipment templates are repeatable elements of a shipment, which are
 * the destination, product and product number (pn).
 * Excluded are amounts, dates, and notes.
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../redux/actions/actions';

// COMPONENTS
import Table from '../components/Table';
import TemplateCreator from '../components/TemplateCreator';


// Retrieves data from store (appends to "props").
function mapStateToProps(store) {
    return {
        templates: store.templates
    };
};

class ShipmentTemplates extends React.Component {
    // Server-side data retrieval (for server rendering).
    static need = [Actions.fetchShipmentTemplates]
    
    // Validates props
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        templates: PropTypes.arrayOf(PropTypes.shape({
            company: PropTypes.string.isRequired,
            dept: PropTypes.string.isRequired,
            unit: PropTypes.string.isRequired,
            product: PropTypes.string.isRequired,
            pn: PropTypes.string.isRequired,
        })).isRequired,
    }
    
    deleteTemplate = (template) => {  // ES7 class function binding
        if (confirm('真的要把檔案刪除嗎?\nDo you want to delete this template?')) {
            this.props.dispatch(Actions.deleteTemplateRequest(template));
            this.props.dispatch(Actions.fetchDepartments());
            this.props.dispatch(Actions.fetchShipmentTemplates());
        }
    }
    
    createTemplate = (template) => {
        this.props.dispatch(Actions.addTemplateRequest(template));
        this.props.dispatch(Actions.fetchDepartments());
        this.props.dispatch(Actions.fetchShipmentTemplates());
    }
    
    render() {
        const props = this.props;
        const tableHeaders = ["公司", "Dept", "Unit", "材料名稱", "料號", "除"];
        const tableKeys = ["company", "dept", "unit", "product", "pn"];
        
        return (
        <div className="container" 
             style={{maxWidth: '900px', margin: 'auto'}}>
            <TemplateCreator 
                createTemplate={this.createTemplate}
                />
            <legend>Shipment Templates</legend>
            <Table 
                tableHeaders={tableHeaders}
                tableKeys={tableKeys}
                tableRows={props.templates}
                onDelete={this.deleteTemplate}
                />
        </div>
        )
    }        
}

export default connect(mapStateToProps)(ShipmentTemplates);