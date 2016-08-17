import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { getRoute } from '../../utils/utils'
// Actions
import { fetchBarrelShipments } from '../../redux/state/barrelShipments.redux'
// Components



export default connect(
    ({barrelShipments}) => ({barrelShipments}),  // Pull items from store
    { fetchBarrelShipments }  // Bind actions with dispatch
)(class BarrelShipmentsView extends Component {
    // Server-side data retrieval (for server rendering).
    static need = [fetchBarrelShipments]  // Preload for sub-component

    /**
     * Validates incoming props.
     */
    static propTypes = {  // ES7 style
        // Props from store
        barrelShipments: PropTypes.array.isRequired,
        // Dispatch bound actions
        fetchBarrelShipments: PropTypes.func.isRequired,
    }

    static defaultProps = {

    }

    state = {

    }

    componentWillMount = () => {
        if (this.props.barrelShipments.length === 0) {
            this.props.fetchBarrelShipments();
        }
    }


    componentDidMount = () => {
//        if (typeof describe === 'function') {
//            Tests(this);
//        }
    }

    render() {
        const { props, state } = this;

        return (
            <div className="container"
                 style={{maxWidth: '1400px', margin: 'auto'}}>
                { props.barrelShipments.map(shipment =>
                    <div>
                       x- {getRoute(shipment)} -x
                    </div>
                ) }
            </div>
        );
    }
})
