/**
 * @overview Redux actions / AJAX requests.
 * Reducer is default export.
 * Constants exported for use in testing.
 * ```
 *     import reducerMethod, * as actionMethods from "this-module";
 * ```
 */

/************** CONSTANTS **************/

export const UPDATE_QUERY = Symbol("UPDATE_QUERY")


/************** ACTIONS **************/

export function updateSavedQuery(query) {
    return {
        type: UPDATE_QUERY,
        query,
    };
}


/************** REDUCER **************/

export default function reducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_QUERY :
            return {...state, ...action.query};

        default:
            return state; // Nothing changes for unknown actions.
    }
}