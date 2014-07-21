<?php

require_once "./db_utils.php";

$username = "bencentra"; // $_SERVER['WEBAUTH_USER'];
if (!$username) {
	echo json_encode(array("status" => false, "message" => "Uh-oh, missing Webauth credentials!", "data" => false));
	die();
}

$params = array();
$params["username"] = $username;

if (array_key_exists("latitude", $_POST) && array_key_exists("longitude", $_POST)) {
	$params["latitude"] = $_POST["latitude"];
	$params["longitude"] = $_POST["longitude"];
}
else {
	echo json_encode(array("status" => false, "message" => "Oops! You forgot your latitude or longitude!", "data" => false));
	die();
}

if (array_key_exists("address", $_POST)) {
	$params["address"] = $_POST["address"];
}
else {
	echo json_encode(array("status" => false, "message" => "Oops! You forgot your address!", "data" => false));
	die();
}

$sql = "REPLACE INTO geo (username, latitude, longitude, address) VALUES (:username, :latitude, :longitude, :address)";
$query = db_insert($sql, $params);
if ($query) {
	echo json_encode(array("status" => true, "message" => "Successfully Updated Address!", "data" => true));
}
else {
	echo json_encode(array("status" => false, "message" => "Failed To Update Address.", "data" => false));
}

?>