<?php

if ($_FILES) {
	if (isset($_FILES['file1']))
	{
		move_uploaded_file($_FILES['file1']['tmp_name'], $_FILES['file1']['name']);
		
		$name = $_FILES['file1']['name'];
		$error = $_FILES['file1']['error'];
	}
	else if (isset($_FILES['file2']))
	{
		move_uploaded_file($_FILES['file2']['tmp_name'], $_FILES['file2']['name']);
		
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
