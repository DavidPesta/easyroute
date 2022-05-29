import { serve, EasyRequest, EasyResponse } from "../mod.ts";

const htmlContent = `<!DOCTYPE html>
<html>
	<body>
		<p>
			Put Variables<br />
			<input type="text" id="pudding" value="chocolate" /> Pudding<br />
			<input type="button" value="Submit" onclick="submitPut();" />
		</p>
	</body>
	<script>
		async function submitPut() {
			var data = {
				"pudding": document.getElementById("pudding").value
			}
			
			const response = await fetch("/data", {
				method: "PUT",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			});
			
			const json = await response.json();
			
			console.log(json);
		}
	</script>
</html>
`;

function putData(request: EasyRequest): EasyResponse {
	return new EasyResponse(JSON.stringify(request.bodyVars), { type: "json" });
}

serve({
	"GET /": () => new EasyResponse(htmlContent, { type: "html" }),
	"PUT /data": putData
});
