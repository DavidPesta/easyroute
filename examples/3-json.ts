import { serve, EasyResponse } from "https://deno.land/x/easyroute@0.1.0/mod.ts";

serve({
	"GET /json": () => new EasyResponse(JSON.stringify({ message: "hello world" }), { type: "json" })
});
