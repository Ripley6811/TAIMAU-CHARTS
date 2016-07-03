import React from 'react';

const TableHead = (props) =>
    <thead>
        <tr>
            { props.headers.map((content, i) => 
                                <th key={i}>{content}</th>) }
        </tr>
    </thead>

TableHead.propTypes = {
    headers: React.PropTypes.array.isRequired,
}

export default TableHead;