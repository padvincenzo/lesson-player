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

// Actions
$lang->cancel             = "Cancel";
$lang->close              = "Close";
$lang->confirm            = "Confirm";
$lang->delete             = "Delete";
$lang->edit               = "Edit";
$lang->ok                 = "Ok";
$lang->remove             = "Remove";
$lang->show               = "Show";

// Words
$lang->class              = "Class";
$lang->credits            = "Credits";
$lang->dated              = "Dated";
$lang->directory          = "Directory";
$lang->documentation      = "Documentation";
$lang->filename           = "File name";
$lang->homePage           = "Home page";
$lang->professor          = "Professor";
$lang->progress           = "Progress";
$lang->search             = "Search...";
$lang->title              = "Title";

// ---------- Class ----------
$lang->idclass            = "Class ID";
$lang->classDirectory     = "Class directory";
$lang->classList          = "Class list";
$lang->className          = "Class name";
$lang->newClass           = "Add class";
$lang->removeThisClass    = "Move the class '{className}' to the trash?";
$lang->deleteThisClass    = "Permanently delete '{className}'?";

// Class statements
$lang->classAdded         = "Class added";
$lang->classNotAdded      = "Class not added";
$lang->classEdited        = "Class edited";
$lang->classNotEdited     = "Class not edited";
$lang->classDeleted       = "Class deleted";
$lang->classNotDeleted    = "Class not deleted";
$lang->classRemoved       = "Class removed";
$lang->classNotRemoved    = "Class not removed";
$lang->classCompleted     = "You have completed this class";


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

// Lesson statements
$lang->lessonAdded        = "Lesson added";
$lang->lessonNotAdded     = "Lesson not added";
$lang->lessonEdited       = "Lesson '{lessonTitle}' edited";
$lang->lessonNotEdited    = "Lesson not edited";
$lang->lessonDeleted      = "Lesson '{lessonTitle}' deleted";
$lang->lessonNotDeleted   = "Lesson not deleted";
$lang->lessonRemoved      = "Lesson '{lessonTitle}' removed";
$lang->lessonNotRemoved   = "Lesson not removed";

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

// Database
$lang->dbConnectionFailed = "Database connection failed.";
$lang->dbNotFound         = "Database name not found.";
$lang->installSuccessful  = "Install successful.";
$lang->installFailed      = "Install failed.";
$lang->notYetInstalled    = "Database has not been installed yet.";

// FFmpeg
$lang->ffmpegCopyPaste    = "Copy and paste output of";
$lang->ffmpegOutput       = "Output of ffmpeg";

// Errors
$lang->success            = "Success";
$lang->failed             = "Failed";
$lang->errFileOpen        = "Error opening file";
$lang->errInvalidData     = "Data not valid";

?>
