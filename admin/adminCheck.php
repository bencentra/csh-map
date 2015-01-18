<?php
require_once("../config.php");
$admins = array("bencentra");
$adminUser = "";
if (DEV_MODE) {
  $adminUser = htmlentities(DEV_USER);
}
else {
  $adminUser = htmlentities($_SERVER["WEBAUTH_USER"]);
}
$isAdmin = in_array($adminUser, $admins);
?>