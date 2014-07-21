<?php

?>
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
	<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
	<style>
		* { box-sizing: border-box; }
		html { height: 100%; }
    body { height: 100%; margin: 0; padding: 0; }
    #map-canvas { height: 100%; z-index: 0}
    #wrapper { width: 100%; position: absolute; top: 0; left: 0; z-index: 1}
    #header { 
    	height: 72px; 
    	width: 100%; 
    	padding: 12px;
    }
    #header h2 { margin-top: 0; }
	</style>
</head>
<body>
	<!-- Content -->
	<div id="map-canvas"></div>
	<div id="wrapper">
		<div id="header">
			<nav class="navbar navbar-default" role="navigation">
			  <div class="container-fluid">
			    <!-- Brand and toggle get grouped for better mobile display -->
			    <div class="navbar-header">
			      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
			        <span class="sr-only">Toggle navigation</span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			      </button>
			      <a class="navbar-brand" href="#">CSH Map</a>
			    </div>

			    <!-- Collect the nav links, forms, and other content for toggling -->
			    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			      <ul class="nav navbar-nav">
			        
			      </ul>
			      <ul class="navbar-form navbar-right">
			      	<div class="form-group">
						    <input type="text" class="form-control" placeholder="Username">
						  </div>
						  <button type="submit" class="btn btn-default">Search</button>
						  &nbsp;|&nbsp;
			      	<button type="button" class="btn btn-default">Change My Location</button>
			      </ul>
			    </div><!-- /.navbar-collapse -->
			  </div><!-- /.container-fluid -->
			</nav>
		</div>
	</div>
	<!-- Scripts -->
	<script src="https://code.jquery.com/jquery-2.1.0.min.js"></script>
	<script src="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJDy3u2nsUVz_l8AON489lo29SzHTEGYI"></script>
	<script>

		var map = false;
		var markers = [];
		var myLatlng = new google.maps.LatLng(37,-97);

		function initialize() {
			var mapCanvas = document.querySelector("#map-canvas");

      var mapOptions = {
      	disableDefaultUI: true,
        center: myLatlng,
        zoom: 4
      };

      map = map || new google.maps.Map(mapCanvas, mapOptions);

      addMarkers();
    }

    function addMarkers() {
    	$.ajax({
    		url: "http://localhost/csh-map/lib/get_users.php",
    		dataType: "json",
    		method: "GET",
    		success: function(data, status, ajax) {
    			console.log(data);
    			if (data.status) {
    				var users = data.data;
    				for (var i = 0; i < users.length; i++) {
    					var user = users[i];
    					addMarker(user.latitude, user.longitude, user.username);
    				}
    				console.log(markers);
    			}
    			else {
    				console.log(message);
    			}
    		},
    		error: function(ajax, status, error) {
    			console.log(error);
    		}
      });
    }

    function addMarker(lat, long, title) {
    	try {
	    	if (!map) throw "Map not instantiated, not adding marker!";
	    	var marker = new google.maps.Marker({
	    		map: map,
	    		animation: google.maps.Animation.DROP,
	    		position: new google.maps.LatLng(lat, long),
	    		title: title
	    	});
	    	markers.push(marker);
	    }
	    catch (ex) {
	    	console.error(ex);
	    }
    }

    google.maps.event.addDomListener(window, 'load', initialize);

	</script>	
</body>
</html>