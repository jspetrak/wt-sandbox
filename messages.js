'use strict'

var dbClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var uuid = require('uuid').v4

module.exports = function (context, request, response) {
	// Expects MONGO_URL as secret parameter of WebTask
	var dbURL = context.data.MONGO_URL

	if (request.method == 'POST') {
		var content = ''

		request.on('data', function (data) { content += data })

		request.on('end', function () {
			var data = JSON.parse(content)

			console.log(data)

			data.uuid = uuid()

			dbClient.connect(dbURL, function (error, db) {
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

		var data = []
		var items = 0

		dbClient.connect(dbURL, function (error, db) {
			if (error) return done(error)

			var collection = db.collection('messages')
			var stream = collection.find().stream()
			stream.on('data', function (item) {
				item.createdOn = (new ObjectID(item._id)).getTimestamp()

				data[items] = item
				items += 1
			})
			stream.on('end', function () {
				console.log(`Found ${items} message(s)`)

				response.write(JSON.stringify(data))

				response.end()
			})
		})
	}
}