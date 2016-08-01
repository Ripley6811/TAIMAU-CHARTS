import expect from 'expect';
import mainReducer from '../redux/reducers/reducer';
import deepFreeze from 'deep-freeze';
import * as ActionTypes from '../modules/Shipment/shipment.actions';


// POLYFILL: Object.assign (because this does not use "babel").
if (typeof Object.assign != 'function') {
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


describe('reducer tests', () => {
    it('reducer ADD_SHIPMENTS is working', () => {
        const stateBefore = { 
            shipments: [{product: "LAST"}], 
            query: {company: "McD"} 
        };
        
        const stateAfter = { 
            shipments: [{
                company: "Wendy's",
                dept: "CA2A",
                unit: "12",
                product: "Frosty",
                pn: "ftasty",
            }, {product: "LAST"}], 
            query: {company: "McD"}  
        };

        const action = {
            type: ActionTypes.ADD_SHIPMENTS,
            shipments: [{
                company: "Wendy's",
                dept: "CA2A",
                unit: "12",
                product: "Frosty",
                pn: "ftasty",
            }]
        };
        
        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(stateAfter).toEqual(mainReducer(stateBefore, action));
    });

    it('action ADD_SELECTED_SHIPMENT is working', () => {
        const stateBefore = {
            shipments: [{
                company: "Wendy's",
                dept: "CA2A",
                unit: "12",
                product: "Frosty",
                pn: "ftasty",
            }],
            currShipment: null,
        };

        const stateAfter = {
            shipments: [{
                company: "Wendy's",
                dept: "CA2A",
                unit: "12",
                product: "Frosty",
                pn: "ftasty",
            }],
            currShipment: {
                company: "Wendy's",
                dept: "CA2A",
                unit: "12",
                product: "Frosty",
                pn: "ftasty",
            },
        };

        const action = {
            type: ActionTypes.ADD_SELECTED_SHIPMENT,
            shipment: {
                company: "Wendy's",
                dept: "CA2A",
                unit: "12",
                product: "Frosty",
                pn: "ftasty",
            },
        };

        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(stateAfter).toEqual(mainReducer(stateBefore, action));
    });
});