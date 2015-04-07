<?php
//links database to this page
//taking all code and pasting it here
//sets it up to be able to find the page and folders
  	require_once(__DIR__ . "/controller/login-verify.php");
  	require_once(__DIR__ . "/view/header.php");
  	if(authenticateUser()) {
  		require_once(__DIR__. "/view/navigation.php");
  	}
    require_once(__DIR__ . "/controller/create-db.php");
    require_once(__DIR__ . "/view/footer.php");
    require_once(__DIR__ . "/controller/read-posts.php");
//separated code to be able to maintain easily    
?>

