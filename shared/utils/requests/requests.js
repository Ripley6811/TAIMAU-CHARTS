/**
 * @overview AJAX/AJAJ requests NOT RELATED to Redux store.
 */
import { baseURL } from '../../../server/config';
/**
 * `fetch` is a replacement for using XMLHttpRequest and employs ES6 "Promise"
 * https://github.com/matthew-andrews/isomorphic-fetch
 */
import fetch from 'isomorphic-fetch';


/**
 * Used in "PDFMaker"
 */
export function requestTriMonthlyPDF(company, startDate, endDate, callback) {
    const URL = `${baseURL}/api/shipmentsPDF?` +
          `company=${company}&start=${startDate}&end=${endDate}`;
    return fetch(URL).
        then(res => res.json()).
        then(jsonData => callback(jsonData));
}


/**
 * Used in "PDFMaker"
 */
export function requestWasteWaterPDF(company, startDate, endDate, callback) {
    const URL = `${baseURL}/api/shipmentsPDF?` +
          `company=${company}&start=${startDate}&end=${endDate}&unit=廢水`;
    return fetch(URL).
        then(res => res.json()).
        then(jsonData => callback(jsonData));
}


/**
 * Used in "SettingsView"
 */
export function getAllProducts(callback) {
    const URL = `${baseURL}/api/product`;
    return fetch(URL).
        then(res => res.json()).
        then(records => callback(records));
}
