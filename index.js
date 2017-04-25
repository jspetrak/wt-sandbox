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
<script type="text/javascript">
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

}
</script>
</head>
<body>
<h1>WebTask Example</h1>
<div>
<textarea id="gb-message"></textarea>
<input type="submit" id="gb-save">
</div>
</body>
</html>
	`)
}