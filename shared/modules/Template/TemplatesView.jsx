/**
 * @overview Page for viewing and editing (CRUD) of "shipment templates".
 * Shipment templates are repeatable elements of a shipment, which are
 * the destination, product and product number (pn).
 * Excluded are amounts, dates, and notes.
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
// Actions
import { fetchTemplates as fetchTankerTemplates,
         deleteTemplateRequest as deleteTankerTemplate,
         addTemplateRequest as addTankerTemplate,
         updateTemplateRequest as updateTankerTemplate } from '../../redux/state/tankerTemplates.redux'
import { fetchTemplates as fetchBarrelTemplates,
         deleteTemplateRequest as deleteBarrelTemplate,
         addTemplateRequest as addBarrelTemplate,
         updateTemplateRequest as updateBarrelTemplate } from '../../redux/state/barrelTemplates.redux'
import { fetchDepartments } from '../../redux/state/deptLinks.redux'
// Components
import { FA_TRUCK, FA_CUBES } from '../../components/FontAwesome'
import Table from '../../components/Table'
import TemplateCreator from './components/TemplateCreator'
// Test suite
import Tests from './tests/templates.spec'


const BARREL_TYPE = Symbol('BARREL_TYPE')
const TANKER_TYPE = Symbol('TANKER_TYPE')


export default connect(
    // Pull items from store
    ({barrelTemplates, tankerTemplates, query}) => ({barrelTemplates, tankerTemplates, query}),
    // Bind actions with dispatch
    { fetchDepartments,
      fetchTankerTemplates, deleteTankerTemplate, addTankerTemplate, updateTankerTemplate,
      fetchBarrelTemplates, deleteBarrelTemplate, addBarrelTemplate, updateBarrelTemplate }
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

    componentWillMount = () => {
        this.resetState();
    }

    componentDidMount = () => {
        if (typeof describe === 'function') {
            Tests(this);
        }
    }

    resetState = () => {
        this.setState({
            editMode: false,
            template: {
                company: this.props.query.company,
                barcode: true
            },
        });
    }

    /**
     * Sets "template" to existing record for editing.
     */
    editShipment = (template) => {
        this.setState({
            template: Object.assign({}, template),
            editMode: true,
        });
    }

    /**
     * Sets fields in shipment object.
     */
    setTemplateFields = (obj) => {
        this.setState({
            template: Object.assign({}, this.state.template, obj)
        });
    }
    
    deleteTemplate = (type, template) => {
        // WARNING: Might have "race" problem between dispatches.
        if (confirm('真的要把檔案刪除嗎?\nDo you want to delete this template?')) {
            if (type === BARREL_TYPE) {
                this.props.deleteBarrelTemplate(template);
            } else if (type === TANKER_TYPE) {
                this.props.deleteTankerTemplate(template);
            }
            // Wait then dispatch update for sidebar
            setTimeout(() => {
                this.props.fetchDepartments();
            }, 300);
        }
    }

    deleteTankerTemplate = (template) => { 
        this.deleteTemplate(TANKER_TYPE, template);
    }

    deleteBarrelTemplate = (template) => { 
        this.deleteTemplate(BARREL_TYPE, template);
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

    saveTemplate = () => {
        const { editMode, template } = this.state;


        if (!template.shelfLife) delete template.shelfLife;
        if (!template.rtCode) delete template.rtCode;
        if (!template.pn) delete template.pn;

        if (!!template['lotPrefix'] || !!template['pkgQty'] || template['barcode']) {
            if (editMode && !!template._id) {
                this.props.updateBarrelTemplate(template);
            } else if (!editMode && !template._id) {
                this.props.addBarrelTemplate(template);
            }
        } else {
            if (editMode && !!template._id) {
                this.props.updateTankerTemplate(template);
            } else if (!editMode && !template._id) {
                this.props.addTankerTemplate(template);
            }
        }

        this.resetState();

        // Wait then dispatch update for sidebar
        setTimeout(() => {
            this.props.fetchDepartments();
        }, 300);
    }

    render() {
        const { props, state } = this;
        const { barrelTemplates, tankerTemplates, query } = this.props;
        const tankerTableHeaders = ["公司", "Dept", "Unit", "材料名稱", "料號", "編", "除"];
        const tankerTableKeys = ["company", "dept", "unit", "product", "pn"];
        const barrelTableHeaders = ["公司", "批次字首", "RT Code", "材料名稱", "料號", "容量", "保存期間", "barcode", "datamatrix", "編", "除"];
        const barrelTableKeys = ["company", "lotPrefix", "rtCode", "product", "pn", "pkgQty", "shelfLife", "barcode", "datamatrix"];

        const filteredBarrelTemplates = barrelTemplates.filter(this.barrelFilter);
        const filteredTankerTemplates = tankerTemplates.filter(this.tankerFilter);

        return (
            <div className="container"
                 >
                <TemplateCreator
                    template={state.template}
                    editMode={state.editMode}
                    saveTemplate={this.saveTemplate}
                    setFields={this.setTemplateFields}
                    reset={this.resetState} />

                <br />
                <br />

                { query.dept ? <span></span> :
                <div>
                    <legend>桶裝 &nbsp; <img alt="jerrycan" src="/img/jerrycan.svg" height="20" /><img alt="jerrycan" src="/img/jerrycan.svg" height="20" /> &nbsp;
                        Barrel Shipment Templates</legend>
                    <Table
                        tableHeaders={barrelTableHeaders}
                        tableKeys={barrelTableKeys}
                        tableRows={filteredBarrelTemplates}
                        onDelete={this.deleteBarrelTemplate}
                        editShipment={this.editShipment}/>
                </div>
                }

                <br />

                <div>
                    <legend>槽車 &nbsp; <img alt="tanker" src="/img/tanker.svg" height="35" /> &nbsp;
                        Tanker Shipment Templates</legend>
                    <Table
                        tableHeaders={tankerTableHeaders}
                        tableKeys={tankerTableKeys}
                        tableRows={filteredTankerTemplates}
                        onDelete={this.deleteTankerTemplate}
                        editShipment={this.editShipment} />
                </div>
            </div>
        )
    }
})
