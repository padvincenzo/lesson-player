# Lesson Player's lesson-overlay plugin
Display an overlay when the user is not active.

## Plugin options

* **data**: An array of strings that the overlay use to build itself: these strings will be converted to div(s) that also have the same class name.
* **doNotShowIf** ``function () {}``: A function that return true if you do not want the overlay to be displayed. Do not confuse with ``enable``: this is meant for temporary operations; if overlay is not enabled then it wont be displayed anyway, but if it's enabled, then it will be displayed if this function returns ``false``.

## New methods added to the player

This plugin does not create a method. Instead, creates an object called ``lessonOverlay`` with the following properties and methods:

* ``enabled``: Whether the overlay is enabled or not.
* ``update(data)``: A method that require a ``data`` object, that contains a string for each element in the ``data`` array in the initial plugin options.
* ``hide()``: Hide the overlay.
* ``show()``: Show the overlay (if enabled and ``doNotShowIf`` return ``false`` (or does not exist at all)).
* ``toggle()``: Toggle the value of ``enabled`` and return the new value.
