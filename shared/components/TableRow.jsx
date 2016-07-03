import React from 'react';

/**
 * Creates a table row.
 * 
 * Takes an object and list of keys and adds cells in order.
 * Additional cells may be added as children.
 * @param   {object} props Passdown properties
 * @returns {object} React DOM element
 */
function TableRow(props) {
    return (
        <tr onClick={props.rowClick}>
          {props.keys.map((key, i) => <td key={i}>{props.data[key]}</td>)}
          {props.children}
        </tr>
    );
}

TableRow.propTypes = {
    data: React.PropTypes.object.isRequired,
    keys: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    // Optional
    rowClick: React.PropTypes.func,
}

export default TableRow