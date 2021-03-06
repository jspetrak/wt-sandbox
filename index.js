'use strict'

module.exports = function (context, req, res) {
	res.writeHead(200, { 'Content-Type' : 'text/html'})

	res.end(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>WebTask Example</title>
<style type="text/css">
body {
	font-family: "Source Sans Pro", sans-serif;
}
</style>
<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>
<script type="text/javascript">
var syncMessages = function () {
	$.ajax({
		url : '/messages',
		type : 'GET',
		success : function (data) {
			var known = []
			$('#gb-messages').children().each(function () { known.push($(this).attr('data-gb-uuid')) })

			data.forEach(function (record) {
				if (known.includes(record.uuid) == false) {
					$('#gb-messages').prepend(\"<div data-gb-uuid=\\"" + record.uuid + "\\">" + $.datepicker.formatDate('yy-mm-dd', new Date(record.createdOn)) + ": " + record.message + "</div>")
				}
			})
		}
	}).then(function () { setTimeout(syncMessages, 5000) })
}

window.onload = function () {

	$('#gb-save').click(function () {
		var messageText = $('#gb-message').val()

		if (messageText.length > 0) {
			var payload = { message : messageText }

			$.ajax({
				url : '/messages',
				type : 'POST',
				contentType: "application/json; charset=utf-8",
				dataType : 'json',
				data : JSON.stringify(payload),
				complete : function () { $('#gb-message').val('') },
				failure : function (errorMessage) { console.log(errorMessage) }
			})
		}
	})

	syncMessages()

}
</script>
</head>
<body>
<h1>WebTask Example</h1>
<div>
<textarea id="gb-message"></textarea>
<input type="submit" id="gb-save">
</div>

<div id="gb-messages">

</body>
</html>
	`)
}