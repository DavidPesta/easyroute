import { serve, EasyRequest } from "../mod.ts";

function query(request: EasyRequest): Response {
	return new Response(JSON.stringify(request.queryVars));
}

serve({
	"GET /query": query
});
