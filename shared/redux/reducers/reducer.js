/**
 * @overview Imported as "rootReducer" in `configureStore.js`
 * A reducer changes the "state" object according to an "action" taken.
 * Must 
 */

import { 
    ADD_SHIPMENT, 
    ADD_SHIPMENTS, 
    ADD_SELECTED_SHIPMENT, 
    DELETE_SHIPMENT,
    UPDATE_OPTIONS,
    ADD_TEMPLATES,
    DELETE_TEMPLATE,
    ADD_DEPT_LINKS,
    ADD_SELECTED_DEPT,
} from '../actions/actions.js';

const initialState = {
    selectedDept: null,
    deptLinks: [],
    templates: [],
    options: {},
    shipments: [],
    shipment: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_SHIPMENT :
      // Add new item to beginning of list and spread (...) to attach remainder.
      return Object.assign({}, state, 
                {shipments: [action.shipment, ...state.shipments]});

    case ADD_SHIPMENTS :
        return Object.assign({}, state, {shipments: action.shipments, query: action.params});

    case ADD_SELECTED_SHIPMENT :
        return Object.assign({}, state, {shipment: action.shipment});

    case DELETE_SHIPMENT :
        return Object.assign({}, state, 
            {shipments: state.shipments.filter(
                (shipment) => shipment._id !== action.shipment._id)});

    case DELETE_TEMPLATE :
        return Object.assign({}, state, 
            {templates: state.templates.filter(
                (template) => template._id !== action.template._id)});
    
    case UPDATE_OPTIONS :
        return Object.assign({}, state, {options: action.options});

    case ADD_TEMPLATES :
        return Object.assign({}, state, {templates: action.templates});

    case ADD_DEPT_LINKS :
        return Object.assign({}, state, {deptLinks: action.tree});

    case ADD_SELECTED_DEPT :
        return Object.assign({}, state, 
            {selectedDept: action.obj, shipments: action.shipments});

    default:
      return state; // Nothing changed for unknown actions.
  }
};