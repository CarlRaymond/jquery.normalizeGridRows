/*! jquery.normalizeBoxHeights - v0.1.0 - 2016-03-24
* https://github.com/CarlRaymond/jquery.normalizeBoxHeights
* Copyright (c) 2016 ; Licensed GPLv2 */
// Used in layouts with multiple content items rendered in boxes. Iterates over a selection set and adjusts
// heights of each item so that each row (defined as items sharing the same top offset) are equal-height.
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
    
    // This function does the work
    var normalizer = function() {
		var $items = this;

		// Set auto so items assume their natural height
		$items.css({ height: 'auto' });

		var rowStart = 0; // Start index of current row
		var maxRowHeight = 0; // Max height seen so far in row
		var currentTopOffset = 0; // Top offset of elements in current row

        // Iterate the selection set in document order
		this.each(function (index) {
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
    
    // Apply normalizer to selection set, and re-invoke on named
    // events, with debouncing.
    $.fn.normalizeBoxHeights = function(events) {
        var $items = this;
        normalizer.apply($items);
        
        // If events mentioned, watch them
        if (arguments.length > 0) {
            var renormalizer = debounce(normalizer, 250);
            
            $.each(events, function(index, event) {
               $(window).on(event, renormalizer.apply($items));
            });
        }
        
        // Allow chaining
        return this;
    };
}));