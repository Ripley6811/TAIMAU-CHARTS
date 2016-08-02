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



export default (state, action) => {
    return Object.assign({}, state, reducer(state, action));
};

function reducer(state, action) {
    switch (action.type) {
        case UPDATE_QUERY :
            return {
                query: Object.assign({}, state.query, action.query)
            };

        case ADD_SHIPMENTS :
            return {
                shipments: [...action.shipments, ...state.shipments]
            };

        case LOAD_SHIPMENTS :
            return { 
                shipments: action.shipments 
            };

        case ADD_SELECTED_SHIPMENT :
            return { 
                currShipment: action.shipment 
            };

        case DELETE_SHIPMENT :
            return {
                deletedShipment: state.shipments.filter( s => s._id === action.shipment._id)[0],
                shipments: state.shipments.filter( s => s._id !== action.shipment._id )
            };

        case DELETE_TEMPLATE :
            return {
                deletedTemplate: state.templates.filter( t => t._id === action.deleteID )[0],
                templates: state.templates.filter( t => t._id !== action.deleteID )
            };

        case LOAD_TEMPLATES :
            return { 
                templates: action.templates 
            };

        case ADD_TEMPLATE :
            return {
                templates: [action.template, ...state.templates]
            };

        case ADD_DEPT_LINKS :
            return { 
                deptLinks: action.records 
            };

        default:
            if (action.type !== '@@INIT' && action.type !== '@@redux/INIT') {
                throw "Reducer case not found for the following action type: " + action.type;
            }
            return state; // Nothing changes for unknown actions.
    }
};
