<?php

require_once("./adminCheck.php");

if (!$isAdmin) {
  die(result(false, "Sorry, admins only!", false));
}

require_once("../../../maps_db_info.inc");
require_once("../api/db_utils.php");
$db = new DatabaseUtils(DB_NAME, DB_HOST, DB_USER, DB_PASS);

function result($status, $message, $data) {
  $arr = array(
    "status" => $status,
    "message" => $message,
    "data" => $data
  );
  return json_encode($arr);
} 

function sendEmail($user, $date) {
  global $adminUser;
  $date = date("F j, Y", strtotime($date));
  $url = "http://bit.ly/csh-global-map";
  $to = $user."@csh.rit.edu";
  $from = "bencentra@csh.rit.edu";
  $subject = "CSH Map - Update Your Location!";
  $headers = "From: ".$from."\r\n";
  $headers .= "Reply-To: ".$from."\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
  $message = "<html><body><div style='width: 440px; margin: auto; padding: 20px; border: 1px solid black;'>";
  $message .= "<h2 style='text-align: center;'>Is your location accurate <br/>on the CSH Map?</h2>";
  $message .= "<a href='".$url."' style='text-decoration: none;'>";
  $message .= "<div style='width: 170px; margin: auto; text-align: center; padding: 5px; font-size: 16px; font-weight: bold; color: white; background-color: #bc0000;'>Update My Location</div></a>";
  $message .= "<p style='font-size: 16px;'>You last updated your location on <span style='font-weight: bold;'>".$date."</span>. You can update or confirm it here: <a href='".$url."'>".$url."</a>.</p>";
  $message .= "<p style='font-size: 14px;'>You can also remove yourself from the map, or opt-out of future email notifications.</p>";
  $message .= "<p style='font-size: 14px;'>The more accurate the map is, the better we can see where CSHers are across the country and around the world!</p>";
  $message .= "<p style='font-size: 14px;'>Thanks for using the CSH Map!</p>";
  $message .= "<p style='font-size: 14px;'><b>Ben Centra</b><br/><a href='mailto:".$from."'>".$from."</a><br/>RIT/CSH 2010-2014</p>";
  $message .= "</div></body></html>";
  return mail($to, $subject, $message, $headers);
}

$months = 6;
if (array_key_exists("months", $_GET)) {
  $months = intval($_GET["months"]);
}
if ($months < 0) {
  $months = 0;
}
if ($months > 12) {
  $months = 12;
}

$users = array();
$sql = "SELECT username, last_update FROM geo WHERE last_update < DATE_SUB(NOW(), INTERVAL :months MONTH) AND can_email = 1";
$params = array("months" => $months);
$result = $db->select($sql, $params);
$sent = array();
if ($result !== false) {
  $users = $result;
  $success = true;
  $lastUser = "";
  foreach($users as $user) {
    $success = sendEmail($user["username"], $user["last_update"]);
    if (!$success) {
      $lastUser = $user;
      break;
    }
    else {
      $sent[] = $user["username"];
    }
  }
  if ($success) {
    echo result(true, "Emails sent successfully!", $sent);
  }
  else {
    echo result(false, "Error sending email.", $lastUser);
  }
}
else {
  echo result(false, "Error retrieving users.", false);
}

?>