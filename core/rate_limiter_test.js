/**
 * @typedef {import("@types").IClock} IClock
 */

import assert from "node:assert";
import test from "node:test";
import { RateLimiter } from "./rate_limiter.js";

/**
 * @param {RateLimiter} rl
 * @param {string} key
 * @returns void
 */
function gt(rl, key) {
    const [ok, err] = rl.tryGrabToken(key);
    assert(ok, "Bucket should have token for grab");
    assert(!err, `Error should be undefined, it is ${err} now instead`);
}

test("register bucket", function () {
    /** @type{IClock} */
    const clock = {
        getMTime: function () {
            return 0n;
        },
    };
    const rl = new RateLimiter(10n, 1n, clock);

    const key = "haha";
    rl.addBucket(key);
    gt(rl, key);
});

test("try grab token", async function () {
    let mTime = 0n;
    /** @type{IClock} */
    const clock = {
        getMTime: function () {
            return mTime;
        },
    };
    const rl = new RateLimiter(10n, 1n, clock);

    const key = "haha";
    rl.addBucket(key);

    await Promise.all([
        gt(rl, key),
        gt(rl, key),
        gt(rl, key),
        gt(rl, key),
        gt(rl, key),
        gt(rl, key),
        gt(rl, key),
        gt(rl, key),
        gt(rl, key),
        gt(rl, key),
    ]);

    const [ok, err] = rl.tryGrabToken(key);
    assert(!ok, "Bucket should not have token for grab");
    assert(!!err, "Should have error when no token for grab");
    assert(
        err === "rate limit exceeded",
        `Error string mismatch, it is ${err} now instead`,
    );

    mTime = 1n;
    gt(rl, key);
});
