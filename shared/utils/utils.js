
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


/**
 * Returns a formatted routing number string from BARREL SHIPMENT record data.
 * @param   {object} shipment Barrel Shipments record
 * @returns {string} Route number string
 */
export function getRoute(shipment) {
    const { shipYear: year, shipMonth: month, shipDate: date, 
            rtCode: code, rtSeq: seq } = shipment;
    
    const Y = year.toString().substring(3),
          DD = date < 10 ? `0${date}` : `${date}`,
          SEQ = seq < 10 ? `0${seq}` : `${seq}`,
          M = '123456789ABC'.split('')[month];

    return `${Y}${M}${DD}${code}${SEQ}`;
}