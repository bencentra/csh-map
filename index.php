<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<meta name="description" content="">
	<meta name="keywords" content="">
	<meta name="author" content="">
	<title>CSH Member/Alumni Map</title>
	<!-- Styles -->
	<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
	<link rel="stylesheet" href="./jquery-ui-autocomplete/jquery-ui.min.css">
	<style>
		* { box-sizing: border-box; }
		html { height: 100%; }
    body { height: 100%; margin: 0; padding: 0; }
    #map-canvas { height: 100%; z-index: 0}
    #infoWindow { width: 300px; overflow: auto;}
    #wrapper { width: 100%; padding: 12px; position: absolute; top: 0; left: 0; z-index: 1}
    .navbar { padding: 6px 0;  margin-bottom: 10px;}
    .navbar-form { padding: 0 6px;}
    .gray { color: #999999; }
    .small { font-size: .8em; }
    .shadow { box-shadow: 0 0 12px #777777; }
    .hide { display: none; }
    .center { text-align: center; }
    .slogan { margin: 15px 6px; }
    .ui-autocomplete { position: absolute; cursor: default; z-index:10000 !important;} 
	</style>
</head>
<body>
	<!-- Content -->
	<div class="modal fade" id="addressModal" tabindex="-1" role="dialog" aria-labelledby="addressModal" aria-hidden="true">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
	        <h4 class="modal-title">Where Are You?</h4>
	      </div>
	      <div class="modal-body">
	      	<p><em class="gray">Provide at least your city and state/country</em></p>
	        <form role="form" onsubmit="return false;">
	        	<div class="form-group">
	        		<label for="addressChange">Address:</label>
	        		<input type="text" id="addressChange" class="form-control" placeholder="Boston, MA"/>
	        	</div>
	        	<div class="pull-right">
		      		<button type="button" class="btn btn-link" onclick="map.removeAddress();">Remove Address from Map</button>
		      	</div>
					</form>
	      </div>
        <br>
	      <div class="modal-footer">
        	<button type="button" class="btn btn-primary" onclick="map.updateAddress();">Update Address</button>
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
  <div class="modal fade" id="searchModal" tabindex="-1" role="dialog" aria-labelledby="searchModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
          <h4 class="modal-title">Search Map</h4>
        </div>
        <div class="modal-body">
          <form role="form" onsubmit="return false;">
            <div class="form-group">
              <label>Type</label>
              <select class="form-control" id="searchType" onchange="map.changeSearchType(this.value);">
                <option value="name">Name</option>
                <option value="location">Location</option>
              </select>
            </div>
            <div class="form-group">
              <label>Search</label>
              <input type="text" id="searchValue" class="form-control" placeholder="Real Name or Username..." />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" onclick="map.search($('#searchValue').val());">Search</button>
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->
	<div id="map-canvas"></div>
	<div id="wrapper">
		<nav class="navbar navbar-default shadow" role="navigation">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="index.php">CSH Map</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav center">
            <em class="navbar-text slogan">Find CSHers Across the Globe!</em>
          </ul>
          <ul class="navbar-form navbar-right">
            <br class="visible-xs">
            <div class="form-group center">
              <span id="popoverBtn" data-toggle="tooltop" data-placement="bottom" data-container="body">
                <button id="addressBtn" type="button" class="btn btn-primary" data-toggle="modal" data-target="#addressModal">Change My Location</button>
              </span>
            </div>
            <span class="gray hidden-xs">&nbsp;|&nbsp;</span>
            <div class="form-group center">
              <button id="searchBtn" type="button" class="btn btn-info" data-toggle="modal" data-target="#searchModal">Search Map</button>
            </div>
            <span class="gray hidden-xs">&nbsp;|&nbsp;</span>
            <div class="form-group">
              <select class="form-control" id="mapType" onchange="map.changeMapType(this.value);">
                <option value="roadmap" selected="selected">Road Map</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav><!-- /.navbar -->
		<div class="alert alert-success shadow" id="alert" role="alert" style="display:none;">
			<button type="button" class="close"><span>&times;</span></button>
		  <strong class="alert-title">Title!</strong> <span class="alert-text">Text!</span>
		</div>
	</div>
	<!-- Scripts -->
	<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
	<script src="https://netdna.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
	<script src="./jquery-ui-autocomplete/jquery-ui.min.js"></script>
  <?php
    require_once("./config.php");
    if (DEV_MODE) {
      $userName = htmlentities(DEV_USER);
      $commonName = htmlentities(DEV_CN);
      $apiUrl = DEV_API_URL;
    }
    else {
      $userName = htmlentities($_SERVER['WEBAUTH_USER']);
      $commonName = htmlentities($_SERVER['WEBAUTH_LDAP_CN']);
      $apiUrl = API_URL;
    }
    $profilesUrl = PROFILES_URL;
  ?>
  <script src="https://maps.googleapis.com/maps/api/js?key=<?php echo GMAPS_API_KEY; ?>"></script>
  <script>
    var CSH_MAP_CONFIG = {
      apiUrl: "<?php echo $apiUrl; ?>",
      profilesUrl: "<?php echo $profilesUrl; ?>"
    }
  </script>
	<script src="./js/map.js"></script>
	<script>

    var map, currentUser;

    document.addEventListener("DOMContentLoaded", function() {
      currentUser = {
        uid: "<?php echo $userName; ?>",
        cn: "<?php echo $commonName; ?>"
      };

      map = new CSH_MAP("map-canvas", currentUser);
      map.init();

      $(searchValue).on('keypress', function(e) {
        if (e.keyCode == 13) {
          map.search($('#searchValue').val());
        }
      });

      $(addressChange).on('keypress', function(e) {
        if (e.keyCode == 13) {
          map.updateAddress();
        }
      });

    }, true);

	</script>	
</body>
</html>