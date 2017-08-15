/**
 * @overview Redux actions / AJAX requests.
 * Reducer is default export.
 * Constants exported for use in testing.
 * ```
 *     import reducerMethod, * as actionMethods from "this-module";
 * ```
 */

import { encodeQuery } from '../../utils/utils'
import callApi from '../../utils/apiCaller'


/************** CONSTANTS **************/

const URL = "companies"
const [ GET, PUT, POST, DELETE ] = [ "get", "put", "post", "delete" ]
export const LOAD_DIRECTORY = Symbol("load directory")




/************** ACTIONS **************/

export function fetchDirectory(query, store) {
    // "dispatch" is a callback that runs the reducer.
    return (dispatch) => {
        return callApi(`${URL}/directory`)
        .then(docs => dispatch({ docs, type: LOAD_DIRECTORY }));
    };
}



/************** REDUCER **************/

export default function reducer(state = [], {type, doc, docs}) {
    switch (type) {

        case LOAD_DIRECTORY:
            return docs;

        default:
            return state; // Nothing changes for unknown actions.
    };
}
