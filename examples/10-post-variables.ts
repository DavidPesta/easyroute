import { serve, EasyRequest, EasyResponse } from "../mod.ts";

const htmlContent = `<!DOCTYPE html>
<html>
	<body>
		<p>
			Post Variables<br />
			<input type="text" id="one" value="uno" /> One<br />
			<input type="text" id="two" value="dos" /> Two<br />
			<input type="button" value="Submit" onclick="submitPost();" />
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
				headers: {'Content-Type': 'application/json'},
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

serve({
	"GET /": () => new EasyResponse(htmlContent, { type: "html" }),
	"POST /data": postData
});
