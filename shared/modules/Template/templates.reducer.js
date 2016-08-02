import {
    LOAD_TEMPLATES,
    ADD_TEMPLATE,
    DELETE_TEMPLATE,
} from './template.actions.js';


//export default (state = {}, action) => {
//    console.log('HERE I AM');
//    console.log(state, action);
//    console.log(Object.assign);
//    return Object.assign({}, state, reducer(state, action));
//};

export default function reducer(state = [], action) {
    switch (action.type) {

        case DELETE_TEMPLATE :
            return state.filter( t => t._id !== action.deleteID );

        case LOAD_TEMPLATES :
            return action.templates;

        case ADD_TEMPLATE :
            return [action.template, ...state];

        default:
            return state; // Nothing changes for unknown actions.
    }
};
