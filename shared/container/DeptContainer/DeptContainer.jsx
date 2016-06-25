import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import MainTable from './MainTable';

class DeptContainer extends Component {  
    static propTypes = {
        query: PropTypes.shape({
                year: PropTypes.string,
                month: PropTypes.string,
        }).isRequired,
    };

    static defaultProps = {
        query: {},
    }

    componentWillUpdate(nextProps, nextState) {  
        const dateRange = (function() {
            const year = nextProps.query.year,
                  month = nextProps.query.month,
                  retArray = [];
            
            if (typeof year === "string" && year && month === undefined) {
                for (let i=0; i<12; i++) {
                    retArray.push( new Date(Date.UTC(year, i, 1)) );
                }
            } else if (typeof year === "string" && typeof month === "string") {
                for (let i=new Date(Date.UTC(year, Number(month)+1, 0)).getDate(); i>0; i--) {
                    retArray.unshift(new Date(Date.UTC(year, month, i)));
                }
            }
            
            return retArray;
        })();
        
//        this.test = d3.nest()
//            .key(d => d.unit)
//            .key(d => d.name)
//            .rollup(v => {return{
//                unit: v[0].unit,
//                name: v[0].name,
//                amount: d3.sum(v, d => d.amount),
//            }})
//            .map(nextProps.shipments);
//        console.dir(this.test);
        
        
        // Calculates the product totals across all dates
        this.prodTotals = d3.nest()
            .key(d => d.unit)
            .key(d => d.name)
            .rollup(v => d3.sum(v, d => d.amount))
            .map(nextProps.shipments);
        
        // Creates a object tree of units->depts
        this.header = d3.nest()
            .key(d => d.unit)
            .key(d => d.name)
            .rollup(v => ({}))
            .map(nextProps.shipments);
        
        let headArray = [];
        for (let unit in this.header) {
            for (let prod in this.header[unit]) {
                headArray.push([unit, prod, this.prodTotals[unit][prod]]);
            }
        }
        
        // Adds daily totals to `header`
        for (let i=0; i<nextProps.shipments.length; i++) {
            const s = nextProps.shipments[i];
            const oldAmt = this.header[s.unit][s.name][s.date.substring(0,10)] || 0;
            this.header[s.unit][s.name][s.date.substring(0,10)] = s.amount + oldAmt;
        }
        
        // Creates 2D array of dates and data
        this.dataArray = dateRange.map(each => [each]);
        for (let i=0; i<this.dataArray.length; i++) {
            let dateString = this.dataArray[i][0].toISOString().substring(0,10);
            for (let headIndex=0; headIndex<headArray.length; headIndex++) {
                let [unit, prod] = headArray[headIndex];
                if (this.header[unit]) {
                    if (this.header[unit][prod]) {
                        this.dataArray[i].push(this.header[unit][prod][dateString] || "");
                    }
                }
            }
        }
        // Adds headers to `dataArray`
        this.dataArray.unshift(["Date"].concat(headArray.map(head => head[1])));
        this.dataArray.unshift([""].concat(headArray.map(head => head[0])));
        
        // Creates 2D array of prods and grand totals
        this.dataTotals = [];
        this.dataTotals.push([""].concat(headArray.map(head => head[0])));
        this.dataTotals.push([""].concat(headArray.map(head => head[1])));
        this.dataTotals.push(["總額"].concat(headArray.map(head => head[2])));
        
    }
    
    render() {
      return (
        <div className="container">
            <h2> {this.props.query.dept}</h2>
              
                  <MainTable 
                      data={this.dataArray} 
                      totals={this.dataTotals} />
        </div>
      );
    }
}


// Retrieve data from store as props
const mapStateToProps = (store) => ({
      shipments: store.shipments,
      query: store.query || {},
});

export default connect(mapStateToProps)(DeptContainer);