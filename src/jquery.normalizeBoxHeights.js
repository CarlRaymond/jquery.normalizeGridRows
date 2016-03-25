// Used in layouts with multiple content items rendered in boxes. Iterates over a selection set and adjusts
// heights of each item so that each row (defined as items sharing the same top offset) are equal-height.
//
// Usage: $("{selector}").normalizeBoxHeights()
// Resizes the elements specified by the selector.
//
// To re-apply when certain events occur on the window, specify an array of event names and
// a debounce delay interval in milliseconds. This prevents rapidly invoking the behavior
// multiple times when the events are triggered rapidly. This is a common scenario:
// $("{selector}").normalizeBoxHeights({ events: ['resize', 'orientationchange' ]});
//
// The defaults are { events: [], delay: 250 }, meaning no window events are handled,
// and the debounce delay is 250ms.
(function (factory) {
    
    // Register as a module with CommonJS or AMD, or as a plain jQuery
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
    
    // This function does the work. It's a standard function, so the 
    // collection to work on is supplied as an argument.
    var normalize = function($items) {

		// Set auto so items assume their natural height
		$items.css({ height: 'auto' });

		var rowStart = 0; // Start index of current row
		var maxRowHeight = 0; // Max height seen so far in row
		var currentTopOffset = 0; // Top offset of elements in current row

        // Iterate the selection set in document order
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
    var debounce = function(target_fn, delay) {
        var timer;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(target_fn, delay);
        };
    };
    
    var defaults = {
        delay: 250,
        events: []
    };
    
    // The plugin proper.
    $.fn.normalizeBoxHeights = function(options) {
        var $items = this;
        var settings = $.extend({}, defaults, options);
        
        // Normalize the selection set
        normalize($items);
        
        // If events mentioned, re-normalize when they are triggered,
        // with debouncing.
        if (settings.events.length > 0) {
            var renormalize = debounce(function() { normalize($items); }, settings.delay);
            
            $.each(settings.events, function(index, event) {
               $(window).on(event, renormalize);
            });
        }
        
        // Allow chaining
        return this;
    };
}));