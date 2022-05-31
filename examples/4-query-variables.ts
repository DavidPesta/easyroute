import { serve, EasyRequest, EasyResponse } from "https://deno.land/x/easyroute@0.1.0/mod.ts";

function query(request: EasyRequest): EasyResponse {
	return new EasyResponse(JSON.stringify(request.queryVars));
}

serve({
	"GET /query": query
});
