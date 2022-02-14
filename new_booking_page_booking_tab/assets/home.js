(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.searchFormVertiportNameValidator = function(value) {
    if (value.length < 1) {
      return true;
    } else {
      return __indexOf.call(gon.vertiports_names, value) >= 0;
    }
  };

  $(function() {
    var $form;
    $form = $('#trip_aircraft_finder_form');
    $form.bootstrapValidator({
      submitButtons: 'input[type="submit"].btn.btn-primary',
      threshold: 3,
      live: "submitted",
      fields: {
        departure: {
          selector: "#trip_aircraft_finder_departute",
          validators: {
            notEmpty: {
              message: "Departure is required."
            },
            callback: {
              message: "Can't find such departure. Please, start typing and choose one from the list.",
              callback: function(value, validator, $field) {
                return window.searchFormVertiportNameValidator(value);
              }
            }
          }
        },
        arrival: {
          selector: "#trip_aircraft_finder_arrival",
          validators: {
            notEmpty: {
              message: "Arrival is required."
            },
            callback: {
              message: "Can't find such arrival. Please, start typing and choose one from the list.",
              callback: function(value, validator, $field) {
                return window.searchFormVertiportNameValidator(value);
              }
            }
          }
        }
      }
    });
    return $form.on('railsAutocomplete.select', function(event, data) {
      var field;
      field = $(event.target);
      return $form.getFormValidator().updateStatus(field, 'NOT_VALIDATED').validateField(field);
    });
  });

}).call(this);
