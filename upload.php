<?php

if ($_FILES)
{
	if (isset($_FILES['file1']))
	{
		$tmp_name	= $_FILES['file1']['tmp_name'];
		$name		= $_FILES['file1']['name'];
		$error		= $_FILES['file1']['error'];
		
		if ($error == 0)
		{
			move_uploaded_file($tmp_name, $name);
		}
	}
	
	$response = array(
		'name'	=> $name,
		'error'	=> $error,
	);
	
	echo json_encode($response);
	die();
}
