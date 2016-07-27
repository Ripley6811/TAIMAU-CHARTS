
/**
 * Returns a URL parameter string from an object. Does NOT include '?'.
 * @param   {object} params Simple one-level (non-nested) object.
 * @returns {string} Query parameter string to add after "?".
 */
export function encodeQuery(params) {
    return Object.keys(params).map(
        key => encodeURI(`${key}=${params[key]}`)
    ).join("&");
}