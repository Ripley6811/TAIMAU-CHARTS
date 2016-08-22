/**
 * @overview Page for viewing and editing (CRUD) of "shipment templates".
 * Shipment templates are repeatable elements of a shipment, which are
 * the destination, product and product number (pn).
 * Excluded are amounts, dates, and notes.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// Actions
import { fetchTankerTemplates,
         deleteTemplateRequest as deleteTankerTemplate,
         addTemplateRequest as addTankerTemplate } from '../../redux/state/tankerTemplates.redux';
import { fetchTemplates as fetchBarrelTemplates,
         deleteTemplateRequest as deleteBarrelTemplate,
         addTemplateRequest as addBarrelTemplate } from '../../redux/state/barrelTemplates.redux';
import { fetchDepartments } from '../../redux/state/deptLinks.redux';
// Components
import Table from '../../components/Table';
import TemplateCreator from './components/TemplateCreator';
// Test suite
import Tests from './tests/templates.spec';


export default connect(
    // Pull items from store
    ({barrelTemplates, tankerTemplates, query}) => ({barrelTemplates, tankerTemplates, query}),
    // Bind actions with dispatch
    { fetchDepartments,
      fetchTankerTemplates, deleteTankerTemplate, addTankerTemplate,
      fetchBarrelTemplates, deleteBarrelTemplate, addBarrelTemplate }
)(class TemplatesView extends React.Component {
    // Server-side data retrieval (for server rendering).
    static need = [fetchTankerTemplates, fetchBarrelTemplates]

    // Validates props
    static propTypes = {
        // Redux store
        query: PropTypes.object.isRequired,
        barrelTemplates: PropTypes.array.isRequired,
        tankerTemplates: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            company: PropTypes.string.isRequired,
            product: PropTypes.string.isRequired,
            pn: PropTypes.string.isRequired,
            dept: PropTypes.string.isRequired,
            unit: PropTypes.string.isRequired,
        })).isRequired,
    }

    deleteTankerTemplate = (template) => {  // ES7 class function binding
        // WARNING: Might have "race" problem between dispatches.
        if (confirm('真的要把檔案刪除嗎?\nDo you want to delete this template?')) {
            this.props.deleteTankerTemplate(template);
            // Wait then dispatch update for sidebar
            setTimeout(() => {
                this.props.fetchDepartments();
            }, 300);
        }
    }

    deleteBarrelTemplate = (template) => {  // ES7 class function binding
        // WARNING: Might have "race" problem between dispatches.
        if (confirm('真的要把檔案刪除嗎?\nDo you want to delete this template?')) {
            this.props.deleteBarrelTemplate(template);
            // Wait then dispatch update for sidebar
            setTimeout(() => {
                this.props.fetchDepartments();
            }, 300);
        }
    }

    createBarrelTemplate = (template) => {
        this.props.addBarrelTemplate(template);
        // Wait then dispatch update for sidebar
        setTimeout(() => {
            this.props.fetchDepartments();
        }, 300);
    }

    createTankerTemplate = (template) => {
        this.props.addTankerTemplate(template);
        // Wait then dispatch update for sidebar
        setTimeout(() => {
            this.props.fetchDepartments();
        }, 300);
    }

    tankerFilter = (template) => {
        const { company, dept } = this.props.query;

        if (!!company && !!dept) {
            return template.company === company &&
                   template.dept === dept;
        } else if (!!company) {
            return template.company === company;
        }
        return false;
    }

    barrelFilter = (template) => {
        const { company } = this.props.query;

        if (!!company) {
            return template.company === company;
        }
        return false;
    }

    componentDidMount = () => {
        if (typeof describe === 'function') {
            Tests(this);
        }
    }

    render() {
        const { barrelTemplates, tankerTemplates } = this.props;
        const tankerTableHeaders = ["公司", "Dept", "Unit", "材料名稱", "料號", "除"];
        const tankerTableKeys = ["company", "dept", "unit", "product", "pn"];
        const barrelTableHeaders = ["公司", "批次字首", "RT Code", "材料名稱", "料號", "容量", "保質期", "barcode", "datamatrix", "除"];
        const barrelTableKeys = ["company", "lotPrefix", "rtCode", "product", "pn", "pkgQty", "shelfLife", "barcode", "datamatrix"];

        const filteredBarrelTemplates = barrelTemplates.filter(this.barrelFilter);
        const filteredTankerTemplates = tankerTemplates.filter(this.tankerFilter);

        return (
            <div className="container"
                 >
                <TemplateCreator
                    createBarrelTemplate={this.createBarrelTemplate}
                    createTankerTemplate={this.createTankerTemplate} />
                <legend>Tanker Shipment Templates</legend>
                <Table
                    tableHeaders={tankerTableHeaders}
                    tableKeys={tankerTableKeys}
                    tableRows={filteredTankerTemplates}
                    onDelete={this.deleteTankerTemplate} />
                <legend>Barrel Shipment Templates</legend>
                <Table
                    tableHeaders={barrelTableHeaders}
                    tableKeys={barrelTableKeys}
                    tableRows={filteredBarrelTemplates}
                    onDelete={this.deleteBarrelTemplate} />
            </div>
        )
    }
});
