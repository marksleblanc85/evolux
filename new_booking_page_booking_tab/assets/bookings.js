(function() {
  window.booking_form_initializator = {
    initialize: function() {
      this.form = $("#booking_tab form");
      this.initialize_booking_owner_events();
      this.initialize_nested_form_events();
      this.initialize_tab_link_events();
      return true;
    },
    initialize_booking_owner_events: function() {
      var _this = this;
      this.form.find("a.booking_remove_own_passenger").on('click', function(event) {
        var field;
        field = _this.form.find('input:checkbox#booking_with_owner_of_booking').click().prop('checked', false);
        $.uniform.update(field);
        return true;
      });
      this.form.find('input:checkbox#booking_with_owner_of_booking').on('click', function(event) {
        if (event.currentTarget.checked) {
          _this.form.find("#booking_owner_passenger").show();
          _this.form.find("#booking_owner_passenger input.booking_passenger_reject_passenger").val('');
          _this.form.find("#booking_owner_passenger input:hidden[name*='[_destroy]']").val('0');
        } else {
          _this.form.find("#booking_owner_passenger").hide();
          _this.form.find("#booking_owner_passenger input.booking_passenger_reject_passenger").val('1');
          _this.form.find("#booking_owner_passenger input:hidden[name*='[_destroy]']").val('1');
        }
        return true;
      });
      return true;
    },
    initialize_nested_form_events: function() {
      $('#booking_passengers').on('cocoon:after-insert', function(event, insertedItem) {
        init_form_input_and_tooltip(true, $(insertedItem));
        init_phone_format_fields();
        return true;
      });
      return true;
    },
    initialize_tab_link_events: function() {
      $("#booking_forms_nav").on('click', '#booking_forms_nav li.disabled a', function(event) {
        event.stopImmediatePropagation();
        return false;
      });
      return true;
    }
  };

  window.booking_payment_form_initializator = {
    initialize: function() {
      this.form = $("#payment_tab form");
      this.initialize_booking_payment_events();
      return true;
    },
    initialize_booking_payment_events: function() {
      var _this = this;
      this.form.find("a#booking_payment_new_payment").on('click', function(event) {
        _this.form.find('#last_booking_payment, a#booking_payment_new_payment').hide();
        _this.form.find('#new_booking_payment, a#booking_payment_previous_payment').show();
        _this.form.find('#booking_transaction_use_previous_billing').val('');
        $.uniform.update(_this.form.find('select, input[type=checkbox], input[type=radio]'));
        return true;
      });
      this.form.find("a#booking_payment_previous_payment").on('click', function(event) {
        _this.form.find('#new_booking_payment, a#booking_payment_previous_payment').hide();
        _this.form.find('#last_booking_payment, a#booking_payment_new_payment').show();
        _this.form.find('#booking_transaction_use_previous_billing').val('1');
        $.uniform.update(_this.form.find('select, input[type=checkbox], input[type=radio]'));
        return true;
      });
      return true;
    }
  };

  $(function() {
    return $("#booking_forms_content").on('click', 'a.booking_go_back', function(event) {
      $("#booking_forms_nav li#" + ($(this).data('prev_step'))).find('a').tab('show');
      return false;
    });
  });

}).call(this);
