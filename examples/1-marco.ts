import { serve } from "../mod.ts";

serve({
	"GET /marco": () => new Response("polo")
});
