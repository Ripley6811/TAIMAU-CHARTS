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
export const LOAD_BARREL_TEMPLATES = Symbol("LOAD_BARREL_TEMPLATES")
export const ADD_BARREL_TEMPLATE = Symbol("ADD_BARREL_TEMPLATE")


/************** ACTIONS **************/

export function fetchTemplates() {
    return (dispatch) => {
        return callApi(URL, GET).then(docs => dispatch(
            { docs, type: LOAD_BARREL_TEMPLATES }
        ));
    };
}


export function deleteTemplateRequest() {

}


export function addTemplateRequest(template) {
    return (dispatch) => {
        return callApi(URL, POST, template).then(doc => dispatch(
            { doc, type: ADD_BARREL_TEMPLATE }
        ));
    };
}


/************** REDUCER **************/

export default function reducer(state = [], action) {
    switch (action.type) {

        case LOAD_BARREL_TEMPLATES :
            return action.docs;
            
        case ADD_BARREL_TEMPLATE:
            return [action.doc, ...state];

        default:
            return state; // Nothing changes for unknown actions.
    };
}
