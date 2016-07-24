import React, { PropTypes, Component } from 'react';
// Redux
import * as Actions from '../redux/actions/actions';

const P_ORDER = "productOrder",
      OPTIONS = "productOptions";

class SettingsView extends Component {
    state = {
        [P_ORDER]: [],
        [OPTIONS]: [{product: "blank", pn: ""}],
    }

    addRow = () => {
        this.setState({
            [P_ORDER]: [...this.state[P_ORDER],
                        this.state[OPTIONS][0]]
        }, this.saveToBrowser);
    }

    removeRow = (i) => {
        this.setState({
            [P_ORDER]: [...this.state[P_ORDER].slice(0,i),
                        ...this.state[P_ORDER].slice(i+1)]
        }, this.saveToBrowser);
    }

    setIndex = (event, i) => {
        const selectedIndex = event.target.selectedIndex;
        this.setState({
            [P_ORDER]: [...this.state[P_ORDER].slice(0,i),
                        this.state[OPTIONS][selectedIndex],
                        ...this.state[P_ORDER].slice(i+1)]
        }, this.saveToBrowser);
    }

    // Store the product ordering in browser. Not stored in database.
    saveToBrowser = () => {
        window.localStorage.setItem(P_ORDER, JSON.stringify(this.state[P_ORDER]));
    }

    loadFromBrowser = () => {
        const browserData = JSON.parse(window.localStorage.getItem(P_ORDER));
        if (browserData) {
            this.setState({[P_ORDER]: browserData});
        }
    }

    // Loads list of products with PNs from database.
    componentDidMount() {
        Actions.getAllProducts(this.addProductOptionsToState);
        this.loadFromBrowser();
    }

    // Callback that adds product list to state.
    addProductOptionsToState = (data) => {
        this.setState({
            [OPTIONS]: [this.state[OPTIONS][0], ...data]
        });
    }

    render() {
        const props = this.props;

        return <div className="container" style={{margin: "auto"}}>
            <h1>Settings</h1>
            <h2>Tri-monthly Shipment PDF Report</h2>
            <div style={{padding: "8px", border: "2px solid orange", borderRadius: "8px 24px"}}>
                <h3>Product Display Order</h3>

                <div className="form-group row">
                    <div className="col-xs-1 text-right" style={{padding: "0px"}}>
                        <button className="btn btn-success"
                            onClick={this.addRow}>
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                    <div className="col-xs-10">
                            Use a blank to skip a line when printing.
                    </div>
                </div>
                {this.state[P_ORDER].map((each,i) =>
                <div key={`${i}${each.pn}`} className="row">
                    {/*** REMOVE BUTTON ***/}
                    <div className="col-xs-1 text-right" style={{padding: "0px"}}>
                        <button className="btn btn-danger"
                                onClick={() => this.removeRow(i)}>
                            <span className="glyphicon glyphicon-minus"></span>
                        </button>
                    </div>
                    {/*** PN-PRODUCT SELECTION LIST ***/}
                    <div className="col-xs-8" style={{padding: "0px"}}>
                    <select className="form-control"
                        value={each.pn}
                        onChange={e => this.setIndex(e, i)}>
                        {this.state[OPTIONS].map((temp, i2) =>
                            <option key={i2} value={temp.pn}>
                                {temp.pn} &nbsp; &nbsp; {temp.product}
                            </option>
                        )}
                    </select>
                    </div>
                </div>
                )}
                <br />
            </div>
        </div>
    }
}

export default SettingsView;
