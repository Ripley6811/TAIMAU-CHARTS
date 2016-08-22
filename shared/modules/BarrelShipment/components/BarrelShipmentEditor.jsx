/**
 * @overview Place to enter new shipment data.
 */
import React, { Component, PropTypes } from 'react'
import * as utils from '../../../utils/utils'


const INPUT_DIV_STYLE = {padding: "3px", fontSize: "17px"}
const INPUT_INNER_STYLE = {padding: "0px 3px", fontSize: "17px"}


const inputFields = [
    { key: "formID",      type: "text",    label: "出貨編號" },
    { key: "ship",        type: "date",    required: true,  label: "出貨日期" },
    { key: "orderID",     type: "text",    required: true,  label: "訂單編號" },
    { key: "orderTotal",  type: "number",  label: "訂單數量" },
    { key: "rtSeq",       type: "text",    required: true,  label: "RT 序列號" },
    { key: "make",        type: "date",    label: "製造日期" },
    { key: "lotID",       type: "text",    required: true,  label: "批號" },
    { key: "start",       type: "number",  required: true,  label: "流水起始號" },
    { key: "count",       type: "number",  required: true,  label: "桶數" },
    { key: "note",        type: "text",    label: "備註" },
    // The following are provided by the selected template.
//    { key: "company",     type: "text",    label: "公司" },
//    { key: "product",     type: "text",    label: "材料名稱" },
//    { key: "pn",          type: "text",    label: "料號" },
//    { key: "rtCode",      type: "text",    label: "RT Code" },
//    { key: "pkgQty",      type: "number",  label: "桶子容量" },
//    { key: "shelfLife",   type: "number",  label: "保質期" },
//    { key: "barcode",     type: "radio",   label: "barcode" },
//    { key: "datamatrix",  type: "radio",   label: "datamatrix" },
]


export default
class BarrelShipmentEditor extends Component {
    static propTypes = {
        // From Parent
        shipment: PropTypes.object.isRequired,
        templates: PropTypes.array.isRequired,
        setFields: PropTypes.func.isRequired,
        saveShipment: PropTypes.func.isRequired,
        editMode: PropTypes.bool.isRequired,
        reset: PropTypes.func.isRequired,
    }

    componentDidMount = () => {
        this.validateInputs();
    }

    componentDidUpdate = () => {
        this.validateInputs();
    }

    /**
     * Basic validation for required fields and sets background color.
     */
    validateInputs = () => {
        let allPassed = true;

        inputFields.forEach(({ key, type, required }) => {
            const element = this.refs[key];
            switch (type) {
                case 'text':
                    if (required && element.value.trim().length === 0) {
                        allPassed = false;
                        element.style.backgroundColor = 'pink';
                    } else {
                        element.style.backgroundColor = '';
                    }
                    break;
                case 'number':
                    if (required && Number(element.value) <= 0) {
                        allPassed = false;
                        element.style.backgroundColor = 'pink';
                    } else {
                        element.style.backgroundColor = '';
                    }
                    break;
                case 'radio':
                    break;
                case 'date':
                    if (required && !element.value) {
                        allPassed = false;
                        element.style.backgroundColor = 'pink';
                    } else {
                        element.style.backgroundColor = '';
                    }
                    break;
            }
        });

        return allPassed;
    }

    setFields = () => {
        const keyValues = {};

        inputFields.forEach(({ key, type, required }) => {
            switch (type) {
                case 'text':
                    Object.assign(keyValues, {[key]: this.refs[key].value.trim()});
                    break;
                case 'number':
                    Object.assign(keyValues, {[key]: Number(this.refs[key].value)});
                    break;
                case 'radio':
                    Object.assign(keyValues, {[key]: this.refs[key].checked});
                    break;
                case 'date':
                    if (!this.refs[key].value) break;
                    Object.assign(keyValues, {
                        [key + 'Year']:  Number(this.refs[key].value.split('-')[0]),
                        [key + 'Month']: Number(this.refs[key].value.split('-')[1])-1,
                        [key + 'Date']:  Number(this.refs[key].value.split('-')[2]),
                    });
            }
        });

        if (this.validateInputs()) {
            this.refs['saveBtn'].disabled = false;
        } else {
            this.refs['saveBtn'].disabled = true;
        }

        const sixDigitDate = utils.sixDigitDate(
            Number(this.refs.make.value.split('-')[0]),
            Number(this.refs.make.value.split('-')[1])-1,
            Number(this.refs.make.value.split('-')[2])
        );
        keyValues.lotID = this.props.shipment.lotPrefix + sixDigitDate + keyValues.lotID.slice(7);

        this.props.setFields(keyValues);
    }

