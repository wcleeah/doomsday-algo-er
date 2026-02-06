/**
 * @param {URLSearchParams} search
 * @return {import("@types").WithError<{year: number, month: number, day: number}>}
 */
export function parseQueryParam(search) {
    const year = search.get("year");
    const month = search.get("month");
    const day = search.get("day");
    if (!year || !month || !day) {
        return [
            undefined,
            "The following query param is required: year, month and day",
        ];
    }

    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);
    const dayInt = parseInt(day, 10);

    if (Number.isNaN(yearInt) || Number.isNaN(monthInt) || Number.isNaN(dayInt)) {
        return [
            undefined,
            "The following query param must be integer: year, month and day",
        ];
    }

    return [{ year: yearInt, month: monthInt, day: dayInt }, undefined];
}

