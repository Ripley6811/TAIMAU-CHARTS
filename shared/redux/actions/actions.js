/**
 * @overview
 */
import Config from '../../../server/config';
/**
 * `fetch` is a replacement for using XMLHttpRequest
 * https://github.com/matthew-andrews/isomorphic-fetch
 */
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${Config.port}`) : '';

export const ADD_SHIPMENT = 'ADD_SHIPMENT';
export const DELETE_SHIPMENT = 'DELETE_SHIPMENT';
export const ADD_SELECTED_SHIPMENT = 'ADD_SELECTED_SHIPMENT';
export const ADD_SHIPMENTS = 'ADD_SHIPMENTS';
export const UPDATE_OPTIONS = 'UPDATE_OPTIONS';
export const ADD_TEMPLATES = 'ADD_TEMPLATES';
export const DELETE_TEMPLATE = 'DELETE_TEMPLATE';
export const ADD_DEPT_LINKS = 'ADD_DEPT_LINKS';
export const ADD_SELECTED_DEPT = 'ADD_SELECTED_DEPT';

/**
 * Used in `ShipmentContainer`.
 * @param   {object}   shipment New shipment data to send.
 * @returns {function} Function to post a new shipment request and accepts a callback.
 */
export function addShipmentRequest(shipment) {
    const reducerFormat = (shipment) => ({
        type: ADD_SHIPMENT,
        shipment
    });

    return (dispatch) => {
        /**
         * AJAX req to `addShipment` in `server/routes/shipment.routes` ->
         * `server/controllers/shipment.controller`
         */
        fetch(`${baseURL}/api/addShipment`, {
            method: 'post',
            body: JSON.stringify(shipment),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).
        then(res => res.json()).
        then(res => dispatch(reducerFormat(res.shipment)));
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

//export function addSelectedDept(obj) {
//    if (!('company' in obj)) throw "'company' parameter missing."
//    if (!('dept' in obj)) throw "'dept' parameter missing."
//    
//    const reducerFormat = (shipments) => ({
//        type: ADD_SELECTED_DEPT,
//        obj,
//        shipments,
//    });
//    
//    const limit = 500;
//    // "dispatch" is a callback that runs the reducer.
//    return (dispatch) => {
//        return fetch(`${baseURL}/api/getShipments?limit=${limit}&company=${obj.company}&dept=${obj.dept}` ).
//        then((response) => response.json()).
//        then((response) => dispatch(reducerFormat(response.shipments)));
//    };
//}

/**
 * Runs on server side first in ShipmentContainer.
 * @returns {[[Type]]} [[Description]]
 */
export function fetchShipments(params = {}) {
    const reducerFormat = (shipments) => ({
        type: ADD_SHIPMENTS,
        shipments,
        params,
    });
    
    for (let key in params) {
        if (!params[key]) delete params[key];
    }
    
    const paramString = "?" + Object.keys(params).map(key => `${key}=${params[key]}`).join("&");
    console.log("fetching shipments with following parameters:");
    console.dir(paramString);

    // "dispatch" is a callback that runs the reducer.
    return (dispatch) => {
        return fetch(`${baseURL}/api/getShipments` + paramString).
        then((response) => response.json()).
        then((response) => dispatch(reducerFormat(response.shipments)));
    };
}

export function fetchOptions(shipment = {}) {
    const reducerFormat = (options) => {
        const companyList = Array.from(new Set(options.map(each => each.company)));
        const nameList = Array.from(new Set(options.map(each => each.name)));
        const pnList = Array.from(new Set(options.map(each => each.pn)));
        const deptList = Array.from(new Set(options.map(each => each.dept)));
        const unitList = Array.from(new Set(options.map(each => each.unit)));

        return {
            type: UPDATE_OPTIONS,
            options: {
                companyList,
                nameList,
                pnList,
                deptList,
                unitList
            }
        };
    };

    const filter = (shipment) => {
        delete shipment.date;
        delete shipment.note;
        delete shipment.refPage;
        delete shipment.amount;

        for (let key in shipment) {
            if (!shipment[key]) {
                delete shipment[key];
            }
        }

        return shipment;
    }

    return (dispatch) => {
        return fetch(`${baseURL}/api/getOptions`, {
            method: 'post',
            body: JSON.stringify(filter(shipment)),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).
        then((response) => response.json()).
        then((response) => dispatch(reducerFormat(response.options)));
    };
}

export function fetchTemplates() {
    const reducerFormat = (options) => {
        return {
            type: ADD_TEMPLATES,
            templates: options
        };
    };

    return (dispatch) => {
        return fetch(`${baseURL}/api/getOptions`).
        then((response) => response.json()).
        then((response) => dispatch(reducerFormat(response.options)));
    };
}

export function fetchDeptLinks() {    
    const reducerFormat = (options) => {
        const tree = {};
        options.forEach((each) => {
            tree[each.company] ? tree[each.company].add(each.dept) : tree[each.company] = new Set([each.dept]);
        });
        for (let key in tree) {
            tree[key] = Array.from(tree[key]).sort();
        }
        
        return {
            type: ADD_DEPT_LINKS,
            tree
        };
    };

    return (dispatch) => {
        return fetch(`${baseURL}/api/getOptions`).
        then((response) => response.json()).
        then((response) => dispatch(reducerFormat(response.options)));
    };
}

export function deleteShipmentRequest(shipment) {
    const reducerFormat = (shipment) => ({
        type: DELETE_SHIPMENT,
        shipment,
    });

    return (dispatch) => {
        fetch(`${baseURL}/api/deleteShipment`, {
            method: 'delete',
            body: JSON.stringify({
                _id: shipment._id,
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).
        then(() => dispatch(reducerFormat(shipment)));
    };
}

export function deleteTemplateRequest(template) {
    const reducerFormat = (template) => ({
        type: DELETE_TEMPLATE,
        template,
    });

    return (dispatch) => {
        fetch(`${baseURL}/api/deleteOption`, {
            method: 'delete',
            body: JSON.stringify({
                _id: template._id,
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }).
        then(() => dispatch(reducerFormat(template)));
    };
}
