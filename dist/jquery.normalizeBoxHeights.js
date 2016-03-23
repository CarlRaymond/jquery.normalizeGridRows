/*! jquery.normalizeBoxHeights - v0.1.0 - 2016-03-23
* https://github.com/CarlRaymond/jquery.normalizeBoxHeights
* Copyright (c) 2016 ; Licensed GPLv2 */
// Used in layouts with multiple content items rendered in boxes. Iterates over a selection set and adjusts
// heights of each item so that each row (defined as items sharing the same top offset) are equal-height.
// When in a responsive layout, re-invoke on resize or 
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
	$.fn.normalizeBoxHeights = function() {
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
				rowStart = index;
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
}));