import { serve, EasyResponse } from "https://deno.land/x/easyroute@0.1.0/mod.ts";

function world(): EasyResponse {
	return new EasyResponse("world");
}

serve({
	"GET /hello": world
});
