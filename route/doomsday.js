/**
 * @typedef {import("@types").AsyncRouteHandler} AsyncRouteHandler
 * @typedef {import("@types").SyncRouteHandler} SyncRouteHandler
 * @typedef {import("@types").Routes} Routes  
 */

import { findWeekday } from "../lib/doomsday/doomsday.js";
import { findWeekday as prmoptPerplexity } from "../lib/doomsday/perplexity.js";
import { getUrlObject } from "../lib/request/url.js";
import { errorResponse, okResponse } from "../lib/response/response.js";

/**
 * @param {URLSearchParams} search
 * @return {import("@types").WithError<{year: number, month: number, day: number}>}
 */
function parseQueryParam(search) {
    const year = search.get("year");
    const month = search.get("month");
    const day = search.get("day");
    if (!year || !month || !day) {
        return [
            undefined,
            "The following query param is required: year, month and day",
        ];
    }

    const yearInt = parseInt(year);
    const monthInt = parseInt(month);
    const dayInt = parseInt(day);

    if (isNaN(yearInt) || isNaN(monthInt) || isNaN(dayInt)) {
        return [
            undefined,
            "The following query param must be integer: year, month and day",
        ];
    }

    return [{ year: yearInt, month: monthInt, day: dayInt }, undefined];
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

/** @type {AsyncRouteHandler} */
async function findWithPerplexity(req, res) {
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

    const [ret, wdErr] = await prmoptPerplexity(params.year, params.month, params.day);

    if (!ret || wdErr) {
        res.statusCode = 422;
        res.write(errorResponse(err ?? "Something went wrong"));
        return;
    }

    res.write(okResponse("Success", ret));
    res.statusCode = 200;
}

/** @type {Routes} */
export const routes = [
    ["/dooooooooooooooooooooooooooooom", findWithDoomsday],
    ["/perplexity", findWithPerplexity],
];
