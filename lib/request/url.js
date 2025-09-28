/**
 * @param {import("@types").Request} req
 * @returns {import("@types").WithError<URL>}
 */
export function getUrlObject(req) {
    if (!req.url) {
        return [undefined, "url is undefined"];
    }
    if (!req.headers.host) {
        return [undefined, "host is undefined"];
    }

    // i dun care if the host is in http or https, it might very well be transformed to http by lb anyways
    return [new URL(req.url, "http://" + req.headers.host), undefined];
}
