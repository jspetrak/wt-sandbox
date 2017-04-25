'use strict'

module.exports = function (context, request, response) {
	if (request.method == 'POST') {
		var content = ''

		request.on('data', function (data) { content += data })

		request.on('end', function () {
			var data = JSON.parse(content)

			console.log(data)

			response.statusCode = 201
			response.end()
		})
	}

	if (request.method == 'GET') {
		response.setHeader('Content-Type', 'application/json')
		response.write(JSON.stringify([]))
		response.end()
	}
}