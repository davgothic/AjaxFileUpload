<?php

if ($_FILES) {
	if (isset($_FILES['file1']))
	{
		$name = $_FILES['file1']['name'];
		$error = $_FILES['file1']['error'];
	}
	else if (isset($_FILES['file2']))
	{
		$name = $_FILES['file2']['name'];
		$error = $_FILES['file2']['error'];
	}
	
	$response = array(
		'name'	=> $name,
		'error'	=> $error,
	);
	
	echo json_encode($response);
	die();
}
