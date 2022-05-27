import { serve, EasyRequest, jsonResponse } from "../mod.ts";

function world(): Response {
	return new Response("world");
}

function query(request: EasyRequest): Response {
	return new Response(JSON.stringify(request.queryVars));
}

function pathWithVariables(_request: EasyRequest, one: string, two: boolean, three: number): Response {
	return new Response(`${one} - ${two} - ${three}`);
}

class SomeClass {
	static staticMethod(): Response {
		return new Response("staticMethod response");
	}
}

serve({
	"GET /marco": () => new Response("polo"),
	"GET /hello": world,
	"GET /json": () => jsonResponse({ message: "hello world" }),
	"GET /query": query,
	"GET /static-method": SomeClass.staticMethod,
	"GET /path/with/variables/one:string/two:boolean/three:number": pathWithVariables
});
