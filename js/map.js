var CSH_MAP;

(function (jq, gmaps) {

  "use strict";

  CSH_MAP = function (mapCanvas, currentUser) {

    jq(".alert").alert();
    jq(".alert").click(function() {
      hideAlert();
    });

    // var apiUrl = "https://members.csh.rit.edu/~bencentra/csh-map/api/api.php?request=";
    // var apiUrl = "http://localhost:8888/csh-map/api/";
    var apiUrl = "http://localhost/csh-map/api/"; 

    var profilesURL = "https://jdprofiles.csh.rit.edu/user";

    var map, geocoder, center, markers, names, currentInfo, myMarker;

    function initialize () {
      if (typeof map === "object") {
        console.warn("CSH_MAP already initialized.");
        return;
      }
      if (typeof jq === "undefined" || !jq) {
        console.warn("Can't initialize CSH_MAP; missing jQuery.");
        return;
      }
      if (typeof gmaps === "undefined" || !gmaps) {
        console.warn("Can't initialize CSH_MAP; missing Google Maps API.");
        return;
      }
      if (typeof mapCanvas === "object") {
        map = mapCanvas;
      }
      else if (typeof mapCanvas === "string") {
        var mapOptions = {
          disableDefaultUI: true,
          center: new gmaps.LatLng(37,-97), // Somewhere in Kansas;
          zoom: 4
        };
        map = new gmaps.Map(document.getElementById(mapCanvas), mapOptions);
      }
      else {
        console.warn("Can't initialize CSH_MAP; mapCanvas of invalid type.");
        return;
      }
      geocoder = new gmaps.Geocoder();
      markers = [];
      getAllMarkers();
    }

    function getAllMarkers() {
      jq.ajax({
        url: apiUrl+"users/group_by/location", 
        method: "GET",
        dataType: "json",
        success: function (result) {
          if (!result.status || !result.data) {
            showAlert("warn", result.message);
            return;
          }
          jq.each(result.data, function (location, users) {
            addMarker(location, users);
          });
          names = getUserNames();
          jq("#memberSearch").autocomplete({
            source: names
          });
          myMarker = findMarkerByUser(currentUser.uid);
          if (myMarker) {
            currentUser.latitude = myMarker.users[0].latitude;
            currentUser.longitude = myMarker.users[0].longitude;
            currentUser.address = myMarker.location;
            currentUser.date = "Some time";
            jq("#addressChange").val(myMarker.location);
          }
          else {
            jq("#addressModal").modal("show");
          }
        }, 
        error: ajaxError
      });
    }

    function addMarker (location, users) {
      var marker = new gmaps.Marker({
        map: map,
        animation: gmaps.Animation.DROP,
        position: new gmaps.LatLng(users[0].latitude, users[0].longitude),
        title: location
      });
      var info = createInfoWindow(marker, users);
      markers.push({
        marker: marker,
        info: info,
        users: users,
        location: location
      });
    }

    function createInfoWindow (marker, users) {
      var content = "<div id=\"infoWindow\"><h4>"+marker.title+"</h4>";
      content += "<p><button type=\"button\" onclick=\"map.zoom('"+marker.title+"')\">Zoom In</button></p>";
      jq.each(users, function(index, user) {
        content += "<p><strong>"+user.cn+"</strong> (<a href=\""+profilesURL+"/"+user.uid+"\" target=\"_blank\">"+user.uid+"</a>)</p>";
      });
      content += "</div>";
      var info = new gmaps.InfoWindow({content: content});
      gmaps.event.addListener(marker, "click", function() {
        if (currentInfo) currentInfo.close();
        info.open(map, marker);
        currentInfo = info;
      });
      return info;
    }

    function updateMyAddress() {
      if (!geocoder) return;
      var address = $("#addressChange").val();
      geocoder.geocode({address:address}, function (results, status) {
        if (status == gmaps.GeocoderStatus.OK) {
          var location = results[0].geometry.location;
          address = results[0].formatted_address;
        }
        jq.ajax({
          url: apiUrl+"users",
          method: "POST",
          dataType: "json",
          data: {
            latitude: location.k,
            longitude: location.B,
            address: address
          },
          success: function (result) {
            if (!result.status || !result.data) {
              showAlert("warn", result.message);
              return;
            }
            var oldMarker = findMarkerByUser(currentUser.uid);
            if (oldMarker) {
              removeMeFromMarker(oldMarker);
              updateOrRemoveMarker(oldMarker);
            }
            currentUser.address = address;
            currentUser.latitude = location.k;
            currentUser.longitude = location.B;
            currentUser.date = "Just Now";
            var existingMarker = findMarkerByLocation(address);
            if (existingMarker) {
              existingMarker.users.push(currentUser);
              existingMarker.info = createInfoWindow(existingMarker.marker, existingMarker.users);
            }
            else {
              var users = [currentUser];
              addMarker(address, users);
            }
            names = getUserNames();
            jq("#memberSearch").autocomplete({
              source: names
            });
            jq("#addressChange").val(address);
            jq("#addressModal").modal("hide");
            showAlert("success", "Address updated successfully!");
          },
          error: ajaxError
        });
      }); 
    }

    function removeMeFromMap() {
      myMarker = myMarker || findMarkerByUser(currentUser.uid);
      if (!myMarker) return;
      jq.ajax({
        url: apiUrl+"users",
        method: "DELETE",
        dataType: "json",
        success: function (result) {
          if (!result.status || !result.data) {
            showAlert("warn", result.message);
            return;
          }
          removeMeFromMarker(myMarker);
          updateOrRemoveMarker(myMarker);
          currentUser.address = "";
          currentUser.latitude = 0;
          currentUser.longitude = 0;
          currentUser.date = "Just Now";
          names = getUserNames();
          jq("#memberSearch").autocomplete({
            source: names
          });
          jq("#addressChange").val("");
          jq("#addressModal").modal("hide");
          showAlert("success", "Address removed successfully!");
        },
        error: ajaxError
      });
    }

    function removeMeFromMarker (marker) {
      for (var i = 0; i < marker.users.length; i++) {
        var user = marker.users[i];
        if (user.uid == currentUser.uid) {
          marker.users.splice(i, 1);
          break;
        }
      }
    }

    function updateOrRemoveMarker (marker) {
      if (marker.users.length > 0) {
        marker.info = createInfoWindow(marker.marker, marker.users);
      }
      else {
        marker.marker.setMap(null);
        marker = false;
      }
    }

    function findMarkerByUser (uid) {
      var found = false;
      jq.each(markers, function (index, marker) {
        jq.each(marker.users, function (index, user) {
          if (user.uid == uid) {
            found = marker;
          }
        }); 
      });
      return found;
    }

    function findMarkerByLocation (loc) {
      var found = false;
      jq.each(markers, function (index, marker) {
        if (marker.location == loc) {
          found = marker;
        }
      });
      return found;
    }

    function getUserNames () {
      var userNames = [];
      jq.each(markers, function (location, marker) {
        jq.each(marker.users, function (index, user) {
          userNames.push(user.cn + " (" + user.uid + ")");
        });
      });
      return userNames;
    }

    function ajaxError (error) {
      console.error(error);
    }

    function searchUsers (search) {
      var uid = search.split("(")[1].split(")")[0].trim();
      var marker = findMarkerByUser(uid);
      if (marker) {
        centerMapOnMarker(marker);
      }
      else {
        showAlert("warn", "Unable to find user \""+uid+"\", please try again.");
      }
    }

    function centerMapOnLocation (loc) {
      var marker = findMarkerByLocation(loc);
      centerMapOnMarker(marker);
    }

    function centerMapOnMarker (marker) {
      gmaps.event.trigger(marker.marker, "click");
      map.setCenter(marker.marker.getPosition());
      map.setZoom(12);
    }

    function changeMapType (type) {
      if (!map) return;
      switch (type) {
        case "satellite":
          map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
          break;
        case "hybrid":
          map.setMapTypeId(google.maps.MapTypeId.HYBRID);
          break;
        case "terrain":
          map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
          break;
        default:
          map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      }
    }

    function hideAlert() {
      jq("#alert").hide();
    }

    function showAlert(status, message) {
      jq("#alert .alert-title").html((status == "warn") ? "Warning!" : "Success!");
      jq("#alert .alert-text").html(message);
      var add = (status == "warn") ? "alert-danger" : "alert-success";
      var remove = (status == "warn") ? "alert-success" : "alert-danger";
      jq("#alert").addClass(add).removeClass(remove).show();
    }

    return {
      init: initialize,
      updateAddress: updateMyAddress,
      removeAddress: removeMeFromMap,
      changeType: changeMapType,
      search: searchUsers,
      zoom: centerMapOnLocation
    }

  };

}) (window.jQuery, window.google.maps);