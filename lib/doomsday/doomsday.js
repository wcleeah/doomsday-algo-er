import { info } from "../../core/logger.js";
import { DOOMSDAY_PER_MONTH, MONTH_NUM_STR_MAP } from "./const.js";

/**
 * @param {number} year
 * @returns {number}
 */
function weekdayOfDoomsDay(year) {
    // This describe how far a year is from the prev century leap year
    // zero means it is leap year
    const mod = Math.floor(year / 100) % 4;
    /** @type {number} */
    let wdayOfCYear;

    // Each century starts a cycle of weekday of doomsday
    // Tuesday, Sunday, Friday, Wednesday
    switch (mod) {
        case 0:
            wdayOfCYear = 2;
            break;
        case 1:
            wdayOfCYear = 0;
            break;
        case 2:
            wdayOfCYear = 5;
            break;
        default: // mod must be 3
            wdayOfCYear = 3;
            break;
    }

    // How many years has passed since the closest prev century year
    const diffWithCentury = year % 100;

    return (
        (wdayOfCYear + diffWithCentury + Math.floor(diffWithCentury / 4)) % 7
    );
}

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string | undefined}
 */
function validateYMD(year, month, day) {
    if (year < 0) {
        return "Wrong ages, year must be > 0";
    }

    if (month <= 0 || month > 12) {
        return "Wrong planet, month must be >= 1 and <= 12";
    }
    if (day <= 0) {
        return "Wrong planet, month must be >= 1";
    }

    const isLeapYear = year % 4 === 0;
    switch (month) {
        case 2:
            if (isLeapYear && day > 29) {
                return "Wrong planet, day must be >= 1 and <= 29 in February (leap year)";
            }
            if (!isLeapYear && day > 28) {
                return "Wrong planet, day must be >= 1 and <= 28 in February (non leap year)";
            }

            break;
        // i dun care, i will fallthrough
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            if (day > 31) {
                return `Wrong planet, day must be >= 1 and <= 31 in month ${MONTH_NUM_STR_MAP[month]}`;
            }
            break;
        default:
            if (day > 30) {
                return `Wrong planet, day must be >= 1 and <= 30 in ${MONTH_NUM_STR_MAP[month]}`;
            }
    }

    return undefined;
}

/**
 * @typedef {{ weekday: number, doomsdayWeekday: number }} WeekdayRes
 */

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {import("@types").WithError<WeekdayRes>}
 */
export function findWeekday(year, month, day) {
    info("Finding weekday", { year, month, day });
    const err = validateYMD(year, month, day);
    if (err) {
        return [undefined, err];
    }

    /** @type {number} */
    let weekday;
    // leap year criteria
    // 1. non century year: every 4 year
    // 2. century year: must also be divisible by 400
    let isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

    const doomsdayWeekday = weekdayOfDoomsDay(year);
    info(`Doomsday weekday of yesr ${year} is ${doomsdayWeekday}`);
    let doomsDay = DOOMSDAY_PER_MONTH[month].nonLeap;

    if (isLeapYear) {
        doomsDay = DOOMSDAY_PER_MONTH[month].leap;
    }
    info(`Doomsday of ${month} is ${doomsDay}`);

    const dayDiff = (day - doomsDay) % 7;
    weekday = doomsdayWeekday + dayDiff;

    if (weekday >= 7) {
        weekday = weekday % 7;
    }
    if (weekday < 0) {
        weekday = 7 + weekday;
    }
    info("Calculation done", { weekday, doomsdayWeekday });

    return [
        {
            weekday,
            doomsdayWeekday,
        },
        undefined,
    ];
}
