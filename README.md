# jQuery.normalizeGridRows

A jQuery plugin for grid-of-boxes layouts to adjust the heights of elements
so that each row of elements has the same height, that of the largest in the row.
It can listen for window resize or other events to re-apply itself.

## Usage
Include jQuery and this plugin (either `dist/jquery.normalize-grid-rows.js` or
`dist/jquery.normalize-grid-rows.min.js`) in your page, then invoke:
        `$(".myboxes").normalizeGridRows();`
where ".myboxes" is a jQuery selector to locate the elements of interest. This
will adjust the collection one time.

Plugin options can specify events like `resize` and `orientationchange` to
automatically reapply the behavior when the named events are triggered.
A debounce interval prevents applying the behavior multiple times when the
events are triggered in rapid succession.

To reapply the behavior when the window's resize and orientationchange events are
triggered, use:
        `$(".myboxes").normalizeGridRows({ events: ['resize', 'orientationchange'] });`
The default debounce interval is 250ms; specify a different interval with a 'delay'
property in the options object.

The plugin works by iterating the collection (assumed to be in document order),
and finding the contiguous elements that share the same top offset. Each set of such
elements are sized to the height of the tallest in the set. The plugin works with or
without a responsive framework like Bootstrap or Foundation, and has no dependencies
other than jQuery itself.
 