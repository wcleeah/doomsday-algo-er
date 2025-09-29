import { MONTH_NUM_STR_MAP, MODELS } from "./const.js";

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string}
 */
function constructPrompt(year, month, day) {
    const date = `${MONTH_NUM_STR_MAP[month]} ${day}, ${year}`;
    return `Find the weekday of ${date} using doomsday algo, DO NOT VERIFY THE ANS WITH ANY CALENDER, list out all the calculation, provide the ans in this format:
    1. Doomsday of year ${year}: {ans}
    2. Weekday of ${date}: {ans}
    3. The actual weekday of ${date}: {the actual weekday}
    `;
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {Promise<import("@types").WithError<{ model: string, output: string, cost: string, tokenUsed: string }>>}
 */
export async function findWeekday(year, month, day) {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
        return [
            undefined,
            "Bro you did not forget the api key right? ...RIGHT?????",
        ];
    }
    const apiUrl = process.env.PERPLEXITY_API_URL;
    if (!apiUrl) {
        return [undefined, "U'R... Kidding me, L for you forgetting the URL"];
    }

    const prompt = constructPrompt(year, month, day);

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + apiKey,
    };

    // Too bad perplexity does not provide any documentation on error response
    // I guess i will just assume the request will always be success :)))
    const res = await fetch(apiUrl, {
        headers,
        body: JSON.stringify({
            model: MODELS[Date.now() % 2],
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        }),
    });

    const body = await res.json();
    return [
        {
            model: body.model,
            tokenUsed: body.usage.total_tokens,
            cost: body.usage.cost.total_cost,
            output: body.choices[0].message.content,
        },
        undefined,
    ];
}
