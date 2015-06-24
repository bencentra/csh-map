<?php

require_once("../../maps_db_info.inc");
require_once("api/db_utils.php");
$db = new DatabaseUtils(DB_NAME, DB_HOST, DB_USER, DB_PASS);
$user = $_SERVER["WEBAUTH_USER"];

$sql = "UPDATE geo SET can_email = 0 WHERE username = :username";
$params = array("username" => $user);
$result = $db->update($sql, $params);
if ($result) {
  echo "You have been unsubscribed from CSH Map update emails!";
}
else {
  echo "Error unsubscribing. Please contact <a href='mailto:bencentra@csh.rit.edu'>bencentra@csh.rit.edu</a>.";
}

?>