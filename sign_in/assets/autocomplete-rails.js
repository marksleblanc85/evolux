/*
* Unobtrusive autocomplete
*
* To use it, you just have to include the HTML attribute autocomplete
* with the autocomplete URL as the value
*
*   Example:
*       <input type="text" data-autocomplete="/url/to/autocomplete">
*
* Optionally, you can use a jQuery selector to specify a field that can
* be updated with the element id whenever you find a matching value
*
*   Example:
*       <input type="text" data-autocomplete="/url/to/autocomplete" data-id-element="#id_field">
*/
(function(e){var t=null;e.fn.railsAutocomplete=function(){var t=function(){this.railsAutoCompleter||(this.railsAutoCompleter=new e.railsAutocomplete(this))};return e.fn.on!==undefined?e(document).on("focus",this.selector,t):this.live("focus",t)},e.railsAutocomplete=function(e){_e=e,this.init(_e)},e.railsAutocomplete.fn=e.railsAutocomplete.prototype={railsAutocomplete:"0.0.1"},e.railsAutocomplete.fn.extend=e.railsAutocomplete.extend=e.extend,e.railsAutocomplete.fn.extend({init:function(t){function n(e){return e.split(t.delimiter)}function r(e){return n(e).pop().replace(/^\s+/,"")}t.delimiter=e(t).attr("data-delimiter")||null,t.min_length=e(t).attr("min-length")||2,t.append_to=e(t).attr("data-append-to")||null,e(t).autocomplete({appendTo:t.append_to,source:function(n,i){params={term:r(n.term)},e(t).attr("data-autocomplete-fields")&&e.each(e.parseJSON(e(t).attr("data-autocomplete-fields")),function(t,n){params[t]=e(n).val()}),e.getJSON(e(t).attr("data-autocomplete"),params,function(){arguments[0].length==0&&(arguments[0]=[],arguments[0][0]={id:"",label:"no existing match"}),e(arguments[0]).each(function(n,r){var i={};i[r.id]=r,e(t).data(i)}),i.apply(null,arguments)})},change:function(t,n){if(!e(this).is("[data-id-element]")||e(e(this).attr("data-id-element")).val()=="")return;e(e(this).attr("data-id-element")).val(n.item?n.item.id:"");if(e(this).attr("data-update-elements")){var r=e.parseJSON(e(this).attr("data-update-elements")),i=n.item?e(this).data(n.item.id.toString()):{};if(r&&e(r["id"]).val()=="")return;for(var s in r)element=e(r[s]),element.is(":checkbox")?i[s]!=null&&element.prop("checked",i[s]):element.val(n.item?i[s]:"")}},search:function(){var e=r(this.value);if(e.length<t.min_length)return!1},focus:function(){return!1},select:function(r,i){var s=n(this.value);s.pop(),s.push(i.item.value);if(t.delimiter!=null)s.push(""),this.value=s.join(t.delimiter);else{this.value=s.join(""),e(this).attr("data-id-element")&&e(e(this).attr("data-id-element")).val(i.item.id);if(e(this).attr("data-update-elements")){var o=e(this).data(i.item.id.toString()),u=e.parseJSON(e(this).attr("data-update-elements"));for(var a in u)element=e(u[a]),element.is(":checkbox")?o[a]!=null&&element.prop("checked",o[a]):element.val(o[a])}}var f=this.value;return e(this).bind("keyup.clearId",function(){e.trim(e(this).val())!=e.trim(f)&&(e(e(this).attr("data-id-element")).val(""),e(this).unbind("keyup.clearId"))}),e(t).trigger("railsAutocomplete.select",i),!1}})}}),e(document).ready(function(){e("input[data-autocomplete]").railsAutocomplete()})})(jQuery);
