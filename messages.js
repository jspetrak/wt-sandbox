'use strict'

var dbClient = require('mongodb').MongoClient

module.exports = function (context, request, response) {
	if (request.method == 'POST') {
		var content = ''

		request.on('data', function (data) { content += data })

		request.on('end', function () {
			var data = JSON.parse(content)

			console.log(data)

			// Expects MONGO_URL as secret parameter of WebTask
			dbClient.connect(context.data.MONGO_URL, function (error, db) {
				if (error) return done(error)

				var collection = db.collection('messages')
				collection.insert(data)
			})

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