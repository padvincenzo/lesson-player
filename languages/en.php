<?php
/*
Lesson Player
View your lessons, do not miss the mark.

Copyright (C) 2021  Vincenzo Padula

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

$langCode = "en";
$lang = (object) [];

// Properties
$lang->dateFormat         = "default";
$lang->IPAddress          = "Server's local IP address is:";
$lang->IPNotAvailable     = "Server's local IP address is not available";

// Actions
$lang->cancel             = "Cancel";
$lang->close              = "Close";
$lang->confirm            = "Confirm";
$lang->delete             = "Delete";
$lang->edit               = "Edit";
$lang->ok                 = "Ok";
$lang->remove             = "Remove";
$lang->restore            = "Restore";
$lang->show               = "Show";

// Words
$lang->class              = "Class";
$lang->credits            = "Credits";
$lang->dated              = "Dated";
$lang->directory          = "Directory";
$lang->documentation      = "Documentation";
$lang->filename           = "File name";
$lang->homePage           = "Home page";
$lang->install            = "Install";
$lang->professor          = "Professor";
$lang->progress           = "Progress";
$lang->title              = "Title";
$lang->trashBin           = "Trash bin";

// ---------- Class ----------
$lang->idclass            = "Class ID";
$lang->classDirectory     = "Class directory";
$lang->classList          = "Class list";
$lang->className          = "Class name";
$lang->newClass           = "Add class";
$lang->removeThisClass    = "Move the class '{className}' to the trash?";
$lang->deleteThisClass    = "Permanently delete '{className}'?";
$lang->search             = "Search in {className}...";

// Class statements
$lang->classAdded         = "Class '{className}' added";
$lang->classNotAdded      = "Class not added";
$lang->classEdited        = "Class '{className}' edited";
$lang->classNotEdited     = "Class not edited";
$lang->classDeleted       = "Class '{className}' deleted";
$lang->classNotDeleted    = "Class not deleted";
$lang->classRemoved       = "Class '{className}' removed";
$lang->classNotRemoved    = "Class not removed";
$lang->classRestored      = "Class '{className}' restored";
$lang->classNotRestored   = "Class not restored";
$lang->classCompleted     = "You have completed this class";
$lang->classProgress      = "{nWatched} / {nLessons}";


// ---------- Lesson ----------
$lang->idlesson           = "Lesson ID";
$lang->defaultLessonTitle = "Lesson of {lessonDated}";
$lang->lessonList         = "Lesson list";
$lang->previousLesson     = "Previous lesson";
$lang->nextLesson         = "Next lesson";
$lang->newLesson          = "Add lesson";
$lang->silencesList       = "List of silences";
$lang->removeThisLesson   = "Move the lesson '{lessonTitle}' to the trash?";
$lang->deleteThisLesson   = "Permanently delete '{lessonTitle}'?";
$lang->screenshotName     = "{lessonTitle} ({lessonClass}) [{lessonMark}]";

// Lesson statements
$lang->lessonAdded        = "Lesson '{lessonTitle}' added";
$lang->lessonNotAdded     = "Lesson not added";
$lang->lessonEdited       = "Lesson '{lessonTitle}' edited";
$lang->lessonNotEdited    = "Lesson not edited";
$lang->lessonDeleted      = "Lesson '{lessonTitle}' deleted";
$lang->lessonNotDeleted   = "Lesson not deleted";
$lang->lessonRemoved      = "Lesson '{lessonTitle}' removed";
$lang->lessonNotRemoved   = "Lesson not removed";
$lang->lessonRestored     = "Lesson '{lessonTitle}' restored";
$lang->lessonNotRestored  = "Lesson not restored";

// Lesson status
$lang->started            = "Started";
$lang->toBeWatched        = "To be watched";
$lang->watched            = "Watched";
$lang->setAsWatched       = "Set as watched";
$lang->setToBeWatched     = "Set to be watched";

// Player
$lang->overlayEnabled     = "Overlay enabled";
$lang->overlayDisabled    = "Overlay disabled";
$lang->paused             = "Paused";
$lang->play               = "Play";
$lang->playing            = "Playing";
$lang->rate               = "Rate";
$lang->resume             = "Resume";
$lang->soundOff           = "Muted";
$lang->soundOn            = "Unmuted";
$lang->volume             = "Volume";
$lang->zoomArea           = "Select area to zoom";
$lang->zoomReseted        = "Zoom reseted";

// Database
$lang->dbConnectionFailed = "Database connection failed.";
$lang->dbNotFound         = "Database name not found.";
$lang->installSuccessful  = "Install successful. Redirecting to the home page...";
$lang->installFailed      = "Install failed.";
$lang->notYetInstalled    = "Database has not been installed yet. Install it now?";

// FFmpeg
$lang->ffmpegCopyPaste    = "Copy and paste output of";
$lang->ffmpegOutput       = "Output of ffmpeg";

// Errors
$lang->success            = "Success";
$lang->failed             = "Failed";
$lang->errFileOpen        = "Error opening file";
$lang->errInvalidData     = "Data not valid";

// Feedback
$lang->feedback           = "Feedback";
$lang->feedbackWrite      = "What would you like to communicate to the developer?";
$lang->feedbackSend       = "Send";
$lang->feedbackThanks     = "Thanks for your feedback :)";
$lang->yourName           = "Your name";
$lang->yourMail           = "Your mail";

// Settings
$lang->settings                 = "Settings";
$lang->setting = (object) [];
$lang->setting->dictionaryTags  = "You can use: ";
$lang->setting->classProgress   = "Class progress";
$lang->setting->dateFormat      = "Format for dates";
$lang->setting->separator       = "Separator";
$lang->setting->screenshotName  = "Screenshot name (.jpg)";
$lang->setting->theme           = "Theme";
$lang->setting->timeDisplay     = "Remaining time display mode";
$lang->setting->timeDisplayCurr = "Video time";
$lang->setting->timeDisplayReal = "Real remaining time";

// Shortcuts
$lang->shortcuts              = "Shortcuts";
$lang->shortcut = (object) [];
$lang->shortcut->backward     = "Go backward (5sec)";
$lang->shortcut->faster       = "Faster";
$lang->shortcut->forward      = "Go forward (5sec)";
$lang->shortcut->fullscreen   = "Toggle fullscreen";
$lang->shortcut->longBackward = "Go backward (1min)";
$lang->shortcut->longForward  = "Go forward (1min)";
$lang->shortcut->mute         = "Toggle audio";
$lang->shortcut->overlay      = "Toggle overlay";
$lang->shortcut->play         = "Play/Pause";
$lang->shortcut->screenshot   = "Take a screenshot";
$lang->shortcut->skipSilence  = "Skip current silence";
$lang->shortcut->slower       = "Slower";
$lang->shortcut->volumeDown   = "Volume down";
$lang->shortcut->volumeUp     = "Volume up";
$lang->shortcut->zoom         = "Zoom";

?>
