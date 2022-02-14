(function() {
  window.trip_aircraft_resultor = {
    initialize: function() {
      window.init_form_input_and_tooltip(true);
      return $("a.sky_booking_action").on('click', function(event) {
        var form;
        form = $("#new_trip_form");
        form.find('#flight_aircraft_id').val($(this).data('aircraft_id'));
        form.find('#flight_booking_type').val($(this).data('booking_type'));
        form.find('#flight_reposition_vertiport_id').val($(this).data('reposition_vertiport_id'));
        form.submit();
        return false;
      });
    }
  };

  window.flight_form_initializator = {
    initialize: function() {
      this.form = $("form#new_flight_form");
      this.initialize_confirmation_datepicker();
      this.initialize_departure_return_datepicker();
      if (this.form.find('#flight_skyshare_passenger_count_goal').length > 0) {
        this.initialize_skyshare_goal_event();
      }
      return true;
    },
    initialize_confirmation_datepicker: function() {
      var _this = this;
      this.form.find("#flight_confirmation_deadline_date").datepicker({
        minDate: new Date,
        maxDate: this.form.find("#flight_confirmation_deadline_date").data('max_date'),
        onSelect: function(selectedDate, instance) {
          return _this.update_datetime_fields();
        }
      });
      return this.form.find("#flight_confirmation_deadline_time").on('change', function(event) {
        _this.update_datetime_fields();
        return true;
      });
    },
    initialize_departure_return_datepicker: function() {
      var _this = this;
      this.form.find("#flight_departure_date").datepicker({
        minDate: new Date,
        onSelect: function(selectedDate, instance) {
          var date;
          date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
          _this.form.find("#flight_return_date").datepicker("option", "minDate", date);
          return _this.form.find("#flight_departure_time").change();
        }
      });
      this.form.find("#flight_return_date").datepicker({
        minDate: new Date,
        onSelect: function(selectedDate, instance) {
          var date;
          date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
          _this.form.find("#flight_departure_date").datepicker("option", "maxDate", date);
          return _this.form.find("#flight_return_time").change();
        }
      });
      return this.form.find("#flight_departure_time, #flight_return_time").on('change', function(event) {
        update_min_max_time_selects(_this.form.find("#flight_departure_date"), _this.form.find("#flight_return_date"), _this.form.find("#flight_departure_time"), _this.form.find("#flight_return_time"));
        $.uniform.update(_this.form.find("#flight_departure_time, #flight_return_time"));
        update_datetime_field_based_on_date_and_time(_this.form.find("#flight_departure_date"), _this.form.find("#flight_departure_time"), _this.form.find("#flight_departure_datetime"));
        if (_this.form.find("#flight_return_datetime").length > 0) {
          update_datetime_field_based_on_date_and_time(_this.form.find("#flight_return_date"), _this.form.find("#flight_return_time"), _this.form.find("#flight_return_datetime"));
        }
        return true;
      });
    },
    initialize_skyshare_goal_event: function() {
      var _this = this;
      return this.form.find('.flight_skyshare_goal_select_button').on('click', function(event) {
        var count, count_green_seat, element, i, open_count;
        element = $(event.currentTarget);
        count = parseInt(element.data('count'));
        _this.form.find("#flight_skyshare_passenger_count_goal").val(count);
        _this.form.find(".shared-target-goal").removeClass('active');
        element.closest('.shared-target-goal').addClass('active');
        count_green_seat = parseInt(_this.form.find(".helicopter-capacity-imgs").data('green_seats'));
        $.each(_this.form.find(".goal_passenger_seat"), function(i, elem) {
          if (i < count - 1) {
            if (i < count_green_seat - 1) {
              return $(elem).addClass('green-seat');
            } else {
              return $(elem).addClass('blue-seat');
            }
          } else {
            return $(elem).removeClass('blue-seat').removeClass('green-seat');
          }
        });
        if ($('#detail_passenger_seats_goal').length > 0) {
          $('#detail_passenger_seats_goal').html(count);
          $('#detail_target_price').html(element.closest('.shared-target-goal').find('.goal-shared-price strong').html());
          open_count = count - $("#passengers_photos .reserved").length;
          $("#passengers_photos figure.open_seat").remove();
          i = 0;
          while ((i += 1) <= open_count) {
            $("#passengers_photos").append("<figure class='open_seat'><img alt='Logo' src='/assets/defaults/middle_user-logo.png'><figcaption>OPEN SEAT</figcaption></figure>");
          }
        }
        return false;
      });
    },
    update_datetime_fields: function() {
      update_datetime_field_based_on_date_and_time(this.form.find("#flight_confirmation_deadline_date"), this.form.find("#flight_confirmation_deadline_time"), this.form.find("#flight_confirmation_deadline_datetime"));
      return true;
    }
  };

  $(function() {
    $("input:checkbox#shared_skyshare_checkbox").on('change', function() {
      $.ajax({
        url: $(this).data('url'),
        dataType: "script",
        method: 'PUT',
        data: "shared_skyshare=" + (this.checked ? '1' : '0')
      });
      return true;
    });
    return $("#operator-info-modal").on("hide.bs.modal", function() {
      $(this).removeData('bs.modal');
      return $(this).empty();
    });
  });

}).call(this);
