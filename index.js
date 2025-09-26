import { createHttpServer } from "./core/server.js";

const server = createHttpServer()

// TOOO: move the port to env
server.listen(3000);
