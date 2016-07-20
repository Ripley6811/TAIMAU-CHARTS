import React from 'react';

// COMPONENTS
import TableHead from './TableHead';
import TableRow from './TableRow';

function Table(props) {
    return (
    <table className="table table-bordered table-condensed table-hover">
        <TableHead headers={props.tableHeaders} />
        <tbody>
        {props.tableRows.map((row, i) => (
        <TableRow data={row} keys={props.tableKeys} key={`tablerow${i}`} >
             {/**Delete button added as a child of TableRow.*/}
             <td className="danger text-center cell-button" 
                 onClick={() => props.onDelete(row)}>
                  <span className="glyphicon glyphicon-trash"></span>
             </td>
        </TableRow>
        ))}
        </tbody>
    </table>
    )
}

Table.propTypes = {
    tableHeaders: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    tableKeys: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    tableRows: React.PropTypes.array.isRequired,
    onDelete: React.PropTypes.func.isRequired,
}

export default Table;