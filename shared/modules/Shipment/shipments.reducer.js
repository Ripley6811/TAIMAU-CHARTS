import {
    ADD_SHIPMENTS,
    LOAD_SHIPMENTS,
    DELETE_SHIPMENT,
} from './shipment.actions.js';



//export default (state, action) => {
//    return Object.assign({}, state, reducer(state, action));
//};

export default function reducer(state = [], action) {
    switch (action.type) {

        case ADD_SHIPMENTS :
            return [...action.shipments, ...state];

        case LOAD_SHIPMENTS :
            return action.shipments;

        case DELETE_SHIPMENT :
            return state.filter( s => s._id !== action.shipment._id );

        default:
            return state; // Nothing changes for unknown actions.
    }
};