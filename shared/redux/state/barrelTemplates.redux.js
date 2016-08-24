/**
 * @overview Redux actions / AJAX requests.
 * Reducer is default export.
 * Constants exported for use in testing.
 * ```
 *     import reducerMethod, * as actionMethods from "this-module";
 * ```
 */

import callApi from '../../utils/apiCaller'


/************** CONSTANTS **************/

const URL = `barrelTemplate`
const [ GET, PUT, POST, DELETE ] = [ "get", "put", "post", "delete" ]
export const LOAD_TEMPLATES = Symbol("LOAD_TEMPLATES")
export const ADD_TEMPLATE = Symbol("ADD_TEMPLATE")
export const UPDATE_TEMPLATE = Symbol("UPDATE_TEMPLATE")
export const DELETE_TEMPLATE = Symbol("DELETE_TEMPLATE")


/************** ACTIONS **************/

export function fetchTemplates() {
    // If used in "need" list then requires "return" with "callApi" (?)
    return (dispatch) => {
        return callApi(URL, GET)
        .then(docs => dispatch({ docs, type: LOAD_TEMPLATES }));
    };
}


export function addTemplateRequest(template) {
    return (dispatch) => {
        return callApi(URL, POST, template)
        .then(doc => dispatch({ doc, type: ADD_TEMPLATE }));
    };
}


export function updateTemplateRequest(template) {
    return (dispatch) => {
        return callApi(URL, PUT, { template })
        .then(doc => dispatch({ doc, type: UPDATE_TEMPLATE }));
    };
}


export function deleteTemplateRequest(doc) {
    return (dispatch) => {
        return callApi(URL, DELETE, {_id: doc._id})
        .then(() => dispatch({ doc, type: DELETE_TEMPLATE }));
    };
}


/************** REDUCER **************/

export default function reducer(state = [], {type, doc, docs}) {
    switch (type) {

        case LOAD_TEMPLATES :
            return docs;

        case ADD_TEMPLATE:
            return [doc, ...state];

        case DELETE_TEMPLATE :
            return state.filter( each => each._id !== doc._id );

        case UPDATE_TEMPLATE:
            return state.map( each => each._id === doc._id ? doc : each );

        default:
            return state; // Nothing changes for unknown actions.
    };
}
