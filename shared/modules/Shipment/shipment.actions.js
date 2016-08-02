/**
 * @overview Redux actions / AJAX requests.
 */
import { baseURL } from '../../../server/config';
import { encodeQuery } from '../../utils/utils';
import callApi from '../../utils/apiCaller';


export const ADD_SHIPMENTS         = Symbol("shipment.actions.ADD_SHIPMENTS"),
             LOAD_SHIPMENTS        = Symbol("shipment.actions.LOAD_SHIPMENTS"),
             DELETE_SHIPMENT       = Symbol("shipment.actions.DELETE_SHIPMENT");


/**
 * Used in `ShipmentContainer`.
 * @param   {object}   shipment New shipment data to send.
 * @returns {function} Function to post a new shipment request and accepts a callback.
 */
export function addShipmentsRequest(shipments) {
    const reducerFormat = (shipments) => ({
        type: ADD_SHIPMENTS,
        shipments,
    });

    // "dispatch" is a callback that runs the reducer.
    return (dispatch) => {
        callApi(`shipment`, 'post', {shipments})
        .then(docs => dispatch(reducerFormat(docs)));
    };
}
// Routes single shipment to multiple shipment method
export function addShipmentRequest(shipment) {
    addShipmentsRequest([shipment]);
}


/**
 * Runs on server side first in ShipmentContainer.
 * @returns {function} Promise to send AJAX results to reducer.
 */
export function fetchShipments() {
    const params = Object.assign({}, arguments[0]);

    const reducerFormat = (shipments) => ({
        type: LOAD_SHIPMENTS,
        shipments
    });

    for (let key in params) {
        if (params[key] === undefined) delete params[key];
    }

    // "dispatch" is a callback that runs the reducer.
    return (dispatch) => {
        return callApi(`shipment?${encodeQuery(params)}`)
        .then(docs => dispatch(reducerFormat(docs)));
    };
}


export function deleteShipmentRequest(shipment) {
    const reducerFormat = (shipment) => ({
        type: DELETE_SHIPMENT,
        shipment,
    });

    return (dispatch) => {
        callApi(`shipment`, 'delete', {_id: shipment._id})
        .then(() => dispatch(reducerFormat(shipment)));
    };
}
