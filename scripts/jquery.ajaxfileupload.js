/**
 * AJAX File Upload
 * http://github.com/davgothic/AjaxFileUpload
 * 
 * Copyright (c) 2010 David Hancock
 * Licensed under the MIT license ( See bundled LICENSE file )
 */

(function($) {
	$.fn.ajaxfileupload = function(options) {

		var defaults = {
			debug: false,
			action: 'upload.php',
			onSubmit: function(file){},
			onComplete: function(file, response){}
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
			
			var element	= $(e.target);
			var file	= filename(element.val());
			
			settings.onSubmit.call(this, file);
			
			var iframe = createIframe();
			iframe.bind('load', {element:element, file:file}, onComplete);
			
			var form = createForm(iframe);
			form.append(element).submit();
			
			// clean up
            form.remove();
			form = null;
            element.remove();
			element = null;
		}
		
		function onComplete (e) {
			
			var iframe = $(e.target);
			
			// Get the response text from the iframe
			var doc = iframe[0].contentDocument ? iframe[0].contentDocument : window.frames[iframe[0].id].document;
			var response = doc.body.innerHTML;
			
			if (response) {
				response = eval("(" + response + ")");
			} else {
				response = {};
			}
			
			// Fire our callback
			settings.onComplete.call(e.data.element, e.data.file, response);
			
			// Remove the iframe after short delay
			setTimeout(function() {
				iframe.remove();
			}, 0);
			
			return;
		}
		
		function filename(filePath) {
			return filePath.replace(/.*(\/|\\)/, '');
		}
		
		var randomId = (function() {
			var id = 0;
			return function () {
				return '_AjaxFileUpload' + id++;
			};
		})();
		
		function createIframe() {
			
			var id = randomId();
			
			var iframe = $('<iframe/>')
				.attr({
					src: 'javascript:false;',
					name: id,
					id: id
				})
				.hide()
				.appendTo('body');
			
			return iframe;
		}
		
		function createForm(iframe) {
			
			var form = $('<form />')
				.attr({
					method: 'post',
					action: settings.action,
					enctype: 'multipart/form-data',
					target: iframe[0].name
				})
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
