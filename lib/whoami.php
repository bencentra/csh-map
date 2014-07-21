<?php

$userName = "bencentra"; // $_SERVER['WEBAUTH_USER'];
$commonName = "Ben Centra"; // $_SERVER['WEBAUTH_LDAP_CN'];

echo json_encode(array("uid" => $userName, "cn" => $commonName));

?>