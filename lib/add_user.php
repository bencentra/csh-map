<?php

require_once "./db_utils.php";

$username = "bencentra"; // $_SERVER['WEBAUTH_USER'];

$params = array();
$params["username"] = $username;

if (array_key_exists("latitude", $_POST) && array_key_exists("longitude", $_POST)) {
	$params["latitude"] = $_POST["latitude"];
	$params["longitude"] = $_POST["longitude"];
}
else {
	echo json_encode(array("status" => false, "message" => "Oops! You forgot your latitude and/or longitude!", "data" => false));
	die();
}

$sql = "REPLACE INTO geo (username, latitude, longitude) VALUES (:username, :latitude, :longitude)";
$query = db_insert($sql, $params);
if ($query) {
	echo json_encode(array("status" => true, "message" => "Successfully Updated Address!", "data" => true));
}
else {
	echo json_encode(array("status" => false, "message" => "Failed To Update Address.", "data" => false));
}

?>