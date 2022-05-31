import { serve, EasyRequest, EasyResponse } from "https://deno.land/x/easyroute@0.1.0/mod.ts";

const htmlContent = `<!DOCTYPE html>
<html>
	<body>
		<p>
			Post Variables<br />
			<input type="text" id="one" value="uno" /> One<br />
			<input type="text" id="two" value="dos" /> Two<br />
			<input type="button" value="Submit" onclick="submitPost();" />
		</p>
		<p>
			<form method="POST" action="/post-page">
				Form Post<br />
				<input type="text" name="field1" /> Field 1<br />
				<input type="text" name="field2" /> Field 2<br />
				<input type="submit" />
			</form>
		</p>
	</body>
	<script>
		async function submitPost() {
			var data = {
				"one": document.getElementById("one").value,
				"two": document.getElementById("two").value,
				"three": 3,
				"yes": true
			}
			
			const response = await fetch("/data", {
				method: "POST",
				headers: {'Content-Type': 'application/json; charset=utf-8'},
				body: JSON.stringify(data)
			});
			
			const json = await response.json();
			
			console.log(json);
		}
	</script>
</html>
`;

function postData(request: EasyRequest): EasyResponse {
	return new EasyResponse(JSON.stringify(request.bodyVars), { type: "json" });
}

function postPage(request: EasyRequest): EasyResponse {
	console.log(request.bodyVars);
	return new EasyResponse(htmlContent, { type: "html" });
}

serve({
	"GET /": () => new EasyResponse(htmlContent, { type: "html" }),
	"POST /data": postData,
	"POST /post-page": postPage
});
