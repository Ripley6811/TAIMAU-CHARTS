import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// Import Components
import ShipmentCreateView from '../../components/ShipmentCreateView/ShipmentCreateView';
import ShipmentListView from '../../container/ShipmentListView/ShipmentListView';

import * as Actions from '../../redux/actions/actions';


class ShipmentContainer extends Component {
    constructor(props, context) {
        super(props, context);
        this.fillFormFromList = this.fillFormFromList.bind(this);
    }


    fillFormFromList(shipment) {
        this.props.dispatch(Actions.addSelectedShipment({
            // Exclude `date`, `amount`, and `note`.
            name: shipment.name,
            pn: shipment.pn,
            company: shipment.company,
            dept: shipment.dept,
            unit: shipment.unit
        }));
    }

    componentDidMount() {
        // Ensure shipments loaded into state if switching on client-side.
        if (this.props.shipments.length === 0) {
            this.props.dispatch(Actions.fetchShipments());
            this.props.dispatch(Actions.fetchOptions());
        }
    }

    render() {
        return (
                <div className="container">
                    {(() => {
                        if (this.props.params.secret === "edit") {
                         return <ShipmentCreateView />
                        }
                    })()}
                    <br />
                    <ShipmentListView shipments={this.props.shipments}
                        fillFormFromList={this.fillFormFromList}
                        edit={this.props.params.secret === "edit"} />
                </div>
        );
    }
}

// Actions required to provide data for this component to render in server-side.
ShipmentContainer.need = [() => { return Actions.fetchShipments(); },
                          () => { return Actions.fetchOptions(); }];

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    shipment: store.shipment,
    shipments: store.shipments,
  };
}

ShipmentContainer.contextTypes = {
  router: React.PropTypes.object,
};

/**
 * Redux's `connect` method injects `dispatch` method into class.
 * `mapStateToProps` makes store objects accessible as props.
 */
export default connect(mapStateToProps)(ShipmentContainer);
