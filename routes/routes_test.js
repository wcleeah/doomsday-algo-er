import test from "node:test";
import {
    ROUTE_EXIST,
    ROUTE_MAP_FROZEN,
    ROUTE_NOT_FOUND,
    Router,
} from "./routes.js";
import assert from "assert";

test("route registration", function () {
    const router = new Router();
    const path = "/health";
    const f = function () {
        return;
    };
    const regErr = router.register(path, f);
    assert.ok(!regErr, "Should not have error when registering route");

    const [pathFunc, routeErr] = router.route(path);
    assert.strictEqual(pathFunc, f, "Path function is incorrect");
    assert.ok(!routeErr, "Should not have error getting the pathFunc");
});

test("multiple route registration", function () {
    const router = new Router();
    const path = "/health";
    const f = function () {
        return;
    };
    router.register(path, f);

    const path2 = "/ping";
    const f2 = function () {
        return;
    };
    router.register(path2, f2);

    const [pathFunc, err] = router.route(path);
    assert.strictEqual(pathFunc, f, "Path function 1 is incorrect");
    assert.ok(!err, "Should not have error: first route");

    const [pathFunc2, err2] = router.route(path2);
    assert.strictEqual(pathFunc2, f2, "Path function 2 is incorrect");
    assert.ok(!err2, "Should not have error: second route");
});

test("route does not exist", function () {
    const router = new Router();
    const path = "/health";

    const [pathFunc, err] = router.route(path);
    assert.ok(!pathFunc, "Should not have returned a pathFunc");
    assert.strictEqual(
        err,
        ROUTE_NOT_FOUND,
        "Incorrect error, should've been: " + ROUTE_NOT_FOUND,
    );
});

test("route already registered", function () {
    const router = new Router();
    const path = "/health";
    const f = function () {
        return;
    };
    const firstRegErr = router.register(path, f);
    assert.ok(!firstRegErr, "First registration should not have error");

    const secondRegError = router.register(path, f);
    assert.ok(secondRegError, "Second registration should have error");
    assert.strictEqual(
        secondRegError,
        ROUTE_EXIST,
        "Incorrect error, should've been: " + ROUTE_EXIST,
    );
});

test("lock route map", function () {
    const router = new Router();
    const path = "/health";
    const f = function () {
        return;
    };
    router.register(path, f);
    router.lock();

    const path2 = "/ping";
    const f2 = function () {
        return;
    };
    const errAfterLock = router.register(path2, f2);
    assert.ok(errAfterLock, "Should have err after locking the map");
    assert.strictEqual(
        errAfterLock,
        ROUTE_MAP_FROZEN,
        "Incorrect error, should've been: " + ROUTE_MAP_FROZEN,
    );
});

test("assert sucks", function () {
    assert.equal("123", 123, "equal");
});
