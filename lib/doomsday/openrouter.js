import { info } from "../../core/logger.js";
import { MONTH_NUM_STR_MAP } from "./const.js";

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string}
 */
function constructPrompt(year, month, day) {
    const date = `${MONTH_NUM_STR_MAP[month]} ${day}, ${year}`;
    return `Find the weekday of ${date} using doomsday algorithm, DO NOT VERIFY THE ANS WITH ANY CALENDER, list out all the calculation steps, explain in best detail.`;
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {Promise<import("@types").WithError<ReadableStream<Uint8Array<ArrayBuffer>>>>}
 */
export async function promptOpenRouter(year, month, day) {
    const apiKey = process.env.OPEN_ROUTER_API_KEY;
    if (!apiKey) {
        return [
            undefined,
            "Bro you did not forget the api key right? ...RIGHT?????",
        ];
    }
    const apiUrl = process.env.OPEN_ROUTER_API_URL;
    if (!apiUrl) {
        return [undefined, "U'R... Kidding me, L for you forgetting the URL"];
    }

    const prompt = constructPrompt(year, month, day);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };

    const reqBody = {
        model: "arcee-ai/trinity-large-preview:free",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        stream: true,
    };

    info("Requesting Open Router", { body: reqBody, url: apiUrl });

    const res = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(reqBody),
    });

    const resBody = res.body;
    if (!resBody) {
        return [undefined, "Somehow resbody does not have a reader"];
    }

    return [resBody, undefined]
}
