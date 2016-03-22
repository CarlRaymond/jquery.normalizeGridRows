// Used in layouts with multiple content items rendered in boxes. Iterates over a selection set and adjusts
// heights of each item so that each row (defined as items sharing the same top offset) are equal-height.
// When in a responsive layout, re-invoke on resize or 
(function($) {
	$.fn.normalizeBoxHeights = function() {

		var $items = this;
		// Set auto so items assume their natural height
		$items.css({ height: 'auto' });

		var rowStart = 0;
		var maxRowHeight = 0;
		var currentTopOffset = 0;
		this.each(function (index) {
			var $item = $(this);
			var height = $item.height();
			var topOffset = $item.offset().top;

			if (index == 0) {
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
					// Passed end of row. Update heights.
					$row = $items.slice(rowStart, index);
					$row.height(maxRowHeight);

					// Start next row with this item
					rowStart = index;
					maxRowHeight = height;
					currentTopOffset = $item.offset().top;
				}
			}
		});

		// Update last row
		$items.slice(rowStart).height(maxRowHeight);
	}
})(jQuery);