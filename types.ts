import { EasyRequest } from "./EasyRequest.ts";
import { EasyResponse } from "./EasyResponse.ts";

// deno-lint-ignore no-explicit-any
type Handler = (request: EasyRequest, ...args: any[]) => EasyResponse | Promise<EasyResponse>;

export interface Routes {
	[path: string]: Handler;
}

export type RouteParamOrder = { [key: string]: string[] };

export interface EasyResponseInit {
	type?: "html" | "json",
	headers?: HeadersInit;
	status?: number;
	statusText?: string;
}

export type CookieOptions = {
	expires?: Date;
	maxAge?: number;
	domain?: string;
	path?: string;
	secure?: boolean;
	httpOnly?: boolean;
	sameSite?: "Strict" | "Lax" | "None";
	unparsed?: string[];
};
