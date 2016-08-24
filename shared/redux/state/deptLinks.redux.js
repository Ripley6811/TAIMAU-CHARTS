/**
 * @overview Redux actions / AJAX requests.
 * Department links are derived from SHIPMENT TEMPLATE records
 * Reducer is default export.
 * Constants exported for use in testing.
 * ```
 *     import reducerMethod, * as actionMethods from "this-module";
 * ```
 */

import callApi from '../../utils/apiCaller'


/************** CONSTANTS **************/

export const ADD_DEPT_LINKS  = Symbol("ADD_DEPT_LINKS")
const DEPARTMENT_URL = `tankerTemplate/departments`
    
    
/************** ACTIONS **************/

export function fetchDepartments() {
    return (dispatch) => {
        // If used in "need" list then requires "return" keyword below (?)
        return callApi(DEPARTMENT_URL).
        then(docs => dispatch({ docs, type: ADD_DEPT_LINKS }));
    };
}


/************** REDUCER **************/

export default function reducer(state = [], action) {
    switch (action.type) {
            
        case ADD_DEPT_LINKS :
            return action.docs;

        default:
            return state; // Nothing changes for unknown actions.
    }
};
