import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
// Actions
import { fetchTankerShipments,
         addShipmentsRequest,
         deleteShipmentRequest,
         updateSpecRequest } from '../../redux/state/tankerShipments.redux'
// Components
import ShipmentCreator from './components/ShipmentCreator'
import Table from '../../components/Table'
import SpecReportModal from './components/SpecReportModal'

import Tests from './tests/shipments.spec'


export default connect(
    // Pull items from store
    ({query, tankerShipments, tankerTemplates}) =>
    ({query, tankerShipments, tankerTemplates}),
    // Bind actions with dispatch
    { addShipmentsRequest,
      deleteShipmentRequest,
      updateSpecRequest,
      fetchTankerShipments }
)(class ShipmentsView extends Component {
    // Server-side data retrieval (for server rendering).
    static need = [fetchTankerShipments]  // Preload for sub-component

    /**
     * Validates incoming props.
     */
    static propTypes = {
        query: PropTypes.object.isRequired,
        tankerShipments: PropTypes.array.isRequired,
        tankerTemplates: PropTypes.array.isRequired,
    }

    componentDidMount = () => {
        if (typeof describe === 'function') {
            Tests(this);
        }
    }

    filterTemplatesByCompany = (templates, company) => {
        return templates.filter(t => t.company === company);
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

    render() {
        const { query: { company: CO, year: YY, month: MM },
               tankerShipments, tankerTemplates } = this.props;
        const filteredTemplates = this.filterTemplatesByCompany(tankerTemplates, CO);
        let tableHeaders = ["頁", "進貨日期", "材料名稱", "需求量", "Dept", "Unit", "備註", "規範", "除"];
        let tableKeys = ["refPageStr", "dateStr", "product", "amount", "dept", "unit", "note"];


        // Create new array with formatted date and refPage strings.
        const shipments = tankerShipments.map(s => {
            const sa = String(s.refPage).split(".");
            if (sa[1] && sa[1].length < 2) sa[1] += "0";
            return Object.assign({}, s, {
                dateStr: s.date.substr(0,10),
                refPageStr: sa.join('-'),
            })
        });
        
        this.highlightLastAdditions(shipments);

        return (
            <div className="container"
                 style={{maxWidth: '1400px', margin: 'auto'}}>
                <ShipmentCreator
                    company={CO}
                    year={YY}
                    month={MM}
                    templates={filteredTemplates}
                    submitShipments={this.props.addShipmentsRequest} />
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
