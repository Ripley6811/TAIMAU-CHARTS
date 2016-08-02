import {
    ADD_DEPT_LINKS,
} from './template.actions.js';


//export default (state = {}, action) => {
//    return Object.assign({}, state, reducer(state, action));
//};

export default function reducer(state = {}, action) {
    switch (action.type) {
            
        case ADD_DEPT_LINKS :
            return action.records;

        default:
            return state; // Nothing changes for unknown actions.
    }
};
