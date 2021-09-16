# Lesson Player's take-notes plugin
Take notes while watching the lesson (requires vjs-area-selector).

## This plugin is by no means complete
I'm uploading it for testing purposes.

## Plugin options

* **onInsert** ``function (text) {}``: (optional) A function to be called when a note is added

## New methods added to the player

* ``toggleNotes()``: Display/hide the notes.
* ``isWritingNote()``: Return a boolean that indicates that the user is writing notes (not necessarily actively).
