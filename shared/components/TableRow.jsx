import React from 'react';

/**
 * Creates a table row.
 * 
 * Takes an object and list of keys and adds cells in order.
 * Additional cells may be added as children.
 * @param   {object} props Passdown properties
 * @returns {object} React DOM element
 */
export default function TableRow(props) {
    return (
        <tr>
            {props.keys.map((key, i) => 
                <td key={`tablecol${i}`}>{props.data[key]}</td>
            )}
            {props.children}
        </tr>
    );
}

TableRow.propTypes = {
    data: React.PropTypes.object.isRequired,
    keys: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
}