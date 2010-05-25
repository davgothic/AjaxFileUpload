(function($) {
	$.fn.ajaxfileupload = function(options) {

		var defaults = {
			debug: false,
			action: 'upload.php',
		},
		settings = $.extend({}, defaults, options);

		this.each(function() {
			var $this = $(this);

			if ($this.is('input') && $this.attr('type') == 'file') {
				
				log('Applying to file input with id ' + $this[0].id);
				
				$this.bind('change', onChange);
				
			} else {
				log('Ignoring invalid element')
			}
		});
		
		function onChange(e) {
			log('onChange fired');
			log('Selected file: ' + $(e.target).val());
			
			var span = $('<span />')
				.text('Uploading')
				.insertAfter(e.target);
				
			settings.interval = window.setInterval(function() {
				var text = span.text();
				if (text.length < 13) {
					span.text(text + '.');
				} else {
					span.text('Uploading');
				}
			}, 200);
			
			var iframe = createIframe();
			iframe.bind('load', {span:span}, onComplete)
			var form = createForm(iframe);

			form.append(e.target);
			form.submit();
			
			// clean up
            form.remove();
			form = null;
            $(e.target).remove();
			e.target = null;
		}
		
		function onComplete (e) {
			log('onComplete fired');
			var response = e.target.contentDocument.body.innerHTML;
			response = eval("(" + response + ")");
			$(e.data.span).replaceWith('Done');
			console.log(response);
			
			$(e.target).remove();
		}
		
		var randomId = (function() {
			var id = 0;
			return function () {
				return '_AjaxUpload' + id++;
			};
		})();
		
		function createIframe() {
			
			var id = randomId();
			
			var iframe = $('<iframe/>')
				.attr('name', id)
				.attr('id', id)
				.hide()
				.appendTo('body');
			
			return iframe;
		}
		
		function createForm(iframe) {
			
			var form = $('<form />')
				.attr('method', 'post')
				.attr('action', settings.action)
				.attr('enctype', 'multipart/form-data')
				.attr('target', iframe[0].name)
				.hide()
				.appendTo('body');
			
			return form;
		}
		
		function log (output) {
			if (settings.debug == true && typeof(console) != 'undefined' && typeof(console.log) == 'function') {
				console.log('[AjaxFileUpload] ' + output);
			}
		}

		return this;
	}
})(jQuery);
