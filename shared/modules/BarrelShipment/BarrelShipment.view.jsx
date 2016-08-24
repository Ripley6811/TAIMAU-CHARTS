import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { getRoute } from '../../utils/utils'
// Actions
import { fetchBarrelShipments,
         addShipmentRequest,
         updateShipmentRequest,
         deleteShipmentRequest } from '../../redux/state/barrelShipments.redux'
// Components
import BarrelShipmentTable from './components/BarrelShipmentTable'
import BarrelShipmentEditor from './components/BarrelShipmentEditor'


export default connect(
    // Pull items from store
    ({query, barrelShipments, barrelTemplates}) =>
    ({query, barrelShipments, barrelTemplates}),
    // Bind actions with dispatch
    { fetchBarrelShipments,
      addShipmentRequest,
      updateShipmentRequest,
      deleteShipmentRequest }
)(class BarrelShipmentsView extends Component {
    // Server-side data retrieval (for server rendering).
    static need = [fetchBarrelShipments]  // Preload for sub-component

    /**
     * Validates incoming props.
     */
    static propTypes = {
        // Props from store
        query: PropTypes.object.isRequired,
        barrelShipments: PropTypes.array.isRequired,
        barrelTemplates: PropTypes.array.isRequired,
    }

    componentWillMount = () => {
        this.resetState();
    }

    deleteShipment = (shipment) => {
        if (confirm('真的要把檔案刪除嗎?\nDo you want to delete this shipment?')) {
            this.props.deleteShipmentRequest(shipment);
        }
    }

    /**
     * Sets "shipment" fields with data from previous shipment.
     */
    prefillNewShipment = (shipment) => {
        const { product, lotPrefix, pn, company, lotID, orderID, note, count,
                rtCode, orderTotal, pkgQty, shelfLife, barcode, datamatrix,
                start, makeYear, makeMonth, makeDate, rtSeq } = shipment;
        const today = new Date();
        this.setState({
            editMode: false,
            shipment: {
                product, lotPrefix, pn, company, lotID, orderID, note, count,
                rtCode, orderTotal, pkgQty, shelfLife, barcode, datamatrix,
                makeYear, makeMonth, makeDate,
                start: start+count,
                shipYear: today.getFullYear(),
                shipMonth: today.getMonth(),
                shipDate: today.getDate(),
                rtSeq: '',
            },
        });
    }

    /**
     * Sets "shipment" to existing record for editing.
     */
    editShipment = (shipment) => {
        this.setState({
            shipment: Object.assign({}, shipment),
            editMode: true,
        });
    }

    /**
     * Sets fields in shipment object.
     */
    setShipmentFields = (obj) => {
        this.setState({
            shipment: Object.assign({}, this.state.shipment, obj)
        });
    }

    saveShipment = () => {
        const { editMode, shipment } = this.state;

        if (editMode && !!shipment._id) {
            this.props.updateShipmentRequest(shipment);
        } else if (!editMode && !shipment._id) {
            this.props.addShipmentRequest(shipment);
        }

        this.resetState();
    }

    resetState = () => {
        const today = new Date(),
              month = today.getMonth() + 1,
              date = today.getDate(),
              YYYY = today.getFullYear().toString(),
              MM = month < 10 ? '0'+month : month.toString(),
              DD = date < 10 ? '0'+date : date.toString();
        this.setState({
            editMode: false,
            shipment: {
                company: this.props.query.company,
                lotPrefix: `P`,
                lotID: `P${YYYY.substr(2)}${MM}${DD}01`,
                start: 1,
                shipYear: today.getFullYear(),
                shipMonth: today.getMonth(),
                shipDate: today.getDate(),
                makeYear: today.getFullYear(),
                makeMonth: today.getMonth(),
                makeDate: today.getDate(),
                barcode: true
            },
        });
    }

    filterTemplatesByCompany = (templates, company) => {
        return templates.filter(t => t.company === company);
    }

    render() {
        const { props, state } = this,
              { company } = props.query;

        if (!props.query.company) {
            return <div><h2>Select a company.</h2></div>
        }

        return (
            <div className="container">
                <BarrelShipmentEditor
                    shipment={state.shipment}
                    templates={props.barrelTemplates.filter(t => t.company === company)}
                    setFields={this.setShipmentFields}
                    saveShipment={this.saveShipment}
                    editMode={state.editMode}
                    reset={this.resetState} />
                <br />
                <br />
                <BarrelShipmentTable
                    barrelShipments={props.barrelShipments}
                    deleteShipment={this.deleteShipment}
                    prefillNewShipment={this.prefillNewShipment}
                    editShipment={this.editShipment} />
            </div>
        );
    }
})
