/**
 * @overview Redux actions / AJAX requests.
 * Reducer is default export.
 * Constants exported for use in testing.
 * ```
 *     import reducerMethod, * as actionMethods from "this-module";
 * ```
 */

import { encodeQuery } from '../../utils/utils'
import callApi from '../../utils/apiCaller'


/************** CONSTANTS **************/

export const ADD_SHIPMENTS   = Symbol("ADD_SHIPMENTS")
export const LOAD_SHIPMENTS  = Symbol("LOAD_SHIPMENTS")
export const UPDATE_SHIPMENT = Symbol("UPDATE_SHIPMENT")
export const DELETE_SHIPMENT = Symbol("DELETE_SHIPMENT")
const SHIPMENT_URL = `tankerShipment`
const [ GET, POST, PUT, DELETE ] = [ "get", "post", "put", "delete" ]


/************** PRIVATE METHODS **************/

function storeRecentIds(keyword, idArray) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(keyword, JSON.stringify(idArray));
    }
}


/************** ACTIONS **************/

/**
 * Used in `ShipmentContainer`.
 * @param   {object}   shipment New shipment data to send.
 * @returns {function} Function to post a new shipment request and accepts a callback.
 */
export function addShipmentsRequest(shipments) {
    return (dispatch) => {
        callApi(SHIPMENT_URL, POST, {shipments})
        .then(docs => {
            storeRecentIds('recent_shipments', docs.map(doc => doc._id));
            return dispatch({ docs, type: ADD_SHIPMENTS });
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
export function fetchTankerShipments(query, store) {
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
        return callApi(`${SHIPMENT_URL}?${encodeQuery(params)}`)
        .then(docs => dispatch({ docs, type: LOAD_SHIPMENTS }));
    };
}


export function deleteShipmentRequest(shipment) {
    return (dispatch) => {
        callApi(SHIPMENT_URL, DELETE, {_id: shipment._id})
        .then(() => dispatch({ shipment, type: DELETE_SHIPMENT }));
    };
}


export function updateSpecRequest(id, report) {
    return (dispatch) => {
        callApi(`${SHIPMENT_URL}/spec/${id}`, PUT, {report})
        .then(shipment => {
            return dispatch({ shipment, type: UPDATE_SHIPMENT });
        });
    }
}


/************** REDUCER **************/

export default function reducer(state = [], action) {
    switch (action.type) {

        case ADD_SHIPMENTS :
            return [...action.docs, ...state];

        case LOAD_SHIPMENTS :
            return action.docs;

        case UPDATE_SHIPMENT :
            return state.map( s => s._id === action.shipment._id ? action.shipment : s );

        case DELETE_SHIPMENT :
            return state.filter( s => s._id !== action.shipment._id );

        default:
            return state; // Nothing changes for unknown actions.
    }
}
