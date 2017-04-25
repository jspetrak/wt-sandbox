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
		console.log($('#gb-message').val());
	});

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