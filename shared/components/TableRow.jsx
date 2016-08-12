import React from 'react';

/**
 * Creates a table row.
 *
 * Takes an object and list of keys and adds cells in order.
 * Additional specialized cells may be added as children (must contain <td> tags).
 * @param   {object} props Passdown properties
 * @returns {object} React DOM element
 */
export default function TableRow(props) {
    const rowStyle = props.data.hightlight ? {backgroundColor: "gold"} : {};
    return (
        <tr style={rowStyle}>
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
