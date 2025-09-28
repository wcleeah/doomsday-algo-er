/**
 * @typedef {import('node:http').Server} Server
 */
import { createServer } from "node:http";
import { ROUTE_NOT_FOUND, Router } from "./router.js";
import { bindRoute, info } from "./logger.js";

/**
 * @param {Server} server
 */
function registerListener(server) {
    server.on("close", function () {
        console.log("Server closed, bye");
    });
}

/**
 * @param {Router} router
 */
function registerRoute(router) {
    const err = router.register("/health", function (_req, res) {
        res.write("ok");
    });
    if (!err) {
        console.log("Route registration failed for /health, err:", err);
    }

    router.lock();
}

/**
 * @returns {Server} Server object
 */
export function createHttpServer() {
    const router = new Router();
    registerRoute(router);

    const server = createServer((req, res) => {
        const [f, err] = router.route(req.url?.split("?")[0]);

        /** @type {import("@types").RouteHandler} next */
        const next = function (req, res) {
            info(`${req.method} ${req.url}`);
            if (err === ROUTE_NOT_FOUND) {
                res.statusCode = 404;
                info(`${req.method} ${req.url} 404`);
                res.write("not found");
                res.end();
                return;
            }
            if (!f) {
                res.statusCode = 500;
                res.write("internal server error");
                info("Random error or something is wrong", { err });
                info(`${req.method} ${req.url} 500`);
                res.end();
                return;
            }

            f(req, res);
            info(`${req.method} ${req.url} ${req.statusCode}`);
        };
        bindRoute(req, res, next);
        res.end();
    });

    registerListener(server);
    return server;
}
