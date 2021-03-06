/**
 * @overview Creates a column of buttons for selecting a company and its departments.
 * Non-JSX Example: This is an example and exercise in not using JSX.
 */
import React, { PropTypes } from 'react';


const CompanyColumn = props => React.createElement(
    'div', 
    {
        className: "col-md-6 text-center btn-group btn-group-vertical",
        style: {padding: '3px'},
    },
    React.createElement(
        'button', 
        { 
            id: props.company,
            className: 'company-btn ' + props.BTN_CLASS_STRING,
            style: typeof window !== 'undefined' && props.query.company === props.company ? props.HIGHLIGHTED_BTN : {},
            type: 'button',
            onClick: () => props.onClick({ company: props.company })
        },
        React.createElement(
            'strong',
            null,
            props.company
        )
    ),
    props.depts.map(dept => React.createElement(
        "button", 
        {
            id: `${props.company}-${dept}`,
            className: 'dept-btn ' + props.BTN_CLASS_STRING,
            key: `${props.company}-${dept}`,
            style: typeof window !== 'undefined' && 
                   props.query.dept === dept ? 
                   props.HIGHLIGHTED_BTN : {},
            type: "button",
            onClick: () => props.onClick({ company: props.company, dept: dept }) 
        },
        dept
    ))
);

CompanyColumn.propTypes = {
    company: PropTypes.string.isRequired,
    depts: PropTypes.arrayOf( PropTypes.string ).isRequired,
    onClick: PropTypes.func.isRequired,
    BTN_CLASS_STRING: PropTypes.string.isRequired,
    HIGHLIGHTED_BTN: PropTypes.object.isRequired,
};

export default CompanyColumn;