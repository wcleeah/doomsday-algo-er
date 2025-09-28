import test from "node:test";
import { findWeekday } from "./doomsday.js";
import assert from "node:assert";

test("findWeekDay", function () {
    // Test by year, for each year there will be three test cases:
    // - exactly on doomsday
    // - after doomsday
    // - before doomsday
    // NOTE: most day lib use zero-index month, no idea why TBH
    const dates = [
        // test anchor year
        new Date(2000, 3, 4),
        new Date(2000, 4, 16),
        new Date(2000, 1, 4),

        // next century leap year
        new Date(2400, 3, 4),
        new Date(2400, 4, 16),
        new Date(2400, 1, 4),

        // prev century leap year
        new Date(1600, 3, 4),
        new Date(1600, 4, 16),
        new Date(1600, 1, 4),

        // special case for 100 divisible year
        // apparently if that year is not divisible by 400
        // it is not a leap year
        // https://en.wikipedia.org/wiki/Leap_year
        // After anchor year
        new Date(2100, 5, 6),
        new Date(2100, 4, 14),
        new Date(2100, 8, 6),

        // Before anchor year
        new Date(1900, 6, 11),
        new Date(1900, 7, 10),
        new Date(1900, 11, 9),

        // Leap year
        // After anchor year
        new Date(2004, 1, 29),
        new Date(2004, 9, 10),
        new Date(2004, 11, 28),
        new Date(2004, 2, 13),

        // Before anchor year
        new Date(1996, 1, 29),
        new Date(1996, 10, 7),
        new Date(1996, 4, 26),
        // my birthday hehe
        new Date(1996, 7, 5),

        // non leap year
        // After anchor year
        new Date(2010, 3, 4),
        new Date(2003, 1, 28),
        new Date(2006, 10, 10),
        new Date(2093, 6, 5),

        // Before anchor year
        new Date(1990, 3, 4),
        new Date(1990, 1, 28),
        new Date(1973, 8, 19),
        new Date(1998, 2, 19),
    ];

    for (const date of dates) {
        const [wday, err] = findWeekday(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
        );
        assert.ok(!err, `Should not have error for ${date.toDateString()}`);
        // only checking weekday here, since if weekday is correct, doomsdayWeekday must be correct
        assert.strictEqual(
            wday?.weekday,
            date.getDay(),
            `Expected weekday: ${date.getDay()}, got: ${wday?.weekday}, doomsdayWeekday: ${wday?.doomsdayWeekday}, date: ${date.toDateString()}`,
        );
    }
});

test("incorrect year", function () {
    const [weekday, err] = findWeekday(-1, 1, 1);

    assert.ok(err, "Should have error");
    assert.ok(!weekday, "Should not have returned weekday");
});

test("incorrect month", function () {
    const [weekday1, err1] = findWeekday(1, 0, 1);
    const [weekday2, err2] = findWeekday(1, 13, 1);

    assert.ok(err1, "Should have error when month is <= 0");
    assert.ok(!weekday1, "Should not have returned weekday when month is <= 0");
    assert.ok(err2, "Should have error when month is >= 13");
    assert.ok(
        !weekday2,
        "Should not have returned weekday when month is >= 13",
    );
});

test("incorrect day: <= 0", function () {
    const [weekday, err] = findWeekday(1, 1, 0);

    assert.ok(err, "Should have error");
    assert.ok(!weekday, "Should not have returned weekday");
});

test("incorrect day: leap year Feb", function () {
    const [weekday1, err1] = findWeekday(2000, 2, 30);
    const [weekday2, err2] = findWeekday(2001, 2, 29);

    assert.ok(err1, "Should have error when day is >= 30 for leap year");
    assert.ok(
        !weekday1,
        "Should not have returned weekday when day is >= 29 for leap year",
    );
    assert.ok(err2, "Should have error when day is >= 29 for non leap year");
    assert.ok(
        !weekday2,
        "Should not have returned weekday when day is >= 29 for non leap year",
    );
});

test("incorrect day: leap year non Feb", function () {
    const monthWith31 = [
        findWeekday(2000, 1, 32),
        findWeekday(2000, 3, 32),
        findWeekday(2000, 5, 32),
        findWeekday(2000, 7, 32),
        findWeekday(2000, 8, 32),
        findWeekday(2000, 10, 32),
        findWeekday(2000, 12, 32),
    ];
    for (const res of monthWith31) {
        const [weekday, err] = res;
        assert.ok(
            err,
            "Should have error when day is >= 32 for month with 31st",
        );
        assert.ok(
            !weekday,
            "Should not have returned weekday when day is >= 32 for month with 31st",
        );
    }

    const monthWithout31 = [
        findWeekday(2000, 4, 32),
        findWeekday(2000, 6, 32),
        findWeekday(2000, 9, 32),
        findWeekday(2000, 11, 32),
    ];

    for (const res of monthWithout31) {
        const [weekday, err] = res;
        assert.ok(
            err,
            "Should have error when day is >= 31 for month without 31st",
        );
        assert.ok(
            !weekday,
            "Should not have returned weekday when day is >= 31 for month without 31st",
        );
    }
});
