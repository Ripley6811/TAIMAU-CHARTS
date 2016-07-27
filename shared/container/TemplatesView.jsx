/**
 * @overview Page for viewing and editing (CRUD) of "shipment templates".
 * Shipment templates are repeatable elements of a shipment, which are
 * the destination, product and product number (pn).
 * Excluded are amounts, dates, and notes.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// Actions
import { fetchShipmentTemplates, fetchDepartments, 
         deleteTemplateRequest, addTemplateRequest } from '../redux/actions/actions';
// Components
import Table from '../components/Table';
import TemplateCreator from '../components/TemplateCreator';


export default connect(
    ({templates, query}) => ({templates, query}),  // Pull items from store
    { fetchShipmentTemplates, fetchDepartments, 
      deleteTemplateRequest, addTemplateRequest }  // Bind actions with dispatch
)(class TemplatesView extends React.Component {
    // Server-side data retrieval (for server rendering).
    static need = [fetchShipmentTemplates]

    // Validates props
    static propTypes = {
        // Redux store
        query: PropTypes.object.isRequired,
        templates: PropTypes.arrayOf(PropTypes.shape({
            company: PropTypes.string.isRequired,
            dept: PropTypes.string.isRequired,
            unit: PropTypes.string.isRequired,
            product: PropTypes.string.isRequired,
            pn: PropTypes.string.isRequired,
        })).isRequired,
        // Actions
        fetchShipmentTemplates: PropTypes.func.isRequired,
        fetchDepartments: PropTypes.func.isRequired,
        deleteTemplateRequest: PropTypes.func.isRequired,
        addTemplateRequest: PropTypes.func.isRequired,
    }

    // Ensure required data is loaded.
    componentWillMount = () => {
        if (this.props.templates.length === 0)
            this.props.fetchShipmentTemplates();
    }

    deleteTemplate = (template) => {  // ES7 class function binding
        // WARNING: Might have "race" problem between dispatches.
        if (confirm('真的要把檔案刪除嗎?\nDo you want to delete this template?')) {
            this.props.deleteTemplateRequest(template);
            // Wait then dispatch update for sidebar
            setTimeout(() => {
                this.props.fetchDepartments();
            }, 300);
        }
    }

    createTemplate = (template) => {
        this.props.addTemplateRequest(template);
        // Wait then dispatch update for sidebar
        setTimeout(() => {
            this.props.fetchDepartments();
        }, 300);
    }

    templateFilter = (template) => {
        const { company, dept } = this.props.query;
        
        if (!!dept) {
            return template.company === company &&
                   template.dept === dept;
        } else if (!!company) {
            return template.company === company;
        }

        return false;
    }

    render() {
        const { templates } = this.props;
        const tableHeaders = ["公司", "Dept", "Unit", "材料名稱", "料號", "除"];
        const tableKeys = ["company", "dept", "unit", "product", "pn"];

        // Filter templates
        const filteredTemplates = templates.filter(this.templateFilter);

        return (
            <div className="container"
                 style={{maxWidth: '900px', margin: 'auto'}}>
                <TemplateCreator
                    createTemplate={this.createTemplate} />
                <legend>Shipment Templates</legend>
                <Table
                    tableHeaders={tableHeaders}
                    tableKeys={tableKeys}
                    tableRows={filteredTemplates}
                    onDelete={this.deleteTemplate} />
            </div>
        )
    }
});
