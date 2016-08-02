/**
 * @overview Redux actions / AJAX requests.
 */
import { baseURL } from '../../../server/config';
import { encodeQuery } from '../../utils/utils';
import callApi from '../../utils/apiCaller';


export const ADD_TEMPLATE    = Symbol("template.actions.ADD_TEMPLATE"),
             LOAD_TEMPLATES  = Symbol("template.actions.LOAD_TEMPLATES"),
             DELETE_TEMPLATE = Symbol("template.actions.DELETE_TEMPLATE"),
             ADD_DEPT_LINKS  = Symbol("actions.ADD_DEPT_LINKS");


export function fetchDepartments() {
    const reducerFormat = (records) => {
        return {
            type: ADD_DEPT_LINKS,
            records
        };
    };

    return (dispatch) => {
        // If used in "need" list then requires "return" keyword below (?)
        return callApi(`department`).
        then(docs => dispatch(reducerFormat(docs)));
    };
}


export function addTemplateRequest(template) {
    const reducerFormat = (template) => ({
        type: ADD_TEMPLATE,
        template
    });

    return (dispatch) => {
        /**
         * AJAX req to `addTemplate` in `server/routes/template.routes` ->
         * `server/controllers/shipmentTemplate.controller`
         */
        callApi(`shipmentTemplate`, 'post', template)
        .then(doc => dispatch(reducerFormat(doc)));
    };
}


export function fetchShipmentTemplates() {
    const reducerFormat = (templates) => {
        return {
            type: LOAD_TEMPLATES,
            templates: templates
        };
    };

    return (dispatch) => {
        // If used in "need" list then requires "return" keyword below (?)
        return callApi(`shipmentTemplate`)
        .then(docs => dispatch(reducerFormat(docs)));
    };
}


export function deleteTemplateRequest(template) {
    const reducerFormat = (template) => {
        return {
            type: DELETE_TEMPLATE,
            deleteID: template._id
        }
    };

    return (dispatch) => {
        callApi(`shipmentTemplate`, 'delete', {
             _id: template._id,
        })
        .then(() => dispatch(reducerFormat(template)));
    };
}
