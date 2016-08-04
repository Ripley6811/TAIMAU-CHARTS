/**
 * @overview Redux actions / AJAX requests.
 */
import { baseURL } from '../../../../server/config';
import { encodeQuery } from '../../../utils/utils';
import callApi from '../../../utils/apiCaller';


export const ADD_TEMPLATE    = Symbol("template.actions.ADD_TEMPLATE"),
             LOAD_TEMPLATES  = Symbol("template.actions.LOAD_TEMPLATES"),
             DELETE_TEMPLATE = Symbol("template.actions.DELETE_TEMPLATE"),
             ADD_DEPT_LINKS  = Symbol("actions.ADD_DEPT_LINKS");


export function fetchDepartments() {
    return (dispatch) => {
        // If used in "need" list then requires "return" keyword below (?)
        return callApi(`department`).
        then(docs => dispatch({
            type: ADD_DEPT_LINKS,
            records: docs
        }));
    };
}


export function addTemplateRequest(template) {
    return (dispatch) => {
        callApi(`shipmentTemplate`, 'post', template)
        .then(doc => {
            if (!!doc.errmsg) return null;
            
            dispatch({
                type: ADD_TEMPLATE,
                template: doc
            })
        });
    };
}


export function fetchShipmentTemplates() {
    return (dispatch) => {
        // If used in "need" list then requires "return" keyword below (?)
        return callApi(`shipmentTemplate`)
        .then(docs => dispatch({
            type: LOAD_TEMPLATES,
            templates: docs
        }));
    };
}


export function deleteTemplateRequest(template) {
    return (dispatch) => {
        callApi(`shipmentTemplate`, 'delete', {
             _id: template._id,
        })
        .then(() => dispatch({
            type: DELETE_TEMPLATE,
            deleteID: template._id
        }));
    };
}
