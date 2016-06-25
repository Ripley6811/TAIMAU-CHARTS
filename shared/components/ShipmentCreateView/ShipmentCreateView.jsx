import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';

class ShipmentCreateView extends Component {
    constructor(props, context) {
        // TODO: See if passing props and context to super is necessary.
        super(props, context);
        this.addShipment = this.addShipment.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }

    /**
     * Checks data then calls the main `addShipment` method on props obj.
     * 
     * Refs are the html element
     */
    addShipment() {
        const shipment = this.props.shipment;
        const requiredFields = [
            'company',
            'date',
            'name',
            'pn',
            'amount',
            'dept',
            'unit'
        ];

        if (requiredFields.every((el) => shipment[el])) {
            // Use the "add" method in ShipmentContainer
            this.props.dispatch(Actions.addShipmentRequest(
                Object.assign({}, shipment)
            ));

            // Update selection options based on input
            this.props.dispatch(Actions.fetchDeptLinks());
            
            this.clearForm();
        }
    }
    

    handleChange(event) {
        const update = {};
        update[event.target.name] = event.target.value;
        // Update the current shipment
        this.props.dispatch(Actions.addSelectedShipment(
            Object.assign({}, this.props.shipment, update)
        ));
        // Update selection options based on input
        this.props.dispatch(Actions.fetchOptions(
            Object.assign({}, this.props.shipment, update)
        ));
    }

    clearForm() {
        // Clear values by adding empty shipment object.
        this.props.dispatch(Actions.addSelectedShipment({}))
    }

    render() {
        let props = this.props;
        return (
      <form>
        <fieldset>
            <legend>Create New Shipment</legend>

        <div className="row">
            <div className="form-group col-sm-1">
                <label className="form-label">公司</label>
                <input className="form-control" list="companyOptions"
                    name="company" onChange={this.handleChange} 
                    value={props.shipment.company || ''} required />
                <datalist id="companyOptions">
                    {props.options.companyList.map((value, i) => 
                        <option value={value} key={i} />
                    )}
                </datalist>
            </div>
            <div className="form-group col-sm-1">
                <label className="">
                    <abbr title="Page Reference Number">參考頁</abbr>
                </label>
                <input className="form-control" 
                    name="refPage" onChange={this.handleChange} 
                    value={props.shipment.refPage || ''} />
            </div>
            <div className="form-group col-sm-2">
                <label className="form-label">
                    <abbr title="Date Shipped">進貨日期</abbr>
                </label>
                <input className="form-control" 
                    name="date" onChange={this.handleChange} 
                    value={props.shipment.date || ''} type="date" required />
            </div>
            <div className="form-group col-sm-2">
                <label className="form-label">
                    <abbr title="Product Name">材料名稱</abbr>
                </label>
                <input className="form-control" list="nameOptions"
                    name="name" onChange={this.handleChange} 
                    value={props.shipment.name || ''} required />
                <datalist id="nameOptions">
                    {props.options.nameList.map((value, i) => 
                        <option value={value} key={i} />
                    )}
                </datalist>
            </div>
            <div className="form-group col-sm-2">
                <label className="form-label">
                    <abbr title="Product Number">料號</abbr>
                </label>
                <input className="form-control" list="pnOptions"
                    name="pn" onChange={this.handleChange} 
                    value={props.shipment.pn || ''} required />
                <datalist id="pnOptions">
                    {props.options.pnList.map((value, i) => 
                        <option value={value} key={i} />
                    )}
                </datalist>
            </div>
            <div className="form-group col-sm-1">
                <label className="form-label">需求量</label>
                <input className="form-control" 
                    name="amount" onChange={this.handleChange} 
                    value={props.shipment.amount || ''} type="number" required />
            </div>
            <div className="form-group col-sm-1">
                <label className="form-label">Dept</label>
                <input className="form-control" list="deptOptions"
                    name="dept" onChange={this.handleChange} 
                    value={props.shipment.dept || ''} required />
                <datalist id="deptOptions">
                    {props.options.deptList.map((value, i) => 
                        <option value={value} key={i} />
                    )}
                </datalist>
            </div>
            <div className="form-group col-sm-1">
                <label className="form-label">Unit</label>
                <input className="form-control" list="unitOptions"
                    name="unit" onChange={this.handleChange} 
                    value={props.shipment.unit || ''} required />
                <datalist id="unitOptions">
                    {props.options.unitList.map((value, i) => 
                        <option value={value} key={i} />
                    )}
                </datalist>
            </div>
            <div className="form-group col-sm-1">
                <label className="form-label">備註</label>
                <input className="form-control" 
                    name="note" onChange={this.handleChange} 
                    value={props.shipment.note || ''} />
            </div>
        </div>
        <div className="row text-center">
            <input className="btn btn-success btn-margin" type="button" 
                value="提交 / Submit" onClick={this.addShipment} />
        </div>
        <div className="row text-center">
            <input className="btn btn-primary btn-margin" type="button" 
                value="Clear Fields" onClick={this.clearForm} />
            <input className="btn btn-primary btn-margin" type="button" 
                value="Edit Dropdown Options" onClick={() => window.location= "../shipment_templates"} />
        </div>
        </fieldset>
      </form>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(store) {
    return {
        shipment: store.shipment,
        options: store.options,
    };
}

//ShipmentCreateView.propTypes = {
//    addShipment: PropTypes.func.isRequired,
//    showAddShipment: PropTypes.bool.isRequired,
//};

export default connect(mapStateToProps)(ShipmentCreateView);