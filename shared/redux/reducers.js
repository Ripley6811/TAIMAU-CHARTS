/**
 * @overview This is the root reducer. 
 * Imported as "rootReducer" in `configureStore.js`
 * A reducer changes the "state" object according to an "action" taken.
 *
 * Things you should never do inside a reducer:
    - Mutate its arguments;
    - Perform side effects like API calls and routing transitions;
    - Call non-pure functions, e.g. Date.now() or Math.random()
 */
import { combineReducers } from 'redux';

// Import Reducers
import templates from '../modules/Template/templates.reducer.js';
import deptLinks from '../modules/Template/deptLinks.reducer.js';
import shipments from '../modules/Shipment/shipments.reducer.js';
import query from '../modules/AppSidebar/query.reducer.js';


// POLYFILL: Object.assign (because testing will fail without this).
if (typeof Object.assign !== 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

// Combine all reducers into one root reducer
export default combineReducers({
    deptLinks,
    templates,
    shipments,
    query,
});
