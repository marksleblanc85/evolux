(function() {
  window.shift_form_initializator = {
    initialize: function() {
      this.form = $("#operator_shift_form");
      this.initialize_events();
      return true;
    },
    initialize_events: function() {
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
      this.form.find("#flight_departure_time, #flight_return_time").on('change', function(event) {
        update_min_max_time_selects(_this.form.find("#flight_departure_date"), _this.form.find("#flight_return_date"), _this.form.find("#flight_departure_time"), _this.form.find("#flight_return_time"));
        $.uniform.update(_this.form.find("#flight_departure_time, #flight_return_time"));
        update_datetime_field_based_on_date_and_time(_this.form.find("#flight_departure_date"), _this.form.find("#flight_departure_time"), _this.form.find("#flight_departure_datetime"));
        if (_this.form.find("#flight_return_datetime").length > 0) {
          update_datetime_field_based_on_date_and_time(_this.form.find("#flight_return_date"), _this.form.find("#flight_return_time"), _this.form.find("#flight_return_datetime"));
        }
        return true;
      });
      this.form.find("#flight_shift_type_shifted_to_one_way").on('change', function(event) {
        _this.form.find('#shift_round_trip_section').hide();
        return true;
      });
      return this.form.find("#flight_shift_type_shifted_to_double_round_trip").on('change', function(event) {
        _this.form.find('#shift_round_trip_section').show();
        return true;
      });
    }
  };

  window.sum_up_form_initializator = {
    initialize: function() {
      this.form = $("#operator_sum_up_form");
      this.initialize_events();
      return true;
    },
    initialize_events: function() {
      var _this = this;
      return this.form.find("#sum_up_edit_operator_account_link").on('click', function(event) {
        _this.form.find("#invoice_bank_account_edit_message").hide();
        _this.form.find("#invoice_loading").show();
        $.get('/operator/flights/fetch_stripe_recipient.json', (function(data) {
          _this.form.find("#invoice_loading").hide();
          _this.form.find("#invoice_back_account_fields").show();
          _this.form.find("#invoice_add_operator_receipient").val('1');
          _this.form.find("#invoice_back_account_fields").find('input, select').removeAttr('disabled');
          _this.form.find("#invoice_recipient_name").val(data['recipient_name']);
          _this.form.find("#invoice_recipient_type").val(data['recipient_type']);
          $.uniform.update($('#invoice_recipient_type'));
          _this.form.find("#invoice_recipient_account_number").val(data['recipient_account_number']);
          return true;
        }), 'json');
        return false;
      });
    }
  };

  $(function() {
    $("select#operator_suggestions_select").on('change', function() {
      if ($(this).val() === 'have') {
        $('#operator_suggestions_container').show();
      } else {
        $('#operator_suggestions_container').hide();
        $('#operator_suggestions_container').find('input:checkbox').prop('checked', false);
        $.uniform.update($('#operator_suggestions_container').find('input:checkbox'));
      }
      return true;
    });
    return $("select.operator_reason_answer").on('change', function() {
      $('.reason_explanations textarea').val('');
      if ($(this).val() === $(this).data('explanation')) {
        $('.reason_explanations').show();
      } else {
        $('.reason_explanations').hide();
      }
      return true;
    });
  });

}).call(this);
