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

export const ADD_TEMPLATE    = Symbol("ADD_TEMPLATE")
export const LOAD_TEMPLATES  = Symbol("LOAD_TEMPLATES")
export const DELETE_TEMPLATE = Symbol("DELETE_TEMPLATE")
const SHIPMENT_TEMPLATE_URL = `tankerTemplate`
const [ GET, POST, DELETE ] = [ "get", "post", "delete" ]


/************** ACTIONS **************/

export function addTemplateRequest(template) {
    return (dispatch) => {
        callApi(SHIPMENT_TEMPLATE_URL, POST, template)
        .then(doc => {
            if (!!doc.errmsg) return null;

            dispatch({
                type: ADD_TEMPLATE,
                template: doc
            })
        });
    };
}


export function fetchTankerTemplates() {
    return (dispatch) => {
        // If used in "need" list then requires "return" keyword below (?)
        return callApi(SHIPMENT_TEMPLATE_URL)
        .then(docs => dispatch({
            type: LOAD_TEMPLATES,
            templates: docs
        }));
    };
}


export function deleteTemplateRequest(template) {
    return (dispatch) => {
        callApi(SHIPMENT_TEMPLATE_URL, DELETE, {
             _id: template._id,
        })
        .then(() => dispatch({
            type: DELETE_TEMPLATE,
            deleteID: template._id
        }));
    };
}


/************** REDUCER **************/

export default function reducer(state = [], action) {
    switch (action.type) {

        case DELETE_TEMPLATE :
            return state.filter( t => t._id !== action.deleteID );

        case LOAD_TEMPLATES :
            return action.templates;

        case ADD_TEMPLATE :
            return [action.template, ...state];

        default:
            return state; // Nothing changes for unknown actions.
    }
}
