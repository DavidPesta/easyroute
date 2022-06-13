import { Cookie, setCookie, deleteCookie } from "https://deno.land/std@0.141.0/http/mod.ts";
import { EasyResponseInit, CookieOptions } from "./types.ts";

export class EasyResponse extends Response {
	constructor(body?: BodyInit | undefined, init?: EasyResponseInit) {
		super(body, init);
		
		if (init?.type === "html") {
			this.headers.set("Content-Type", "text/html; charset=utf-8");
		}
		
		if (init?.type === "json") {
			this.headers.set("Content-Type", "application/json; charset=utf-8");
		}
	}
	
	setCookie(name: string, value: string, options?: CookieOptions) {
		const cookie: Cookie = {
			name,
			value
		};
		
		if (options != undefined) {
			cookie.expires = options.expires;
			cookie.maxAge = options.maxAge;
			cookie.domain = options.domain;
			cookie.path = options.path;
			cookie.secure = options.secure;
			cookie.httpOnly = options.httpOnly;
			cookie.sameSite = options.sameSite;
			cookie.unparsed = options.unparsed;
		}
		
		setCookie(this.headers, cookie);
	}
	
	setCookies(cookies: { [name: string]: string }, options?: CookieOptions) {
		for (const [name, value] of Object.entries(cookies)) {
			this.setCookie(name, value, options);
		}
	}
	
	deleteCookie(name: string) {
		deleteCookie(this.headers, name);
	}
}
