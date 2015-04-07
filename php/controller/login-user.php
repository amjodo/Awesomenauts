<?php
	require_once(__DIR__ . "/../model/config.php");
	//gains acess to database

	$array = array(
		'exp' => '',
		'exp1' => '',
		'exp2' => '',
		'exp3' => '',
		'exp4' => '',

	);

	$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);	
	$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);
	$query = $_SESSION["connection"]->query("SELECT * FROM users WHERE BINARY username = '$username'");
	//select proper user from database
	//where database connection is being stored
	//running query on database connection
	//being selected by the query
	if($query->num_rows == 1) {
		$row = $query->fetch_array();

		if($row["password"] === crypt($password, $row["salt"])) {
			$_SESSION["authenticated"] = true;
			$array["exp"] = $row["exp"];
			$array["exp1"] = $row["exp1"];
			$array["exp2"] = $row["exp2"];
			$array["exp3"] = $row["exp3"];
			$array["exp4"] = $row["exp4"];

			$_SESSION["name"] = $username;
			
			echo json_encode($array);
		} else {
			echo "<p>Invalid username and password</p>";
		}

	}
	
	//check if information was stored, get array store into row
?>	
<!--html>
<head>
		<link rel="stylesheet" type="text/css" href="main.css">
		<link href='http://fonts.googleapis.com/css?family=Indie+Flower' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Poiret+One' rel='stylesheet' type='text/css'>
		<meta charset="UTF-8"> 
	 <title> Created User</title>
</head>
<button type="button"><a href="BlogIII/blog.php">Home</a></button-->
