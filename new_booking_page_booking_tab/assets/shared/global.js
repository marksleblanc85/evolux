(function() {
  var accordeon_helper;

  window.select_user_time_zone = function(mapping) {
    var selected_timezone;
    selected_timezone = mapping[jstz.determine().name()];
    if (selected_timezone) {
      return $("select.user_time_zone").val(selected_timezone).change();
    }
  };

  window.update_min_max_time_selects = function(from_date, to_date, from_time, to_time) {
    var departure_date, departure_index, return_date, return_index;
    departure_date = from_date.val();
    return_date = to_date.val();
    if (departure_date.length > 0 && departure_date === return_date) {
      departure_index = from_time.prop("selectedIndex");
      return_index = to_time.prop("selectedIndex");
      if (return_index > 0) {
        $.each(from_time.find("option"), function(i, option) {
          if (i > 0 && i >= return_index) {
            return $(option).attr('disabled', 'disabled');
          } else {
            return $(option).removeAttr('disabled');
          }
        });
      }
      if (departure_index > 0) {
        $.each(to_time.find("option"), function(i, option) {
          if (i > 0 && i <= departure_index) {
            return $(option).attr('disabled', 'disabled');
          } else {
            return $(option).removeAttr('disabled');
          }
        });
        if (from_time.find("option:selected:disabled").length > 0) {
          from_time.val('');
        }
        if (to_time.find("option:selected:disabled").length > 0) {
          to_time.val('');
        }
      }
    } else {
      from_time.find("option:disabled").removeAttr('disabled');
      to_time.find("option:disabled").removeAttr('disabled');
    }
    return true;
  };

  window.update_datetime_field_based_on_date_and_time = function(date_element, time_element, datetime_element) {
    var date, time;
    try {
      time = time_element.val().length > 0 ? time_element.val() : '12:00 AM';
      date = new Date(Date.parse("" + (date_element.val()) + " " + time));
      if (Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime())) {
        datetime_element.val("" + (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate()) + " " + (date.getHours()) + ":" + (date.getMinutes()) + ":" + (date.getSeconds()));
      } else {
        datetime_element.val('');
      }
    } catch (_error) {
      datetime_element.val('');
    }
    return true;
  };

  window.display_grouped_vertiports_region = function(container, vertiport_type) {
    var first_checkbox, region_select;
    if (vertiport_type == null) {
      vertiport_type = "vertiport";
    }
    region_select = container.find("select.vertiport_groups_region_select");
    region_select.on('change', function() {
      accordeon_helper.display_region_vertiports(container, $(this), vertiport_type);
      return true;
    });
    first_checkbox = container.find('.vertiport-groups-vertiports input:checkbox:checked:first');
    if (first_checkbox.length === 0) {
      first_checkbox = container.find('.vertiport-groups-vertiports input:checkbox:first');
    }
    accordeon_helper.open_vertiports_group(container, first_checkbox, region_select);
    return true;
  };

  window.init_select_all_checkbox_events = function() {
    $(".allCheckOptions input.selectAll:checkbox").on('change', function() {
      var group;
      group = $(this).closest('.allCheckOptions');
      group.find("input.selectOne:checkbox").prop('checked', this.checked);
      $.uniform.update(group.find("input.selectOne:checkbox"));
      return true;
    });
    $(".allCheckOptions input.selectOne:checkbox").on('change', function() {
      var checked, group, total;
      group = $(this).closest('.allCheckOptions');
      checked = group.find("input.selectOne:checkbox:checked");
      total = group.find("input.selectOne:checkbox");
      group.find("input.selectAll:checkbox").prop('checked', checked.length === total.length);
      $.uniform.update(group.find("input.selectAll:checkbox"));
      return true;
    });
    return true;
  };

  window.init_phone_format_fields = function() {
    $("input:text.phone_input").mask("(999) 999-9999");
    return true;
  };

  window.add_hightlight_to_autocomplete = function() {
    return $.ui.autocomplete.prototype._renderItem = function(ul, item) {
      item.label = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
      return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
    };
  };

  window.add_vertiport_groups_to_autocomplete = function() {
    return $.ui.autocomplete.prototype._renderMenu = function(ul, items) {
      var currentCategory, that;
      that = this;
      currentCategory = "";
      return $.each(items, function(index, item) {
        var li;
        li = void 0;
        if (item.category !== currentCategory) {
          if (item.category === 'city') {
            ul.append("<li class='ui-autocomplete-vertiport-category'>By City/ZIP:</li>");
          } else if (item.category === 'airport') {
            ul.append("<li class='ui-autocomplete-vertiport-category'>By Vertiport Code:</li>");
          }
          currentCategory = item.category;
        }
        li = that._renderItemData(ul, item);
        if (item.category) {
          li.attr("aria-label", item.label);
        }
      });
    };
  };

  accordeon_helper = {
    display_region_vertiports: function(container, region_select, vertiport_type) {
      container.find(".vertiport-groups-region").hide();
      if (region_select.val().length) {
        return container.find("#" + vertiport_type + "_region_" + (region_select.val())).show();
      }
    },
    open_vertiports_group: function(container, first_checkbox, region_select) {
      var region_id;
      if (first_checkbox.length > 0) {
        region_id = first_checkbox.closest('.vertiport-groups-region').attr('id').match(/\d+$/)[0];
        region_select.val(region_id).change();
        first_checkbox.closest('.vertiport-groups-cities').find('a.vertiport-groups-city').trigger('click');
      }
      return true;
    }
  };

  $(function() {
    init_select_all_checkbox_events();
    return add_hightlight_to_autocomplete();
  });

}).call(this);
