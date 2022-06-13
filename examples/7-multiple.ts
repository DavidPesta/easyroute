import { serve, EasyRequest, EasyResponse } from "https://deno.land/x/easyroute@0.2.0/mod.ts";

function world(): EasyResponse {
	return new EasyResponse("world");
}

function query(request: EasyRequest): EasyResponse {
	return new EasyResponse(JSON.stringify(request.queryVars));
}

function pathWithVariables(_request: EasyRequest, one: string, two: boolean, three: number): EasyResponse {
	return new EasyResponse(`${one} - ${two} - ${three}`);
}

class SomeClass {
	static staticMethod(): EasyResponse {
		return new EasyResponse("staticMethod response");
	}
}

serve({
	"GET /marco": () => new EasyResponse("polo"),
	"GET /hello": world,
	"GET /json": () => new EasyResponse(JSON.stringify({ message: "hello world" }), { type: "json" }),
	"GET /query": query,
	"GET /static-method": SomeClass.staticMethod,
	"GET /path/with/variables/one:string/two:boolean/three:number": pathWithVariables
});