    get inputKeys() {
        return inputFields.map(f => f.key);
    }

    useTemplate = (templateIndex) => {
        const { company, product, pn, lotPrefix, rtCode, pkgQty, shelfLife,
                barcode, datamatrix } = this.props.templates[templateIndex];
        this.props.setFields({
            company, product, pn, lotPrefix, rtCode, pkgQty, shelfLife, barcode, datamatrix
        });
    }

    render() {
        const { shipment: propsShipment, templates } = this.props;
        const { makeYear: mY, makeMonth: mM, makeDate: mD,
                shipYear: sY, shipMonth: sM, shipDate: sD } = propsShipment;
        const shipment = Object.assign({}, propsShipment, {
            make: mY ? `${mY}-${(mM+1) < 10 ? '0'+(mM+1) : (mM+1)}-${mD < 10 ? '0'+mD : mD}` : '',
            ship: sY ? `${sY}-${(sM+1) < 10 ? '0'+(sM+1) : (sM+1)}-${sD < 10 ? '0'+sD : sD}` : '',
        });

        return <div>
            { this.props.editMode ?
                <legend>Editing Shipment <small>({shipment._id})</small></legend> :
                <legend>Create New Shipment</legend> }
            <div className="row">
                <div className="col-sm-4" style={INPUT_DIV_STYLE}>
                    <label className="form-label">材料名稱</label>
                    { this.props.editMode || !!shipment.product ?
                    <input className="form-control" type="text" disabled
                        value={`${shipment.product}  ${shipment.pn}`} />
                        :
                    <select className="form-control"
                        onChange={e => this.useTemplate(e.target.value)}>
                        <option key="blankTemplate" value="">
                            選材料
                        </option>
                        { templates.map((tp, i) =>
                        <option key={tp.pn + i} value={i}>
                            {tp.product} &nbsp; &nbsp; {tp.pn}
                        </option>
                        ) }
                    </select>
                    }
                </div>
                { inputFields.slice(0, 4).map(({ key, type, label, required},i) =>
                <div className="col-sm-2"
                    key={"NS_"+key} style={INPUT_DIV_STYLE}>
                    <label className="form-label">{label}</label>
                    <input className="form-control"
                        onChange={this.setFields}
                        type={type} ref={key} value={shipment[key] || ''} />
                </div>
                ) }
            </div>
            <div className="row">
                { inputFields.slice(4, 10).map(({ key, type, label, required},i) =>
                <div className="col-sm-2"
                    key={"NS_"+key} style={INPUT_DIV_STYLE}>
                    <label className="form-label">{label}</label>
                    <input className="form-control"
                        onChange={this.setFields}
                        type={type} ref={key} value={shipment[key] || ''} />
                </div>
                ) }
            </div>
            <br />
            <div className="row">
                <div className="col-sm-4" style={INPUT_DIV_STYLE}>
                    RT: {utils.getRoute(shipment)}
                </div>
                <div className="col-sm-4" style={INPUT_DIV_STYLE}>
                    批次序列號: {utils.getLotSet(shipment)}
                </div>
            </div>
            <br />
            <div className="row">
                <button className="btn btn-warning" ref='saveBtn' onClick={this.props.saveShipment} >
                    { this.props.editMode ? "Save Updates" : "Save New Record" }
                </button>
                &nbsp;
                <button className="btn btn-primary" onClick={this.props.reset} >
                    { this.props.editMode ? "Cancel Editing" : "Reset All" }
                </button>
            </div>
        </div>;
    }
}
