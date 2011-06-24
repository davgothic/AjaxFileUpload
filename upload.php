<?php
/**
 * This is just an example of how a file could be processed from the
 * upload script. It should be tailored to your own requirements.
 */

if ($_FILES)
{
	// Only accept files with these extensions
	$whitelist = array('jpg', 'jpeg', 'png', 'gif');

	if (isset($_FILES['file1']))
	{
		$tmp_name	= $_FILES['file1']['tmp_name'];
		$name		= basename($_FILES['file1']['name']);
		$error		= $_FILES['file1']['error'];
		
		if ($error === UPLOAD_ERR_OK)
		{
			$extension = pathinfo($name, PATHINFO_EXTENSION);

			if ( ! in_array($extension, $whitelist))
			{
				$error = 'Invalid file type uploaded.';
			}
			else
			{
				move_uploaded_file($tmp_name, $name);
			}
		}
	}
	
	$response = array(
		'name'	=> $name,
		'error'	=> $error,
	);
	
	echo json_encode($response);
	die();
}
