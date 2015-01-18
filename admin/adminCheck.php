<?php
require_once("../config.php");
$admins = ['bencentra'];
if (DEV_MODE) {
  $user = htmlentities(DEV_USER);
}
else {
  $user = htmlentities($_SERVER["WEBAUTH_USER"]);
}
$isAdmin = in_array($user, $admins);
?>