(function() {
  var calendar;

  calendar = {
    disable_past_months: function() {
      var current_month, m, _i, _ref, _results;
      current_month = new Date().getUTCMonth();
      $("#month option:eq(" + current_month + ")").prop("selected", true).change();
      _results = [];
      for (m = _i = 0, _ref = current_month - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; m = 0 <= _ref ? ++_i : --_i) {
        _results.push($("#month option:eq(" + m + ")").prop("disabled", true));
      }
      return _results;
    },
    enable_all_months: function() {
      return $("#month option").prop("disabled", false);
    }
  };

  $(function() {
    calendar.disable_past_months();
    return $("#year").change(function(e) {
      if ($("#year")[0].selectedIndex === 0) {
        return calendar.disable_past_months();
      } else {
        return calendar.enable_all_months();
      }
    });
  });

}).call(this);
