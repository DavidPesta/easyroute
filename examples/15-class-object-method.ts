import { serve, EasyRequest, EasyResponse } from "https://deno.land/x/easyroute@0.2.0/mod.ts";

class ObjectClass {
	data: string;
	
	constructor(data: string) {
		this.data = data;
	}
	
	someMethod(_request: EasyRequest, value: number): EasyResponse {
		return new EasyResponse(`someMethod response: ${this.data} / ${value}`);
	}
}

const obj = new ObjectClass("some data");

serve({
	"GET /instance-method/value:number": [obj, obj.someMethod]
});
