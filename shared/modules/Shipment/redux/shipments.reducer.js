import {
    ADD_SHIPMENTS,
    LOAD_SHIPMENTS,
    UPDATE_SHIPMENT,
    DELETE_SHIPMENT,
} from './shipment.actions.js';


export default function reducer(state = [], action) {
    switch (action.type) {

        case ADD_SHIPMENTS :
            return [...action.shipments, ...state];

        case LOAD_SHIPMENTS :
            return action.shipments;
    
        case UPDATE_SHIPMENT :
            return state.map( s => s._id === action.shipment._id ? action.shipment : s );

        case DELETE_SHIPMENT :
            return state.filter( s => s._id !== action.shipment._id );

        default:
            return state; // Nothing changes for unknown actions.
    }
};