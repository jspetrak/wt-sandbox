'use strict'

var app = new (require('express'))()
var wt = require('webtask-tools')
var request = require('request')

app.get('/', function (req, res) {
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

					// Write CSV header row
					res.write('"Client Name","Rule Name","Rule ID"' + "\n")

					// Traverse the rules received
					JSON.parse(rulesBody).forEach( function(rule) {
						// Search for using client name in rule script
						var clientNamePos = rule.script.indexOf("context.clientName")
						// If client name is used, extract it
						if (clientNamePos > -1) {
							var clientNameStringStartPos = rule.script.indexOf('\"', clientNamePos)
							var clientNameStringEndPos = rule.script.indexOf('\"', clientNameStringStartPos + 2)

							var clientName = rule.script.substring(clientNameStringStartPos + 1, clientNameStringEndPos)

							// Write data to CSV output
							res.write('"' + clientName + '","' + rule.name + '","' + rule.id+ '"' + "\n")
						}
					})

					res.end()
				}
			)
		}
	)
})

var authorizedEmails = [
	'jspetrak@outlook.cz'
]
var auth0Setup = {
	authorized : (ctx, req) => authorizedEmails.indexOf(ctx.user.email.toLowerCase()) !== -1
}

module.exports = wt.fromExpress(app).auth0(auth0Setup)
