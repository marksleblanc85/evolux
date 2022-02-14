(function() {
  window.scroll_images_initializator = {
    initialize: function(image_container) {
      if (image_container == null) {
        image_container = ".aircraft-img-scroll";
      }
      $(image_container).bind('mousedown', function(event) {
        $(this).data('down', true).data('x', event.clientX).data('scrollLeft', this.scrollLeft);
        return false;
      }).bind('touchstart', function(event) {
        $(this).data('down', true).data('x', event.originalEvent.targetTouches[0].pageX);
        return false;
      }).bind('mouseup touchend', function(event) {
        $(this).data('down', false);
      }).bind('mousemove', function(event) {
        if ($(this).data('down') === true) {
          this.scrollLeft = $(this).data('scrollLeft') + $(this).data('x') - event.clientX;
        }
      }).bind('touchmove', function(event) {
        if ($(this).data('down') === true) {
          this.scrollLeft = $(this).data('x') - event.originalEvent.targetTouches[0].pageX;
        }
      }).bind('mousewheel', function(event, delta) {
        this.scrollLeft -= delta * 30;
      }).css({
        'overflow': 'hidden',
        'cursor': '-moz-grab'
      });
      return $(window).mouseout(function(event) {
        if ($(image_container).data('down')) {
          try {
            if (event.originalTarget.nodeName === 'BODY' || event.originalTarget.nodeName === 'HTML') {
              return $(image_container).data('down', false);
            }
          } catch (_error) {}
        }
      });
    }
  };

  $(function() {});

}).call(this);
