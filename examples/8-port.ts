import { serve } from "../mod.ts";

serve({
	"GET /marco": () => new Response("polo")
}, { port: 8001 });
