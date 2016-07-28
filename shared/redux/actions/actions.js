/**
 * @overview Redux actions / AJAX requests.
 */
import { baseURL } from '../../../server/config';
import { encodeQuery } from '../../utils/utils';
/**
 * `fetch` is a replacement for using XMLHttpRequest and employs ES6 "Promise"
 * https://github.com/matthew-andrews/isomorphic-fetch
 */
import fetch from 'isomorphic-fetch';


export const UPDATE_QUERY           = Symbol(),
             ADD_SHIPMENTS          = Symbol(),
             ADD_TEMPLATE           = Symbol(),
             ADD_SELECTED_SHIPMENT  = Symbol(),
             LOAD_SHIPMENTS         = Symbol(),
             LOAD_TEMPLATES         = Symbol(),
             ADD_DEPT_LINKS         = Symbol(),
             DELETE_SHIPMENT        = Symbol(),
             DELETE_TEMPLATE        = Symbol();


export function updateSavedQuery(query) {
    return {
        type: UPDATE_QUERY,
        query,
    };
}


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
        then(res => res.json()).
        then(docs => dispatch(reducerFormat(docs)));
    };
}
// Routes single shipment to multiple shipment method
export const addShipmentRequest = (shipment) => 
             addShipmentsRequest([shipment]);


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
        then(doc => dispatch(reducerFormat(doc)));
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
        return fetch(`${baseURL}/api/shipment?${encodeQuery(params)}`).
        then(res => res.json()).
        then(docs => dispatch(reducerFormat(docs)));
    };
}



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
        then(res => res.json()).
        then(docs => dispatch(reducerFormat(docs)));
    };
}



export function fetchDepartments() {
    const reducerFormat = (records) => {
        return {
            type: ADD_DEPT_LINKS,
            records
        };
    };

    return (dispatch) => {
        // If used in "need" list then requires "return" keyword below (?)
        return fetch(`${baseURL}/api/getDepartments`).
        then(res => res.json()).
        then(docs => dispatch(reducerFormat(docs)));
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
