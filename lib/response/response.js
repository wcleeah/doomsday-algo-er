/**
 * @param {string} errorStr
 * @param {Record<string, unknown>} meta
 */
export function errorResponse(errorStr, meta = {}) {
    return JSON.stringify({
        message: errorStr,
        errorMeta: meta
    })
}

/**
 * @param {string} message 
 * @param {Record<string, unknown>} data 
 */
export function okResponse(message = "Success", data = {}) {
    return JSON.stringify({
        message,
        data
    })
}
