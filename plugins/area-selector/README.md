# Lesson Player's area-selector plugin
Select an area of the video *(not useful alone)*.

## Plugin options

*None*

## New methods added to the player

* ``select()``: Returns a promise. When resolved, you'll have an object (``coordinates``) that contains:
  * ``left``, ``top``, ``width``, ``height``: Coordinates of the video with is view size;
    ``relativeLeft``, ``relativeTop``, ``relativeWidth``, ``relativeHeight``: Coordinates relative to the video's wrapper;
    ``absoluteLeft``, ``absoluteTop``, ``absoluteWidth``, ``absoluteHeight``: Coordinates of the video with its real size
* ``cancelSelection()``: Reject the promise that ``select()`` has returned, if exists.
* ``isSelectingArea()``: Return a boolean that indicates if the user is selecting an area.
