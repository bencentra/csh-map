<?php

require_once "./db_utils.php";

abstract class API
{
  protected $method = '';
  protected $endpoint = '';
  protected $verb = '';
  protected $args = array();
  protected $file = null;

  public function __construct($request) {
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    header("Access-Control-Allow-Orgin: *");
    header("Access-Control-Allow-Methods: *");
    header("Content-Type: application/json");

    $this->args = explode('/', rtrim($request, '/'));
    $this->endpoint = array_shift($this->args);
    if (array_key_exists(0, $this->args) && !is_numeric($this->args[0])) {
      $this->verb = array_shift($this->args);
    }

    $this->method = $_SERVER['REQUEST_METHOD'];
    if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
      if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
        $this->method = 'DELETE';
      } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
        $this->method = 'PUT';
      } else {
        throw new Exception("Unexpected Header");
      }
    }
  }

  public function processAPI() {
    switch($this->method) {
      case 'DELETE':
      case 'POST':
        $this->request = $this->_cleanInputs($_POST);
        break;
      case 'GET':
        $this->request = $this->_cleanInputs($_GET);
        break;
      case 'PUT':
        $this->request = $this->_cleanInputs($_GET);
        $this->file = file_get_contents("php://input");
        break;
      default:
        return $this->_response('Invalid Method', 405);
        break;
    }

    if ((int)method_exists($this, $this->endpoint) > 0) {
      return $this->_response($this->{$this->endpoint}($this->args));
    }

    return $this->_response("No Endpoint: $this->endpoint", 404);
  }

  private function _response($data, $status = 200) {
      header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
      return json_encode($data); // JSON_PRETTY_PRINT only works in PHP >= 5.4
  }

  private function _cleanInputs($data) {
    $clean_input = Array();
    if (is_array($data)) {
      foreach ($data as $k => $v) {
        $clean_input[$k] = $this->_cleanInputs($v);
      }
    } 
    else {
      $clean_input = trim(strip_tags($data));
    }
    return $clean_input;
  }

  private function _requestStatus($code) {
    $status = array(  
      200 => 'OK',
      404 => 'Not Found',   
      405 => 'Method Not Allowed',
      500 => 'Internal Server Error',
    ); 
    return ($status[$code]) ? $status[$code] : $status[500]; 
  }
}

class MapAPI extends API
{
  private $uid = "";
  private $cn = "";

  public function __construct($request, $origin) {
    parent::__construct($request);
    $this->uid = htmlentities("bencentra"); // htmlentities($_SERVER['WEBAUTH_USER']);
    $this->cn = htmlentities("Ben Centra <script>alert('LOL');</script>"); // htmlentities($_SERVER['WEBAUTH_LDAP_CN']);
  }

  private function result($status, $message, $data) {
    return array(
      "status" => $status,
      "message" => $message,
      "data" => $data
    );
  }

  protected function users() {
    switch ($this->method) {
      case "GET":
        $sql = "SELECT username as uid, common_name as cn, latitude, longitude, address, last_update as date FROM geo";
        $query = db_select($sql, array());
        if ($query) {
          return $this->result(true, "", $query);
        }
        else {
          return $this->result(false, "Error: Failed to retrieve users.", false);
        }
        break;
      case "POST":
        $params = array();
        $params["uid"] = $this->uid;
        $params["cn"] = $this->cn;
        if (array_key_exists("latitude", $this->request)) {
          $params["latitude"] = $this->request["latitude"];
        }
        else {
          return $this->result(false, "Error: Missing latitude.", false);
        }
        if (array_key_exists("longitude", $this->request)) {
          $params["longitude"] = $this->request["longitude"];
        }
        else {
          return $this->result(false, "Error: Missing longitude.", false);
        }
        if (array_key_exists("address", $this->request)) {
          $params["address"] = $this->request["address"];
        }
        else {
          return $this->result(false, "Error: Missing address.", false);
        }
        $sql = "REPLACE INTO geo (username, common_name, latitude, longitude, address) 
                VALUES (:uid, :cn, :latitude, :longitude, :address)";
        $query = db_insert($sql, $params);
        if ($query) {
          return $this->result(true, "", true);
        }
        else {
          return $this->result(false, "Error: Failed to update address.", false);
        }
        break;
      case "DELETE":
        $params = array();
        $params["uid"] = $this->uid;
        $sql = "DELETE FROM geo WHERE username = :uid";
        $query = db_delete($sql, $params);
        if ($query) {
          return $this->result(true, "", true);
        }
        else {
          return $this->result(false, "Error: Failed to remove address.", false);
        }
        break;
      default:
        return $this->result(false, 'Invalid HTTP method for endpoint "users."', false);
    }
  }
  
}

// Requests from the same server don't have a HTTP_ORIGIN header
if (!array_key_exists('HTTP_ORIGIN', $_SERVER)) {
  $_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
}

try {
  $API = new MapAPI($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
  echo $API->processAPI();
} 
catch (Exception $e) {
  echo json_encode(Array('error' => $e->getMessage()));
}

?>