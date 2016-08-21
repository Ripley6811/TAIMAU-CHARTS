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
     * Creates a "Set" of products and returns an array of "option" components.
     */
    get productSelectOptions() {
        const { company } = this.props,
              optionsArray = [...new Set(this.props.templates.map(temp => temp.product))];

        return optionsArray.map((product, i) =>
            <option key={`${company}${i}${product}`} value={product}>
                {product}
            </option>
        );
    }

    /**
     * Creates an array of dept-unit "option" components given a product.
     */
    deptRadioButtons = (row, product) => {
        const { dept: currDept } = this.state.newShipments[row];
        const optionsArray = Array(...new Set(this.getProductTemplates(product).map(ea => ea.dept)));
        const selectedStyle = {backgroundColor: 'springgreen'};

        return optionsArray.map((dept, i) =>
            <button className="btn btn-default"
                key={`${i}-${row}-${product}`}
                style={dept === currDept ? selectedStyle : {}}
                onClick={() => this.setDeptUnitPn(row, dept)} >
                {dept}
            </button>
        );
    }

    /**
     * Creates an array of dept-unit "option" components given a product.
     */
    unitRadioButtons = (row, product, dept) => {
        const { unit: currUnit } = this.state.newShipments[row];
        const optionsArray = Array(...new Set(this.getProductTemplates(product).filter(ea => (ea.dept === dept && ea.product === product)).map(ea => ea.unit)));
        const regularStyle = {}
        const selectedStyle = { backgroundColor: 'gold'};

        return optionsArray.map((unit, i) =>
            <button className="btn btn-default"
                key={`${i}-${row}-${product}`}
                style={unit === currUnit ? selectedStyle : regularStyle}
                onClick={() => this.setUnitPn(row, unit)} >
                {unit}
            </button>
        );
    }

    /**
     * Returns a subset of templates matching product.
     */
    getProductTemplates = (product) => {
        return this.props.templates.filter(
            each => each.product === product
        );
    }

    removeAllEntries = () => {
        this.setState({
            newShipments: [],
        });
        this.refs.refPageB.value = "";
    }

    getRefPage = () => {
        const { refPageA: { value: refA },
                refPageB: { value: refB } } = this.refs;
        return (100*Number(refA) + Number(refB)) / 100;
    }

    addRow = () => {
        if (this.props.templates.length < 1) {
            alert("No templates found");
            return;
        }
        const { product, pn, dept, unit, company } = this.props.templates[0];

        this.setState({
            newShipments: [...this.state.newShipments,
                           {
                               date: this.getYYYYMMDD(),
                               refPage: this.getRefPage(),
                               product, pn, dept, unit, company,
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

    setProperty = (row, key, value) => {
        const { state: { newShipments } } = this;

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
            newShipments: [...newShipments.slice(0,row),
                           Object.assign({}, newShipments[row], { [key]: value }),
                           ...newShipments.slice(row+1)]
        });
    }

    // Currently not used...
    clearField = (key) => {
        const { newShipments: slist } = this.state;
        this.setState({
            newShipments: slist.map(each => Object.assign({}, each, {[key]: ""}))
        });
    }

    clearAllTextInputs = () => {
        const { newShipments: slist } = this.state;
        // Wait for this "setState" to finish before triggering refPage "setState".
        this.setState({
            newShipments: slist.map(each => Object.assign({}, each, {
                amount: "",
                note: "",
            }))
        }, () => (this.refs.refPageB.value = ""));
    }

    setReference = () => {

        this.setState({
            newShipments: this.state.newShipments.map(each =>
                Object.assign({}, each, {refPage: this.getRefPage()})
            )
        });
    }

    /**
     * Sets unit and pn based on Unit-button click
     */
    setDeptUnitPn = (row, dept) => {
        const { getProductTemplates: getTemplates, state: { newShipments } } = this,
              { product } = newShipments[row],
              templatesArr = getTemplates(product).filter(ea => (ea.dept === dept)),
              template = templatesArr[0];
        // Assert at least one match
        if (templatesArr.length < 1) throw "No templates found in 'setDeptUnit'";

        this.setState({
            newShipments: [...newShipments.slice(0,row),
                           Object.assign({}, newShipments[row], {
                               dept: template.dept,
                               unit: template.unit,
                               pn: template.pn,
                           }),
                           ...newShipments.slice(row+1)]
        });
    }

    /**
     * Sets unit and pn based on Unit-button click
     */
    setUnitPn = (row, unit) => {
        const { getProductTemplates: getTemplates, state: { newShipments } } = this,
              { product, dept } = newShipments[row],
              templatesArr = getTemplates(product).filter(ea => (ea.dept === dept && ea.unit === unit)),
              template = templatesArr[0];
        // Assert single match
        if (templatesArr.length !== 1) throw "Multiple or no templates found in 'setDeptUnit'";

        this.setState({
            newShipments: [...newShipments.slice(0,row),
                           Object.assign({}, newShipments[row], {
                               unit: template.unit,
                               pn: template.pn,
                           }),
                           ...newShipments.slice(row+1)]
        });
    }

    /**
     * @param {object} event Select list event
     * @param {number} i     New shipments list index
     */
    setProduct = (event, row) => {
        const { state: { newShipments } } = this,
              { value: prodName } = event.target;  // (Destructuring with rename, "value" is undefined)

        const { product, pn, dept, unit, company } = this.getProductTemplates(prodName)[0];

        this.setState({
            newShipments: [...newShipments.slice(0,row),
                           Object.assign({}, newShipments[row],
                                         { product, pn, dept, unit, company }),
                           ...newShipments.slice(row+1)]
        });
    }

    submitNewShipments = () => {
        const { state: { newShipments },
                refs: { refPageA, refPageB },
                props: { submitShipments } } = this;

        const datesAreGood = newShipments.every(each => {
            console.log(each.date);
            if (!each.date) return false;
            // Must be current or past date.
            return new Date(each.date) <= new Date();
        });
        const amountsAreGood = newShipments.every(each => !!each.amount);

        if (!datesAreGood) {
            alert("Check dates column. 一個多日期不好.");
        } else if (datesAreGood && amountsAreGood &&
                   !!refPageA.value && !!refPageB.value) {
            const outShipments = newShipments.map(e =>
                Object.assign({}, e, {product: e.product.split("(")[0]})
            );
            for (let i in outShipments) outShipments[i].refPageSeq = +i;
            submitShipments(outShipments);
            this.clearAllTextInputs();
        } else {
            alert("All fields except 'note' are required.");
        }
    }

    render() {
        const { state: { newShipments },
                props: { company } } = this;

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
                    <div className="input-group" style={{zIndex: "0"}}>
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
                <div className="col-xs-1" style={INPUT_DIV_STYLE}>
                    <input className="form-control" type="text"
                           style={INPUT_INNER_STYLE}
                           placeholder="需求量"
                           value={each.amount}
                           onChange={e => this.setProperty(row, "amount", e.target.value)}></input>
                </div>
                { /** DEPT-UNIT SELECTION LIST */ }
                <div className="col-xs-5" style={INPUT_DIV_STYLE}>
                    { this.deptRadioButtons(row, each.product) }
                    { this.unitRadioButtons(row, each.product, each.dept) }
                </div>
                { /** NOTE INPUT */ }
                <div className="col-xs-1" style={INPUT_DIV_STYLE}>
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
