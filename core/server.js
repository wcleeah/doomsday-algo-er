/**
 * @typedef {import('node:http').Server} Server
 */
import { createServer } from "node:http";
import { ROUTE_NOT_FOUND, Router } from "../routes/routes.js";

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
    router.register("/health", function (_req, res) {
        res.write("ok");
    });
    router.lock();
}

/**
 * @returns {Server} Server object
 */
export function createHttpServer() {
    const router = new Router();
    registerRoute(router);

    const server = createServer((req, res) => {
        const [f, err] = router.route(req.url);
        if (err === ROUTE_NOT_FOUND) {
            res.statusCode = 404;
            res.write("not found");
            res.end();
            return;
        }
        if (!f) {
            res.statusCode = 500;
            res.write("internal server error");
            res.end();
            return;
        }

        f(req, res);
        res.end();
    });

    registerListener(server);
    return server;
}
