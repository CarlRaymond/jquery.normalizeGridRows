/*! jquery.normalize-grid-rows - v1.0.0 - 2016-04-04
* https://github.com/CarlRaymond/jquery.normalizeGridRows
* Copyright (c) 2016 ; Licensed MIT */
// jQuery plugin for grid-of-boxes layouts. Iterates over a selection set and adjusts
// heights of each item so that each row (defined as items sharing the same top offset)
// are equal-height.
//
// Usage: $("{selector}").normalizeGridRows()
// Resizes the elements specified by the selector.
//
// To re-apply when certain events occur on the window, specify an array of event names and
// a debounce delay interval in milliseconds. Debouncing prevents rapidly invoking the
// handler multiple times when the events are triggered rapidly. This is a common scenario:
// $("{selector}").normalizeGridRows({ events: ['resize', 'orientationchange' ]});
//
// The defaults are { events: [], delay: 250 }, meaning no window events are handled,
// and the debounce delay is 250ms.
//
// Plugin wrapped up in an IIFE. The argument factory is a function invoked in one of
// three ways (depending on the environment) to register the plugin with jQuery.
;(function (factory) {

	// Register as a module in a module environment, or as a plain jQuery
	// plugin in a bare environment.
	if(typeof module === "object" && typeof module.exports === "object") {
		// CommonJS environment
		factory(require("jquery"));
	}
	else if (typeof define === 'function' && define.amd) {
		// AMD environment. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Old-fashioned browser globals
		factory(jQuery);
	}
}(function($) {

	// Normalize does the work on the jQuery collection
	// supplied as an argument. Iterates the collection (assumed to be
	// in document order), finding elements that share the same
	// top offset, and therefore form a row. The elements in the row
	// are sized to the tallest member, and the process continues.
	var normalize = function($items) {

		// Set height auto so items assume their natural height
		$items.css({ height: 'auto' });

		var rowStart = 0; // Start index of current row
		var maxRowHeight = 0; // Max height seen so far in row
		var currentTopOffset = 0; // Top offset of elements in current row

		// Iterate the collection
		$items.each(function (index) {
			var $item = $(this);
			var height = $item.height();
			var topOffset = $item.offset().top;

			if (index === 0) {
				// Start first row
				rowStart = 0;
				maxRowHeight = height;
				currentTopOffset = topOffset;
			}
			else {
				// Belong with current row?
				if (topOffset == currentTopOffset) {
					// Continue current row
					if (height > maxRowHeight) { maxRowHeight = height; }
				}
				else {
					// Passed end of row. Update heights of current row.
					$items.slice(rowStart, index).height(maxRowHeight);

					// Start next row with this item. Adjusting heights in
					// current row may have changed this item's top offset.
					rowStart = index;
					maxRowHeight = height;
					currentTopOffset = $item.offset().top;
				}
			}
		});

		// Update final row
		$items.slice(rowStart).height(maxRowHeight);
	};

	// Transforms a supplied function into a debounced version. Invoking the
	// resulting function will start a timer of 'delay' milliseconds, and
	// then execute the target function. Subsequent invocations will reset
	// the timer. This is useful as an event handler for rapidly repeating events
	// like resize.
	var debounced = function(target_fn, delay) {
		var timer;
		return function() {
			clearTimeout(timer);
			timer = setTimeout(target_fn, delay);
		};
	};

	// Default options for the plugin.
	var defaults = {
		delay: 250,		// Debounce interval, milliseconds
		events: []		// Events to monitor, as array of strings
	};

	// The plugin proper.
	$.fn.normalizeGridRows = function(options) {
		var $items = this;
		var settings = $.extend({}, defaults, options);
		
		// Normalize the selection set
		normalize($items);
		
		// If any events mentioned, re-normalize when they are triggered,
		// with debouncing.
		if (settings.events.length > 0) {
			var renormalize = debounced(function() { normalize($items); }, settings.delay);
			
			$.each(settings.events, function(index, eventname) {
				$(window).on(eventname, renormalize);
			});
		}
		
		// Allow chaining
		return this;
	};
}));