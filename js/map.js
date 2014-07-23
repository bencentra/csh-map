var CSH_MAP = function(user) {

  // Activate alerts
  $("#alert").alert();
  $("#alert").click(function() {
    hideAlert();
  });

  /*
  * Private variables and functions
  */
  var apiUrl = "http://localhost/csh-map/api/";
  var map, geocoder, info;
  var markers = [];
  var currentUser = user;
  var center = new google.maps.LatLng(37,-97); // Somewhere in Kansas
  
  function initialize() {
    var mapOptions = {
      disableDefaultUI: true,
      center: center,
      zoom: 4
    };
    map = map || new google.maps.Map(document.querySelector("#map-canvas"), mapOptions);
    geocoder = new google.maps.Geocoder();
    addMarkers();
  }

  function deleteAddress() {
    $.ajax({
      url: apiUrl+"/users",
      dataType: "json",
      method: "DELETE",
      success: function (data, status, ajax) {
        console.log(data);
        if (data.status) {
          removeMarker(currentUser);
          showAlert('success', data.message);
          $("#addressModal").modal('hide');
        }
        else {
          console.error(data.message);
          showAlert('warn', data.message);
          $("#addressModal").modal('hide');
        }
      },
      error: function(ajax, status, error) {
        console.log(error);
        showAlert('warn', error);
        $("#addressModal").modal('hide');
      }
    })
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
            url: apiUrl+"/users",
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
                removeMarker(currentUser);
                addMarker(location.k, location.B, currentUser);
                showAlert('success', data.message);
                $("#addressModal").modal('hide');
              }
              else {
                console.error(data.message);
                showAlert('warn', data.message);
                $("#addressModal").modal('hide');
              }
            },
            error: function (ajax, status, error) {
              console.error(error);
              showAlert('warn', error);
              $("#addressModal").modal('hide');
            }
          });
        }
        else {
          console.error(status);
          showAlert('warn', "Error geocoding your address, please try again!");
          $("#addressModal").modal('hide');
        }
      });
    }
    catch (ex) {
      console.error(ex);
    }
  }

  function addMarkers() {
    $.ajax({
      url: apiUrl+"/users",
      dataType: "json",
      method: "GET",
      success: function(data, status, ajax) {
        console.log(data);
        if (data.status) {
          var users = data.data;
          // Place Markers
          for (var i = 0; i < users.length; i++) {
            var user = users[i];
            addMarker(user.latitude, user.longitude, user);
          }
          console.log(markers);
          // Check if current user is on the map
          var found = findUser(currentUser.uid, users);
          if (found) {
            $("#addressChange").val(found.address);
          } 
          else {
            $("#addressModal").modal('show');
          }
        }
        else {
          console.error(data.message);
          showAlert('warn', data.message);
        }
      },
      error: function(ajax, status, error) {
        console.error(error);
        showAlert('warn', error);
      }
    });
  }

  function addMarker(lat, long, user) {
    try {
      if (!map) throw "Map not instantiated, not adding marker!";
      var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(lat, long),
        title: user.cn + " (" + user.uid + ")"
      });
      var content = "<h4>"+user.cn+"</h4>"+
        "<p><strong>"+user.uid+"</strong></p>"+
        "<p>"+user.address+"</p>";
      var info = new google.maps.InfoWindow({content: content});
      google.maps.event.addListener(marker, 'click', function() { info.open(map, marker); });
      markers.push(marker);
    }
    catch (ex) {
      console.error(ex);
    }
  }

  function removeMarker(user) {
    var match = user.cn + " (" + user.uid + ")";
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
      if (users[i].uid == username) {
        return users[i];
      }
    }
    return false;
  }

  function hideAlert() {
    $("#alert").hide();
  }

  function showAlert(status, message) {
    $("#alert .alert-title").html((status == 'warn') ? "Warning!" : "Success!");
    $("#alert .alert-text").html(message);
    var add = (status == 'warn') ? 'alert-danger' : 'alert-success';
    var remove = (status == 'warn') ? 'alert-success' : 'alert-danger';
    $("#alert").addClass(add).removeClass(remove).show();
  }

  return {
    initializeMap: function() {
      initialize();
    },
    updateAddress: function() {
      saveAddress();
    },
    removeAddress: function() {
      deleteAddress();
    }
  };

};