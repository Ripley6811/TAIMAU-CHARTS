import React from 'react';

// COMPONENTS
import TableHead from './TableHead';
import TableRow from './TableRow';
import { FA_TRASH } from './FontAwesome';


const trashCellStyle = {
          cursor: "pointer",
          width: "30px",
          color: "black"
      },
      specCellStyle = {
          cursor: "pointer",
          width: "60px",
      }


function Table(props) {
    const SpecModal = props.specModal;
    const updateSpec = props.updateSpec;

    return (
    <table className="table table-bordered table-condensed table-hover">
        <TableHead headers={props.tableHeaders} />
        <tbody>
        {props.tableRows.map((row, i) => (
        <TableRow data={row} keys={props.tableKeys} key={`${i}-${row._id}`} >
             {/** Add Spec Modal WITH button if component is provided. Shipments list **/}
             {!SpecModal ? null : (
                <td style={specCellStyle}>
                    <SpecModal shipment={row} sendUpdate={updateSpec} />
                </td>
             )}

             {/** Delete button added as a child of TableRow. **/}
             <td className="delete-row-btn danger text-center"
                 style={trashCellStyle}
                 onClick={() => props.onDelete(row)}>
                  {FA_TRASH}
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
