(function() {
  var trip_aircraft_finder;

  trip_aircraft_finder = {
    initialize: function() {
      add_vertiport_groups_to_autocomplete();
      this.form = $("#trip_aircraft_finder_form");
      this.initialize_datepickers();
      this.initialize_events();
      this.initialize_add_stops();
      return this.stop_field_on_page_load();
    },
    initialize_datepickers: function() {
      var _this = this;
      this.form.find("#trip_aircraft_finder_departure_date").datepicker({
        minDate: new Date,
        onSelect: function(selectedDate, instance) {
          var date;
          date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
          _this.form.find("#trip_aircraft_finder_return_date").datepicker("option", "minDate", date);
          _this.form.find("#trip_aircraft_finder_departure_time").change();
          return _this.form.find("#trip_aircraft_finder_departure_date").trigger('dateUpdated');
        }
      });
      return this.form.find("#trip_aircraft_finder_return_date").datepicker({
        minDate: new Date,
        onSelect: function(selectedDate, instance) {
          var date;
          date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
          _this.form.find("#trip_aircraft_finder_departure_date").datepicker("option", "maxDate", date);
          _this.form.find("#trip_aircraft_finder_return_time").change();
          return _this.form.find("#trip_aircraft_finder_return_date").trigger('dateUpdated');
        }
      });
    },
    initialize_events: function() {
      var _this = this;
      this.form.find("#trip_aircraft_finder_trip_type_one_way").on('change', function(event) {
        _this.form.find('#return_time_container').find('input, select').val('').trigger('change');
        _this.form.find('#return_time_container').hide();
        return true;
      });
      this.form.find("#trip_aircraft_finder_trip_type_round_trip").on('change', function(event) {
        _this.form.find('#return_time_container').show();
        $.uniform.update('#trip_aircraft_finder_return_time');
        return true;
      });
      $("#select_aircraft_class_container input:checkbox").on('change', function(event) {
        _this.form.find("#form_aircraft_class_container").find("input:checkbox[value='" + ($(event.currentTarget).val()) + "']").prop('checked', event.currentTarget.checked).change();
        return true;
      });
      this.form.find("#trip_aircraft_finder_departure_time, #trip_aircraft_finder_return_time").on('change', function(event) {
        update_min_max_time_selects(_this.form.find("#trip_aircraft_finder_departure_date"), _this.form.find("#trip_aircraft_finder_return_date"), _this.form.find("#trip_aircraft_finder_departure_time"), _this.form.find("#trip_aircraft_finder_return_time"));
        $.uniform.update(_this.form.find("#trip_aircraft_finder_departure_time, #trip_aircraft_finder_return_time"));
        return true;
      });
      this.form.on('railsAutocomplete.select', '#trip_aircraft_finder_departute, #trip_aircraft_finder_arrival, #trip_aircraft_finder_stops input', function(event, data) {
        var inputs, _ref;
        if (event.currentTarget.id === "trip_aircraft_finder_departute") {
          _this.form.find("#departure_region").val((_ref = data.item) != null ? _ref.region : void 0);
        }
        inputs = _this.form.find(':input:text');
        inputs.eq(inputs.index(event.currentTarget) + 1).focus();
        return true;
      });
      return this.form.find("#trip_aircraft_finder_departute").on('blur', function(event) {
        if ($(event.currentTarget).val().length === 0) {
          _this.form.find("#departure_region").val("");
        }
        return true;
      });
    },
    initialize_add_stops: function() {
      var _this = this;
      this.form.find("#trip_aircraft_finder_add_stop_link").on('click', function(event) {
        var template;
        if ($("input#trip_aircraft_flight_stops_").length === 0) {
          template = '<div class="form-group">\
          <label class="col-sm-3 control-label" for="trip_aircraft_finder_flight_stops_">Stop</label>\
          <div class="col-sm-9"><input class="form-control" data-autocomplete-fields=\'{"departure_region":"#departure_region"}\' data-autocomplete="/trips/autocomplete_vertiport_name" id="trip_aircraft_flight_stops_" name="trip_aircraft_finder[flight_stops][]" placeholder="Search by city, zip or vertiport code" type="text"></div>\
        </div>';
          _this.form.find("#trip_aircraft_finder_stops").append(template);
          _this.form.find("#trip_aircraft_finder_stops").find("input[data-autocomplete]").railsAutocomplete();
          _this.validate_stop_field();
          _this.switch_buttons();
          return false;
        }
      });
      return true;
    },
    switch_buttons: function() {
      var remove_link;
      remove_link = "<a href='' onclick='return false;' id = 'trip_aircraft_finder_remove_stop_link' class='pull-right'>remove</a>";
      this.form.find("#trip_aircraft_finder_add_stop_link").hide();
      this.form.find(".add-stop-holder div").append(remove_link);
      return this.initialize_remove_stops();
    },
    initialize_remove_stops: function() {
      var _this = this;
      this.form.find("a#trip_aircraft_finder_remove_stop_link").on('click', function(event) {
        _this.form.find("#trip_aircraft_finder_stops").find("input[data-autocomplete]").fieldValidator({
          remove: true
        });
        $(event.currentTarget).remove();
        _this.form.find("div#trip_aircraft_finder_stops div").remove();
        _this.form.find("#trip_aircraft_finder_add_stop_link").show();
        return _this.form.find("#trip_aircraft_finder_passengers").val(_this.form.find("#trip_aircraft_finder_passengers").val()).trigger('change');
      });
      return true;
    },
    validate_stop_field: function() {
      return this.form.find("#trip_aircraft_finder_stops").find("input[data-autocomplete]").fieldValidator({
        validators: {
          notEmpty: {
            message: "Stop is required."
          },
          callback: {
            message: "Can't find such stop. Please, start typing and choose one from the list.",
            callback: function(value, validator, $field) {
              return window.searchFormVertiportNameValidator(value);
            }
          }
        }
      });
    },
    stop_field_on_page_load: function() {
      if ($("#trip_aircraft_finder_stops input").length > 0) {
        this.switch_buttons();
        return this.validate_stop_field();
      }
    }
  };

  $(function() {
    return trip_aircraft_finder.initialize();
  });

}).call(this);
