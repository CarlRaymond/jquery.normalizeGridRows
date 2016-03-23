# jQuery.normalizeBoxHeights

A jQuery plugin for box layouts to adjust the heights of elements
so that each row of elements (those that share the same top offset)
has the height of the largest in the row.

Usage: Include jQuery and this plugin in your page, then invoke:
        $(".myboxes").normalizeBoxHeights();
where ".myboxes" is a jQuery selector to locate the box elements of interest.

In a responsive layout, it is up to the client to invoke the plugin whenever
the layout changes because of a resize, rotation, etc.
