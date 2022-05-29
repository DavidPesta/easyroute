import { serve, EasyResponse } from "../mod.ts";

serve({
	"GET /marco": () => new EasyResponse("polo")
}, { port: 8001 });
