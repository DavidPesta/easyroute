# easyroute

A simple and pragmatic approach to routing Deno web requests.

## Usage

```js
import { serve, EasyRequest, jsonResponse } from "https://deno.land/x/easyroute@0.1.0/mod.ts";

function pathWithVariables(_request: EasyRequest, one: string, two: boolean, three: number): Response {
	return new Response(`${one} - ${two} - ${three}`);
}

serve({
	"GET /marco": () => new Response("polo"),
	"GET /json": () => jsonResponse({ message: "hello world" }),
	"GET /path/with/variables/one:string/two:boolean/three:number": pathWithVariables
});
```

In a nutshell, specify a request method (GET, POST, etc) before the endpoint path and the server will route the request to the specified function. Behind the scenes, validation is performed on startup to make sure path variables in the route align with the function variables. Type checking is performed during runtime when an endpoint is hit to ensure booleans and numbers passed into the path variables are correct. Finally, the EasyRequest object gets populated with a wide variety of useful information, easily named and easily accessed. Everything else works as you see it above.

## Different Port

```js
serve({
	"GET /marco": () => new Response("polo")
}, { port: 8001 });
```

The default port is 8000, but you can change it by passing in a plain object with options.

## Examples

A growing collection of examples can be found inside of the examples folder.
