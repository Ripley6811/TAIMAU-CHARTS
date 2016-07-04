import React, { PropTypes, Component } from 'react';

/**
 * Although the imported "React" etc. are not seen below, 
 * They appear after conversion from JSX to JavaScript.
 */

MainTable.defaultProps = {
    data: [[],[]],
    totals: [[],[],[]],
}

export default function MainTable(props) { return (
<table className="table-bordered table-condensed cell-height-min" style={{fontSize: "14px"}}>

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
                    <td>{row[0].toLocaleDateString()}</td>

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