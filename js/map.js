var CSH_MAP = function(id, user) {

  // Activate alerts
  $(".alert").alert();
  $(".alert").click(function() {
    hideAlert();
  });

  // API url
  // var apiUrl = "https://members.csh.rit.edu/~bencentra/csh-map/api/api.php?request=";
  // var apiUrl = "http://localhost:8888/csh-map/api/";
  var apiUrl = "http://localhost/csh-map/api/"; 

  // Profiles url
  var profilesURL = "https://jdprofiles.csh.rit.edu/user";

  // Map components
  var map, geocoder, center, currentUser, users, userNames, currentInfo;
  
  // Initialize the map
  function initialize() {
    users = [];
    currentUser = user;
    var mapOptions = {
      disableDefaultUI: true,
      center: new google.maps.LatLng(37,-97), // Somewhere in Kansas;
      zoom: 4
    };
    map = map || new google.maps.Map(document.getElementById(id), mapOptions);
    geocoder = new google.maps.Geocoder();
    addMarkers();
  }

  function deleteAddress() {
    $.ajax({
      url: apiUrl+"users",
      dataType: "json",
      method: "DELETE",
      success: function (data, status, ajax) {
        if (data.status) {
          removeMarker(currentUser);
          showAlert('success', data.message);
          $("#addressModal").modal('hide');
        }
        else {
          showAlert('warn', data.message);
          $("#addressModal").modal('hide');
        }
      },
      error: function(ajax, status, error) {
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
          var location = results[0].geometry.location;
          var address = results[0].formatted_address;
          $.ajax({
            url: apiUrl+"users",
            dataType: "json", 
            method: "POST",
            data: {
              latitude: location.k,
              longitude: location.B,
              address: address
            },
            success: function (data, status, ajax) {
              if (data.status) {
                currentUser.latitude = location.k;
                currentUser.longitude = location.B;
                currentUser.address = address;
                currentUser.date = "Just Now";
                removeMarker(currentUser);
                addMarker(currentUser);
                showAlert('success', data.message);
                $("#addressModal").modal('hide');
              }
              else {
                showAlert('warn', data.message);
                $("#addressModal").modal('hide');
              }
            },
            error: function (ajax, status, error) {
              showAlert('warn', error);
              $("#addressModal").modal('hide');
            }
          });
        }
        else {
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
      url: apiUrl+"users",
      dataType: "json",
      method: "GET",
      success: function(data, status, ajax) {
        if (data.status) {
          users = data.data;
          userNames = $.map(users, function(user) { 
            return user.cn+" ("+user.uid+")"; 
          });
          $("#memberSearch").autocomplete({
            source: userNames
          });
          for (var i = 0; i < users.length; i++) {
            var user = users[i];
            addMarker(user);
          }
          var found = findUserByUsername(currentUser.uid);
          if (found) {
            $("#addressChange").val(found.address);
          } 
          else {
            $("#addressModal").modal('show');
          }
        }
        else {
          showAlert('warn', data.message);
        }
      },
      error: function(ajax, status, error) {
        showAlert('warn', error);
      }
    });
  }

  function addMarker(user) {
    try {
      if (!map) throw "Map not instantiated, not adding marker!";
      var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(user.latitude, user.longitude),
        title: user.cn + " (" + user.uid + ")"
      });
      var content = '<h4>'+user.cn+'</h4>'+
        '<p><a href="'+profilesURL+'/'+user.uid+'" target="_blank">'+user.uid+'</a></p>'+
        '<p>'+user.address+'</p>'+
        '<p class="small gray">Last Updated: '+user.date+'</p>';
      var info = new google.maps.InfoWindow({content: content});
      google.maps.event.addListener(marker, 'click', function() { 
        info.open(map, marker); 
        map.setCenter(marker.position);
        map.setZoom(12);
      });
      user.marker = marker;
      user.info = info;
    }
    catch (ex) {
      console.error(ex);
    }
  }

  function removeMarker(user) {
    var match = user.cn + " (" + user.uid + ")";
    for (var i = 0; i < users.length; i++) {
      if (users[i].marker.title == match) {
        users[i].marker.setMap(null);
        users[i].marker = null;
        return true;
      }
    }
    return false;
  }

  function findUserByUsername(username) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].uid == username) {
        return users[i];
      }
    }
    return false;
  }

  function findUserByCommonName(commonName) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].cn == commonName) {
        return users[i];
      }
    }
    return false;
  }

  function centerMap(user) {
    try {
      if (!map) throw "Map not instantiated, not centering map!";
      if (currentInfo) currentInfo.close();
      google.maps.event.trigger(user.marker, 'click');
      currentInfo = user.info;
    }
    catch (ex) {
      console.error(ex);
    }
  }

  function changeMapType(type) {
    try {
      if (!map) throw "Map not instantiated, not changing map type!";
      switch (type) {
        case 'satellite':
          map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
          break;
        case 'hybrid':
          map.setMapTypeId(google.maps.MapTypeId.HYBRID);
          break;
        case 'terrain':
          map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
          break;
        default:
          map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      }
    }
    catch (ex) {
      console.error(ex);
    }
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
      return initialize();
    },
    updateAddress: function() {
      return saveAddress();
    },
    removeAddress: function() {
      return deleteAddress();
    },
    changeType: function(type) {
      return changeMapType(type);
    },
    center: function(name) {
      name = name.split("(")[1].split(")")[0].trim();
      user = findUserByUsername(name);
      if (user) {
        return centerMap(user);
      }
      else {
        showAlert('warn', 'Unable to find user with name "'+name+'", please try again.');
      }
    }
  };

};