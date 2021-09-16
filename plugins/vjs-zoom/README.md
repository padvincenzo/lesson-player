# Lesson Player's zoom plugin
Zoom in on a specific area of the video (requires vjs-area-selector).

## Plugin options

* **beforeZoom** ``function () {}``: (optional) A function that is called when the user want to zoom. Used for displaying a message.
* **onReset** ``function () {}``: (optional) A function that is called when the zoom is restored. Used for displaying a message.

## New methods added to the player

* ``zoom()``: Call the area-selector plugin and zoom the video according to the given coordinates.
* ``zoomReset()``: Reset the zoom.
* ``isZoomed()``: Return a boolean that indicates if the video is zoomed.
