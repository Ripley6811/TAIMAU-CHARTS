import {
    UPDATE_QUERY,
} from './sidebar.actions.js';


export default function reducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_QUERY :
            return {...state, ...action.query};

        default:
            return state; // Nothing changes for unknown actions.
    }
};
