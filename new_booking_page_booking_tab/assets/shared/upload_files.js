(function() {
  var init_dragover_events;

  window.init_remove_image_file = function() {
    return $("a.dragdrop_remove_image_link").on('click', function() {
      var containter;
      containter = $(this).closest('.dragdrop_attachment_file_name_container');
      containter.hide();
      containter.find('.dragdrop_attachment_remove_image').val('1');
      return false;
    });
  };

  window.init_dragdrop_file_field = function(file_upload_container, one_file_only) {
    var drop_element, file_input_obj, nested_add_file_element, submit_element;
    file_input_obj = file_upload_container.find('input:file.dragdropattach_nested_file_field');
    drop_element = file_upload_container.find('.dragdropattach');
    nested_add_file_element = file_upload_container.find('a.dragdrop_add_file_link');
    submit_element = file_upload_container.closest('form').find('input:submit, button:submit, .submit_button');
    file_upload_container.fileupload({
      dataType: 'json',
      url: '/ajax_images.json',
      maxNumberOfFiles: (one_file_only ? 1 : void 0),
      dropZone: drop_element,
      autoUpload: true,
      singleFileUploads: true,
      sequentialUploads: true,
      formData: [
        {
          name: 'file_field_input_name',
          value: file_input_obj.attr('name')
        }, {
          name: 'authenticity_token',
          value: $('meta[name="csrf-token"]').attr('content')
        }
      ],
      maxFileSize: 5000000,
      acceptFileTypes: /(\.|\/)(gif|jpe?g|png|tiff|bmp|pdf)$/i,
      disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator && navigator.userAgent),
      previewSourceFileTypes: /^image\/(gif|jpeg|png|jpg|tiff|bmp)$/,
      previewSourceMaxFileSize: 5000000,
      previewMaxWidth: file_input_obj.data('pwidth') || 200,
      previewMaxHeight: file_input_obj.data('pheight') || 200,
      previewAsCanvas: true,
      uploadTemplateId: null,
      downloadTemplateId: null,
      process: [
        {
          action: 'load',
          fileTypes: /^image\/(gif|jpeg|png|jpg|tiff|bmp)$/,
          maxFileSize: 5000000
        }, {
          action: 'resize'
        }, {
          action: 'save'
        }
      ],
      done: function(event, data) {
        var num;
        if (submit_element.attr('data-count') !== void 0 && submit_element.attr('data-count').length > 0) {
          num = parseInt(submit_element.attr('data-count')) - 1;
          if (num <= 0) {
            submit_element.removeAttr('disabled', true).removeClass('disabled').removeAttr('data-count');
          } else {
            submit_element.attr('data-count', num);
          }
        } else {
          submit_element.removeAttr('disabled', true).removeClass('disabled');
        }
        data.context.find('.dragdrop_remove_link').css('visibility', 'visible');
        if (data.result) {
          if (data.result['error']) {
            data.context.find('.dragdrop_progress').append("<div class='alert alert-danger'>" + data.result['error'] + "</div>");
          } else {
            data.context.find('input:hidden.dragdrop_attachment_cache').val(data.result['image_cache']);
          }
        }
        return true;
      },
      fail: function(event, data) {
        var num;
        if (submit_element.attr('data-count') !== void 0 && submit_element.attr('data-count').length > 0) {
          num = parseInt(submit_element.attr('data-count')) - 1;
          if (num <= 0) {
            submit_element.removeAttr('disabled', true).removeClass('disabled').removeAttr('data-count');
          } else {
            submit_element.attr('data-count', num);
          }
        } else {
          submit_element.removeAttr('disabled', true).removeClass('disabled');
        }
        data.context.find('.dragdrop_remove_link').css('visibility', 'visible');
        if (data.errorThrown) {
          data.context.find('.dragdrop_progress').append("<div class='alert alert-danger'>" + data.errorThrown + "</div>");
        }
        return true;
      },
      add: function(e, data) {
        var files, options, that;
        that = $(this).data("blueimp-fileupload") || $(this).data("fileupload");
        options = that.options;
        files = data.files;
        if (options.maxNumberOfFiles !== 1) {
          nested_add_file_element.click();
        }
        data.context = file_upload_container.find(".dragdrop_attachment_file_name_container .dragdrop_image_nested_field:last");
        if (data.context) {
          file_upload_container.find(".dragdrop_attachment_file_name_container").show();
          data.context.find('.dragdrop_remove_link').css('visibility', 'hidden');
          data.context.find('.dragdrop_progress, .dragdrop_file_name .preview span').html('');
          data.context.find('input:hidden.dragdrop_attachment_cache, input:hidden.dragdrop_attachment_remove_image').val('');
          $(this).fileupload("process", data).done(function() {
            var progress_html;
            if (options.maxNumberOfFiles !== 1) {
              that._adjustMaxNumberOfFiles(-files.length);
            }
            data.maxNumberOfFilesAdjusted = true;
            data.files.valid = data.isValidated = that._validate(files);
            options.filesContainer[(options.prependFiles ? "prepend" : "append")](data.context);
            progress_html = data.isValidated ? "<div class='progress progress-striped progress-success'><div class='bar progress-bar progress-bar-success' style='width: 0%'></div></div>" : "<div class='alert alert-danger'>" + files[0].error + "</div>";
            data.context.find('.dragdrop_progress').html(progress_html);
            that._renderPreviews(data);
            that._forceReflow(data.context);
            return that._transition(data.context).done(function() {
              var num;
              if (data.isValidated && options.autoUpload) {
                num = submit_element.attr('data-count') !== void 0 && submit_element.attr('data-count').length > 0 ? parseInt(submit_element.attr('data-count')) : 0;
                submit_element.attr('disabled', true).addClass('disabled').attr('data-count', num + 1);
                return data.submit();
              }
            });
          });
        }
        return true;
      }
    });
    return true;
  };

  init_dragover_events = function() {
    $(document).bind("dragover", function(e) {
      var dropZone, element, timeout;
      dropZone = $('.dragdropattach');
      timeout = window.dropZoneTimeout;
      if (timeout) {
        clearTimeout(timeout);
      }
      element = $(e.target).hasClass('dragdropattach') ? e.target : $(e.target).closest('div[class^="dragdropattach"]')[0];
      if (element !== undefined && (element != null)) {
        $(element).addClass("hover");
      } else {
        dropZone.removeClass("hover");
      }
      return window.dropZoneTimeout = setTimeout(function() {
        window.dropZoneTimeout = null;
        return dropZone.removeClass("hover");
      }, 100);
    });
    $(document).bind("drop dragover", function(e) {
      return e.preventDefault();
    });
    return true;
  };

  $(function() {
    init_dragover_events();
    return init_remove_image_file();
  });

}).call(this);
