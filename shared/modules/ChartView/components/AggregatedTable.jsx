/**
 * @overview Display a table of data. Used in "ChartsView.jsx
 * Note: Although the imported "React" etc. are not seen below, 
 * They appear after conversion from JSX to JavaScript.
 */
import React, { PropTypes } from 'react';


AggregatedTable.defaultProps = {
    data: [[],[]],
    totals: [[],[],[]],
}


export default 
function AggregatedTable(props) { return (
<table className="table-bordered table-condensed cell-height-min" 
    style={{fontSize: "16px"}}>

    <thead>
        <tr>
        {
            props.data[0].map((unit, i) => <th key={i+unit}>{unit}</th>)
        }
        </tr>
        <tr>
        {
            props.data[1].map((prod, i) => <th key={i+prod}>{prod}</th>)
        }
        </tr>
    </thead>
    <tbody>
        {
            props.data.slice(2).map((row, i) =>
                <tr key={i}>
                    <td>
                        {
                        props.data.length < 20 ?
                        `${row[0].getMonth()+1} 月` : 
                        `${row[0].getMonth()+1} / ${row[0].getDate()}`
                        }
                    </td>

                    {row.slice(1).map((col, i) => <td key={i}>{col}</td>)}
                </tr>
            )
        }
        <tr>
        {
            props.totals[1].map((col, i) => <th key={i}>{col}</th>)
        }
        </tr>
        <tr>
        {
            props.totals[2].map((col, i) => <th key={i} style={{backgroundColor: "gold", color: "black"}}>{col}</th>)
        }
        </tr>
    </tbody>
</table>
)}