<?php
	$userName = "bencentra"; // $_SERVER['WEBAUTH_USER'];
	$commonName = "Ben Centra"; // $_SERVER['WEBAUTH_LDAP_CN'];
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
    .navbar { box-shadow: 0 0 12px #777777; padding: 6px;}
    .gray { color: #777777; }
	</style>
</head>
<body>
	<!-- Content -->
	<div class="modal fade" id="addressModal" tabindex="-1" role="dialog" aria-labelledby="addressModal" aria-hidden="true">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
	        <h4 class="modal-title">Where You Is?</h4>
	      </div>
	      <div class="modal-body">
	      	<p><em>Provide at least your city and state/country</em></p>
	        <form role="form">
	        	<div class="form-group">
	        		<label for="addressChange">Address:</label>
	        		<input type="text" id="addressChange" class="form-control" placeholder="Boston, MA"/>
	        	</div>
					</form>
	      </div>
	      <div class="modal-footer">
	      	<div class="pull-left">
	      		<button type="button" class="btn btn-link" onclick="removeAddress();">Remove address</button>
	      	</div>
	        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
	        <button type="button" class="btn btn-primary" onclick="saveAddress();">Save changes</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
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
			      <ul class="nav navbar-nav"></ul>
			      <p class="navbar-text">Find CSH Members and Alumni Across the Globe!</p>
			      <ul class="navbar-form navbar-right">
			      	<!-- <div class="form-group">
						    <input type="text" class="form-control" placeholder="Username">
						  </div>
						  <button type="submit" class="btn btn-primary">Search</button>
						  <span class="gray">&nbsp;|&nbsp;</span> -->
			      	<button type="button" class="btn btn-info" data-toggle="modal" data-target="#addressModal">Change My Location</button>
			      </ul>
			    </div><!-- /.navbar-collapse -->
			  </div><!-- /.container-fluid -->
			</nav><!-- /.navbar -->
		</div>
	</div>
	<!-- Scripts -->
	<script src="https://code.jquery.com/jquery-2.1.0.min.js"></script>
	<script src="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJDy3u2nsUVz_l8AON489lo29SzHTEGYI"></script>
	<script>

		var uid = "<?php echo $userName; ?>";
		var cn = "<?php echo $commonName; ?>"; 

		var map = false;
		var geocoder = false;
		var markers = [];
		var center = new google.maps.LatLng(37,-97);

		function initialize() {
			var mapCanvas = document.querySelector("#map-canvas");

      var mapOptions = {
      	disableDefaultUI: true,
        center: center,
        zoom: 5
      };

      map = map || new google.maps.Map(mapCanvas, mapOptions);

      geocoder = new google.maps.Geocoder();

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
    				// Place Markers
    				for (var i = 0; i < users.length; i++) {
    					var user = users[i];
    					var title = user.common_name + " (" + user.username + ")";
    					addMarker(user.latitude, user.longitude, title);
    				}
    				console.log(markers);
    				// Check if current user is on the map
    				var found = findUser(uid, users);
    				if (found) {
    					$("#addressChange").val(found.address);
    				} 
    				else {
    					$("#addressModal").modal('show');
    				}
    			}
    			else {
    				console.error(data.message);
    			}
    		},
    		error: function(ajax, status, error) {
    			console.error(error);
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

    function removeMarker() {
    	var match = cn + " (" + uid + ")";
    	for (var i = 0; i < markers.length; i++) {
    		if (markers[i].title == match) {
    			markers[i].setMap(null);
    			markers.splice(i,1);
    			return true;
    		}
    	}
    	return false;
    }

    function findUser(username, users) {
    	for (var i = 0; i < users.length; i++) {
    		if (users[i].username == username) {
    			return users[i];
    		}
    	}
    	return false;
    }

    function saveAddress() {
    	var address = $("#addressChange").val();
    	console.log(address);
    	try {
    		if (!geocoder) throw "Geocoder no instantiated, can't lookup address!";
    		geocoder.geocode({"address":address}, function (results, status) {
	    		if (status == google.maps.GeocoderStatus.OK) {
	    			console.log(results);
	    			var location = results[0].geometry.location;
	    			var address = results[0].formatted_address;
	    			$.ajax({
	    				url: "http://localhost/csh-map/lib/add_user.php",
	    				dataType: "json", 
	    				method: "POST",
	    				data: {
	    					latitude: location.k,
	    					longitude: location.B,
	    					address: address
	    				},
	    				success: function (data, status, ajax) {
	    					console.log(data);
	    					if (data.status) {
	    						removeMarker();
	    						var title = cn + " (" + uid + ")";
	    						addMarker(location.k, location.B, title);
	    						$("#addressModal").modal('hide');
	    					}
	    					else {
	    						console.error(data.message);
	    					}
	    				},
	    				error: function (ajax, status, error) {
	    					console.error(error);
	    				}
	    			});
	    		}
	    		else {
	    			console.error(status);
	    		}
	    	});
    	}
    	catch (ex) {
    		console.error(ex);
    	}
    }

    // Initialize the map
    google.maps.event.addDomListener(window, 'load', initialize);

	</script>	
</body>
</html>