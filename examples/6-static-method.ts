import { serve } from "../mod.ts";

class SomeClass {
	static staticMethod(): Response {
		return new Response("staticMethod response");
	}
}

serve({
	"GET /static-method": SomeClass.staticMethod
});
