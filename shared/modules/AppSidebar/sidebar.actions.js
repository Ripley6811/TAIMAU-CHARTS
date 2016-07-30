/**
 * @overview Redux actions / AJAX requests.
 */
export const UPDATE_QUERY = Symbol("sidebar.actions.UPDATE_QUERY");


export function updateSavedQuery(query) {
    return {
        type: UPDATE_QUERY,
        query,
    };
}