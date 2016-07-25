/**
 * @overview Imported as "rootReducer" in `configureStore.js`
 * A reducer changes the "state" object according to an "action" taken.
 * Must 
 */

import { 
    UPDATE_QUERY,
    ADD_SHIPMENTS, 
    LOAD_SHIPMENTS, 
    ADD_SELECTED_SHIPMENT, 
    DELETE_SHIPMENT,
    UPDATE_TEMPLATES,
    LOAD_TEMPLATES,
    ADD_TEMPLATE,
    DELETE_TEMPLATE,
    ADD_DEPT_LINKS,
    ADD_SELECTED_DEPT,
} from '../actions/actions.js';


export default (state, action) => {
  switch (action.type) {
    
    case UPDATE_QUERY :
        return Object.assign({}, state, 
                {query: Object.assign({}, state.query, action.query)});
    
    case ADD_SHIPMENTS :
        return Object.assign({}, state, 
                {shipments: [...action.shipments, ...state.shipments]});

    case LOAD_SHIPMENTS :
        return Object.assign({}, state, {shipments: action.shipments});

    case ADD_SELECTED_SHIPMENT :
        return Object.assign({}, state, {currShipment: action.shipment});

    case DELETE_SHIPMENT :
        return Object.assign({}, state, 
            {shipments: state.shipments.filter(
                (shipment) => shipment._id !== action.shipment._id)});

    case DELETE_TEMPLATE :
        return Object.assign({}, state, 
            {currTemplate: action.template,
            templates: state.templates.filter(
                (template) => template._id !== action.deleteID)});
    
    case UPDATE_TEMPLATES :
        return Object.assign({}, state, {templates: action.templates});

    case LOAD_TEMPLATES :
        return Object.assign({}, state, {templates: action.templates});

    case ADD_TEMPLATE :
        return Object.assign({}, state, 
                {templates: [action.template, ...state.templates]});

    case ADD_DEPT_LINKS :
        return Object.assign({}, state, {deptLinks: action.records});

    case ADD_SELECTED_DEPT :
        return Object.assign({}, state, 
            {currDept: action.obj, shipments: action.shipments});

    default:
      return state; // Nothing changed for unknown actions.
  }
};