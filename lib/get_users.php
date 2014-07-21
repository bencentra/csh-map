<?php

require_once "./db_utils.php";

$sql = "SELECT * FROM geo";
$query = db_select($sql, array());
if ($query) {
	echo json_encode(array("status" => true, "message" => "Successfully Retrieved Users!", "data" => $query));
}
else {
	echo json_encode(array("status" => false, "message" => "Failed To Retrieve Users.", "data" => false));
}

?>