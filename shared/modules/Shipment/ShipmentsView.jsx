import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
// Actions
import { fetchShipmentTemplates } from '../Template/redux/template.actions';
import { addShipmentsRequest, deleteShipmentRequest, updateSpecRequest } from './redux/shipment.actions';
// Components
import ShipmentCreator from './components/ShipmentCreator'
import Table from '../../components/Table'
import SpecReportModal from './components/SpecReportModal'

import Tests from './tests/shipments.spec'


export default connect(
    ({query, shipments, templates}) => ({query, shipments, templates}),  // Pull items from store
    { addShipmentsRequest, deleteShipmentRequest, updateSpecRequest,
      fetchShipmentTemplates }  // Bind actions with dispatch
)(class ShipmentsView extends Component {
    // Server-side data retrieval (for server rendering).
    static need = [fetchShipmentTemplates]  // Preload for sub-component

    /**
     * Validates incoming props.
     */
    static propTypes = {  // ES7 style
        // Props from store
        query: PropTypes.object.isRequired,
        shipments: PropTypes.array.isRequired,
        templates: PropTypes.array.isRequired,
        // Dispatch bound actions
        addShipmentsRequest: PropTypes.func.isRequired,
        deleteShipmentRequest: PropTypes.func.isRequired,
        fetchShipmentTemplates: PropTypes.func.isRequired,
        updateSpecRequest: PropTypes.func.isRequired,
    }

    static defaultProps = {
        shipments: []
    }

    state = {
        filteredCompanyTemplates: []
    }

    componentWillMount = () => {
        const { templates, query } = this.props;
        // Ensure required data is loaded.
        if (templates.length === 0) {
            this.props.fetchShipmentTemplates();
        }
        this.setFilteredCompanyTemplates(templates, query.company);
        this.highlightLastAdditions(this.props.shipments);
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.query.company !== nextProps.query.company) {
            this.setFilteredCompanyTemplates(nextProps.templates, nextProps.query.company);
        }
    }

    setFilteredCompanyTemplates = (templates, company) => {
        this.setState({
            filteredCompanyTemplates: templates.filter(t => t.company === company)
        });
    }

    submitShipments = (newShipmentsArray) => {
        // Strip the (Formulas) following chinese product names
        newShipmentsArray.forEach(each => each.product = each.product.split("(")[0].trim());
        this.props.addShipmentsRequest(newShipmentsArray);
    }

    deleteShipment = (shipment) => {
        if (confirm('真的要把檔案刪除嗎?\nDo you want to delete this shipment?')) {
            this.props.deleteShipmentRequest(shipment);
        }
    }

    highlightLastAdditions = (shipments) => {
        if (typeof localStorage !== 'undefined' && localStorage.recent_shipments) {
            const idsToHighlight = JSON.parse(localStorage.recent_shipments);
            for (const shipment of shipments) {
                shipment.hightlight = idsToHighlight.indexOf(shipment._id) >= 0;
            }
        }
    }

    componentWillUpdate = (nextProps, nextState) => {
        this.highlightLastAdditions(nextProps.shipments);
    }

    componentDidMount = () => {
        if (typeof describe === 'function') {
            Tests(this);
        }
    }

    render() {
        const { query, shipments } = this.props;
        let tableHeaders = ["公司", "頁", "進貨日期", "材料名稱", "需求量", "Dept", "Unit", "備註", "規範", "除"];
        let tableKeys = ["company", "refPageStr", "dateStr", "product", "amount", "dept", "unit", "note"];

        // Remove dept column if selected on sidebar and in query.
//        if (query.dept) {
//            tableHeaders = tableHeaders.filter(each => each !== "Dept");
//            tableKeys = tableKeys.filter(each => each !== "dept");
//        }
        // Remove company column if selected on sidebar and in query.
        if (query.company) {
            tableHeaders = tableHeaders.filter(each => each !== "公司");
            tableKeys = tableKeys.filter(each => each !== "company");
        }

        // Create date string from datetime field
        shipments.forEach(s => s.dateStr = s.date.substr(0,10));
        // Create hyphenated string from refPage decimal
        shipments.forEach(s => {
            const sa = String(s.refPage).split(".");
            if (sa[1] && sa[1].length < 2) sa[1] += "0";
            s.refPageStr = sa.join("-");
        });

        return (
            <div className="container"
                 style={{maxWidth: '1400px', margin: 'auto'}}>
                <ShipmentCreator
                    company={this.props.query.company}
                    year={this.props.query.year}
                    month={this.props.query.month}
                    companyTemplates={this.state.filteredCompanyTemplates}
                    submitShipments={this.submitShipments} />
                <br />
                <legend>Shipment History
                    <label className="badge" style={{position: "relative", left: "20px", backgroundColor: "gold", color: "black"}}>金色 : 最近新增</label>
                </legend>
                <Table
                    tableHeaders={tableHeaders}
                    tableKeys={tableKeys}
                    tableRows={shipments}
                    onDelete={this.deleteShipment}
                    specModal={SpecReportModal}
                    updateSpec={this.props.updateSpecRequest} />
            </div>
        );
    }
});
