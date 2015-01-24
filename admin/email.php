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
  $url = "https://members.csh.rit.edu/~bencentra/csh-map/";
  $to = "blcentra@gmail.com";//$user."@csh.rit.edu";
  $from = "bencentra@csh.rit.edu";
  $subject = "CSH Map - Update Your Location!";
  $headers = "From: ".$from."\r\n";
  $headers .= "Reply-To: ".$from."\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
  $message = "<html><body>";
  $message .= "<h3>Is your location accurate on the CSH Map?</h3>";
  $message .= "<p>You last updated your location on ".$date.". If your location has changed, you can update it here: <a href='".$url."'>".$url."</a>.";
  $message .= " You can also choose to remove yourself from the map, or opt-out of future email notifications.</p>";
  $message .= "<p>The more accurate the map is, the better we can see where CSHers are across the country and around the world!</p>";
  $message .= "<p>Thanks for using the CSH Map!</p>";
  $message .= "<p><b>Ben Centra</b><br/><a href='mailto:".$from."'>".$from."</a><br/>RIT/CSH 2010-2014</p>";
  $message .= "</body></html>";
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
  }
  if ($success) {
    echo result(true, "Emails sent successfully!", true);
  }
  else {
    echo result(false, "Error sending email.", $lastUser);
  }
}
else {
  echo result(false, "Error retrieving users.", false);
}

?>