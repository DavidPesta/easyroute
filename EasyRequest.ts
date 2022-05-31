import easy from "https://deno.land/x/easyutil@0.6.0/mod.ts";
import { ConnInfo } from "https://deno.land/std@0.141.0/http/server.ts";
import { getCookies } from "https://deno.land/std@0.141.0/http/mod.ts";

export class EasyRequest {
	ip: string;
	referer: string;
	language: string;
	userAgent: string;
	contentType: string;
	contentLength: string;
	method: string;
	url: string;
	origin: string;
	host: string;
	hostname: string;
	pathVars: Record<string, string>;
	queryVars: Record<string, string>;
	// deno-lint-ignore no-explicit-any
	bodyVars: Record<string, any>;
	cookieVars: Record<string, string>;
	protocol: string;
	subdomain: string;
	domain: string;
	tld: string;
	port: number;
	path: string;
	filename: string;
	ext: string;
	query: string;
	fragment: string;
	body: string;
	request: Request;
	connInfo: ConnInfo;
	
	constructor(request: Request, connInfo: ConnInfo) {
		const url = new URL(request.url);
		const urlInfo = easy.string.parse.url(request.url);
		
		this.ip = (connInfo.remoteAddr as Deno.NetAddr).hostname;
		this.referer = request.headers.get("referer") ?? "";
		this.language = request.headers.get("accept-language") ?? "";
		this.userAgent = request.headers.get("user-agent") ?? "";
		this.contentType = request.headers.get("content-type") ?? "";
		this.contentLength = request.headers.get("content-length") ?? "";
		this.method = request.method;
		this.url = url.href;
		this.origin = url.origin;
		this.host = url.host;
		this.hostname = url.hostname;
		this.pathVars = {};
		this.queryVars = easy.string.parse.urlQuery(urlInfo.query);
		this.bodyVars = {};
		this.cookieVars = getCookies(request.headers);
		this.protocol = urlInfo.protocol;
		this.subdomain = urlInfo.subdomain;
		this.domain = urlInfo.domain;
		this.tld = urlInfo.tld;
		this.port = (connInfo.localAddr as Deno.NetAddr).port;
		this.path = urlInfo.path;
		this.filename = urlInfo.filename;
		this.ext = urlInfo.ext;
		this.query = urlInfo.query;
		this.fragment = urlInfo.fragment;
		this.body = "";
		this.request = request;
		this.connInfo = connInfo;
	}
	
	async prepVars() {
		// TODO: Add support for multipart/form-data to enable file uploads. Here is knowledge: https://stackoverflow.com/a/4073451/508558
		
		this.body = await this.request.text();
		
		if (this.contentType.indexOf("application/json") !== -1) {
			if (this.contentLength !== "") {
				try {
					this.bodyVars = JSON.parse(this.body);
				}
				catch {
					throw new Error("The content type used is application/json, but the body failed to parse as JSON.");
				}
			}
		}
		
		if (this.contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
			this.bodyVars = easy.string.parse.urlQuery(this.body);
		}
	}
	
	matchRoute(route: string): boolean {
		const [routeVerb, routePath] = route.split(" ");
		
		if (this.method !== routeVerb) return false;
		
		const requestPathTokens = this.path.split("/");
		const routePathTokens = routePath.split("/");
		if (requestPathTokens.length !== routePathTokens.length) return false;
		
		const possiblePathVars: { [key: string]: string } = {};
		for (let tokenIndex = 0, numTokens = requestPathTokens.length; tokenIndex < numTokens; tokenIndex++) {
			const requestPathToken = requestPathTokens[tokenIndex];
			const routePathToken = routePathTokens[tokenIndex];
			
			if (routePathToken.indexOf(":") === -1) {
				if (requestPathToken !== routePathToken) return false;
			}
			else {
				const [varName, varType] = routePathToken.split(":");
				
				if (
					(varType == "number" && easy.string.isA.number(requestPathToken) == false) ||
					(varType == "boolean" && easy.string.isA.boolean(requestPathToken) == false)
				) {
					// The reason for the Error thrown and not just returning false:
					// False represents that the path is different and gets skipped so that another path can match.
					// But if the same exact number of tokens exists for the request and the path and the non-variable
					// parts all match, then it really should be the same path no matter what, thus error out if the
					// type is wrong. Rarely would two routes make sense to differ by just the type of a variable. Much
					// more likely to be helpful to users is for a type mismatch to be communicated than a harder to
					// discern "could not find route" error. Later we could add a startup setting to make this optional.
					throw new Error(`The request path (${this.path}) does not match the route path (${routePath}). The ${routePathToken} needs to be a ${varType}, but was given a value of ${requestPathToken}.`);
				}
				
				possiblePathVars[varName] = requestPathToken;
			}
		}
		
		this.pathVars = possiblePathVars;
		
		return true;
	}
}
