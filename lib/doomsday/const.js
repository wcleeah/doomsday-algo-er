/** @type {Record<number, Record<"leap" | "nonLeap", number>>} */
export const DOOMSDAY_PER_MONTH = {
    1: {
        nonLeap: 3,
        leap: 4,
    },
    2: {
        nonLeap: 28,
        leap: 29,
    },
    3: {
        nonLeap: 14,
        leap: 14,
    },
    4: {
        nonLeap: 4,
        leap: 4,
    },
    5: {
        nonLeap: 9,
        leap: 9,
    },
    6: {
        nonLeap: 6,
        leap: 6,
    },
    7: {
        nonLeap: 11,
        leap: 11,
    },
    8: {
        nonLeap: 8,
        leap: 8,
    },
    9: {
        nonLeap: 5,
        leap: 5,
    },
    10: {
        nonLeap: 10,
        leap: 10,
    },
    11: {
        nonLeap: 7,
        leap: 7,
    },
    12: {
        nonLeap: 12,
        leap: 12,
    },
};

/** @type {Record<number, string>} */
export const MONTH_NUM_STR_MAP = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
};
