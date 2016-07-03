/**
 * @overview
 */
import Config from '../../../server/config';
/**
 * `fetch` is a replacement for using XMLHttpRequest
 * https://github.com/matthew-andrews/isomorphic-fetch
 */
import fetch from 'isomorphic-fetch';

/**
 * 
 * @param   {object} params Simple one-level (non-nested) object.
 * @returns {string} Query parameter string to add after "?".
 */
function encodeQueryParameters(params) {
    return Object.keys(params)
        .map(
            key => encodeURI(`${key}=${params[key]}`)
        ).join("&");
}

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${Config.port}`) : '';

export const DELETE_SHIPMENT = 'DELETE_SHIPMENT';
export const ADD_SELECTED_SHIPMENT = 'ADD_SELECTED_SHIPMENT';
export const ADD_SHIPMENTS = 'ADD_SHIPMENTS';
export const LOAD_SHIPMENTS = 'LOAD_SHIPMENTS';
export const UPDATE_TEMPLATES = 'UPDATE_TEMPLATES';
export const ADD_TEMPLATES = 'ADD_TEMPLATES';
export const ADD_TEMPLATE = 'ADD_TEMPLATE';
export const DELETE_TEMPLATE = 'DELETE_TEMPLATE';
export const ADD_DEPT_LINKS = 'ADD_DEPT_LINKS';
export const ADD_SELECTED_DEPT = 'ADD_SELECTED_DEPT';
export const SET_LOCATION = 'SET_LOCATION';

/**
 * Used in `ShipmentContainer`.
 * @param   {object}   shipment New shipment data to send.
 * @returns {function} Function to post a new shipment request and accepts a callback.
 */
export function addShipmentRequest(shipment) {
    addShipmentsRequest([shipment]);
}

export function addShipmentsRequest(shipments) {
    const reducerFormat = (shipments) => ({
        type: ADD_SHIPMENTS,
        shipments,
    });

    // "dispatch" is a callback that runs the reducer.
    return (dispatch) => {
        fetch(`${baseURL}/api/shipment`, {
            method: 'post',
            body: JSON.stringify({shipments}),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).
        then((res) => res.json()).
        then((res) => dispatch(reducerFormat(res.shipments)));
    };
}


export function addTemplateRequest(template) {
    const reducerFormat = (template) => ({
        type: ADD_TEMPLATE,
        template
    });

    return (dispatch) => {
        /**
         * AJAX req to `addTemplate` in `server/routes/template.routes` ->
         * `server/controllers/shipmentTemplate.controller`
         */
        fetch(`${baseURL}/api/shipmentTemplate`, {
            method: 'post',
            body: JSON.stringify(template),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).
        then(res => res.json()).  // Throws error if no json
        then(data => dispatch(reducerFormat(data.savedRec)));
    };
}


/**
 * Set the `state.shipment` to the selected shipment.
 * @param   {object} shipment Shipment data object
 * @returns {object} Reducer object with action type
 */
export function addSelectedShipment(shipment) {
    return {
        type: ADD_SELECTED_SHIPMENT,
        shipment,
    };
}


/**
 * Runs on server side first in ShipmentContainer.
 * @returns {[[Type]]} [[Description]]
 */
export function fetchShipments(params) {
    if (!params) throw "params not defined";
    const LIMIT = 50;
    const reducerFormat = (shipments) => ({
        type: LOAD_SHIPMENTS,
        shipments,
        params,
    });
    
    for (let key in params) {
        if (params[key] === undefined) delete params[key];
    }
    
    if (!('year' in params)) params.limit = LIMIT;
    
    const paramString = "?" + encodeQueryParameters(params);
    console.log("fetching shipments with following parameters:");
    console.dir(paramString);

    // "dispatch" is a callback that runs the reducer.
    return (dispatch) => {
        return fetch(`${baseURL}/api/shipment` + paramString).
        then((response) => response.json()).
        then((response) => dispatch(reducerFormat(response.shipments)));
    };
}


export function fetchShipmentTemplates() {
    const reducerFormat = (templates) => {
        return {
            type: ADD_TEMPLATES,
            templates: templates
        };
    };

    return (dispatch) => {
        return fetch(`${baseURL}/api/shipmentTemplate`).
        then((response) => response.json()).
        then((response) => dispatch(reducerFormat(response.templates)));
    };
}


export function fetchDepartments() {    
    const reducerFormat = (records) => {
        const tree = {};
        records.forEach((each) => {
            tree[each.company] ? tree[each.company].push(each.dept) : tree[each.company] = [each.dept];
        });
        
        return {
            type: ADD_DEPT_LINKS,
            tree
        };
    };

    return (dispatch) => {
        return fetch(`${baseURL}/api/getDepartments`).
        then((response) => response.json()).
        then((response) => dispatch(reducerFormat(response.records)));
    };
}


export function deleteShipmentRequest(shipment) {
    const reducerFormat = (shipment) => ({
        type: DELETE_SHIPMENT,
        shipment,
    });

    return (dispatch) => {
        fetch(`${baseURL}/api/shipment`, {
            method: 'delete',
            body: JSON.stringify({
                _id: shipment._id,
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).
        then(res => {
            if (res.status === 404) throw res;
        }).
        then(() => dispatch(reducerFormat(shipment)));
    };
}


export function deleteTemplateRequest(template) {
    const reducerFormat = (template) => {
        const newTemplate = Object.assign({}, template);
        delete newTemplate['_id'];
        return {
            type: DELETE_TEMPLATE,
            deleteID: template._id,
            template: newTemplate,
        }
    };

    return (dispatch) => {
        fetch(`${baseURL}/api/shipmentTemplate`, {
            method: 'delete',
            body: JSON.stringify({
                _id: template._id,
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).
        then(res => {
            if (res.status === 404) throw res;
        }).
        then(() => dispatch(reducerFormat(template)));
    };
}

export function setLocation(val) {
    return (dispatch) => dispatch({
        type: SET_LOCATION,
        location: val
    });
}