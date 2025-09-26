import { createServer } from "node:http";
import { ROUTE_NOT_FOUND, Router } from "../routes/routes.js";

/**
 * @returns {import('node:http').Server} Server object
 */
export function createHttpServer() {
    const router = new Router();
    router.register("/health", function (_req, res) {
        res.write("ok")
    })
    const server = createServer((req, res) => {
        const [f, err] = router.route(req.url);
        if (err === ROUTE_NOT_FOUND) {
            res.statusCode = 404;
            res.end();
            return;
        }
        if (!f) {
            res.statusCode = 500;
            res.end()
            return;
        }

        f(req, res)
        res.end();
    });
    return server;
}
