/**
 * @overview Place to enter sets of shipments.
 */
import React, { Component, PropTypes } from 'react';
// Components
import { FA_CHEVRON_LEFT, FA_PLUS, FA_MINUS } from '../../../components/FontAwesome';


const COLORS = ['rgb(236, 255, 230)', '#f5ce96'];
const INPUT_DIV_STYLE = {padding: "0px", fontSize: "17px"};
const INPUT_INNER_STYLE = {padding: "0px 3px", fontSize: "17px"};


export default
class ShipmentCreator extends Component {
    static propTypes = {
        // Parent
        submitShipments: PropTypes.func.isRequired,
        templates: PropTypes.array.isRequired,
        query: PropTypes.object.isRequired,
    }

    state = {
        newShipments: [],
    }

    componentWillReceiveProps = (nextProps) => {
        // If company selection changes, then delete new shipments list.
        const key = "company";
        if (nextProps.query[key] !== this.props.query[key]) {
            this.removeAllEntries();
        }
    }

    /**
     * Returns a subset of templates matching the current global query.company.
     */
    get companyTemplates() {
        return this.props.templates.filter(temp =>
            temp.company === this.props.query.company
        );
    }

    /**
     * Merges possible dept-unit combinations as string to put in set
     * then splits strings to return an array of objects.
     */
    get deptOptions() {
        const newSet = [...new Set(this.companyTemplates.map(temp => `${temp.dept}|${temp.unit}`))].map(
            each => ({dept: each.split("|")[0], unit: each.split("|")[1]})
        );
        return newSet;
    }

    /**
     * Returns a subset of templates matching dept and unit.
     */
    getDeptTemplates = (dept, unit) => {
        return this.companyTemplates.filter(
            each => each.dept === dept && each.unit === unit
        );
    }

    removeAllEntries = () => {
        this.setState({
            newShipments: [],
        });
        if (this.refs.refPage) this.refs.refPage.value = "";
    }

