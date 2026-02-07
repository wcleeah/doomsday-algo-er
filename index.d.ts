import type { IncomingMessage, ServerResponse } from "node:http";

export type Request = IncomingMessage;
export type Response = ServerResponse;
export type SyncRouteHandler = function(import('http').IncomingMessage, import('http').ServerResponse, any): void; 
export type AsyncRouteHandler = function(import('http').IncomingMessage, import('http').ServerResponse, any): Promise<void>; 
export type RouteHandler = SyncRouteHandler | AsyncRouteHandler;
export type Routes = [string, RouteHandler][];
export type WithError<T> = [T, undefined] | [T | undefined, string];
export type Bucket = {
    counter: bigint;
    last_ns: bigint;
}
export interface IClock {
    getMTime: () => bigint;
}
