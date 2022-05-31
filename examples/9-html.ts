import { serve, EasyResponse } from "https://deno.land/x/easyroute@0.1.0/mod.ts";

function htmlPage() {
	const content = `<!DOCTYPE html>
		<html>
			<head></head>
			<body>
				<p>
					Welcome to HTML!
				</p>
			</body>
		</html>
	`;
	
	return new EasyResponse(content, { type: "html" });
}

serve({
	"GET /": htmlPage
});
