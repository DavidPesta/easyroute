import { serve, EasyRequest, EasyResponse } from "https://deno.land/x/easyroute@0.2.0/mod.ts";

function pathWithVariables(_request: EasyRequest, one: string, two: boolean, three: number): EasyResponse {
	return new EasyResponse(`${one} - ${two} - ${three}`);
}

serve({
	"GET /path/with/variables/one:string/two:boolean/three:number": pathWithVariables
});
