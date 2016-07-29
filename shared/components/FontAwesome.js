import React from 'react';


/**
 * Creates a react element for a Font Awesome icon.
 * 
 * ```
 * import FontAwesome from './FontAwesome';
 * var FA_SPINNING_COG = FontAwesome("cog", "fa-spin");
 * ```
 * 
 * @param   {string} type       Font Awesome class name (without "fa-").
 * @param   {string} classNames = "" Additional string to append to `class`.
 * @returns {object} React element that displays a Font Awesome icon.
 */
export default function create(type, classNames = "") {
    if (!type || typeof type !== 'string') throw "Type error";
    return React.createElement( "span", {
        className: `fa fa-${type} ${classNames}`, 
        "aria-label": `Font Awesome ${type} icon`
    });
}


export const FA_TRASH = create('trash');
export const FA_DOWNLOAD = create('download');
export const FA_CHEVRON_LEFT = create('chevron-left');
export const FA_PLUS = create('plus');
export const FA_MINUS = create('minus');