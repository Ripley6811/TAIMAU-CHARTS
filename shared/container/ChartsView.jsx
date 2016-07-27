/**
 * @overview Displays tables and D3 diagrams for a company/department.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// Components
import AggregatedTable from '../components/AggregatedTable';
import Pie from '../components/Pie';
import YearGraph from '../components/YearGraph';


export default connect(
    ({shipments, query}) => ({shipments, query})  // Pull items from store
)(class ChartsView extends Component {
    static propTypes = {
        query: PropTypes.shape({
                year: PropTypes.number,
                month: PropTypes.number,
        }).isRequired,
        shipments: PropTypes.array.isRequired,
    };

    get datesArray() {
        const retArray = [],
              year = this.props.query.year,
              month = this.props.query.month;

        if (typeof year === "number" && month === undefined) {
            for (let i=0; i<12; i++) {
                retArray.push( new Date(Date.UTC(year, i, 1)) );
            }
        } else if (typeof year === "number" && typeof month === "number") {
            for (let i=new Date(Date.UTC(year, Number(month)+1, 0)).getDate(); i>0; i--) {
                retArray.unshift(new Date(Date.UTC(year, month, i)));
            }
        }

        return retArray;
    }

    get isFullYear() {
        const { query } = this.props,
              hasYear = typeof query.year === "number",
              hasMonth = typeof query.month === "number";
        return hasYear && !hasMonth;
    }

    getDataArrays = () => {
        const { query, shipments } = this.props;

        // Build arrays for display (aggregate shipment data).
        const dataArray = this.datesArray.map(each => [each]);
        const dataTotals = [];

        const dateLength = (typeof query.month === "number") ? 10 : 7;

        if (typeof d3 !== "undefined") {  // Ignore D3.js reference error on server-side
            // Calculates the product totals across all dates
            let prodTotals = d3.nest()
                .key(d => d.unit)
                .key(d => d.product)
                .rollup(v => d3.sum(v, d => d.amount))
                .map(shipments);

            // Creates a object tree of units->depts
            let header = d3.nest()
                .key(d => d.unit)
                .key(d => d.product)
                .rollup(v => ({}))
                .map(shipments);

            let headArray = [];
            for (let unit in header) {
                for (let prod in header[unit]) {
                    headArray.push([unit, prod, prodTotals[unit][prod]]);
                }
            }

            // Adds daily totals to `header`
            for (let i=0; i<shipments.length; i++) {
                const s = shipments[i];
                const oldAmt = header[s.unit][s.product][s.date.substring(0,dateLength)] || 0;
                header[s.unit][s.product][s.date.substring(0,dateLength)] = s.amount + oldAmt;
            }

            // Creates 2D array of dates and data
            for (let i=0; i<dataArray.length; i++) {
                let dateString = dataArray[i][0].toISOString().substring(0,dateLength);
                for (let headIndex=0; headIndex<headArray.length; headIndex++) {
                    let [unit, prod] = headArray[headIndex];
                    if (header[unit]) {
                        if (header[unit][prod]) {
                            dataArray[i].push(header[unit][prod][dateString] || "");
                        }
                    }
                }
            }

            // Adds headers to `dataArray`
            dataArray.unshift(["日期"].concat(headArray.map(head => head[1])));
            dataArray.unshift([query.dept].concat(headArray.map(head => head[0])));

            // Creates 2D array of prods and grand totals
            dataTotals.push([""].concat(headArray.map(head => head[0])));
            dataTotals.push([""].concat(headArray.map(head => head[1])));
            dataTotals.push(["總額"].concat(headArray.map(head => head[2])));
        }

        return [dataArray, dataTotals];
    }

    render() {
        const { query } = this.props,
              [dataArray, dataTotals] = this.getDataArrays();

        if (!!query.dept) {
            return (
                <div className="container">
                    <div className="row">
                        <div style={{float: "left"}}>
                            <AggregatedTable
                                data={dataArray}
                                totals={dataTotals} />
                        </div>
                        <div className="text-center" style={{float: "right"}}>
                            <h2>Ave. # kg / {this.isFullYear ? "月" : "周"}</h2>
                            <Pie id="pie"
                                data={dataTotals}
                                fullYear={this.isFullYear}
                                ></Pie>
                        </div>
                    </div>
                    
                    <div className="row text-center">
                        {this.isFullYear ? <div>
                        <h2>Monthly Trend</h2>
                        <YearGraph
                            data={dataArray}
                            ></YearGraph>
                            </div>
                        : <div></div> }
                    </div>
                </div>
            );
        }

        return (
            <div className="container">
                <br /><br /><br /><br /><br />
                <br /><br /><br /><br /><br />
                <h2>
                    <i className="fa fa-chevron-left" aria-hidden="true" />
                    &nbsp;
                    Select a department
                </h2>
            </div>
        );
    }
});
