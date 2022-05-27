import { serve, jsonResponse } from "../mod.ts";

serve({
	"GET /json": () => jsonResponse({ message: "hello world" }),
});
