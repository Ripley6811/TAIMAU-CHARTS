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

const URL = "barrelShipment"
const [ GET, POST, DELETE ] = [ "get", "post", "delete" ]
export const LOAD_BARREL_SHIPMENTS = Symbol("LOAD_BARREL_SHIPMENTS")


/************** ACTIONS **************/

export function fetchBarrelShipments() {
    return (dispatch) => {
        return callApi(URL, GET).then(docs => dispatch({
            docs, type: LOAD_BARREL_SHIPMENTS
        }));
    };
}


/************** REDUCER **************/

export default function reducer(state = [], action) {
    switch (action.type) {

        case LOAD_BARREL_SHIPMENTS :
            return action.docs;

        default:
            return state; // Nothing changes for unknown actions.
    };
}
