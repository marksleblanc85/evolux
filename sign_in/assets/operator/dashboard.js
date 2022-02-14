(function() {
  window.operator_dashboard_update_table_path = null;

  window.update_missions_tables = function() {
    if (window.operator_dashboard_update_table_path) {
      $.getScript(window.operator_dashboard_update_table_path, function(data, textStatus, jqxhr) {
        return setTimeout(function() {
          return window.update_missions_tables();
        }, 300000);
      });
    }
    return true;
  };

  $(function() {});

}).call(this);
