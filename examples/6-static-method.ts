import { serve, EasyResponse } from "https://deno.land/x/easyroute@0.2.0/mod.ts";

class SomeClass {
	static staticMethod(): EasyResponse {
		return new EasyResponse("staticMethod response");
	}
}

serve({
	"GET /static-method": SomeClass.staticMethod
});
