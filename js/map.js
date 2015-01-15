(function (window, console, jq, gmaps) {

  "use strict";

  window.CSH_MAP = function (mapCanvas, currentUser) {

    jq(".alert").alert();
    jq(".alert").click(function() {
      hideAlert();
    });

    var apiUrl = window.CSH_MAP_CONFIG["apiUrl"] || false;
    var profilesURL = window.CSH_MAP_CONFIG["profilesURL"] || false;
    var map, geocoder, center, markers, names, currentInfo, myMarker, locations, searchType;

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
      getAllLocations();
      searchType = "name";
    }

    function getAllLocations() {
      jq.ajax({
        url: apiUrl+"locations",
        method: "GET",
        dataType: "json",
        success: function (result) {
          if (!result.status || !result.data) {
            showAlert("warn", result.message);
            return;
          }
          locations = result.data;
        },
        error: ajaxError
      });
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
          getUserNames();
          myMarker = findMarkerByUser(currentUser.uid);
          if (myMarker) {
            currentUser.latitude = myMarker.users[0].latitude;
            currentUser.longitude = myMarker.users[0].longitude;
            currentUser.address = myMarker.location;
            currentUser.date = findUserInMarker(currentUser.uid, myMarker).date;
            jq("#addressChange").val(myMarker.location);
            showUpdatePopover(myMarker);
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
        var date = Date.parse(user.date);
        date = new Date(date).toDateString();
        content += "<p><strong>"+user.cn+"</strong> (<a href=\""+CSH_MAP_CONFIG.profilesUrl+"/"+user.uid+"\" target=\"_blank\">"+user.uid+"</a>) <span class=\"gray small\"> - Last Updated: "+date+"</span></p>";
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
      var address, location;
      if (!geocoder) return;
      address = $("#addressChange").val();
      geocoder.geocode({address:address}, function (results, status) {
        if (status == gmaps.GeocoderStatus.OK) {
          location = results[0].geometry.location;
          address = results[0].formatted_address;
        }
        console.log(location);
        jq.ajax({
          url: apiUrl+"users",
          method: "POST",
          dataType: "json",
          data: {
            latitude: location.k,
            longitude: location.D,
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
            currentUser.longitude = location.D;
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
            getUserNames();
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
          getUserNames();
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
        if (user.uid === currentUser.uid) {
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
          if (user.uid === uid) {
            found = marker;
          }
        }); 
      });
      return found;
    }

    function findMarkerByLocation (loc) {
      var found = false;
      jq.each(markers, function (index, marker) {
        if (marker.location === loc) {
          found = marker;
        }
      });
      return found;
    }

    function findUserInMarker(uid, marker) {
      var found = false;
      jq.each(marker.users, function(i, user) {
        if (user.uid === uid) {
          found = user;
        }
      });
      return found;
    }

    function getUserNames () {
      var userNames = [];
      jq.each(markers, function (i, marker) {
        jq.each(marker.users, function (index, user) {
          userNames.push(user.cn + " (" + user.uid + ")");
        });
      });
      names = userNames;
      jq("#searchValue").autocomplete({
        source: names
      });
    }

    function getLocationNames () {
      var locationNames = []
      for (var i = 0; i < locations.length; i++) {
        locationNames.push(locations[i].address);
      }
      console.log(locationNames);
      jq("#searchValue").autocomplete({
        source: locationNames
      });
    }

    function ajaxError (error) {
      console.error(error);
    }

    function changeSearchType (type) {
      type = type.toLowerCase();
      if (type === "name") {
        searchType = type;
        jq("#searchValue").attr("placeholder", "Real Name or Username...").val("");
        getUserNames();
      }
      else if (type === "location") {
        searchType = type;
        jq("#searchValue").attr("placeholder", "City, State, etc...").val("");
        getLocationNames();
      }
      else {
        console.warn("Invalid search type");
      }
    }

    function search (search) {
      jq("#searchModal").modal("hide");
      jq("#searchValue").autocomplete("close");
      if (searchType === "name") {
        searchUsers(search);
      }
      else if (searchType === "location") {
        searchLocations(search);
      }
      else {
        console.warn("Invalid search type");
      }
    }

    function searchUsers (search) {
      try {
        var uid = search.split("(")[1].split(")")[0].trim();
        var marker = findMarkerByUser(uid);
        if (marker) {
          centerMapOnMarker(marker);
        }
        else {
          showAlert("warn", "Unable to find user \""+uid+"\", please try again.");
        }
      }
      catch (e) {
        showAlert("warn", "Unable to find user \""+search+"\", please try again.");
      }
    }

    function searchLocations (search) {
      var location = search.trim();
      var marker = findMarkerByLocation(location);
      if (marker) {
        centerMapOnMarker(marker);
      }
      else {
        showAlert("warn", "Unable to find location \""+location+"\", please try again.");
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

    function showUpdatePopover(marker) {
      var me, i, date, now;
      for (i = 0; i < marker.users.length; i++) {
        if (marker.users[i].uid === currentUser.uid) {
          me = marker.users[i];
          break;
        }
      }
      if (typeof me === "undefined") return;
      date = Date.parse(me.date);
      now = Date.now();
      if ((now - date) > (2628000000 * 6)) {
        jq("#popoverBtn").popover({
          html: true,
          content: "<div class='center'><strong>Looks like it's been a while.</strong><br/> Is your address up to date?</div>"
        }).popover('show');
        jq(".popover").css("top", "60px");
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
      changeMapType: changeMapType,
      changeSearchType: changeSearchType,
      search: search,
      // searchLocation: searchLocations,
      zoom: centerMapOnLocation
    };

  };

}) (window, window.console, window.jQuery, window.google.maps);