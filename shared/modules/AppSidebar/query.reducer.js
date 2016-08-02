import {
    UPDATE_QUERY,
} from './sidebar.actions.js';


//export default (state, action) => {
//    return Object.assign({}, state, reducer(state, action));
//};

export default function reducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_QUERY :
            return Object.assign({}, state, action.query);

        default:
            return state; // Nothing changes for unknown actions.
    }
};
