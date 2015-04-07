<?php 
//finding and going into the folders selected
//access path file
	require_once(__DIR__ . "/../model/config.php");
 ?>
<html>
<head>
		<link rel="stylesheet" type="text/css" href="main.css">
		<link href='http://fonts.googleapis.com/css?family=Indie+Flower' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Poiret+One' rel='stylesheet' type='text/css'>
		<meta charset="UTF-8"> 
	 <title> Created User</title>
</head>
 <h1>Login</h1>
<!--how we are sending info via php, php 
going to store in postvariable and acess in post 
variable-->
 <form method="post" action="<?php echo $path . "controller/login-user.php"?>">

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
 </html>
 
