import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import MainTable from './MainTable';

class DeptContainer extends Component {  
    static propTypes = {
        shipmentQuery: PropTypes.shape({
                year: PropTypes.number,
                month: PropTypes.number,
        }).isRequired,
    };

    static defaultProps = {
        shipmentQuery: {},
    }
    
    state = {
        dataArray: [],
        dataTotals: [],
    }
    
    getDatesArray(year, month) {
        const retArray = [];

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

    componentWillReceiveProps(nextProps) {  
        const datesArray = this.getDatesArray(nextProps.shipmentQuery.year, 
                                              nextProps.shipmentQuery.month);
        
//        this.test = d3.nest()
//            .key(d => d.unit)
//            .key(d => d.product)
//            .rollup(v => {return{
//                unit: v[0].unit,
//                name: v[0].product,
//                amount: d3.sum(v, d => d.amount),
//            }})
//            .map(nextProps.shipments);
//        console.dir(this.test);
        const dateLength = (typeof nextProps.shipmentQuery.month === "number") ?
              10 : 7;
        
        // Calculates the product totals across all dates
        let prodTotals = d3.nest()
            .key(d => d.unit)
            .key(d => d.product)
            .rollup(v => d3.sum(v, d => d.amount))
            .map(nextProps.shipments);

        // Creates a object tree of units->depts
        let header = d3.nest()
            .key(d => d.unit)
            .key(d => d.product)
            .rollup(v => ({}))
            .map(nextProps.shipments);

        let headArray = [];
        for (let unit in header) {
            for (let prod in header[unit]) {
                headArray.push([unit, prod, prodTotals[unit][prod]]);
            }
        }

        // Adds daily totals to `header`
        for (let i=0; i<nextProps.shipments.length; i++) {
            const s = nextProps.shipments[i];
            const oldAmt = header[s.unit][s.product][s.date.substring(0,dateLength)] || 0;
            header[s.unit][s.product][s.date.substring(0,dateLength)] = s.amount + oldAmt;
        }

        // Creates 2D array of dates and data
        let dataArray = datesArray.map(each => [each]);
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
        dataArray.unshift(["Date"].concat(headArray.map(head => head[1])));
        dataArray.unshift([""].concat(headArray.map(head => head[0])));

        // Creates 2D array of prods and grand totals
        let dataTotals = [];
        dataTotals.push([""].concat(headArray.map(head => head[0])));
        dataTotals.push([""].concat(headArray.map(head => head[1])));
        dataTotals.push(["總額"].concat(headArray.map(head => head[2])));
            
        this.dataArray = dataArray;
        this.dataTotals = dataTotals;
    }
    
    render() {
      return (
        <div className="container">
          <h2> {this.props.shipmentQuery.dept}</h2>
          {this.props.shipmentQuery.dept ? 
                  <MainTable 
                      data={this.dataArray} 
                      totals={this.dataTotals} />
              : 
                <div><br /><br /><br /><br /><br /><h2>
                    <span className="glyphicon glyphicon-arrow-left"></span>
                    &nbsp;Select a department
                </h2></div>
          }
                  
        </div>
      );
    }
}


// Retrieve data from store as props
const mapStateToProps = (store) => ({
      shipments: store.shipments,
      shipmentQuery: store.shipmentQuery,
});

export default connect(mapStateToProps)(DeptContainer);