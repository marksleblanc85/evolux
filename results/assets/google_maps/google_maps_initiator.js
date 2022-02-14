(function() {
  var VertiportsAccordeon, base_map_initiator;

  window.home_map_initiator = {
    initialize: function() {
      base_map_initiator(function(markers) {
        var googleMap, page;
        page = "home";
        googleMap = new window.GoogleMap(page, "#home_gmap", markers);
        googleMap.addMarkers();
        return googleMap.searchForm.initializeUpdateFormEvents(page);
      });
      return true;
    }
  };

  window.trips_map_initiator = {
    initialize: function() {
      var page;
      page = "results";
      window.resultGMap = new window.GoogleMap(page, "#results_gmap", gon.markers);
      window.resultGMap.addMarkersWithNumbers();
      window.resultGMap.searchForm.initializeUpdateFormEvents(page);
      window.resultGMap.drawTripOnMap();
      return true;
    }
  };

  window.users_map_initiator = {
    initialize: function(container_id, gmap_id) {
      base_map_initiator(function(markers) {
        var googleMap, vertiportsAccordeon;
        googleMap = new GoogleMap("user_signin", gmap_id, markers);
        vertiportsAccordeon = new VertiportsAccordeon(container_id, googleMap);
        vertiportsAccordeon.listenCheckVertiport();
        vertiportsAccordeon.drawMarkersForCheckedVertiports();
        return vertiportsAccordeon.listenChangeRegion();
      });
      return true;
    }
  };

  base_map_initiator = function(init_map_func) {
    $.get('/load_gmaps_markers.json', (function(data) {
      init_map_func(data.markers);
      return true;
    }), 'json');
    return true;
  };

  VertiportsAccordeon = (function() {
    function VertiportsAccordeon(container, googleMap) {
      this.googleMap = googleMap;
      this.container = $(container);
    }

    VertiportsAccordeon.prototype.listenCheckVertiport = function() {
      var checkbox, googleMap;
      googleMap = this.googleMap;
      checkbox = this.container.find('.vertiport-groups-vertiports input');
      return checkbox.change(function() {
        if (this.checked) {
          googleMap.addMarkerByVertiportId(this.value);
          return googleMap.fitZoom();
        } else {
          googleMap.removeMarkerByVertiportId(this.value);
          return googleMap.fitZoom();
        }
      });
    };

    VertiportsAccordeon.prototype.drawMarkersForCheckedVertiports = function() {
      var checked_vertiports, googleMap, region;
      googleMap = this.googleMap;
      region = this.container.find('select#region').val();
      checked_vertiports = this.container.find(".vertiport_region_" + region + " .vertiport-groups-cities input:checked");
      if (checked_vertiports.length > 0) {
        $.each(checked_vertiports, function(i, vert) {
          return googleMap.addMarkerByVertiportId(vert.value);
        });
        return googleMap.fitZoom();
      }
    };

    VertiportsAccordeon.prototype.listenChangeRegion = function() {
      var googleMap, vertiportsAccordeon;
      googleMap = this.googleMap;
      vertiportsAccordeon = this;
      return this.container.find('select#region').change(function() {
        googleMap.removeMarkers();
        return vertiportsAccordeon.drawMarkersForCheckedVertiports();
      });
    };

    return VertiportsAccordeon;

  })();

}).call(this);
