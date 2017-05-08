'use strict'

var app = new (require('express'))()
var wt = require('webtask-tools')
var request = require('request')

var viewRulesForClients = function (req, res, presenter) {
	// Using given client credentials, request an Auth0 access token
	request(
		{
			uri : "https://somemove.eu.auth0.com/oauth/token",
			method : 'POST',
			json : true,
			body : {
				"grant_type" : "client_credentials",
				"audience" : req.webtaskContext.secrets.AUTH0_AUDIENCE,
				"client_id" : req.webtaskContext.secrets.AUTH0_CLIENT_ID,
				"client_secret" : req.webtaskContext.secrets.AUTH0_CLIENT_SECRET
			}
		},
		function (tokenErr, tokenRes, tokenBody) {
			if (tokenErr) { console.error(tokenErr) }

			// When access token is available, query for all rules
			request(
				{
					url : 'https://somemove.eu.auth0.com/api/v2/rules',
					method : 'GET',
					auth: { bearer: tokenBody.access_token }
				},
				function (rulesErr, rulesRes, rulesBody) {
					if (rulesErr) { console.error(rulesErr) }

					var rulesForClients = {}

					// Traverse the rules received
					JSON.parse(rulesBody).forEach( function(rule) {
						// Search for using client name in rule script
						var clientNamePos = rule.script.indexOf("context.clientName")
						// If client name is used, extract it
						if (clientNamePos > -1) {
							var clientNameStringStartPos = rule.script.indexOf('\"', clientNamePos)
							var clientNameStringEndPos = rule.script.indexOf('\"', clientNameStringStartPos + 2)

							var clientName = rule.script.substring(clientNameStringStartPos + 1, clientNameStringEndPos)

							if (!(clientName in rulesForClients)) {
								rulesForClients[clientName] = []
							}

							rulesForClients[clientName].push({ id : rule.id, name : rule.name })
						}
					})

					presenter(req, res, rulesForClients)
				}
			)
		}
	)
}

app.get('/', function (req, res) {
	var format = req.query.format

	if (format === 'csv') {
		viewRulesForClients(req, res, function (request, response, data) {
			// Write CSV header row
			response.write('"Client Name","Rule Name","Rule ID"' + "\n")

			for (var clientName in data) {
				data[clientName].forEach(function (rule) {
					// Write data to CSV output
					response.write('"' + clientName + '","' + rule.name + '","' + rule.id + '"' + "\n")
				})
			}

			response.end()
		})
	} else {
		viewRulesForClients(req, res, function (request, response, data) {
			response.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>WebTask Example</title>
<style type="text/css">
body { font-family: "Source Sans Pro", sans-serif; }
table { border:  1px solid gray; border-collapse: collapse; }
th, td { border: 1px solid gray; padding: 0.2em 0.5em; }
</style>
<body>
<p><a href="?format=csv&amp;access_token=${req.query.access_token}">Download as CSV</a></p>
<table>
<tr><th>Client Name</th><th>Rules</th></tr>
			`)

			for (var clientName in data) {
				response.write(`<tr><td>${clientName}</td><td><ul>`)

				data[clientName].forEach(function (rule) {
					// Write data to HTML output
					response.write(`<li>${rule.name} (${rule.id})</li>`)
				})

				response.write(`</ul></td></tr>`)
			}

			response.write(`
</table>
</body>
</html>
			`)

			response.end()
		})
	}
})

var authorizedEmails = [
	'jspetrak@outlook.cz',
	'devts@outlook.com'
]
var auth0Setup = {
	authorized : (ctx, req) => authorizedEmails.indexOf(ctx.user.email.toLowerCase()) !== -1
}

module.exports = wt.fromExpress(app).auth0(auth0Setup)
