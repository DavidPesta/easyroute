# easyroute

A simple and pragmatic approach to routing Deno web requests.

## Usage

```js
import { serve, EasyRequest, EasyResponse } from "https://deno.land/x/easyroute@0.2.0/mod.ts";

function pathWithVariables(_request: EasyRequest, one: string, two: boolean, three: number): EasyResponse {
	return new EasyResponse(`${one} - ${two} - ${three}`);
}

function echoData(request: EasyRequest): EasyResponse {
	return new EasyResponse(JSON.stringify(request.bodyVars), { type: "json" });
}

serve({
	"GET /marco": () => new EasyResponse("polo"),
	"GET /json": () => new EasyResponse(JSON.stringify({ message: "hello world" }), { type: "json" }),
	"GET /path/with/variables/one:string/two:boolean/three:number": pathWithVariables,
	"POST /echo": echoData
});
```

In a nutshell, specify a request method (GET, POST, PUT, DELETE) before the endpoint path and the server will route the request to the specified function. Behind the scenes, validation is performed on startup to make sure path variables in the routes align with the function variables. Type checking is performed during runtime when an endpoint is hit to ensure booleans and numbers passed into the path variables are correct. Finally, the EasyRequest object gets populated with a wide variety of useful information, easily named and easily accessed. Everything else works as you see it above.

## Class Instance Method As Handler

```js
class ObjectClass {
	data: string;
	
	constructor(data: string) {
		this.data = data;
	}
	
	someMethod(_request: EasyRequest, value: number): EasyResponse {
		return new EasyResponse(`someMethod response: ${this.data} / ${value}`);
	}
}

const obj = new ObjectClass("some data");

serve({
	"GET /instance-method/value:number": [obj, obj.someMethod]
});
```

Using the method of an instantiated object as the endpoint handler involves a mild trick. Under the hood, the object needs to be bound as the "this" to the method. This requires the object reference to be associated with the object's method, which is shown with the tuple `[obj, obj.someMethod]` in the above example.

## Different Port

```js
serve({
	"GET /marco": () => new EasyResponse("polo")
}, { port: 8001 });
```

The default port is 8000, but you can change it by passing in a plain object with options.

## HTML Pages

```js
function htmlPage() {
	const content = `<!DOCTYPE html>
		<html>
			<body>
				<p>
					Welcome to HTML!
				</p>
			</body>
		</html>
	`;
	
	return new EasyResponse(content, { type: "html" });
}

serve({
	"GET /an-html-page": htmlPage
});
```

To make an endpoint capable of delivering HTML, simply pass the { html: true } option into the new EasyResponse.

## Examples

A growing collection of examples can be found inside of the examples folder.
