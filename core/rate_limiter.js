/**
 * @typedef {import("@types").Bucket} Bucket
 * @typedef {import("@types").IClock} IClock
 * @typedef {import("@types").WithError<boolean>} WithError
 */

export class RateLimiter {
    /** @type {bigint} */
    #bucketSize;
    /** @type {bigint} */
    #refillInterval;
    /** @type {Map<string, Bucket>} */
    #buckets;
    /** @type {IClock} */
    #clock;

    /**
     * @param {bigint} bucketSize
     * @param {bigint} refillInterval
     * @param {IClock} clock
     * @returns void
     */
    constructor(
        bucketSize = 10n,
        refillInterval = 6_000_000_000n,
        clock = { getMTime: process.hrtime.bigint },
    ) {
        this.#bucketSize = bucketSize;
        this.#refillInterval = refillInterval;
        this.#clock = clock;
        this.#buckets = new Map();
    }

    /**
     * @param {string} key
     * @returns void
     */
    #tryRefill(key) {
        const bucket = this.#buckets.get(key);
        if (!bucket) {
            return;
        }

        const cns = this.#clock.getMTime();
        if (cns - bucket.last_ns >= this.#refillInterval) {
            const toAdd = (cns - bucket.last_ns) / this.#refillInterval;
            bucket.last_ns = cns;

            if (bucket.counter + toAdd > this.#bucketSize) {
                bucket.counter = this.#bucketSize;
                return;
            }

            bucket.counter = bucket.counter + toAdd;
            return;
        }
        return;
    }
    /**
     * @param {string} key
     * @returns {WithError}
     */
    tryGrabToken(key) {
        this.#tryRefill(key);
        const bucket = this.#buckets.get(key);
        if (!bucket) {
            return [false, "bucket not found"];
        }
        if (bucket.counter - 1n >= 0) {
            bucket.counter -= 1n;
            return [true, undefined];
        }
        return [false, "rate limit exceeded"];
    }
    /**
     * @param {string} key
     * @returns void
     */
    addBucket(key) {
        this.#buckets.set(key, {
            counter: this.#bucketSize,
            last_ns: this.#clock.getMTime(),
        });
    }
}
