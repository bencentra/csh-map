var CSH_MAP = function(user) {

  // Activate alerts
  $("#alert").alert();
  $("#alert").click(function() {
    hideAlert();
  });

  /*
  * Private variables and functions
  */
  var apiUrl = "http://localhost/csh-map/api/"; //"http://localhost:8888/csh-map/api/";
  var profilesURL = "https://jdprofiles.csh.rit.edu/user";
  var map, geocoder, info;
  var users = [];
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
      url: apiUrl+"users",
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
            url: apiUrl+"users",
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
      url: apiUrl+"users",
      dataType: "json",
      method: "GET",
      success: function(data, status, ajax) {
        console.log(data);
        if (data.status) {
          users = data.data;
          searchUsers();
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
        map.setZoom(12);
        map.setCenter(marker.position);
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

  function searchUsers(search) {
    if (typeof search === "undefined") search = "";
    search = ""+search.toLowerCase().trim();
    var len = search.length;
    var results = [];
    $("#members").html("");
    if (len == 0) {
      for (var i = 0; i < users.length; i++) {
        var match = users[i].cn+' ('+users[i].uid+')';
        $("#members").append('<option value="'+match+'">'+match+'</option>');
      }
      return false;
    }
    for (var i = 0; i < users.length; i++) {
      var match = users[i].cn+' ('+users[i].uid+')';
      var matchLow = match.toLowerCase();
      if (match.indexOf(search) > -1) {
        results.push(users[i]);
        $("#members").append('<option value="'+match+'">'+match+'</option>');
      }
    }
    return results;
  }

  function centerMap(user) {
    try {
      if (!map) throw "Map not instantiated, not centering map!";
      map.setCenter(new google.maps.LatLng(user.latitude, user.longitude));
      map.setZoom(12);
      google.maps.event.trigger(user.marker, 'click');
    }
    catch (ex) {
      console.error(ex);
    }
  }

  function changeMapType(type) {
    try {
      if (!map) throw "Map not instantiated, not changing map type!";
      console.log(type);
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
    search: function(search) {
      return searchUsers(search);
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