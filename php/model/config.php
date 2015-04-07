<?php

	require_once(__DIR__ . "/database.php");
//stores the path to our project
	$path = "/Awesomenauts/php/";
//preserves & saves information
	session_start();
//starts session	
	session_regenerate_id(true);
//maintain same session id, regenerates id using original id
//starts new id so hackers can't access session	

//stores localhost
	$host = "localhost";
//stores root in username	
	$username = "root";
//stores root in password	
	$password = "root";
//stores blog_db in database	
	$database = "awesomenauts_db";
//information for xxamp	

if(!isset($_SESSION["connection"])) {
	//database object
	//pass into consturctor, uses information, stores into variable	
	$connection = new Database($host, $username, $password, $database);
	//preserves & saves information
	$_SESSION["connection"] = $connection;
	//creating database asigning to session
}

