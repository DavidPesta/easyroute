import { serve } from "../mod.ts";

function world(): Response {
	return new Response("world");
}

serve({
	"GET /hello": world
});
