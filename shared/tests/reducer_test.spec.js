import expect from 'expect';
import mainReducer from '../redux/reducers';
import deepFreeze from 'deep-freeze';
import * as ShipmentActions from '../modules/Shipment/redux/shipment.actions';
import * as TemplateActions from '../modules/Template/redux/template.actions';
import * as SidebarActions from '../modules/AppSidebar/redux/sidebar.actions';


const INITIAL_STATE = {query: {}, templates: [], shipments: [], deptLinks: []};

describe('Reducer test', () => {

    describe('Shipment action types', () => {

        it('ADD_SHIPMENTS should prepend new shipments to "state.shipments".', () => {
            const stateBefore = {
                shipments: [{product: "LAST"}],
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                shipments: [{product: "Frosty"}, {product: "Fries"}, {product: "LAST"}],
            });

            const action = {
                type: ShipmentActions.ADD_SHIPMENTS,
                shipments: [{product: "Frosty"}, {product: "Fries"}]
            };

            deepFreeze(stateBefore);
            deepFreeze(action);
            expect(stateAfter).toEqual(mainReducer(stateBefore, action));
        });

        it('LOAD_SHIPMENTS should set array as "state.shipments".', () => {
            const stateBefore = {
                shipments: [{product: "LAST"}],
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                shipments: [{product: "Frosty"}, {product: "Fries"}],
            });

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
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                shipments: [{_id: 1, product: "Frosty"}, {_id: 3, product: "LAST"}],
            });

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
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                shipments: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
            });

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
                templates: [{product: "LAST"}],
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                templates: [{product: "Fries"}, {product: "LAST"}],
            });

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
                deptLinks: {product: "Old Spice"},
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                deptLinks: {product: "Frosty"},
            });

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
                templates: [{product: "LAST"}],
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                templates: [{product: "Frosty"}, {product: "Fries"}],
            });

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
                templates: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                templates: [{_id: 1, product: "Frosty"}, {_id: 3, product: "LAST"}],
            });

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
                templates: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                templates: [{_id: 1, product: "Frosty"}, {_id: 2, product: "Fries"}, {_id: 3, product: "LAST"}],
            });

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
                query: {company: "McD", dept: "Burgers"},
            };

            const stateAfter = Object.assign({}, INITIAL_STATE, {
                query: {company: "Jack's", dept: "Burgers"},
            });

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
