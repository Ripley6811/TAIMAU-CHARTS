import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/actions';

class ShipmentCreator extends Component {
    static propTypes = {
        submitShipments: PropTypes.func.isRequired,
    }
    
    state = {
        selectValue: [],
        newShipments: [],
    }
    
    componentWillReceiveProps(nextProps) {
        // If company selection changes, then delete new shipments list.
        const key = "company";
        if (nextProps.shipmentQuery[key] !== this.props.shipmentQuery[key]) {
            this.clearEntries();
        }
    }
    
    get filteredTemplates() {
        return this.props.templates.filter(temp => 
            temp.company === this.props.shipmentQuery.company
        );
    }

    clearEntries = () => {
        this.setState({
            selectValue: [],
            newShipments: [],
        });
    }
    
    addRow = () => {
        const firstTemplate = this.filteredTemplates[0];
        this.setState({
            selectValue: [...this.state.selectValue, 0],
            newShipments: [...this.state.newShipments,
                           {
                               company: firstTemplate.company,
                               dept: firstTemplate.dept,
                               unit: firstTemplate.unit,
                               product: firstTemplate.product,
                               pn: firstTemplate.pn,
                               refPage: this.refs.refPage.value,
                           }]
        });
    }

    removeRow = (i) => {
        this.setState({
            selectValue: [...this.state.selectValue.slice(0,i),
                          ...this.state.selectValue.slice(i+1)],
            newShipments: [...this.state.newShipments.slice(0,i), 
                           ...this.state.newShipments.slice(i+1)]
        });
    }
    
    setProperty = (i, key, value) => {
        this.setState({
            newShipments: [...this.state.newShipments.slice(0,i),
                           Object.assign({}, this.state.newShipments[i], {
                               [key]: value
                           }),
                           ...this.state.newShipments.slice(i+1)]
        });
    }
    
    setReference = () => {
        const refPage = this.refs.refPage.value;
        this.setState({
            newShipments: this.state.newShipments.map(each => 
                              Object.assign({}, each, {refPage})
                          )
        });
    }
    
    /**
     * @param {object} event Select list event
     * @param {number} i     New shipments list index
     */
    setProduct = (event, i) => {
        const templateIndex = event.target.value,
              selectedTemplate = this.filteredTemplates[templateIndex];
        this.setState({
            selectValue: [...this.state.selectValue.slice(0,i),
                          templateIndex,
                          ...this.state.selectValue.slice(i+1)],
            newShipments: [...this.state.newShipments.slice(0,i),
                           Object.assign({}, this.state.newShipments[i], {
                               dept: selectedTemplate.dept,
                               unit: selectedTemplate.unit,
                               product: selectedTemplate.product,
                               pn: selectedTemplate.pn,
                           }),
                           ...this.state.newShipments.slice(i+1)]
        });
    }
    
    submitNewShipments = () => {
        this.props.submitShipments(this.state.newShipments);
    }
    
    render() {
        const props = this.props;
        
        if (!props.shipmentQuery.company) {
            return (
            <div>
            <legend>Create New Shipment</legend>
                <h2>
                    <span className="glyphicon glyphicon-arrow-left"></span>
                    &nbsp;Select a company
                </h2>
            </div>
            )
        }
        
        return (
        <div>
            <legend>Create New Shipment</legend>
            <div className="form-group row">
                <label className="col-xs-2 form-control-label text-right"
                    style={{padding: "0px"}}>參考頁</label>
                <div className="col-xs-1">
                    <input className="form-control"
                        type="text" ref="refPage"
                        onChange={this.setReference} />
                </div>
            </div>
            {this.state.newShipments.map((each,i) => 
            <div key={i} className="row">
                <div className="col-xs-1 text-right" style={{padding: "0px"}}>
                    <button className="btn btn-danger"
                        onClick={() => this.removeRow(i)}>
                        <span className="glyphicon glyphicon-minus"></span>
                    </button>
                </div>
                <div className="col-xs-3" style={{padding: "0px"}}>
                <input className="form-control" type="date" value={each.date}
                    onChange={e => this.setProperty(i, "date", e.target.value)}></input>
                </div>
                <div className="col-xs-4" style={{padding: "0px"}}>
                <select className="form-control"
                    value={this.state.selectValue[i]}
                    onChange={(e) => this.setProduct(e,i)}>
                    {this.filteredTemplates.map((temp, i2) =>
                        <option key={i2} value={i2}>
                              {temp.dept}{temp.unit} &nbsp; {temp.product} &nbsp; {temp.pn}
                        </option>
                    )}
                </select>
                </div>
                <div className="col-xs-2" style={{padding: "0px"}}>
                    <input className="form-control" type="number" 
                        placeholder="需求量"
                        value={each.amount}
                        onChange={e => this.setProperty(i, "amount", e.target.value)}></input>
                </div>
                <div className="col-xs-2" style={{padding: "0px"}}>
                    <input className="form-control" type="text" 
                        placeholder="備註"
                        value={each.note}
                        onChange={e => this.setProperty(i, "note", e.target.value)}></input>
                </div>
            </div>        
            )  /** Followed by remove button */ }
            <div className="row">
                <div className="col-xs-1 text-right" style={{padding: "0px"}}>
                    <button className="btn btn-success"
                        onClick={this.addRow}>
                        <span className="glyphicon glyphicon-plus"></span>
                    </button>
                </div>
                <div className="col-xs-10 text-center">
                    <button className="btn btn-success"
                        onClick={this.submitNewShipments}
                        disabled={this.state.newShipments.length < 1}>
                    提交 / Submit
                    </button>
                </div>
            </div>
        </div>
        );
    }
}

const mapStateToProps = store => ({
    shipmentQuery: store.shipmentQuery,
    shipment: store.shipment,
    templates: store.templates,
});

export default connect(mapStateToProps)(ShipmentCreator)