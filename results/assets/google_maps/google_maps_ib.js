(function() {
  this.GMInfoBox = (function() {
    function GMInfoBox(gMap) {
      var gMInfoBox;
      this.gMap = gMap;
      this.searchForm = this.gMap.searchForm;
      this.markersData = this.gMap.markersData;
      this.gmap = this.gMap.gmap;
      this.map = this.gmap.map;
      gMInfoBox = this;
      google.maps.event.addListener(this.map, 'click', function() {
        return gMInfoBox.close();
      });
    }

    GMInfoBox.prototype.create = function(markerData) {
      this.markerData = markerData;
      this.close();
      this.infoWindow = this.markerData.infoWindow;
      if (this.infoWindow) {
        this.ib = new InfoBox(this.infoBoxOptionsResults());
        return this.addInfoBoxEventsResults();
      } else {
        this.ib = new InfoBox(this.infoBoxOptionsHome());
        return this.addInfoBoxEventsHome();
      }
    };

    GMInfoBox.prototype.open = function(event) {
      if (this.ib.getVisible() === false) {
        this.ib.open(this.map, event);
        return this.markerData;
      }
    };

    GMInfoBox.prototype.close = function() {
      if (this.ib && this.ib.getVisible() === true) {
        return this.ib.close();
      }
    };

    GMInfoBox.prototype.infoBoxOptionsHome = function() {
      return {
        content: this.infoBoxContentHome(),
        alignBottom: true,
        pixelOffset: new google.maps.Size(-317, -13),
        disableAutoPan: true,
        maxWidth: 0,
        closeBoxURL: "",
        closeBoxMargin: "0",
        zIndex: 500
      };
    };

    GMInfoBox.prototype.infoBoxContentHome = function() {
      var contentIB, cover_image, img_url, vert;
      vert = "vertiport" + this.markerData.id;
      if (this.markerData.image !== void 0 && this.markerData.image !== null && this.markerData.image.length && this.markerData.image.indexOf("missing_vertiport") === -1) {
        img_url = this.markerData.image;
      } else {
        img_url = this.markersData.default_image;
      }
      cover_image = this.resultPage ? this.markersData.helicopter_icon : this.markerData.icon;
      return contentIB = "<div class='info_window'>        <div id='" + vert + "' class = 'vertiport'>          <div class='image'>            <img id='vert_img' class='img' src='" + img_url + "'>          </div>          <div class='about'>            <div class='map-text'>              <p class='title'><span> " + this.markerData.title + " </span></p>              <p class='location'><span> " + this.markerData.location + " </span></p>            </div>            <div class='buttons'>              <button id='select_btn'></button>              <button id='details_btn'></button>            </div>          </div>        </div>        <img class='vert_icon_img' src = '" + cover_image + "'>      </div>";
    };

    GMInfoBox.prototype.addInfoBoxEventsHome = function() {
      var gMInfoBox, gMap, mkData, searchForm;
      gMap = this.gMap;
      mkData = this.markerData;
      gMInfoBox = this;
      searchForm = this.searchForm;
      if (this.listener) {
        google.maps.event.removeListener(this.listener);
      }
      return this.listener = google.maps.event.addListenerOnce(this.ib, 'domready', function() {
        var _this = this;
        $("#vertiport" + mkData.id + " #select_btn").mousedown(function() {
          searchForm.updateFocusedVal(mkData.title);
          gMap.updateMap(mkData.title);
          return searchForm.updateShareFlights();
        });
        return $("#vertiport" + mkData.id + " #details_btn").click(function() {
          $('#vertiport-info').remove();
          return $.get("/vertiport_info_modal", {
            vertiport_id: mkData.id
          }, function() {
            return $("#vertiport-info.vert" + mkData.id).modal();
          });
        });
      });
    };

    GMInfoBox.prototype.infoBoxOptionsResults = function() {
      return {
        content: this.infoBoxContentResults(),
        alignBottom: true,
        pixelOffset: new google.maps.Size(-264, -8),
        disableAutoPan: true,
        maxWidth: 0,
        closeBoxURL: "",
        closeBoxMargin: "0"
      };
    };

    GMInfoBox.prototype.infoBoxContentResults = function() {
      var ib, location, title, vertiportInfo;
      title = this.markerData.title.toUpperCase();
      location = this.markerData.location.toUpperCase();
      vertiportInfo = "<p><span class='title' title = '" + title + "'>" + title + "</span></p><p><span title = '" + location + "'>" + location + "</span></p>";
      ib = $("<div>" + this.infoWindow + "</div>");
      ib.find('.vertiport').append(vertiportInfo);
      return ib.html();
    };

    GMInfoBox.prototype.addInfoBoxEventsResults = function() {
      var gMInfoBox;
      gMInfoBox = this;
      if (this.listener) {
        google.maps.event.removeListener(this.listener);
      }
      return this.listener = google.maps.event.addListener(this.ib, 'domready', function() {
        var aircrafts_count;
        aircrafts_count = $('.aircrafts').find('li').length;
        if (aircrafts_count > 3) {
          gMInfoBox.ticker(aircrafts_count);
        }
        return gMInfoBox.scrollToAircraft(this);
      });
    };

    GMInfoBox.prototype.ticker = function(count) {
      $(".info_window_aircrafts .arrow_down").show();
      $(".info_window_aircrafts .arrow_down .more").html("" + (count - 3) + " more");
      return $('.aircrafts').totemticker({
        row_height: '56px',
        next: '.arrow_down',
        previous: '.arrow_up',
        speed: 200,
        max_items: 3
      });
    };

    GMInfoBox.prototype.scrollToAircraft = function() {
      return $('.info_window_aircrafts li.aircraft').click(function() {
        var aircraft, id, _ref;
        id = $(this).prop("id");
        aircraft = $("#trip_aircrafts_container div#aircraft" + id);
        $('.result-aircrafts-holder').scrollTo(aircraft, 600, {
          margin: true
        });
        if ((_ref = $(".results-holder").find(".wrapper.highlight")) != null) {
          _ref.removeClass("highlight");
        }
        return aircraft.parent('.wrapper').addClass("highlight");
      });
    };

    return GMInfoBox;

  })();

}).call(this);
