(function() {
  this.GoogleMap = (function() {
    var TripMarker;

    function GoogleMap(page, mapContainer, markersData) {
      var defaultCenter,
        _this = this;
      this.page = page;
      this.mapContainer = mapContainer;
      this.markersData = markersData;
      defaultCenter = {
        lat: 25.8155,
        lng: -80.341644
      };
      this.center = this.tryToLocalizeCenter() || defaultCenter;
      this.gmap = new GMaps({
        div: this.mapContainer,
        lat: this.center.lat,
        lng: this.center.lng,
        zoom: 11
      });
      this.searchForm.initialize(this);
      this.searchForm.add_results_scroll_buttons();
      this.map = this.gmap.map;
      this.infoBox = new GMInfoBox(this);
      this.markers = [];
      window.helper.showLoading();
      google.maps.event.addListenerOnce(this.map, 'tilesloaded', function() {
        return window.helper.hideLoading();
      });
      true;
    }

    GoogleMap.prototype.showLoading = function() {
      return $(this.mapContainer).showLoading();
    };

    GoogleMap.prototype.hideLoading = function() {
      return $(this.mapContainer).hideLoading();
    };

    GoogleMap.prototype.tryToLocalizeCenter = function() {
      var vertiport, _ref, _ref1;
      vertiport = ((_ref = $("#trip_aircraft_finder_departute")) != null ? _ref.val() : void 0) || ((_ref1 = $("#trip_aircraft_finder_arrival")) != null ? _ref1.val() : void 0);
      if (vertiport != null ? vertiport.length : void 0) {
        return window.helper.where(this.markersData.vertiports, {
          title: vertiport
        })[0] || null;
      } else {
        return null;
      }
    };

    GoogleMap.prototype.addMarkers = function() {
      var options;
      options = this.buildMarkersOptions();
      this.markers = this.gmap.addMarkers(options);
      return this.markerCluster = new MarkerClusterer(this.map, this.markers, this.markerClusterOptions);
    };

    GoogleMap.prototype.markerClusterOptions = {
      maxZoom: 10
    };

    GoogleMap.prototype.buildMarkersOptions = function() {
      var options,
        _this = this;
      return options = this.markersData.vertiports.map(function(vert, i) {
        return {
          optimized: false,
          zIndex: 300,
          lat: vert.lat,
          lng: vert.lng,
          title: vert.title,
          icon: vert.icon,
          id: vert.id,
          click: function(e) {
            _this.infoBox.create(vert);
            return _this.markerWithOpenedIB = _this.infoBox.open(e);
          }
        };
      });
    };

    GoogleMap.prototype.addMarkersWithNumbers = function() {
      if (this.markersData.vertiports.length) {
        this.markers = this.buildMarkersWithNumbers();
        this.markerCluster = new MarkerClusterer(this.map, this.markers, this.markerClusterOptions);
      }
      return true;
    };

    GoogleMap.prototype.buildMarkersWithNumbers = function() {
      var icon, markers,
        _this = this;
      icon = this.markersData.helicopter_icon;
      markers = [];
      this.markerListiners = {};
      $.each(this.markersData.vertiports, function(i, vert) {
        var marker;
        marker = new MarkerWithLabel({
          optimized: false,
          zIndex: 300,
          map: _this.map,
          position: new google.maps.LatLng(vert.lat, vert.lng),
          title: vert.title,
          icon: icon,
          id: vert.id,
          location: vert.location,
          labelContent: "" + vert.aircrafts,
          labelAnchor: new google.maps.Point(-13, 76),
          labelClass: "gmap-marker-label"
        });
        _this.markerListiners[vert.id] = google.maps.event.addListener(marker, 'click', function() {
          _this.infoBox.create(vert);
          return _this.infoBox.open(marker);
        });
        return markers.push(marker);
      });
      return markers;
    };

    GoogleMap.prototype.fitBounds = function(locations) {
      var bounds;
      if (locations.length) {
        bounds = new google.maps.LatLngBounds();
        $.each(locations, function(i, loc) {
          var lat, lng, _ref, _ref1, _ref2, _ref3;
          lat = loc.lat || ((_ref = loc.getPosition()) != null ? _ref.lat() : void 0) || ((_ref1 = loc.position) != null ? _ref1.lat() : void 0);
          lng = loc.lng || ((_ref2 = loc.getPosition()) != null ? _ref2.lng() : void 0) || ((_ref3 = loc.position) != null ? _ref3.lng() : void 0);
          return bounds.extend(new google.maps.LatLng(lat, lng));
        });
        return this.gmap.fitBounds(bounds);
      }
    };

    GoogleMap.prototype.fitZoom = function() {
      if (this.markers) {
        if (this.markers.length > 1) {
          return this.gmap.fitZoom();
        } else if (this.markers.length === 1) {
          this.gmap.setCenter(this.markers[0].getPosition().lat(), this.markers[0].getPosition().lng());
          return this.gmap.setZoom(10);
        } else {
          this.gmap.setCenter(this.center.lat, this.center.lng);
          return this.gmap.setZoom(10);
        }
      }
    };

    GoogleMap.prototype.onZoomChanged = function() {
      var _this = this;
      return google.maps.event.addListener(this.map, 'zoom_changed', function() {
        if (_this.markerWithOpenedIB) {
          return _this.zoomToMarker(_this.markerWithOpenedIB, true);
        }
      });
    };

    GoogleMap.prototype.zoomToMarker = function(marker, openIB) {
      var lat, lng,
        _this = this;
      if (openIB == null) {
        openIB = false;
      }
      lat = marker.lat === void 0 ? marker.getPosition().lat() : marker.lat;
      lng = marker.lng === void 0 ? marker.getPosition().lng() : marker.lng;
      if (openIB) {
        this.map.panTo({
          lat: lat,
          lng: lng
        });
        this.map.panBy(-190, -80);
        if (this.idle) {
          google.maps.event.removeListener(this.idle);
        }
        return this.idle = google.maps.event.addListenerOnce(this.map, 'idle', function() {
          if (marker.ib) {
            if (marker.ib.getVisible() === false) {
              return marker.openIB();
            }
          } else {
            return _this.openMarkerIB(marker);
          }
        });
      } else {
        return this.gmap.setCenter(lat, lng);
      }
    };

    GoogleMap.prototype.addMarkerByVertiportId = function(id) {
      var marker;
      marker = window.helper.where(this.markersData.vertiports, {
        id: parseInt(id)
      });
      return this.markers.push(this.gmap.addMarker({
        lat: marker[0].lat,
        lng: marker[0].lng,
        title: marker[0].title,
        id: marker[0].id
      }));
    };

    GoogleMap.prototype.removeMarkerByVertiportId = function(id) {
      var rm_marker;
      rm_marker = window.helper.where(this.markers, {
        id: parseInt(id)
      });
      this.markers = this.markers.filter(function(marker) {
        return marker.id !== rm_marker[0].id;
      });
      this.gmap.removeMarker(rm_marker[0]);
      return this.gmap.fitZoom();
    };

    GoogleMap.prototype.findMarkerByVertiportId = function(id) {
      var marker;
      return marker = window.helper.where(this.markers, {
        id: parseInt(id)
      })[0] || null;
    };

    GoogleMap.prototype.findMarkerByVertiportName = function(name) {
      var _ref, _ref1;
      if (((_ref = this.departure) != null ? _ref.tripMarker.title : void 0) === name) {
        return null;
      }
      if (((_ref1 = this.arrival) != null ? _ref1.tripMarker.title : void 0) === name) {
        return null;
      }
      return window.helper.where(this.markers, {
        title: name
      })[0] || null;
    };

    GoogleMap.prototype.removeMarkers = function() {
      if (this.markerCluster) {
        this.markerCluster.clearMarkers();
      }
      if (this.markers) {
        this.gmap.removeMarkers();
      }
      if (this.departure) {
        this.departure.marker.setMap(null);
      }
      if (this.arrival) {
        this.arrival.marker.setMap(null);
      }
      if (this.line) {
        this.line.setMap(null);
      }
      this.markerCluster = null;
      this.markers = [];
      this.departure = null;
      this.arrival = null;
      return true;
    };

    GoogleMap.prototype.openMarkerIB = function(marker) {
      return google.maps.event.trigger(marker, 'click');
    };

    GoogleMap.prototype.draw_line = function(positions) {
      var lineSymbol, path;
      path = positions.map(function(p, i) {
        return new google.maps.LatLng(p.lat, p.lng);
      });
      lineSymbol = {
        path: 'M 0,-3 0,3',
        strokeOpacity: 1,
        scale: 3
      };
      return new google.maps.Polyline({
        path: path,
        strokeColor: '#13507b',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: this.map,
        zIndex: 1000
      });
    };

    TripMarker = (function() {
      function TripMarker(googleMap, vertiport, is_departure) {
        this.googleMap = googleMap;
        this.vertiport = vertiport;
        this.is_departure = is_departure;
        this.markersData = this.googleMap.markersData;
        this.lat = this.vertiport.lat;
        this.lng = this.vertiport.lng;
        this.marker = this.is_departure ? this.vertiport.aircrafts === 0 ? this.addTripMarker(this.markersData.departure_icon) : this.addTripMarkerWithNumber(this.markersData.departure_number_icon) : this.vertiport.aircrafts === 0 ? this.addTripMarker(this.markersData.arrival_icon) : this.addTripMarkerWithNumber(this.markersData.arrival_number_icon);
        this.addTripMarkerEvents();
        this.openIBOnUpdate();
      }

      TripMarker.prototype.addTripMarker = function(icon) {
        if (icon == null) {
          icon = this.markersData.departure_icon;
        }
        return this.googleMap.gmap.addMarker({
          optimized: false,
          zIndex: 400,
          icon: {
            url: icon,
            anchor: new google.maps.Point(42, 40)
          },
          lat: this.vertiport.lat,
          lng: this.vertiport.lng,
          title: this.vertiport.title,
          id: this.vertiport.id,
          location: this.vertiport.location
        });
      };

      TripMarker.prototype.addTripMarkerWithNumber = function(icon) {
        if (icon == null) {
          icon = this.markersData.departure_icon;
        }
        return new MarkerWithLabel({
          optimized: false,
          zIndex: 400,
          map: this.googleMap.map,
          position: new google.maps.LatLng(this.vertiport.lat, this.vertiport.lng),
          title: this.vertiport.title,
          icon: {
            url: icon,
            anchor: new google.maps.Point(44, 60)
          },
          id: this.vertiport.id,
          location: this.vertiport.location,
          labelContent: "" + this.vertiport.aircrafts,
          labelAnchor: new google.maps.Point(-36, 56),
          labelClass: "gmap-marker-label"
        });
      };

      TripMarker.prototype.addTripMarkerEvents = function() {
        var _this = this;
        return google.maps.event.addListener(this.marker, 'click', function() {
          _this.ib = _this.googleMap.infoBox.create(_this.vertiport);
          return _this.googleMap.infoBox.open(_this.marker);
        });
      };

      TripMarker.prototype.openIBOnUpdate = function() {
        if (this.is_departure) {
          this.googleMap.infoBox.create(this.vertiport);
          this.googleMap.infoBox.open(this.marker);
          return true;
        }
      };

      return TripMarker;

    })();

    GoogleMap.prototype.drawTripOnMap = function() {
      var arrival, departure, markers;
      departure = this.markersData.departure;
      arrival = this.markersData.arrival;
      if (departure) {
        this.departure = new TripMarker(this, this.markersData.departure, true);
      }
      if (arrival) {
        this.arrival = new TripMarker(this, this.markersData.arrival, false);
      }
      if (this.line) {
        this.line.setMap(null);
      }
      if (this.departure && this.arrival) {
        this.line = this.draw_line([this.departure, this.arrival]);
        markers = [this.departure.marker, this.arrival.marker].concat(this.markers);
        this.fitBounds(markers);
      } else {
        if (this.departure) {
          this.zoomToMarker(this.departure);
        }
        if (this.arrival) {
          this.zoomToMarker(this.arrival);
        }
      }
      return true;
    };

    GoogleMap.prototype.updateInfoWindow = function(infoWindow) {
      if (this.page === "results") {
        return $(".google-map-full").data("infoWindow", infoWindow);
      }
    };

    GoogleMap.prototype.updateMapOnPageLoad = function() {
      var searchForm;
      searchForm = this.searchForm;
      return google.maps.event.addListenerOnce(this.map, 'tilesloaded', function() {
        return searchForm.submitForm("yes");
      });
    };

    GoogleMap.prototype.updateMap = function(vertiportName) {
      var marker;
      marker = this.findMarkerByVertiportName(vertiportName);
      if (marker) {
        this.zoomToMarker(marker, true);
      }
      return marker;
    };

    GoogleMap.prototype.searchForm = {
      initialize: function(googleMap) {
        this.googleMap = googleMap;
        this.form = $("#trip_aircraft_finder_form");
        this.departure = this.form.find("#trip_aircraft_finder_departute");
        this.arrival = this.form.find("#trip_aircraft_finder_arrival");
        this.stop_button = this.form.find("#trip_aircraft_finder_add_stop_link");
        this.departure_date = this.form.find("#trip_aircraft_finder_departure_date");
        this.departure_time = this.form.find("#trip_aircraft_finder_departure_time");
        this.initializeFocusEvent();
        return this.focused = this.form.find("input.focused");
      },
      updateFocusedVal: function(val) {
        var field;
        field = this.focused.refresh();
        field.val(val);
        return this.form.getFormValidator().updateStatus(field, 'NOT_VALIDATED').validateField(field);
      },
      updateDepartureVal: function(val) {
        return this.departure.val(val);
      },
      updateShareFlights: function() {
        if (this.googleMap.page === "home") {
          $.get("shared_flights", {
            flight: {
              departure: this.departure.refresh().val(),
              arrival: this.arrival.refresh().val(),
              departure_date: this.departure_date.refresh().val(),
              departure_time: this.departure_time.refresh().val()
            }
          });
        }
        return true;
      },
      initializeUpdateFormEvents: function(page) {
        var googleMap,
          _this = this;
        this.page = page != null ? page : "home";
        googleMap = this.googleMap;
        $(document).ajaxComplete(function(event, xhr, settings) {
          var filtered_vertiports, vertiports;
          if (settings.url.indexOf("/trips/autocomplete_vertiport_name") !== -1 || settings.url.indexOf("/trips/autocomplete_departure_name") !== -1) {
            vertiports = xhr.responseJSON;
            if (vertiports && vertiports.length > 0) {
              if (googleMap.infoBox) {
                googleMap.infoBox.close();
              }
              filtered_vertiports = [];
              $.each(vertiports, function(index, item) {
                if (item.category && item.category === 'city') {
                  return filtered_vertiports.push(item);
                }
              });
              if (filtered_vertiports.length > 0) {
                return googleMap.fitBounds(vertiports);
              }
            }
          }
        });
        if (this.page === "home") {
          $(this.form).on('railsAutocomplete.select', 'input:text:not(.hasDatepicker)', function(event) {
            _this.replaceSlider($(event.currentTarget));
            _this.googleMap.updateMap($(event.currentTarget).val());
            _this.updateShareFlights();
            return true;
          });
          this.form.find("select, input:radio, input:checkbox").on('change', function() {
            _this.updateShareFlights();
            return true;
          });
          this.form.find("input").on('blur', function(event) {
            if (_this.focused.refresh().val().length === 0) {
              _this.updateShareFlights();
            }
            return true;
          });
        } else if (this.page === "results") {
          this.form.on('railsAutocomplete.select', 'input:text:not(.hasDatepicker)', function(event) {
            _this.submitForm();
            return true;
          });
          this.form.find("select, input:radio, input:checkbox").on('change', function() {
            _this.submitForm();
            return true;
          });
          this.form.find("input").on('blur', function(event) {
            if (_this.focused.refresh().val().length === 0) {
              _this.submitForm();
            }
            return true;
          });
        }
        return this.form.on("mouseup", "#trip_aircraft_finder_add_stop_link", function(event) {
          $(_this.form).on('focusin', '#trip_aircraft_flight_stops_', function(event) {
            return _this.focusUpdate(event.currentTarget);
          });
          return true;
        });
      },
      submitForm: function(page_first_load) {
        var _this = this;
        if (page_first_load == null) {
          page_first_load = "no";
        }
        if (this.departure.refresh().val() !== this.arrival.refresh().val()) {
          window.helper.showLoading();
          $.get("/trips/search_aircrafts", this.form.serialize(), function(data) {
            var _ref, _ref1, _ref2;
            $("#trip_aircrafts_container").html(data.trip_aircrafts);
            _this.add_results_scroll_buttons();
            _this.googleMap.markersData = data.markers;
            _this.googleMap.removeMarkers();
            if ((_ref = data.markers) != null ? _ref.vertiports.length : void 0) {
              _this.googleMap.addMarkersWithNumbers();
            }
            if (((_ref1 = data.markers) != null ? _ref1.departure : void 0) || ((_ref2 = data.markers) != null ? _ref2.arrival : void 0)) {
              return _this.googleMap.drawTripOnMap();
            }
          }).always(function() {
            return window.helper.hideLoading();
          });
          return true;
        }
      },
      add_results_scroll_buttons: function() {
        var arrow_down, arrow_up, init_arrow_down, init_arrow_up, result, results, toggle_arrows;
        results = $('.result-aircrafts-holder');
        result = results[0];
        arrow_up = $("#more_results_up");
        arrow_down = $("#more_results_down");
        arrow_up.off("click");
        arrow_up.hide();
        arrow_down.off("click");
        arrow_down.hide();
        if (results.find('div.wrapper > div.item').length > 5) {
          toggle_arrows = function() {
            if ((result.scrollHeight - result.scrollTop) >= (result.clientHeight + 950)) {
              if (arrow_down.css('display') === "none") {
                arrow_down.css('display', 'inline-block');
                if (!$._data(arrow_down[0], 'events')) {
                  init_arrow_down();
                }
              }
            } else {
              arrow_down.hide();
            }
            if (result.scrollTop > 200) {
              if (arrow_up.css('display') === "none") {
                arrow_up.css('display', 'inline-block');
                if (!$._data(arrow_up[0], 'events')) {
                  return init_arrow_up();
                }
              }
            } else {
              return arrow_up.hide();
            }
          };
          init_arrow_down = function() {
            return arrow_down.on("click", function() {
              results.scrollTo("+=456px", 600, {
                axis: 'y',
                margin: true,
                onAfter: function() {
                  return toggle_arrows();
                }
              });
              return true;
            });
          };
          init_arrow_up = function() {
            return arrow_up.on("click", function() {
              results.scrollTo("-=456px", 600, {
                axis: 'y',
                margin: true,
                onAfter: function() {
                  return toggle_arrows();
                }
              });
              return true;
            });
          };
          results.scroll(function() {
            return toggle_arrows();
          });
          toggle_arrows();
        }
        return true;
      },
      initializeFocusEvent: function() {
        var _this = this;
        if (this.form.find("input.focused").length === 0) {
          this.departure.addClass("focused");
        }
        $(this.form).on('focusin', '#trip_aircraft_finder_departute, #trip_aircraft_finder_arrival', function(event) {
          return _this.focusUpdate(event.currentTarget);
        });
        return true;
      },
      focusUpdate: function(focused) {
        if ($(focused).is('input')) {
          this.form.find('input.focused').removeClass("focused");
          $(focused).addClass("focused");
        }
        return true;
      },
      replaceSlider: function(element) {
        if (this.page === "home" && !window.helper.mapVisibleOnHome()) {
          if (element.val().length > 2) {
            if ($("#home_carousel").length) {
              $("#home_carousel").carousel('pause');
              $("#home_carousel").hide();
            }
            $("#home_gmap").css('visibility', 'visible').addClass('visibleMap');
            $("div.legend").show();
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    };

    return GoogleMap;

  })();

}).call(this);
