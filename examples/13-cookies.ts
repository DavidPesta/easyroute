import easy from "https://deno.land/x/easyutil@0.6.0/mod.ts";
import { serve, EasyRequest, EasyResponse } from "https://deno.land/x/easyroute@0.2.0/mod.ts";

function htmlPage(request: EasyRequest): EasyResponse {
	const html = `<!DOCTYPE html>
		<html>
			<body>
				<p>
					Cookies:<br />
					${JSON.stringify(request.cookieVars)}
				</p>
				<p>
					Create Cookie<br />
					<input type="text" id="create-name" /> Name<br />
					<input type="text" id="create-value" /> Value<br />
					<input type="text" id="create-expire-seconds" /> Expire in # Seconds<br />
					<input type="button" value="Create" onclick="createCookie();" />
				</p>
				<p>
					Get Cookie<br />
					<input type="text" id="get-name" /> Name<br />
					<input type="button" value="Get" onclick="getCookie();" />
				</p>
				<p>
					Delete Cookie<br />
					<input type="text" id="delete-name" /> Name<br />
					<input type="button" value="Delete" onclick="deleteCookie();" />
				</p>
			</body>
			<script>
				async function createCookie() {
					var data = {
						"name": document.getElementById("create-name").value,
						"value": document.getElementById("create-value").value,
						"expire": document.getElementById("create-expire-seconds").value
					}
					
					const response = await fetch("/cookie", {
						method: "POST",
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(data)
					});
					
					const json = await response.json();
					
					if (json.success) window.location.reload();
				}
				
				async function getCookie() {
					var name = document.getElementById("get-name").value;
					const response = await fetch("/cookie?name=" + name);
					const json = await response.json();
					console.log(json);
				}
				
				async function deleteCookie() {
					var name = document.getElementById("delete-name").value;
					const response = await fetch("/cookie?name=" + name, { method: "DELETE" });
					const json = await response.json();
					if (json.success) window.location.reload();
				}
			</script>
		</html>
	`;
	
	return new EasyResponse(html, { type: "html" });
}

function createCookie(request: EasyRequest): EasyResponse {
	const response = new EasyResponse(JSON.stringify({ success: true, message: `Cookie was set.` }), { type: "json" });
	
	const {name, value, expire} = request.bodyVars;
	
	if (easy.string.isA.integer(expire)) {
		const expireSeconds = easy.string.parse.integer(expire);
		response.setCookie(name, value, {  maxAge: expireSeconds });
	}
	else {
		response.setCookie(name, value);
	}
	
	return response;
}

function getCookie(request: EasyRequest): EasyResponse {
	const name = request.queryVars["name"];
	const value = request.cookieVars[name];
	return new EasyResponse(JSON.stringify({ name: value }), { type: "json" });
}

function deleteCookie(request: EasyRequest): EasyResponse {
	const name = request.queryVars["name"];
	const response = new EasyResponse(JSON.stringify({ success: true, message: `Cookie was deleted.` }), { type: "json" });
	response.deleteCookie(name);
	return response;
}

serve({
	"GET /": htmlPage,
	"POST /cookie": createCookie,
	"GET /cookie": getCookie,
	"DELETE /cookie": deleteCookie
});
