<!-- allows the user to be apart of the blog, if not a user
won't be allowed to post-->
<?php 
//finding and going into the folders selected
	require_once(__DIR__ . "/../model/config.php");
 ?>
<html>
<head>
		<link rel="stylesheet" type="text/css" href="main.css">
		<link href='http://fonts.googleapis.com/css?family=Indie+Flower' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Poiret+One' rel='stylesheet' type='text/css'>
		<meta charset="UTF-8"> 
	 <title> Register</title>
</head>	 
<h1>Register</h1>
<body>
	<form method="post" action="<?php echo $path . "controller/create-user.php"; ?>">
		<div>
			<label for="email">Email:</label>	
			<input type="text" name="email" /> 
		</div>
		<div>
			<label for="username">Username:</label>	
			<input type="text" name="username" /> 
		</div>
		<div>
			<label for="password">Password:</label>	
			<input type="password" name="password" /> 
		</div>
		<div>
			<button type="submit">Submit</button>
		</div>
	</form>
</body>
</html>