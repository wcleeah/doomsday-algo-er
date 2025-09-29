/**
 * @typedef {import('node:http').Server} Server
 * @typedef {import("@types").AsyncRouteHandler} AsyncRouteHandler
 * @typedef {import("@types").Routes} Routes  
 */
import { createServer } from "node:http";
import { ROUTE_NOT_FOUND, Router } from "./router.js";
import { bindRoute, error, info } from "./logger.js";
import { routes as doomsdayRoutes } from "../route/doomsday.js";

const router = new Router();

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
    /** @type {Routes} */
    const routes = [
        [
            "/health",
            function (_req, res) {
                res.write("ok");
            },
        ],
        ...doomsdayRoutes,
    ];

    for (const route of routes) {
        const [path, f] = route;
        const err = router.register(path, f);
        if (err) {
            console.error("Route registration failed, reason:", err);
        } else {
            console.info("Route registration succeeded:", path);
        }
    }
    router.lock();
}

/** @type{AsyncRouteHandler} next -> shoutout to expressjs */
async function next(req, res) {
    const [f, err] = router.route(req.url?.split("?")[0]);
    info(`${req.method} ${req.url}`, { headers: req.headers });
    if (err === ROUTE_NOT_FOUND) {
        res.statusCode = 404;
        error(`${req.method} ${req.url} 404`);
        res.write("not found");
        res.end();
        return;
    }
    if (!f) {
        res.statusCode = 500;
        res.write("internal server error");
        error("Random error or something is wrong", { err });
        error(`${req.method} ${req.url} 500`);
        res.end();
        return;
    }

    // Interesting
    // f can return a promise, or not
    // Wrapping Promise.resolve will handle both case
    await Promise.resolve(f(req, res));
    const msg = `${req.method} ${req.url} ${res.statusCode}`;
    if (res.statusCode >= 400) {
        error(msg);
        return;
    }
    info(msg);
    res.end();
}

/**
 * @returns {Server} Server object
 */
export function createHttpServer() {
    registerRoute(router);

    // OK, LOOK
    // I have done some research, especially on:
    // 1. Express handlings on middlewares, error propagation etc
    // 2. Handleing Sync and Async functions mixture
    // But i dun want create a full fledge ecpress clone
    // I just want to finish the implementation atm
    // So, this will have to work for now
    const server = createServer((req, res) => {
        bindRoute(req, res, next);
    });

    registerListener(server);
    return server;
}
