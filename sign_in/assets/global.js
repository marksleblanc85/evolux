(function() {
  var extend_object, init_global_events,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.init_form_input_and_tooltip = function(with_tooltip, container) {
    if (container) {
      container.find("select, input[type=checkbox], input[type=radio]").uniform();
      if (with_tooltip) {
        this.truncate_and_tooltip(container);
      }
    } else {
      $("select, input[type=checkbox], input[type=radio]").uniform();
      if (with_tooltip) {
        this.truncate_and_tooltip();
      }
    }
    return true;
  };

  window.truncate_and_tooltip = function(container) {
    if (container == null) {
      container = $("body");
    }
    return container.find("[data-toggle=tooltip]").each(function() {
      $(this).truncate();
      if ($(this).text().match(/…/) || $(this).prop("class").match(/glyphicon-question-sign/)) {
        return $(this).tooltip();
      }
    });
  };

  window.init_ajax_pagination = function() {
    return $("body").on('click', '.ajax_pagination .pagination a', function(event) {
      $.getScript($(event.currentTarget).attr('href'));
      event.stopPropagation();
      return false;
    });
  };

  init_global_events = function() {
    $('body').on('submit', "form", function(event) {
      var form;
      if ($(this).find("input.need_block[type=submit], a.need_block").lenght > 0) {
        form = $(this);
        if (form.attr('double_submit_protection') !== undefined) {
          event.stopImmediatePropagation();
          return false;
        } else {
          form.attr('double_submit_protection', '1');
          setTimeout(function() {
            return form.removeAttr('double_submit_protection');
          }, 1500);
          return true;
        }
      }
      return true;
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(event) {
      init_form_input_and_tooltip(false, $($(event.target).data('target')));
      return true;
    });
    return true;
  };

  extend_object = function() {
    return window.clone = function(obj) {
      var flags, key, newInstance;
      if ((obj == null) || typeof obj !== 'object') {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof RegExp) {
        flags = '';
        if (obj.global != null) {
          flags += 'g';
        }
        if (obj.ignoreCase != null) {
          flags += 'i';
        }
        if (obj.multiline != null) {
          flags += 'm';
        }
        if (obj.sticky != null) {
          flags += 'y';
        }
        return new RegExp(obj.source, flags);
      }
      newInstance = new obj.constructor();
      for (key in obj) {
        newInstance[key] = clone(obj[key]);
      }
      return newInstance;
    };
  };

  this.helper = {
    where: function(array, query) {
      var hit;
      if (typeof query !== "object") {
        return [];
      }
      hit = Object.keys(query).length;
      return array.filter(function(item) {
        var key, match, val;
        match = 0;
        for (key in query) {
          val = query[key];
          if (item[key] === val) {
            match += 1;
          }
        }
        if (match === hit) {
          return true;
        } else {
          return false;
        }
      });
    },
    sleep: function(ms) {
      var start, _results;
      if (ms == null) {
        ms = 1000;
      }
      start = new Date().getTime();
      _results = [];
      while (new Date().getTime() - start < ms) {
        continue;
      }
      return _results;
    },
    resultPage: function() {
      return $('#results_gmap').length > 0;
    },
    mapVisibleOnHome: function() {
      return $("#home_gmap").hasClass('visibleMap');
    },
    showLoading: function() {
      var left, loading, top, wrapper;
      loading = $("img.loading");
      wrapper = loading.parent();
      left = wrapper.width() / 2 - 30;
      top = wrapper.height() / 2 - 30;
      loading.css('left', left);
      loading.css('top', top);
      return loading.show();
    },
    hideLoading: function() {
      return $("img.loading").hide();
    }
  };

  this.mixOf = function() {
    var Mixed, base, method, mixin, mixins, name, _i, _ref, _ref1;
    base = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    Mixed = (function(_super) {
      __extends(Mixed, _super);

      function Mixed() {
        _ref = Mixed.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      return Mixed;

    })(base);
    for (_i = mixins.length - 1; _i >= 0; _i += -1) {
      mixin = mixins[_i];
      _ref1 = mixin.prototype;
      for (name in _ref1) {
        method = _ref1[name];
        Mixed.prototype[name] = method;
      }
    }
    return Mixed;
  };

  $.fn.refresh = function() {
    return $(this.selector);
  };

  $.fn.fieldValidator = function(options_hash) {
    var validator;
    validator = $(this).getFormValidator();
    if (validator) {
      if (options_hash.remove) {
        return validator.removeField($(this));
      } else {
        return validator.addField($(this), options_hash);
      }
    } else {
      return false;
    }
  };

  $.fn.getFormValidator = function() {
    return $(this).closest("form").data('bootstrapValidator');
  };

  $(function() {
    init_form_input_and_tooltip(true);
    init_ajax_pagination();
    init_global_events();
    return extend_object();
  });

}).call(this);
