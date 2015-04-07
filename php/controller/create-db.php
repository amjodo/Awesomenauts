<?php
//looks for config
	require_once(__DIR__ ."/../model/config.php");
//looks for these variables
// in this order to buffer & so it can be read by database	
//creating a query to make a table in database 
//connectin has connection to database
//stores all block posts
//(11) means up to 11 values
//NOT NULL can't be empty
//AUTO_INCREMENT automatically increments ids 
	$query = $_SESSION["connection"]->query("CREATE TABLE posts ("
		."id int(11) NOT NULL AUTO_INCREMENT,"
		. "title varchar (255) NOT NULL,"
		. "post text NOT NULL,"
		. "DateTime datetime NOT NULL ,"
		."PRIMARY KEY (id))");
//if table was created print out this message
//true or false statement
	//if($query) {
	//	echo "<p>Succesfully created table: posts</p>";
	//}
//else statement is fired when statement is false
//handles both code and recieves hmtl codes
	//else {
		//echo "<p>" . $_SESSION["connection"]->error . "</p>";
	//}
//same as the top part, just adjusted a bit to correspond with new code
	$query = $_SESSION["connection"]->query("CREATE TABLE users ("
		."id int(11) NOT NULL AUTO_INCREMENT,"
		."username varchar (30) NOT NULL,"
		. "email varchar (50) NOT NULL,"
		. "password char(125) NOT NULL,"
		. "salt char (128)NOT NULL,"
		."PRIMARY KEY(id))");

	//if($query){
		//echo "<p>Succesfully created table: users</p>";
	//}
	//else {
		//echo "<p>" . $_SESSION["connection"]->error . "</p>";
	//}