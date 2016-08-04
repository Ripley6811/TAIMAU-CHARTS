import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// Actions
import { fetchShipmentTemplates } from '../Template/redux/template.actions';
import { addShipmentsRequest, deleteShipmentRequest } from './redux/shipment.actions';
// Components
import ShipmentCreator from './components/ShipmentCreator';
import Table from '../../components/Table';


export default connect(
    ({query, shipments, templates}) => ({query, shipments, templates}),  // Pull items from store
    { addShipmentsRequest, deleteShipmentRequest, fetchShipmentTemplates }  // Bind actions with dispatch
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
    }

    static defaultProps = {
        shipments: []
    }

    componentWillMount = () => {
        // Ensure required data is loaded.
        if (this.props.templates.length === 0) {
            this.props.fetchShipmentTemplates();
        }
    }

    submitShipments = (newShipmentsArray) => {
        this.props.addShipmentsRequest(newShipmentsArray);
    }

    deleteShipment = (shipment) => {
        if (confirm('真的要把檔案刪除嗎?\nDo you want to delete this shipment?')) {
            this.props.deleteShipmentRequest(shipment);
        }
    }

    render() {
        const { query, shipments } = this.props;
        let tableHeaders = ["公司", "頁", "進貨日期", "材料名稱", "需求量", "Dept", "Unit", "備註", "除"];
        let tableKeys = ["company", "refPage", "date", "product", "amount", "dept", "unit", "note"];

        // Remove dept and company columns if selected on sidebar and in query.
        if (query.dept) {
            tableHeaders = tableHeaders.filter(each => each !== "Dept");
            tableKeys = tableKeys.filter(each => each !== "dept");
        }
        if (query.company) {
            tableHeaders = tableHeaders.filter(each => each !== "公司");
            tableKeys = tableKeys.filter(each => each !== "company");
        }

        // Remove time from date string.
        shipments.forEach(s => s.date = s.date.substr(0,10));

        return (
            <div className="container"
                 style={{maxWidth: '1400px', margin: 'auto'}}>
                <ShipmentCreator 
                    query={this.props.query}
                    templates={this.props.templates}
                    submitShipments={this.submitShipments} />
                <br />
                <legend>Shipment History</legend>
                <Table
                    tableHeaders={tableHeaders}
                    tableKeys={tableKeys}
                    tableRows={shipments}
                    onDelete={this.deleteShipment} />
            </div>
        );
    }
});
