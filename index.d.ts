import { IncomingMessage, ServerResponse } from "node:http";

export type Request = IncomingMessage;
export type Response = ServerResponse;
export type RouteHandler = function(import('http').IncomingMessage, import('http').ServerResponse): void; 
