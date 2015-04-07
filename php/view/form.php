<?php 
 require_once(__DIR__ . "/../model/config.php");
 require_once(__DIR__. "/../controller/login-verify.php");
 //checks if logged in
  if(!authenticateUser()) {
  	header("Location:" . $path . "blog.php");
  	//redirects user to home page beofre killing program
  	die();
  	//stops page from loading if user isnt logged in
  }
?>

<h1> Create Blog Post</h1>
<!-- method used to send information -->
<form method="post" action="<?php echo $path . "controller/create-post.php"; ?>">
	<div>
<!-- align with php file alowing user to be able to type text into the web page  -->
<!-- labels title -->
		<label for"title">Title:</label>
<!-- to be able to type text on the webpage -->
		<input type="text" name="title">
	</div>

	<div>
<!-- label post -->
<!-- indicate and align with php file -->
		<label for="post"></label>
<!--allows you yo type unimited text-->
		<textarea name="post"></textarea>
	</div>

	<div>
<!-- creating a submit button which now refreshes the page -->
		<button type="submit">Submit</button>
	</div>
</form>