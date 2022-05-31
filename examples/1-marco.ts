import { serve, EasyResponse } from "https://deno.land/x/easyroute@0.1.0/mod.ts";

serve({
	"GET /marco": () => new EasyResponse("polo")
});
