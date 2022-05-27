import { Status, STATUS_TEXT } from "https://deno.land/std@0.140.0/http/http_status.ts";
import { ConnInfo, ServeInit, serve as stdServe } from "https://deno.land/std@0.140.0/http/server.ts";
import { EasyRequest } from "./EasyRequest.ts";
import { Routes, RouteParamOrder } from "./types.ts";
export * from "./EasyRequest.ts";

/** serve() associates REST verbs and URL paths with handler functions that execute upon invoking them as endpoints.
 *
 * @example
 * ```ts
 * serve({
 * 	"GET /marco": () => new Response("polo"),
 * 	"GET /hello": world,
 * 	"GET /json": () => jsonResponse({ message: "hello world" }),
 * 	"GET /path/with/variables/one:string/two:boolean/three:number": pathWithVariables
 * });
 * ```
 */
export function serve(routes: Routes, options: ServeInit = { port: 8000 }): void {
	// This will check to make sure that the names are the same and in the same order, but not the types. The compiler strips out types, so this can't
	// be done without resorting to decorators and such. But this will provide a fair measure of mistake prevention and is good enough for now.
	const routeParamOrders: RouteParamOrder = {};
	for (const route in routes) {
		const routeParamOrder = getFunctionParams(routes[route]);
		routeParamOrder.shift();
		
		routeParamOrders[route] = [...routeParamOrder]; // We need to clone this because we want to use it later.
		
		const routePathTokens = route.split("/");
		for (const routePathToken of routePathTokens) {
			if (routePathToken.indexOf(":") !== -1) {
				const [varName, varType] = routePathToken.split(":");
				
				if (varName !== routeParamOrder.shift()) {
					throw new Error(`The route path variables in "${route}" do not match its associated function parameters.`);
				}
				
				if (["string", "number", "boolean"].includes(varType) == false) {
					throw new Error(`"${routePathToken}" is not a valid parameter type in "${route}". Valid types are "string", "number", or "boolean".`);
				}
			}
		}
	}
	
	stdServe((request: Request, connInfo: ConnInfo) => handleRequest(request, connInfo, routes, routeParamOrders), options);
}

async function handleRequest(request: Request, connInfo: ConnInfo, routes: Routes, routeParamOrders: RouteParamOrder): Promise<Response> {
	try {
		const easyRequest = new EasyRequest(request, connInfo);
		
		for (const route in routes) {
			if (easyRequest.matchRoute(route)) {
				const routeParamOrder = routeParamOrders[route];
				const orderedPathVars:string[] = [];
				
				for (const param of routeParamOrder) {
					orderedPathVars.push(easyRequest.pathVars[param]);
				}
				
				const response = await routes[route](easyRequest, ...orderedPathVars);
				
				return response;
			}
		}
		
		return handleError(request, `Could not find route for: ${request.method} ${easyRequest.path}`, 404);
	}
	catch (error) {
		console.error("Error serving request:", error);
		return jsonResponse({ error: error.message }, { status: 500 });
	}
}

function handleError(request: Request, error: string, status: number): Response {
	if (request?.headers.get("accept")?.indexOf("text/html") !== -1) {
		let header = "";
		
		switch(status) {
			case 404:
				header = "404 Page not found";
				break;
			default:
				header = "Error";
		}
		
		return new Response(`<h1 align=center>${header}</h1><div align=center>${error}</div>`, {
			status: status,
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}
	
	return jsonResponse({ error }, { status });
}

// Source: https://stackoverflow.com/a/31194949/508558 - Author: https://stackoverflow.com/users/1684079/humbletim
// deno-lint-ignore ban-types
function getFunctionParams(func: Function) {  
	return (func + '')
		.replace(/[/][/].*$/mg,'') // strip single-line comments
		.replace(/\s+/g, '') // strip white space
		.replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
		.split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
		.replace(/=[^,]+/g, '') // strip any ES6 defaults  
		.split(',').filter(Boolean); // split & filter [""]
}

// Source: https://github.com/satyarohith/sift (MIT Licensed)
/** Converts an object literal to a JSON string and returns
 * a Response with `application/json` as the `content-type`.
 *
 * @example
 * ```js
 * serve({
 * 	"/": () => jsonResponse({ message: "hello world"})
 * });
 * ```
 */
export function jsonResponse(jsobj: Parameters<typeof JSON.stringify>[0], init?: ResponseInit): Response {
	const headers = init?.headers instanceof Headers ? init.headers : new Headers(init?.headers);
	
	if (!headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json; charset=utf-8");
	}
	
	return new Response(JSON.stringify(jsobj), {
		statusText: init?.statusText ?? STATUS_TEXT.get(init?.status ?? Status.OK),
		status: init?.status ?? Status.OK,
		headers
	});
}
