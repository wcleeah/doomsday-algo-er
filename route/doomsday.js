/**
 * @typedef {import("@types").AsyncRouteHandler} AsyncRouteHandler
 * @typedef {import("@types").SyncRouteHandler} SyncRouteHandler
 * @typedef {import("@types").Routes} Routes
 */

import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { findWeekday } from "../lib/doomsday/doomsday.js";
import { promptOpenRouter } from "../lib/doomsday/openrouter.js";
import { getUrlObject } from "../lib/request/url.js";
import { errorResponse, okResponse } from "../lib/response/response.js";
import { parseQueryParam } from "./parseQueryParam.js";
import { RateLimiter } from "../core/rate_limiter.js";

/** @type {AsyncRouteHandler} */
async function getRoot(_req, res) {
    const filePath = "public/index.html";

    try {
        const data = await fs.readFile(filePath);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
    }
}

/** @type {SyncRouteHandler} */
function findWithDoomsday(req, res) {
    const [url, urlErr] = getUrlObject(req);
    if (urlErr || !url) {
        res.statusCode = 500;
        res.write(errorResponse(urlErr ?? "Internal Server Error"));
        return;
    }

    const [params, err] = parseQueryParam(url.searchParams);
    if (!params || err) {
        res.statusCode = 422;
        res.write(errorResponse(err ?? "Something went wrong"));
        return;
    }

    const [ret, wdErr] = findWeekday(params.year, params.month, params.day);

    if (!ret || wdErr) {
        res.statusCode = 422;
        res.write(errorResponse(err ?? "Something went wrong"));
        return;
    }

    res.write(okResponse("Success", ret));
    res.statusCode = 200;
}

const rl = new RateLimiter(1n);
rl.addBucket("openrouter");
/** @type {AsyncRouteHandler} */
async function findWithOpenRouter(req, res) {
    const [ok, tokenErr] = rl.tryGrabToken("openrouter");
    if (!ok) {
        res.statusCode = 429;
        res.write(errorResponse(tokenErr ?? "Something went wrong"));
        return;
    }
    const [url, urlErr] = getUrlObject(req);
    if (urlErr || !url) {
        res.statusCode = 500;
        res.write(errorResponse(urlErr ?? "Internal Server Error"));
        return;
    }

    const [params, err] = parseQueryParam(url.searchParams);
    if (!params || err) {
        res.statusCode = 422;
        res.write(errorResponse(err ?? "Something went wrong"));
        return;
    }

    const [ret, wdErr] = await promptOpenRouter(
        params.year,
        params.month,
        params.day,
    );

    if (!ret || wdErr) {
        res.statusCode = 422;
        res.write(errorResponse(wdErr ?? "Something went wrong"));
        return;
    }

    res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    await pipeline(ret, res);
}

/** @type {Routes} */
export const routes = [
    ["/dooooooooooooooooooooooooooooom", findWithDoomsday],
    ["/openrouter", findWithOpenRouter],
    ["/", getRoot],
];
