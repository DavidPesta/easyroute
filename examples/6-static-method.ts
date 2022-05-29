import { serve, EasyResponse } from "../mod.ts";

class SomeClass {
	static staticMethod(): EasyResponse {
		return new EasyResponse("staticMethod response");
	}
}

serve({
	"GET /static-method": SomeClass.staticMethod
});
