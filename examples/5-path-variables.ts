import { serve, EasyRequest } from "../mod.ts";

function pathWithVariables(_request: EasyRequest, one: string, two: boolean, three: number): Response {
	return new Response(`${one} - ${two} - ${three}`);
}

serve({
	"GET /path/with/variables/one:string/two:boolean/three:number": pathWithVariables
});
