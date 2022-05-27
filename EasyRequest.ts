import easy from "https://deno.land/x/easyutil@0.3.0/mod.ts";
import { ConnInfo } from "https://deno.land/std@0.140.0/http/server.ts";

export class EasyRequest {
	ip: string;
	referer: string;
	language: string;
	userAgent: string;
	method: string;
	url: string;
	origin: string;
	host: string;
	hostname: string;
	pathVars: { [key: string]: string };
	// deno-lint-ignore no-explicit-any
	queryVars: { [key: string]: any };
	// deno-lint-ignore no-explicit-any
	bodyVars: { [key: string]: any };
	// deno-lint-ignore no-explicit-any
	cookieVars: { [key: string]: any };
	protocol: string;
	subdomain: string;
	domain: string;
	tld: string;
	port: number;
	path: string;
	filename: string;
	query: string;
	fragment: string;
	body: string;
	request: Request;
	connInfo: ConnInfo;
	
	constructor(request: Request, connInfo: ConnInfo) {
		const urlInfo = new URL(request.url);
		this.ip = (connInfo.remoteAddr as Deno.NetAddr).hostname;
		this.referer = request.headers.get("referer") ?? "";
		this.language = request.headers.get("accept-language") ?? "";
		this.userAgent = request.headers.get("user-agent") ?? "";
		this.method = request.method;
		this.url = urlInfo.href;
		this.origin = urlInfo.origin;
		this.host = urlInfo.host;
		this.hostname = urlInfo.hostname;
		this.pathVars = {};
		this.queryVars = {};
		this.bodyVars = {};
		this.cookieVars = {};
		this.protocol = easy.string.trim.charsRight(urlInfo.protocol, [":"]);
		this.subdomain = "";
		this.domain = "";
		this.tld = "";
		this.port = parseInt(urlInfo.port);
		this.path = urlInfo.pathname;
		this.filename = "";
		this.query = "";
		this.fragment = "";
		this.body = "";
		this.request = request;
		this.connInfo = connInfo;
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
