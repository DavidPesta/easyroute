import { serve, EasyRequest, EasyResponse } from "../mod.ts";

function query(request: EasyRequest): EasyResponse {
	return new EasyResponse(JSON.stringify(request.queryVars));
}

serve({
	"GET /query": query
});
