<?php
require_once("./adminCheck.php");
?>
<!DOCTYPE HTML>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <meta name="keywords" content="">
  <meta name="author" content="">
  <title>CSH Map Admin Panel</title>
  <!-- Styles -->
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
  <style>
    body {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .center {
      text-align: center;
    }
    .small {
      font-size: .85em;
    }
  </style>
</head>
<body>
  <?php if (!$isAdmin): ?>
  <div class="container center">
    <div class="row">
      <div class="col-md-12">
        <h1>Sorry, admins only!</h1>
      </div>
    </div>
  </div>
  <?php else: ?>
  <!-- Content -->
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1 class="center">CSH Map Admin Panel</h1>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <div class="panel panel-default center">
          <div class="panel-heading">
            <div class="panel-title">Email Reminders</div>
          </div>
          <div class="panel-body">
            <p class="small"><em>Send out an email to remind users to update their address.</em></p>
            <form role="form" onsubmit="return false;">
              <div class="form-group">
                <label for="emailMonths">Months Since Last Update</label>
                <input id="emailMonths" name="emailMonths" type="number" class="form-control" min="1" max="12" value="6"/>
              </div>
              <div class="form-group">
                <button type="button" class="btn btn-primary" onclick="sendEmailUpdate();">Send Email</button>
              </div>
            </form>
          </div>
        </div>
        <div id="emailAlert" class="alert alert-success alert-dismissible" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <span class="message">Lorem ipsum and the rest!</span>
        </div>
      </div>
    </div>
  </div>
  <!-- Scripts -->
  <script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
  <!--<script src="//code.angularjs.org/snapshot/angular.min.js"></script>-->
  <script>

    function setAlertClass(selector, success) {
      var $alert = $(id);
      if (!$alert) return;
      if (success) {
        $alert.removeClass("alert-danger").addClass("alert-success");
      }
      else {
        $alert.removeClass("alert-success").addClass("alert-danger");
      }
    }

    function sendEmailUpdate() {
      var months = $("#emailMonths").val();
      if (months < 1) months = 1;
      if (months > 12) months = 12;
      $.ajax({
        method: "GET",
        url: "./email.php?months=" + months,
        dataType: "json",
        success: function(response) {
          if (response.status) {
            setAlertClass("#emailAlert", true);
          }
          else {
            setAlertClass("#emailAlert", false);
          }
          $("#emailAlert").find(".message").text(response.message);
        },
        error: function(error) {
          console.error(error);
        }
      });
    }

  </script> 
  <?php endif; ?>
</body>
</html>