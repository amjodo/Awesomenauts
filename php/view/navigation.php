<?php
//directing server to go to this file and this folder
	require_once(__DIR__ . "/../model/config.php");
?>
	<nav> 
<!--unordered list that points to post file-->
<!--fixing the path to our files trying both ways on how to do it-->
		<ul>
<!--telling it the location of path folder-->
			<li><a href="<?php echo $path . "post.php"?> ">Blog Post Form</a></li>	
		</ul>
	</nav>