import { httpServerHandler } from "cloudflare:node";
import { createHttpServer } from "./core/server.js";

let handler;

export default {
    fetch(request, env, ctx) {
        // Create (once) a handler that can see env/ctx
        if (!handler) {
            const server = createHttpServer(env);
            server.listen(8080);
            handler = httpServerHandler(server);
        }

        return handler.fetch(request, env, ctx);
    },
};
