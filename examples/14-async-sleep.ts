import easy from "https://deno.land/x/easyutil@0.6.0/mod.ts";
import { serve, EasyRequest, EasyResponse } from "https://deno.land/x/easyroute@0.2.0/mod.ts";

async function sleepForSeconds(_request: EasyRequest, seconds: number): Promise<EasyResponse> {
	await easy.sleep(seconds * 1000);
	return new EasyResponse("Done!");
}

serve({
	"GET /sleep/seconds:number": sleepForSeconds
});
