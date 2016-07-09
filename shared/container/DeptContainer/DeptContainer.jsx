import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../../redux/actions/actions';

import MainTable from './MainTable';

class DeptContainer extends Component {  
    static propTypes = {
        query: PropTypes.shape({
                year: PropTypes.number,
                month: PropTypes.number,
        }).isRequired,
    };

    static defaultProps = {
        query: {},
        templates: [],
        shipments: []
    }
    
    state = {
        dataArray: undefined,
        dataTotals: undefined
    }
    
    componentWillMount() {
        /**
         * Ensure shipments are loaded into state 
         * when navigating on client-side.
         */ 
        if (this.props.shipments.length === 0)
            this.props.dispatch(Actions.fetchShipments(this.props.query));
    }

    dispatchFetchShipments(query) {
        const params = query || this.props.query;
        this.props.dispatch(Actions.fetchShipments(params));
    }
    
    get datesArray() {
        const retArray = [];
        const year = this.props.query.year;
        const month = this.props.query.month;

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

    shouldComponentUpdate(nextProps) {
        // Skip changes in "query" and wait for next "shipments" change
        return JSON.stringify(this.props.query) === JSON.stringify(nextProps.query);
    }

    componentWillReceiveProps(nextProps) {
        // If "query" changes then load new set of "shipments".
        if (JSON.stringify(this.props.query) !== JSON.stringify(nextProps.query)) {
            this.dispatchFetchShipments(nextProps.query);
            return;
        }
        
    }
    
    render() {
        const props = this.props;
        
        // Build arrays for display (aggregate shipment data).
        const dataArray = this.datesArray.map(each => [each]);
        const dataTotals = [];
        
        const dateLength = (typeof props.query.month === "number") ?
              10 : 7;
        
        if (typeof d3 !== "undefined") {  // Ignore D3.js reference error on server-side
            // Calculates the product totals across all dates
            let prodTotals = d3.nest()
                .key(d => d.unit)
                .key(d => d.product)
                .rollup(v => d3.sum(v, d => d.amount))
                .map(props.shipments);

            // Creates a object tree of units->depts
            let header = d3.nest()
                .key(d => d.unit)
                .key(d => d.product)
                .rollup(v => ({}))
                .map(props.shipments);

            let headArray = [];
            for (let unit in header) {
                for (let prod in header[unit]) {
                    headArray.push([unit, prod, prodTotals[unit][prod]]);
                }
            }

            // Adds daily totals to `header`
            for (let i=0; i<props.shipments.length; i++) {
                const s = props.shipments[i];
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
            dataArray.unshift([""].concat(headArray.map(head => head[0])));

            // Creates 2D array of prods and grand totals
            dataTotals.push([""].concat(headArray.map(head => head[0])));
            dataTotals.push([""].concat(headArray.map(head => head[1])));
            dataTotals.push(["總額"].concat(headArray.map(head => head[2])));
        } 
            
        if (!!props.query.dept) {
            return (
                <div className="container">
                    <h2> {props.query.dept}</h2>
                    <MainTable 
                        data={dataArray} 
                        totals={dataTotals} />
                </div>
            );
        }
        
        return (
            <div className="container">              
                <br /><br /><br /><br /><br />
                <h2>
                    <span className="glyphicon glyphicon-arrow-left"></span>
                    &nbsp;
                    Select a department
                </h2>
            </div>
        );
    }
}


// Retrieve data from store as props
const mapStateToProps = (store) => ({
      shipments: store.shipments,
      query: store.query,
});

export default connect(mapStateToProps)(DeptContainer);