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

const URL = "barrelTemplate"
const [ GET, POST, DELETE ] = [ "get", "post", "delete" ]
export const LOAD_TEMPLATES = Symbol("LOAD_TEMPLATES")
export const ADD_TEMPLATE = Symbol("ADD_TEMPLATE")
export const DELETE_TEMPLATE = Symbol("DELETE_TEMPLATE")


/************** ACTIONS **************/

export function fetchTemplates() {
    return (dispatch) => {
        return callApi(URL, GET)
        .then(docs => dispatch({ docs, type: LOAD_TEMPLATES }));
    };
}


export function deleteTemplateRequest(doc) {
    return (dispatch) => {
        return callApi(URL, DELETE, {_id: doc._id})
        .then(() => dispatch({ doc, type: DELETE_TEMPLATE }));
    };
}


export function addTemplateRequest(template) {
    return (dispatch) => {
        return callApi(URL, POST, template)
        .then(doc => dispatch({ doc, type: ADD_TEMPLATE }));
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

        default:
            return state; // Nothing changes for unknown actions.
    };
}
