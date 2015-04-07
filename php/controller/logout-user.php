<?php
	require_once(__DIR__ . "/../model/config.php");

	unset($_SESSION["authenticated"]);

	session_destroy();
	//be sure it is destroyed then tranfers them to blog.php
	header("Location: " . $path . "blog.php");
	//so he knows where to go