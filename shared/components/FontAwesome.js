import React from 'react'


/**
 * Creates a react element for a Font Awesome icon.
 *
 * ```
 * import FontAwesome from './FontAwesome';
 * var FA_SPINNING_COG = FontAwesome("cog", "fa-spin");
 * ```
 *
 * @param   {string} type       Font Awesome icon name (without "fa-").
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


export const FA_TRASH = create('trash')
export const FA_DOWNLOAD = create('download')
export const FA_CHEVRON_LEFT = create('chevron-left')
export const FA_PLUS = create('plus')
export const FA_MINUS = create('minus')
export const FA_TIMES = create('times')
export const FA_CHECK = create('check')
export const FA_LEVEL_UP = create('level-up')
export const FA_ARROW_UP = create('arrow-up')
export const FA_PENCIL = create('pencil')
export const FA_CUBES = create('cubes')
export const FA_TRUCK = create('truck')
export const FA_FILE_TEXT = create('file-text')  // Black doc with three lines
export const FA_FILE_O = create('file-o')  // White empty doc
