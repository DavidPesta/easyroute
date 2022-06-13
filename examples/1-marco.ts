import { serve, EasyResponse } from "https://deno.land/x/easyroute@0.2.0/mod.ts";

serve({
	"GET /marco": () => new EasyResponse("polo")
});
