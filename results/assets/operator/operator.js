(function() {
  window.terms_and_conditions_link_initializator = function() {
    return $("#operator_terms_and_conditions_link").on('click', function() {
      var fields, form, params;
      form = $(this).closest('form');
      fields = ['name_of_business', 'chief_pilot_or_business_owner', 'street1', 'street2', 'city', 'state', 'postal_code'];
      params = [];
      $.each(fields, function(i, f) {
        return params.push(("term_params[" + f + "]=") + form.find("#operator_" + f).val());
      });
      $(this).attr('href', "" + ($(this).data('url')) + "?" + (params.join('&')));
      return true;
    });
  };

  $(function() {
    $('.safety_rating_check_box').change(function() {
      var input;
      input = $(this).closest('div.safety_rating').find('input.safety_rating_certificate_input');
      if (this.checked) {
        return input.show();
      } else {
        input.val('');
        return input.hide();
      }
    });
    return $('.safety_rating_check_box').trigger('change');
  });

}).call(this);
