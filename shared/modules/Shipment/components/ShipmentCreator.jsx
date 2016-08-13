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
        companyTemplates: PropTypes.array.isRequired,
        company: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        month: PropTypes.number,
    }

    state = {
        newShipments: [],
    }

    componentWillReceiveProps = (nextProps) => {
        // If company selection changes, then delete new shipments list.
        if (nextProps.company !== this.props.company) {
            this.removeAllEntries();
        }
        if (nextProps.month !== this.props.month) {
            this.removeAllEntries();
        }
    }

    /**
     * Returns company templates.
     */
    get templates() {
        return this.props.companyTemplates;
    }

    /**
     * Creates a "Set" of products and returns an array of "option" components.
     */
    get productSelectOptions() {
        const { company } = this.props,
              optionsArray = [...new Set(this.templates.map(temp => temp.product))];

        return optionsArray.map((product, i) =>
            <option key={`${company}${i}${product}`} value={product}>
                {product}
            </option>
        );
    }

    /**
     * Creates an array of dept-unit "option" components given a product.
     */
    deptSelectOptions = (product) => {
        const optionsArray = this.getProductTemplates(product);

        return optionsArray.map((temp, i) =>
            <option key={`${temp.dept}${temp.unit}${temp.pn}${i}`} value={i}>
                {temp.dept} &nbsp; &nbsp; {temp.unit}
            </option>
        );
    }

    /**
     * Returns a subset of templates matching product.
     */
    getProductTemplates = (product) => {
        return this.templates.filter(
            each => each.product === product
        );
    }

    removeAllEntries = () => {
        this.setState({
            newShipments: [],
        });
        this.refs.refPageB.value = "";
    }

    addRow = () => {
        const firstTemplate = this.templates[0];
        const refA = +this.refs.refPageA.value;
        const refPage = +refA + 0.01*this.refs.refPageB.value;
        this.setState({
            newShipments: [...this.state.newShipments,
                           {
                               date: this.getYYYYMMDD(),
                               company: firstTemplate.company,
                               dept: firstTemplate.dept,
                               unit: firstTemplate.unit,
                               product: firstTemplate.product,
                               pn: firstTemplate.pn,
                               refPage: refPage,
                           }]
        });
    }

    removeRow = (i) => {
        this.setState({
            newShipments: [...this.state.newShipments.slice(0,i),
                           ...this.state.newShipments.slice(i+1)]
        });
    }

    getYYYYMMDD = (day) => {
        day = Number(day);
        const { year, month } = this.props;
        let mm = typeof month !== 'undefined' ? 1 + Number(month) : 1 + new Date().getMonth();
        mm = mm < 10 ? `0${mm}` : `${mm}`;
        let dd = `01`;
        if (typeof day === 'number' && day > 0 && day < 32) {
            dd = Number(day) < 10 ? `0${Number(day)}` : `${Number(day)}`;
        }
        return `${year}-${mm}-${dd}`;
    }

    setProperty = (i, key, value) => {
        if (key === "date") {
            value = this.getYYYYMMDD(value);
        }
        if (key === "amount") {
            value = Number(value);
            if (isNaN(value)) {
                value = 0;
            }
        }
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
        }, () => (this.refs.refPageB.value = ""));
    }

    setReference = () => {
        const refA = +this.refs.refPageA.value;
        const refPage = +refA + 0.01*this.refs.refPageB.value;
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
    setDeptUnit = (event, row) => {
        const productTemplatesIndex = event.target.value;
        const template = this.getProductTemplates(this.state.newShipments[row].product)[productTemplatesIndex];
        this.setState({
            newShipments: [...this.state.newShipments.slice(0,row),
                           Object.assign({}, this.state.newShipments[row], {
                               dept: template.dept,
                               unit: template.unit,
                               pn: template.pn,
                           }),
                           ...this.state.newShipments.slice(row+1)]
        });
    }

    /**
     * @param {object} event Select list event
     * @param {number} i     New shipments list index
     */
    setProduct = (event, row) => {
        const prodName = event.target.value;
        console.log("set product:", prodName);
        const template = this.getProductTemplates(prodName)[0];

        this.setState({
            newShipments: [...this.state.newShipments.slice(0,row),
                           Object.assign({}, this.state.newShipments[row], {
                               product: template.product,
                               pn: template.pn,
                               dept: template.dept,
                               unit: template.unit,
                               company: template.company,
                           }),
                           ...this.state.newShipments.slice(row+1)]
        });
    }

    submitNewShipments = () => {
        const datesAreGood = this.state.newShipments.every(each => {
            console.log(each.date);
            if (!each.date) return false;
            // Must be current or past date.
            return new Date(each.date) <= new Date();
        });
        const amountsAreGood = this.state.newShipments.every(each => !!each.amount);
        const refPageAEntered = this.refs.refPageA.value ? true : false;
        const refPageBEntered = this.refs.refPageB.value ? true : false;
        if (!datesAreGood) {
            alert("Check dates column. 一個多日期不好.");
        } else if (datesAreGood && amountsAreGood && refPageAEntered && refPageBEntered) {
            const shipments = this.state.newShipments.map(e => Object.assign({},e));
            for (let i in shipments) shipments[i].refPageSeq = +i;
            this.props.submitShipments(shipments);
            this.clearAllTextInputs();
        } else {
            alert("All fields except 'note' are required.");
        }
    }

    render() {
        const { company } = this.props,
              { newShipments } = this.state;

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
                <div className="col-xs-3" style={{padding: "0px"}}>
                    <div className="row">
                        <div className="col-xs-2 text-right" style={INPUT_DIV_STYLE}>
                            <button className="btn btn-success"
                                    onClick={this.addRow}>
                                {FA_PLUS}
                            </button>
                        </div>
                        <div className="col-xs-6 text-center" style={INPUT_DIV_STYLE}>
                            <span style={{padding: "0px 5px", fontSize: "30px"}}>
                                {company}
                            </span>
                        </div>
                        <div className="col-xs-4 text-right" style={{padding: "0px 3px"}}>
                            <h4>參考頁</h4>
                        </div>
                    </div>
                </div>
                { /** REF PAGE INPUT */ }
                <div className="col-xs-2" style={{paddingLeft: "0px"}}>
                    <div className="input-group">
                        <input className="form-control text-right" max="9"
                               type="number" ref="refPageA" placeholder="#"
                               onChange={this.setReference} />
                        <span className="input-group-addon">{FA_MINUS}</span>
                        <input className="form-control" max="99"
                               type="number" ref="refPageB" placeholder="#"
                               onChange={this.setReference} />
                    </div>
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
            { newShipments.map((each,row) =>
            <div key={`newrow${row}`} className="row">
                <div className="col-xs-3" style={INPUT_DIV_STYLE}>
                    <div className="row">
                        { /** REMOVE BUTTON */ }
                        <div className="col-xs-2 text-right" style={INPUT_DIV_STYLE}>
                            <button className="btn btn-danger"
                                    onClick={() => this.removeRow(row)}>
                                {FA_MINUS}
                            </button>
                        </div>
                        <div className="col-xs-6" style={INPUT_DIV_STYLE}>
                            <input className="form-control text-right" disabled style={INPUT_INNER_STYLE}
                               value={each.date.substring(0,8)} />
                        </div>
                        { /** DATE INPUT */ }
                        <div className="col-xs-4" style={INPUT_DIV_STYLE}>
                            <input className="form-control" style={INPUT_INNER_STYLE}
                                type="number"
                                placeholder="日"
                                value={Number(each.date.split("-")[2])}
                                onChange={e => this.setProperty(row, "date", e.target.value)} />
                        </div>
                    </div>
                </div>
                { /** PRODUCT SELECTION LIST */ }
                <div className="col-xs-2" style={INPUT_DIV_STYLE}>
                    <select className="form-control" style={INPUT_INNER_STYLE}
                        onChange={e => this.setProduct(e, row)}>
                        { this.productSelectOptions }
                    </select>
                </div>
                { /** AMOUNT INPUT */ }
                <div className="col-xs-2" style={INPUT_DIV_STYLE}>
                    <input className="form-control" type="text"
                           style={INPUT_INNER_STYLE}
                           placeholder="需求量"
                           value={each.amount}
                           onChange={e => this.setProperty(row, "amount", e.target.value)}></input>
                </div>
                { /** DEPT-UNIT SELECTION LIST */ }
                <div className="col-xs-2" style={INPUT_DIV_STYLE}>
                    <select className="form-control" style={INPUT_INNER_STYLE}
                            onChange={e => this.setDeptUnit(e, row)}>
                        { this.deptSelectOptions(each.product) }
                    </select>
                </div>
                { /** NOTE INPUT */ }
                <div className="col-xs-3" style={INPUT_DIV_STYLE}>
                    <input className="form-control" type="text"
                           style={INPUT_INNER_STYLE}
                           placeholder="備註"
                           value={each.note}
                           onChange={e => this.setProperty(row, "note", e.target.value)}></input>
                </div>
            </div>
            )}
        </div>
        );
    }
};
