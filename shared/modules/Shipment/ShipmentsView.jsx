import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
// Actions
import { fetchTankerTemplates } from '../../redux/state/tankerTemplates.redux'
import { addShipmentsRequest, deleteShipmentRequest, updateSpecRequest } from '../../redux/state/tankerShipments.redux'
// Components
import ShipmentCreator from './components/ShipmentCreator'
import Table from '../../components/Table'
import SpecReportModal from './components/SpecReportModal'

import Tests from './tests/shipments.spec'


export default connect(
    // Pull items from store
    ({query, tankerShipments, tankerTemplates}) => ({query, tankerShipments, tankerTemplates}),
    // Bind actions with dispatch
    { addShipmentsRequest, deleteShipmentRequest, updateSpecRequest,
      fetchTankerTemplates }
)(class ShipmentsView extends Component {
    // Server-side data retrieval (for server rendering).
    static need = [fetchTankerTemplates]  // Preload for sub-component

    /**
     * Validates incoming props.
     */
    static propTypes = {  // ES7 style
        // Props from store
        query: PropTypes.object.isRequired,
        tankerShipments: PropTypes.array.isRequired,
        tankerTemplates: PropTypes.array.isRequired,
        // Dispatch bound actions
        addShipmentsRequest: PropTypes.func.isRequired,
        deleteShipmentRequest: PropTypes.func.isRequired,
        fetchTankerTemplates: PropTypes.func.isRequired,
        updateSpecRequest: PropTypes.func.isRequired,
    }

    state = {
        filteredCompanyTemplates: []
    }

    componentWillMount = () => {
        const { tankerShipments, tankerTemplates, query } = this.props;
        // Ensure required data is loaded.
        if (tankerTemplates.length === 0) {
            this.props.fetchTankerTemplates();
        }
        this.setFilteredCompanyTemplates(tankerTemplates, query.company);
        this.highlightLastAdditions(tankerShipments);
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.query.company !== nextProps.query.company) {
            this.setFilteredCompanyTemplates(nextProps.tankerTemplates, nextProps.query.company);
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
        this.highlightLastAdditions(nextProps.tankerShipments);
    }

    componentDidMount = () => {
        if (typeof describe === 'function') {
            Tests(this);
        }
    }

    render() {
        const { query, tankerShipments } = this.props;
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
        tankerShipments.forEach(s => s.dateStr = s.date.substr(0,10));
        // Create hyphenated string from refPage decimal
        tankerShipments.forEach(s => {
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
                    tableRows={tankerShipments}
                    onDelete={this.deleteShipment}
                    specModal={SpecReportModal}
                    updateSpec={this.props.updateSpecRequest} />
            </div>
        );
    }
});
