import { serve, EasyRequest, EasyResponse } from "../mod.ts";

const htmlContent = `<!DOCTYPE html>
<html>
	<body>
		<p><input type="button" value="Perform DELETE with query" onclick="performDeleteWithQuery();" /></p>
		<p><input type="button" value="Perform DELETE with body" onclick="performDeleteWithBody();" /></p>
	</body>
	<script>
		async function performDeleteWithQuery() {
			const response = await fetch("/data?method=query&var1=stuff&var2=things", { method: "DELETE" });
			const json = await response.json();
			console.log(json);
		}
		
		async function performDeleteWithBody() {
			var data = {
				"method": "body",
				"var1": "stuff",
				"var2": "things"
			}
			
			const response = await fetch("/data", {
				method: "DELETE",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			});
			
			const json = await response.json();
			
			console.log(json);
		}
	</script>
</html>
`;

function deleteData(request: EasyRequest): EasyResponse {
	let vars = {};
	
	if (Object.keys(request.queryVars).length > 0) vars = request.queryVars;
	if (Object.keys(request.bodyVars).length > 0) vars = request.bodyVars;
	
	// This is where you would delete applicable data specified in the request variables.
	
	return new EasyResponse(JSON.stringify(vars), { type: "json" });
}

serve({
	"GET /": () => new EasyResponse(htmlContent, { type: "html" }),
	"DELETE /data": deleteData
});
