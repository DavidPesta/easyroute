import { EasyRequest } from "./EasyRequest.ts";

// deno-lint-ignore no-explicit-any
type Handler = (request: EasyRequest, ...args: any[]) => Response | Promise<Response>;

export interface Routes {
	[path: string]: Handler;
}

export type RouteParamOrder = { [key: string]: string[] };
