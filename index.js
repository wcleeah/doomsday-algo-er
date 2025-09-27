import { createHttpServer } from "./core/server.js";

const server = createHttpServer();

server.listen(process.env.PORT, function () {
    console.log(`Server started on ${process.env.PORT}!`);
});
