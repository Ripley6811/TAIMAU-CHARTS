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

const URL = "barrelShipment"
const [ GET, PUT, POST, DELETE ] = [ "get", "put", "post", "delete" ]
export const LOAD_SHIPMENTS = Symbol("LOAD_SHIPMENTS")
export const ADD_SHIPMENT = Symbol("ADD_SHIPMENT")
export const UPDATE_SHIPMENT = Symbol("UPDATE_SHIPMENT")
export const DELETE_SHIPMENT = Symbol("DELETE_SHIPMENT")


/************** ACTIONS **************/

export function fetchBarrelShipments(query, store) {
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

    // Remove 'dept'
    if (params.dept) {
        delete params.dept;
    }

    // Limit to current year if no date selected
    if (!params.year) {
        params.year = new Date().getFullYear();
    }

    // "dispatch" is a callback that runs the reducer.
    return (dispatch) => {
        return callApi(`${URL}?${encodeQuery(params)}`)
        .then(docs => dispatch({ docs, type: LOAD_SHIPMENTS }));
    };
}


export function addShipmentRequest(shipment) {
    return (dispatch) => {
        callApi(URL, POST, {shipment})
        .then(doc => dispatch({ doc, type: ADD_SHIPMENT }));
    };
}


export function updateShipmentRequest(shipment) {
    return (dispatch) => {
        callApi(URL, PUT, {shipment})
        .then(doc => dispatch({ doc, type: UPDATE_SHIPMENT }));
    };
}


export function deleteShipmentRequest(doc) {
    return (dispatch) => {
        callApi(URL, DELETE, {_id: doc._id})
        .then(() => dispatch({ doc, type: DELETE_SHIPMENT }));
    };
}


/************** REDUCER **************/

export default function reducer(state = [], {type, doc, docs}) {
    switch (type) {

        case LOAD_SHIPMENTS:
            return docs;

        case ADD_SHIPMENT:
            return [doc, ...state];

        case UPDATE_SHIPMENT:
            return state.map( each => each._id === doc._id ? doc : each );

        case DELETE_SHIPMENT :
            return state.filter( each => each._id !== doc._id );

        default:
            return state; // Nothing changes for unknown actions.
    };
}
