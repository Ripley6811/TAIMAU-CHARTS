/**
 * @overview
 */
import Config from '../../../server/config';
/**
 * `fetch` is a replacement for using XMLHttpRequest and employs ES6 "Promise"
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



export const UPDATE_QUERY = 'UPDATE_QUERY';
export function updateSavedQuery(query) {
    return {
        type: UPDATE_QUERY,
        query,
    };
}


export function requestTriMonthlyPDF(company, startDate, endDate, callback) {
    const URL = `${baseURL}/api/shipmentsPDF?` +
          `company=${company}&start=${startDate}&end=${endDate}`;
    return fetch(URL).
        then(res => res.json()).
        then(jsonData => callback(jsonData));
}


export function requestWasteWaterPDF(company, startDate, endDate, callback) {
    const URL = `${baseURL}/api/shipmentsPDF?` +
          `company=${company}&start=${startDate}&end=${endDate}&unit=廢水`;
    return fetch(URL).
        then(res => res.json()).
        then(jsonData => callback(jsonData));
}


export function getAllProducts(callback) {
    const URL = `${baseURL}/api/product`;
    return fetch(URL).
        then(res => res.json()).
        then(data => callback(data.records));
}


export const ADD_SHIPMENTS = 'ADD_SHIPMENTS';
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
// Routes single shipment to multiple shipment method
export const addShipmentRequest = (shipment) =>addShipmentsRequest([shipment]);


export const ADD_TEMPLATE = 'ADD_TEMPLATE';
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


export const ADD_SELECTED_SHIPMENT = 'ADD_SELECTED_SHIPMENT';
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


export const LOAD_SHIPMENTS = 'LOAD_SHIPMENTS';
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

    const paramString = "?" + encodeQueryParameters(params);

    // "dispatch" is a callback that runs the reducer.
    return (dispatch) => {
        return fetch(`${baseURL}/api/shipment${paramString}`).
        then((res) => res.json()).
        then((res) => dispatch(reducerFormat(res.shipments)));
    };
}


export const LOAD_TEMPLATES = 'LOAD_TEMPLATES';
export function fetchShipmentTemplates() {
    const reducerFormat = (templates) => {
        return {
            type: LOAD_TEMPLATES,
            templates: templates
        };
    };

    return (dispatch) => {
        // If used in "need" list then requires "return" keyword below (?)
        return fetch(`${baseURL}/api/shipmentTemplate`).
        then((res) => res.json()).
        then((res) => dispatch(reducerFormat(res.templates)));
    };
}


export const ADD_DEPT_LINKS = 'ADD_DEPT_LINKS';
export function fetchDepartments() {
    const reducerFormat = (records) => {
        // Rearrange records into a tree
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
        // If used in "need" list then requires "return" keyword below (?)
        return fetch(`${baseURL}/api/getDepartments`).
        then((res) => res.json()).
        then((res) => dispatch(reducerFormat(res.records)));
    };
}


export const DELETE_SHIPMENT = 'DELETE_SHIPMENT';
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


export const DELETE_TEMPLATE = 'DELETE_TEMPLATE';
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
