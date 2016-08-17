/**
 * Merges object with default parameters.
 * @param   {boolean} required Boolean value for required parameter
 * @param   {object}  obj      Parameters to assign to object
 * @returns {object}  Merged object
 */
export function trimString(obj = {}) {
    const newObj = {
        type: 'String',
        minlength: 1,
        trim: true,
        required: true,
    };
     
    if (typeof obj !== 'object') throw 'Parameter error.';
    
    return Object.assign(newObj, obj);
}