import expect from 'expect';
import mainReducer from '../redux/reducers/reducer';
import deepFreeze from 'deep-freeze';
import * as ShipmentActions from '../modules/Shipment/shipment.actions';
import * as TemplateActions from '../modules/Template/template.actions';
import * as SidebarActions from '../modules/AppSidebar/sidebar.actions';


// POLYFILL: Object.assign (because this does not use "babel").
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


describe('Reducer test_PERSISTENCE', () => {

    describe('Shipment action types', () => {

        it('ADD_SHIPMENTS should prepend new shipments to "state.shipments".', () => {
            const stateBefore = {
                shipments: [{product: "LAST"}],
                TEST_PERSISTENCE: true
            };

            const stateAfter = {
                shipments: [{product: "Frosty"}, {product: "Fries"}, {product: "LAST"}],
                TEST_PERSISTENCE: true
            };

            const action = {
                type: ShipmentActions.ADD_SHIPMENTS,
                shipments: [{product: "Frosty"}, {product: "Fries"}]
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });

        it('ADD_SELECTED_SHIPMENT should set shipment as "state.currShipment".', () => {
            const stateBefore = {
                shipments: [{product: "LAST"}],
                currShipment: {product: "Old Spice"},
                TEST_PERSISTENCE: true
            };

            const stateAfter = {
                shipments: [{product: "LAST"}],
                currShipment: {product: "Frosty"},
                TEST_PERSISTENCE: true
            };

            const action = {
                type: ShipmentActions.ADD_SELECTED_SHIPMENT,
                shipment: {product: "Frosty"},
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });

        it('LOAD_SHIPMENTS should set array as "state.shipments".', () => {
            const stateBefore = {
                shipments: [{product: "LAST"}],
                TEST_PERSISTENCE: true
            };

            const stateAfter = {
                shipments: [{product: "Frosty"}, {product: "Fries"}],
                TEST_PERSISTENCE: true
            };

            const action = {
                type: ShipmentActions.LOAD_SHIPMENTS,
                shipments: [{product: "Frosty"}, {product: "Fries"}]
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });

        it('DELETE_SHIPMENT should remove item from array "state.shipments".', () => {
            const stateBefore = {
                shipments: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
                TEST_PERSISTENCE: true
            };

            const stateAfter = {
                shipments: [{_id: 1, product: "Frosty"}, {_id: 3, product: "LAST"}],
                deletedShipment: {_id: 2, product: "Fries"},
                TEST_PERSISTENCE: true
            };

            const action = {
                type: ShipmentActions.DELETE_SHIPMENT,
                shipment: {_id: 2, product: "Fries"}
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });

        it('DELETE_SHIPMENT should not remove item if ID is not found.', () => {
            const stateBefore = {
                shipments: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
                TEST_PERSISTENCE: true
            };

            const stateAfter = {
                shipments: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
                deletedShipment: undefined,
                TEST_PERSISTENCE: true
            };

            const action = {
                type: ShipmentActions.DELETE_SHIPMENT,
                shipment: {product: "Fries"}
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });
    });
    

    describe('Template action types', () => {

        it('ADD_TEMPLATE should prepend new template to "state.templates".', () => {
            const stateBefore = {
                TEST_PERSISTENCE: true,
                templates: [{product: "LAST"}],
            };

            const stateAfter = {
                TEST_PERSISTENCE: true,
                templates: [{product: "Fries"}, {product: "LAST"}],
            };

            const action = {
                type: TemplateActions.ADD_TEMPLATE,
                template: {product: "Fries"}
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });

        it('ADD_DEPT_LINKS should set records object as "state.deptLinks".', () => {
            const stateBefore = {
                TEST_PERSISTENCE: true,
                deptLinks: {product: "Old Spice"},
            };

            const stateAfter = {
                TEST_PERSISTENCE: true,
                deptLinks: {product: "Frosty"},
            };

            const action = {
                type: TemplateActions.ADD_DEPT_LINKS,
                records: {product: "Frosty"},
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });

        it('LOAD_TEMPLATES should set array as "state.templates".', () => {
            const stateBefore = {
                TEST_PERSISTENCE: true,
                templates: [{product: "LAST"}],
            };

            const stateAfter = {
                TEST_PERSISTENCE: true,
                templates: [{product: "Frosty"}, {product: "Fries"}],
            };

            const action = {
                type: TemplateActions.LOAD_TEMPLATES,
                templates: [{product: "Frosty"}, {product: "Fries"}]
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });

        it('DELETE_TEMPLATE should remove item from array "state.templates".', () => {
            const stateBefore = {
                TEST_PERSISTENCE: true,
                templates: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
            };

            const stateAfter = {
                TEST_PERSISTENCE: true,
                templates: [{_id: 1, product: "Frosty"}, {_id: 3, product: "LAST"}],
                deletedTemplate: {_id: 2, product: "Fries"},
            };

            const action = {
                type: TemplateActions.DELETE_TEMPLATE,
                deleteID: 2
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });

        it('DELETE_TEMPLATE should not remove item if ID is not found.', () => {
            const stateBefore = {
                TEST_PERSISTENCE: true,
                templates: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
            };

            const stateAfter = {
                TEST_PERSISTENCE: true,
                templates: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
                deletedTemplate: undefined,
            };

            const action = {
                type: TemplateActions.DELETE_TEMPLATE,
                deleteID: undefined
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });
    });

    
    describe('Sidebar action types', () => {

        it('UPDATE_QUERY should update only attributes in new object', () => {
            const stateBefore = {
                TEST_PERSISTENCE: true,
                query: {company: "McD", dept: "Burgers"},
            };

            const stateAfter = {
                TEST_PERSISTENCE: true,
                query: {company: "Jack's", dept: "Burgers"},
            };

            const action = {
                type: SidebarActions.UPDATE_QUERY,
                query: {company: "Jack's"}
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });
    });
});
