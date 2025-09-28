import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

const asyncLocalStorage = new AsyncLocalStorage();

/**
 * @param {"info" | "error"} level
 * @param {string} message
 * @param {Record<string, unknown>} meta
 */
function log(level, message, meta) {
    const requestId = asyncLocalStorage.getStore() ?? randomUUID();

    if (process.env.LOG_FORMAT === "PLAIN") {
        console.log(`[${level}]`, message, requestId, meta);
        return;
    }
    console.log(
        JSON.stringify({
            message,
            level,
            requestId,
            meta,
        }),
    );
}

/**
 * @param {string} message
 * @param {Record<string, unknown>} meta
 */
export function info(message, meta = {}) {
    log("info", message, meta);
}

/**
 * @param {string} message
 * @param {Record<string, unknown>} meta
 */
export function error(message, meta = {}) {
    log("error", message, meta);
}

/**
 * @param {import('@types').Request} req
 * @param {import('@types').Response} res
 * @param {import('@types').RouteHandler} next
 */
export function bindRoute(req, res, next) {
    asyncLocalStorage.run(randomUUID(), function () {
        next(req, res);
    });
}
