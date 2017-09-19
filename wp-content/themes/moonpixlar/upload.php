
<?php

foreach ($_FILES["images"]["error"] as $key => $error) {
    if ($error == UPLOAD_ERR_OK) {
        $name = $_FILES["images"]["name"][$key];
        $temp = explode(".", $_FILES["images"]["name"][$key]);
		$newfilename = round(microtime(true)) . '.' . end($temp);
        move_uploaded_file( $_FILES["images"]["tmp_name"][$key], "uploadedImages/" . $newfilename);
    }
}
echo $newfilename;

?>
