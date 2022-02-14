(function() {
  window.aircraft_form_initializator = {
    initialize: function(element) {
      this.form = element;
      this.is_admin_form = this.form.hasClass('admin_aircraft_form');
      this.initialize_events();
      return true;
    },
    initialize_events: function() {
      var _this = this;
      this.form.find("#aircraft_craft_type_id").on('change', function(event) {
        _this.fill_types_field_aircraft($(event.currentTarget).val());
        return true;
      });
      this.form.find("#aircraft_rate_hour").on('change', function(event) {
        _this.update_aircraft_price_class_label($(event.currentTarget).val());
        return true;
      });
      this.form.find(".aircraft_home_vertiport input:checkbox").on('change', function(event) {
        _this.update_aircraft_current_vertiports(event.currentTarget);
        return true;
      });
      this.form.find("#aircraft_average_speed_knots").on('change', function(event) {
        _this.smart_convertion('knots_to_mph', $(event.currentTarget).val(), 'average_speed_mph');
        return true;
      });
      this.form.find("#aircraft_average_speed_mph").on('change', function(event) {
        _this.smart_convertion('mph_to_knots', $(event.currentTarget).val(), 'average_speed_knots');
        return true;
      });
      this.form.find("#aircraft_cruise_speed_knots").on('change', function(event) {
        _this.smart_convertion('knots_to_mph', $(event.currentTarget).val(), 'cruise_speed_mph');
        return true;
      });
      this.form.find("#aircraft_cruise_speed_mph").on('change', function(event) {
        _this.smart_convertion('mph_to_knots', $(event.currentTarget).val(), 'cruise_speed_knots');
        return true;
      });
      if (this.is_admin_form) {
        this.form.find("#aircraft_operator_id").on('change', function(event) {
          _this.admin_update_home_location_for_operator($(event.currentTarget).val());
          return true;
        });
        this.form.find("form.admin_aircraft_form #aircraft_operator_id").trigger('change');
      }
      return true;
    },
    admin_update_home_location_for_operator: function(selected_operator_id) {
      var exclusive,
        _this = this;
      if (gon !== undefined && selected_operator_id.length > 0) {
        this.form.find("#vertiport-groups-section label.vertiport_private").hide();
        this.form.find("#vertiport-groups-section label.vertiport_private input:checkbox").prop('checked', false).trigger('change');
        if (gon.exclusive_landing_permissions_per_operator[selected_operator_id]) {
          exclusive = gon.exclusive_landing_permissions_per_operator[selected_operator_id];
        }
        if (exclusive !== null && exclusive !== undefined) {
          $.each(exclusive, function(i, vertiport_id) {
            return _this.form.find("#vertiport-groups-section label[for='home_vertiport_ids_" + vertiport_id + "']").show();
          });
        }
      } else {
        this.form.find("#vertiport-groups-section label.vertiport_private").show();
      }
      return true;
    },
    fill_types_field_aircraft: function(selected_craft_type_id) {
      var fields, info,
        _this = this;
      if (gon !== undefined && selected_craft_type_id.length > 0) {
        info = JSON.parse(gon.craft_types[selected_craft_type_id]);
        if (info !== null && info !== undefined) {
          fields = ["price", "capacity", "range", "fuel_cost_per_naumi", "max_endurance", "engine_type", "engine_model", "max_gross_weight", "usable_fuel_capacity", "usable_payload", "baggage_volume"];
          $.each(fields, function(i, f) {
            return _this.form.find("#aircraft_" + f).val(info["" + f]).trigger('change');
          });
        }
      }
      return true;
    },
    update_aircraft_price_class_label: function(value) {
      var hour, label;
      hour = parseFloat(value);
      label = 'EcoLux';
      if (gon !== undefined && gon.price_configs !== undefined && gon.price_configs) {
        if (hour >= gon.price_configs.ranges[2]) {
          label = gon.price_configs.names['ultralux'];
        } else if (hour >= gon.price_configs.ranges[1] && hour < gon.price_configs.ranges[2]) {
          label = gon.price_configs.names['astrolux'];
        } else if (hour >= gon.price_configs.ranges[0] && hour < gon.price_configs.ranges[1]) {
          label = gon.price_configs.names['delux'];
        } else {
          label = gon.price_configs.names['ecolux'];
        }
      }
      this.form.find("#aircraft_price_class_label").html(label);
      return true;
    },
    update_aircraft_current_vertiports: function(home_vertiport_object) {
      var container, current_vertiport_element, vertiport_id, vertiport_name;
      container = this.form.find("#aicraft_current_vertiports");
      vertiport_id = $(home_vertiport_object).val();
      vertiport_name = $(home_vertiport_object).data('vertiport_name');
      if (home_vertiport_object.checked) {
        if (container.find("#aircraft_current_vertiport_input_" + vertiport_id).length === 0) {
          current_vertiport_element = $("<div class='checkbox input-group' id='aircraft_current_vertiport_input_" + vertiport_id + "'>            <label class='aircraft_current_vertiport' for='current_vertiport_id_" + vertiport_id + "'>              <input id='current_vertiport_id_" + vertiport_id + "' name='aircraft[current_vertiport_id]' type='radio' value='" + vertiport_id + "'>              " + vertiport_name + "            </label>          </div>");
          container.append(current_vertiport_element);
          if (!this.is_admin_form) {
            current_vertiport_element.find("input").uniform();
          }
        }
      } else {
        container.find("#aircraft_current_vertiport_input_" + vertiport_id).remove();
      }
      return true;
    },
    smart_convertion: function(type, value, oposite_field) {
      var speed;
      try {
        speed = parseFloat(value);
        if (value.length > 0 && !isNaN(value)) {
          if (type === 'knots_to_mph') {
            $("#aircraft_" + oposite_field).val(Number(speed * 1.150779).toFixed(4));
          } else if (type === 'mph_to_knots') {
            $("#aircraft_" + oposite_field).val(Number(speed * 0.868976).toFixed(4));
          }
        }
      } catch (_error) {
        true;
      }
      return true;
    }
  };

  $(function() {});

}).call(this);
