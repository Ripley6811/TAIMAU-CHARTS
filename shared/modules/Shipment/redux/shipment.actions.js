/**
 * @overview Redux actions / AJAX requests.
 */
import { baseURL } from '../../../../server/config';
import { encodeQuery } from '../../../utils/utils';
import callApi from '../../../utils/apiCaller';


export const ADD_SHIPMENTS         = Symbol("shipment.actions.ADD_SHIPMENTS"),
             LOAD_SHIPMENTS        = Symbol("shipment.actions.LOAD_SHIPMENTS"),
             DELETE_SHIPMENT       = Symbol("shipment.actions.DELETE_SHIPMENT");


function storeRecentIds(keyword, idArray) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(keyword, JSON.stringify(idArray));
    }
}


/**
 * Used in `ShipmentContainer`.
 * @param   {object}   shipment New shipment data to send.
 * @returns {function} Function to post a new shipment request and accepts a callback.
 */
export function addShipmentsRequest(shipments) {
    return (dispatch) => {
        callApi(`shipment`, 'post', {shipments})
        .then(docs => {
            storeRecentIds('recent_shipments', docs.map(doc => doc._id));
            return dispatch({
                type: ADD_SHIPMENTS,
                shipments: docs,
            });
        });
    };
}
// Routes single shipment to multiple shipment method
export function addShipmentRequest(shipment) {
    addShipmentsRequest([shipment]);
}


/**
 * Populates the redux store with shipment records.
 * 
 * Called on server for initial page load. Current store state is passed as
 * second parameter on server and should include query parameters if sent in
 * cookie of initial page request.
 * Returns empty array if no company is selected.
 * Returns current year if no year is selected.
 * 
 * @param   {object}   query Query paramaters for database find.
 * @param   {object}   store Redux store state on server else undefined.
 * @returns {function} Fetch shipments api dispatch method.
 */
export function fetchShipments(query, store) {
    const params = query ? Object.assign({}, query) : {};
    
    // Server-side "need" provides store reference
    if (store && store.query) {
        Object.assign(params, store.query);
    }

    for (let key in params) {
        if (params[key] === undefined) delete params[key];
    }
    
    // Require a company
    if (!params.company) {
        params.company = "none";
    }
    
    // Limit to current year if no date selected
    if (!params.year) {
        params.year = new Date().getFullYear();
    }

    // "dispatch" is a callback that runs the reducer.
    return (dispatch) => {
        return callApi(`shipment?${encodeQuery(params)}`)
        .then(docs => dispatch({
            type: LOAD_SHIPMENTS,
            shipments: docs
        }));
    };
}


export function deleteShipmentRequest(shipment) {
    return (dispatch) => {
        callApi(`shipment`, 'delete', {_id: shipment._id})
        .then(() => dispatch({
            type: DELETE_SHIPMENT,
            shipment,
        }));
    };
}