    addRow = () => {
        const firstTemplate = this.companyTemplates[0];
        this.setState({
            newShipments: [...this.state.newShipments,
                           {
                               date: new Date().toISOString().slice(0,10),
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

    // Currently not used...
    clearField = (key) => {
        const slist = this.state.newShipments;
        this.setState({
            newShipments: slist.map(each => Object.assign({}, each, {[key]: ""}))
        });
    }

    clearAllTextInputs = () => {
        const slist = this.state.newShipments;
        // Wait for this "setState" to finish before triggering refPage "setState".
        this.setState({
            newShipments: slist.map(each => Object.assign({}, each, {
                amount: "",
                note: "",
            }))
        }, () => (this.refs.refPage.value = ""));
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
    setDeptUnit = (event, i) => {
        const deptOptionsIndex = event.target.value,
              selectedDeptUnit = this.deptOptions[deptOptionsIndex];
        let templates = this.getDeptTemplates(selectedDeptUnit.dept, selectedDeptUnit.unit);
        this.setState({
            newShipments: [...this.state.newShipments.slice(0,i),
                           Object.assign({}, this.state.newShipments[i], {
                               dept: selectedDeptUnit.dept,
                               unit: selectedDeptUnit.unit,
                               product: templates[0].product,
                               pn: templates[0].pn,
                           }),
                           ...this.state.newShipments.slice(i+1)]
        });
    }

    /**
     * @param {object} event Select list event
     * @param {number} i     New shipments list index
     */
    setProduct = (event, i) => {
        const templateIndex = event.target.value;
        let shipment = this.state.newShipments[i];
        let template = this.getDeptTemplates(shipment.dept, shipment.unit)[templateIndex];

        this.setState({
            newShipments: [...this.state.newShipments.slice(0,i),
                           Object.assign({}, this.state.newShipments[i], {
                               product: template.product,
                               pn: template.pn,
                           }),
                           ...this.state.newShipments.slice(i+1)]
        });
    }

    submitNewShipments = () => {
        const datesAreGood = this.state.newShipments.every(each => {
            if (!each.date) return false;
            // Must be current or past date.
            return new Date(each.date) <= new Date();
        });
        const amountsAreGood = this.state.newShipments.every(each => !!each.amount);
        const refPageEntered = this.refs.refPage.value ? true : false;
        if (!datesAreGood) {
            alert("Check dates column. 一個多日期不好.");
        } else if (datesAreGood && amountsAreGood && refPageEntered) {
            this.props.submitShipments(this.state.newShipments);
            this.clearAllTextInputs();
        } else {
            alert("All fields except 'note' are required.");
        }
    }

    render() {
        const { company } = this.props.query,
              { newShipments } = this.state;
        let lastUnit = "";
        let colorIndex = -1;
        const today = new Date();
        const maxDateString = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;

        if (!company) {
            return (
            <div>
            <legend>Create New Shipment</legend>
                <h2>
                    {FA_CHEVRON_LEFT} &nbsp; Select a company
                </h2>
            </div>
            )
        }

        return (
        <div>
            <legend>Create New Shipment</legend>
            <div className="form-group row">
                <div className="col-xs-2 text-left" style={{padding: "0px"}}>
                    <button className="btn btn-success" style={{float: "left"}}
                            onClick={this.addRow}>
                        {FA_PLUS}
                    </button>
                    <span style={{padding: "0px 5px", fontSize: "30px", float: "right"}}>
                        {company}
                    </span>
                </div>
                { /** REF PAGE INPUT */ }
                <label className="col-xs-1 form-control-label text-right"
                       style={{padding: "5px", margin: "0px"}}>
                    參考頁
                </label>
                <div className="col-xs-1" style={{paddingLeft: "0px"}}>
                    <input className="form-control" max="99"
                           type="number" ref="refPage" placeholder="#"
                           onChange={this.setReference} />
                </div>
                <div className="col-xs-3 text-center">
                    <h5>
                        (用<strong>紀錄模板</strong>輸入新的選擇)
                    </h5>
                </div>
                <div className="col-xs-2 text-center">
                    <button className="btn btn-success"
                            onClick={this.submitNewShipments}
                            disabled={newShipments.length < 1}>
                        提交 / Submit
                    </button>
                </div>
                <div className="col-xs-2 text-center">
                    <button className="btn btn-warning"
                            style={{marginLeft: "10px"}}
                            onClick={this.clearAllTextInputs}
                            disabled={newShipments.length < 1}>
                        Clear All
                    </button>
                </div>
            </div>
            { newShipments.map((each,i) =>
            <div key={`${each}${i}`} className="row">
                { /** REMOVE BUTTON */ }
                <div className="col-xs-3" style={INPUT_DIV_STYLE}>
                    <div className="row" style={INPUT_DIV_STYLE}>
                        <div className="col-xs-2" style={INPUT_DIV_STYLE}>
                            <button className="btn btn-danger"
                                    onClick={() => this.removeRow(i)}>
                                {FA_MINUS}
                            </button>
                        </div>
                        { /** DATE INPUT */ }
                        <div className="col-xs-10" style={INPUT_DIV_STYLE}>
                            <input className="form-control"
                                 style={Object.assign({}, INPUT_INNER_STYLE, {})}
                                type="date"
                                value={each.date}
                                max={maxDateString}
                                onChange={e => this.setProperty(i, "date", e.target.value)} />
                        </div>
                    </div>
                </div>
                { /** DEPT-UNIT SELECTION LIST */ }
                <div className="col-xs-2" style={INPUT_DIV_STYLE}>
                <select className="form-control" style={INPUT_INNER_STYLE}
                        onChange={e => this.setDeptUnit(e,i)}>
                    { this.deptOptions.map((temp, i2) => {
                        const unitChanged = temp.unit.trim().split("-")[0] !== lastUnit;
                        lastUnit = temp.unit.trim().split("-")[0];
                        if (unitChanged) {
                            colorIndex = (colorIndex+1)%2;
                        }

                        return <option key={i2} value={i2}
                            style={{backgroundColor: COLORS[colorIndex]}}>
                            {(1+i2).toString(36)}) &nbsp; {temp.unit} &nbsp; {temp.dept}
                        </option>;


                      }
                    ) }
                </select>
                </div>
                { /** PRODUCT SELECTION LIST */ }
                <div className="col-xs-2" style={INPUT_DIV_STYLE}>
                <select className="form-control" style={INPUT_INNER_STYLE}
                    onChange={e => this.setProduct(e,i)}>
                    { this.getDeptTemplates(each.dept, each.unit).map((temp, i2) =>
                        <option key={`${temp.dept}${temp.unit}${temp.pn}${i2}`} value={i2}>
                            {temp.product} &nbsp; &nbsp; {temp.pn}
                        </option>
                    ) }
                </select>
                </div>
                { /** AMOUNT INPUT */ }
                <div className="col-xs-2" style={INPUT_DIV_STYLE}>
                    <input className="form-control" type="number"
                           style={INPUT_INNER_STYLE}
                           placeholder="需求量"
                           value={each.amount}
                           onChange={e => this.setProperty(i, "amount", e.target.value)}></input>
                </div>
                { /** NOTE INPUT */ }
                <div className="col-xs-3" style={INPUT_DIV_STYLE}>
                    <input className="form-control" type="text"
                           style={INPUT_INNER_STYLE}
                           placeholder="備註"
                           value={each.note}
                           onChange={e => this.setProperty(i, "note", e.target.value)}></input>
                </div>
            </div>
            )}
        </div>
        );
    }
};
