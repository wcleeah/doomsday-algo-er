/** @typedef {import("@types").RouteHandler} RouteHandler */

/** @type {string} */
export const ROUTE_NOT_FOUND = "NOT_FOUND";
/** @type {string} */
export const ROUTE_EXIST = "ROUTE_EXIST";
/** @type {string} */
export const ROUTE_MAP_FROZEN = "ROUTE_MAP_FROZEN";

export class Router {
    /**
     * @type {Record<string, RouteHandler>} map of route string to RouteHandler
     */
    #routesMap;

    constructor() {
        this.#routesMap = {};
    }
    /**
     * Routes a request to the appropriate handler function
     * @param {string | undefined} path
     * @returns {import("@types").WithError<RouteHandler>} 
     */
    route(path) {
        if (!path) {
            return [undefined, ROUTE_NOT_FOUND];
        }
        const pathFunc = this.#routesMap[path];
        if (!pathFunc) {
            return [undefined, ROUTE_NOT_FOUND];
        }

        return [pathFunc, undefined];
    }

    /**
     * Freeze the this.#routesMap
     * @returns {void}
     */
    lock() {
        if (Object.isFrozen(this.#routesMap)) {
            return;
        }
        // OK THIS IS UNNECESSARY I JUST WANT TO TRY USING Object.freese
        Object.freeze(this.#routesMap);
    }

    /**
     * Register a route
     * @param {string} path
     * @param {RouteHandler} f
     * @returns{string | undefined} error if errored
     */
    register(path, f) {
        if (Object.isFrozen(this.#routesMap)) {
            return ROUTE_MAP_FROZEN;
        }

        if (path in this.#routesMap) {
            return ROUTE_EXIST;
        }

        this.#routesMap[path] = f;

        return undefined;
    }
}
