import { serve, EasyResponse } from "../mod.ts";

function world(): EasyResponse {
	return new EasyResponse("world");
}

serve({
	"GET /hello": world
});
