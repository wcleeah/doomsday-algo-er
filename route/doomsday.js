/** @typedef {import("@types").RouteHandler} RouteHandler */

import { findWeekday } from "../lib/doomsday/doomsday.js";
import { getUrlObject } from "../lib/request/url.js";

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

/** @type {RouteHandler} */
function findWithDoomsday(req, res) {
    const [url, urlErr] = getUrlObject(req);
    if (urlErr || !url) {
        res.statusCode = 500;
        res.write({
            message: urlErr ?? "Internal Server Error",
        });
        return;
    }

    const [params, err] = parseQueryParam(url.searchParams);
    if (!params || err) {
        res.statusCode = 422;
        res.write({
            message: err ?? "Something went wrong",
        });
        return;
    }

    const [ret, wdErr] = findWeekday(params.year, params.month, params.day);

    if (!ret || wdErr) {
        res.statusCode = 422;
        res.write({
            message: err ?? "Something went wrong",
        });
        return;
    }

    res.write({
        message: "Success",
        data: ret,
    });
    res.statusCode = 200;
}

/** @type {[string, RouteHandler][]} */
export const routes = [["/dooooooooooooooooooooooooooooom", findWithDoomsday]];
