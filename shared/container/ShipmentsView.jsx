import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../redux/actions/actions';

// COMPONENTS
import ShipmentCreator from '../components/ShipmentCreator';
import Table from '../components/Table';



class ShipmentContainer extends Component {
    // Server-side data retrieval (for server rendering).
    static need = [Actions.fetchShipments, 
                   Actions.fetchShipmentTemplates]

    componentDidMount() {
        /**
         * Ensure shipments are loaded into state 
         * when navigating on client-side.
         */ 
        if (this.props.shipments.length === 0) {
            this.props.dispatch(Actions.fetchShipments());
            this.props.dispatch(Actions.fetchShipmentTemplates());
        }
    }

    submitShipments = (newShipmentsArray) => {
        this.props.dispatch(Actions.addShipmentsRequest(newShipmentsArray));
    }
    
    deleteShipment = (shipment) => {
        if (confirm('真的要把檔案刪除嗎?\nDo you want to delete this shipment?')) {
            this.props.dispatch(Actions.deleteShipmentRequest(shipment));
        }
    }

    render() {
        const props = this.props;
        let tableHeaders = ["公司", "頁", "進貨日期", "材料名稱", "料號", "需求量", "Dept", "Unit", "備註", "除"];
        let tableKeys = ["company", "refPage", "date", "product", "pn", "amount", "dept", "unit", "note"];
        if (props.shipmentQuery.dept) {
            tableHeaders = tableHeaders.filter(each => each !== "Dept");
            tableKeys = tableKeys.filter(each => each !== "dept");
        }
        if (props.shipmentQuery.company) {
            tableHeaders = tableHeaders.filter(each => each !== "公司");
            tableKeys = tableKeys.filter(each => each !== "company");
        }
        
        // Remove time from date string.
        props.shipments.forEach((s, i) => s.date = s.date.substr(0,10));
        
        return (
        <div className="container"
             style={{maxWidth: '1400px', margin: 'auto'}}>
            <ShipmentCreator
                submitShipments={this.submitShipments}
                />
            <br />
            <legend>Shipment History</legend>
            <Table 
                tableHeaders={tableHeaders}
                tableKeys={tableKeys}
                tableRows={props.shipments}
                onDelete={this.deleteShipment}
                />
        </div>
        );
    }
}

// Retrieve data from store as props
const mapStateToProps = (store) => ({
    shipmentQuery: store.shipmentQuery,
    shipment: store.shipment,
    shipments: store.shipments,
});

/**
 * Redux's `connect` method injects `dispatch` method into class.
 * `mapStateToProps` makes store objects accessible as props.
 */
export default connect(mapStateToProps)(ShipmentContainer);