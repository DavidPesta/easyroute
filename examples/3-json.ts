import { serve, EasyResponse } from "../mod.ts";

serve({
	"GET /json": () => new EasyResponse(JSON.stringify({ message: "hello world" }), { type: "json" })
});
