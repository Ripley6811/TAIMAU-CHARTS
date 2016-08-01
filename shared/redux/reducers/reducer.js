/**
 * @overview Imported as "rootReducer" in `configureStore.js`
 * A reducer changes the "state" object according to an "action" taken.
 *
 * Things you should never do inside a reducer:
    - Mutate its arguments;
    - Perform side effects like API calls and routing transitions;
    - Call non-pure functions, e.g. Date.now() or Math.random()
 */

import {
    UPDATE_QUERY,
} from '../../modules/AppSidebar/sidebar.actions.js';

import {
    LOAD_TEMPLATES,
    ADD_TEMPLATE,
    DELETE_TEMPLATE,
    ADD_DEPT_LINKS,
} from '../../modules/Template/template.actions.js';

import {
    ADD_SHIPMENTS,
    ADD_SELECTED_SHIPMENT,
    LOAD_SHIPMENTS,
    DELETE_SHIPMENT,
} from '../../modules/Shipment/shipment.actions.js';


if (!UPDATE_QUERY || !ADD_SHIPMENTS || !LOAD_SHIPMENTS  || !ADD_SELECTED_SHIPMENT ||
    !DELETE_SHIPMENT || !LOAD_TEMPLATES  || !ADD_TEMPLATE || !DELETE_TEMPLATE ||
    !ADD_DEPT_LINKS ) throw "An action type is undefined.";


export default (state, action) => {
    switch (action.type) {
        case UPDATE_QUERY :
            return Object.assign({}, state, {
                query: Object.assign({}, state.query, action.query)
            });

        case ADD_SHIPMENTS :
            return Object.assign({}, state, {
                shipments: [...action.shipments, ...state.shipments]
            });

        case LOAD_SHIPMENTS :
            return Object.assign({}, state, { 
                shipments: action.shipments 
            });

        case ADD_SELECTED_SHIPMENT :
            return Object.assign({}, state, { 
                currShipment: action.shipment 
            });

        case DELETE_SHIPMENT :
            return Object.assign({}, state, {
                shipments: state.shipments.filter( s => s._id !== action.shipment._id )
            });

        case DELETE_TEMPLATE :
            return Object.assign({}, state, {
                currTemplate: action.template,
                templates: state.templates.filter( t => t._id !== action.deleteID )
            });

        case LOAD_TEMPLATES :
            return Object.assign({}, state, { 
                templates: action.templates 
            });

        case ADD_TEMPLATE :
            return Object.assign({}, state, {
                templates: [action.template, ...state.templates]
            });

        case ADD_DEPT_LINKS :
            return Object.assign({}, state, { 
                deptLinks: action.records 
            });

        default:
            if (action.type !== '@@INIT' && action.type !== '@@redux/INIT') {
                console.log("Reducer case not found. Check action type.");
                console.log("Type: ", action.type);
            }
            return state; // Nothing changes for unknown actions.
    }
};
