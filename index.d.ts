import { IncomingMessage, ServerResponse } from "node:http";

export type Request = IncomingMessage;
export type Response = ServerResponse;
export type SyncRouteHandler = function(import('http').IncomingMessage, import('http').ServerResponse): void; 
export type AsyncRouteHandler = function(import('http').IncomingMessage, import('http').ServerResponse): Promise<void>; 
export type RouteHandler = SyncRouteHandler | AsyncRouteHandler;
export type Routes = [string, RouteHandler][];
export type WithError<T> = [T, undefined] | [undefined, string];
