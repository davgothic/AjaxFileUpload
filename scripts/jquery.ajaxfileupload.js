/**
 * AJAX File Upload
 * http://github.com/davgothic/AjaxFileUpload
 * 
 * Copyright (c) 2010 David Hancock
 * Licensed under the MIT license ( http://davgothic.com/mit-license/ )
 */

(function($) {
	$.fn.ajaxfileupload = function(options) {
		
		var defaults = {
			debug: false,
			action: "upload.php",
			onChange: function(file){},
			onSubmit: function(file){},
			onComplete: function(file, response){}
		},
		settings = $.extend({}, defaults, options);
		
		this.each(function() {
			var $this = $(this);
			if ($this.is("input") && $this.attr("type") === "file") {
				log("Applying to file input with id " + $this[0].id);
				$this.bind("change", onChange);
			} else {
				log("Ignoring invalid element");
			}
		});
		
		function onChange(e) {
			var element	= $(e.target),
				file	= filename(element.val()),
				iframe	= createIframe(),
				form	= createForm(iframe);
			
			settings.onChange.call(this, file);
			
			iframe.bind("load", {element: element, file: file}, onComplete);
			
			form.append(element).bind("submit", {element: element, file: file}, onSubmit).submit();
		}
		
		function onSubmit(e) {
			// If false cancel the submission
			if (settings.onSubmit.call(e.data.element, e.data.file) === false) {
				$("span." + e.data.element.attr("id")).replaceWith(e.data.element);
				return false;
			}
			
			// Clean up
			setTimeout(function() {
				$(this).remove();
				e.data.element.remove();
				e.data.element = null;
			}, 0);
			
			return;
		}
		
		function onComplete (e) {
			var iframe	= $(e.target),
				doc		= iframe[0].contentDocument ? iframe[0].contentDocument : window.frames[iframe[0].id].document,
				response = doc.body.innerHTML;
			
			if (response) {
				response = jQuery.parseJSON(response);
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
			return filePath.replace(/.*(\/|\\)/, "");
		}
		
		var randomId = (function() {
			var id = 0;
			return function () {
				return "_AjaxFileUpload" + id++;
			};
		})();
		
		function createIframe() {
			var id		= randomId(),
				iframe	= $("<iframe/>")
				.attr({
					src: "javascript:false;",
					name: id,
					id: id
				})
				.hide()
				.appendTo("body");
				
			return iframe;
		}
		
		function createForm(iframe) {
			var form = $("<form />")
				.attr({
					method: "post",
					action: settings.action,
					enctype: "multipart/form-data",
					target: iframe[0].name
				})
				.hide()
				.appendTo("body");
				
			return form;
		}
		
		function log(output) {
			if (settings.debug === true && typeof(console) !== "undefined" && typeof(console.log) === "function") {
				console.log("[AjaxFileUpload] " + output);
			}
		}

		return this;
	}
})(jQuery);
