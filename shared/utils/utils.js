
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
 * @param   {object} shipment Barrel shipment record
 * @returns {string} Route number string
 */
export function getRoute(shipment) {
    const { shipYear: year, shipMonth: month, shipDate: date,
            rtCode: code, rtSeq: seq } = shipment;

    const Y = year.toString().substring(3),
          DD = date < 10 ? `0${date}` : `${date}`,
          SEQ = seq < 10 ? `0${seq}` : `${seq}`,
          M = '123456789ABC'.split('')[month];

    return `${Y}${M}${DD}${code || ''}${SEQ || ''}`;
}


/**
 * Pre-pads number values with zeros and returns a string with four char length.
 * 3 => "0003"
 * @param   {number} value Number or String of a number to pad.
 * @returns {string} String with length of four.
 */
export function zeroPad(value) {
    const numLen = value.toString().length;
    return '0000'.slice(0, 4-numLen) + value;
}


/**
 * 
 * @param   {object} shipment Barrel shipment record
 * @returns {string} String of lot number and serial number set
 */
export function getLotSet(shipment) {
    return shipment.lotID + zeroPad(shipment.start) + '-' + zeroPad(shipment.start + shipment.count-1)
}