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

$langCode = "it";
$lang = (object) [];

// Properties
$lang->dateFormat         = "{D}/{MM}/{YYYY}";
$lang->IPAddress          = "L'indirizzo IP locale del server è:";
$lang->IPNotAvailable     = "L'indirizzo IP locale del server non è disponibile";

// Actions
$lang->cancel             = "Annulla";
$lang->close              = "Chiudi";
$lang->confirm            = "Conferma";
$lang->delete             = "Elimina";
$lang->edit               = "Modifica";
$lang->ok                 = "Ok";
$lang->remove             = "Rimuovi";
$lang->show               = "Mostra";

// Words
$lang->class              = "Corso";
$lang->credits            = "Crediti";
$lang->dated              = "Data";
$lang->directory          = "Cartella";
$lang->documentation      = "Documentazione";
$lang->filename           = "Nome del file";
$lang->homePage           = "Pagina iniziale";
$lang->install            = "Installa";
$lang->professor          = "Professore";
$lang->progress           = "Progresso";
$lang->search             = "Cerca...";
$lang->separator          = "Separatore";
$lang->settings           = "Impostazioni";
$lang->title              = "Titolo";

// ---------- Class ----------
$lang->idclass            = "ID del corso";
$lang->classDirectory     = "Cartella delle videolezioni";
$lang->classList          = "Lista dei corsi";
$lang->className          = "Nome del corso";
$lang->newClass           = "Nuovo corso";
$lang->removeThisClass    = "Spostare nel cestino la classe '{className}'?";
$lang->deleteThisClass    = "Eliminare definitivamente la classe '{className}'?";

// Class statements
$lang->classAdded         = "Corso '{className}' aggiunto";
$lang->classNotAdded      = "Corso non aggiunto";
$lang->classEdited        = "Corso '{className}' modificato";
$lang->classNotEdited     = "Corso non modificato";
$lang->classDeleted       = "Corso '{className}' eliminato";
$lang->classNotDeleted    = "Corso non eliminato";
$lang->classRemoved       = "Corso '{className}' rimosso";
$lang->classNotRemoved    = "Corso non rimosso";
$lang->classCompleted     = "Hai completato questo corso";


// ---------- Lesson ----------
$lang->idlesson           = "ID della lezione";
$lang->defaultLessonTitle = "Lezione del {lessonDated}";
$lang->lessonList         = "Lista delle lezioni";
$lang->previousLesson     = "Lezione precedente";
$lang->nextLesson         = "Lezione successiva";
$lang->newLesson          = "Nuova lezione";
$lang->silencesList       = "Elenco dei silenzi";
$lang->removeThisLesson   = "Spostare nel cestino la lezione '{lessonTitle}'?";
$lang->deleteThisLesson   = "Eliminare definitivamente la lezione '{lessonTitle}'?";
$lang->screenshotName     = "{lessonTitle} ({lessonClass}) [{lessonMark}]";

// Lesson statements
$lang->lessonAdded        = "Lezione '{lessonTitle}' aggiunta";
$lang->lessonNotAdded     = "Lezione non aggiunta";
$lang->lessonEdited       = "Lezione '{lessonTitle}' modificata";
$lang->lessonNotEdited    = "Lezione non modificata";
$lang->lessonDeleted      = "Lezione '{lessonTitle}' eliminata";
$lang->lessonNotDeleted   = "Lezione non eliminata";
$lang->lessonRemoved      = "Lezione '{lessonTitle}' rimossa";
$lang->lessonNotRemoved   = "Lezione non rimossa";

// Lesson status
$lang->started            = "Iniziata";
$lang->toBeWatched        = "Da guardare";
$lang->watched            = "Guardata";
$lang->setAsWatched       = "Segna già vista";
$lang->setToBeWatched     = "Segna da vedere";

// Player
$lang->overlayEnabled     = "Overlay abilitato";
$lang->overlayDisabled    = "Overlay disabilitato";
$lang->paused             = "In pausa";
$lang->play               = "Riproduci";
$lang->playing            = "In riproduzione";
$lang->rate               = "Velocità";
$lang->resume             = "Riprendi";
$lang->soundOff           = "Muto";
$lang->soundOn            = "Sonoro";
$lang->volume             = "Volume";
$lang->zoomArea           = "Seleziona l'area da ingrandire";
$lang->zoomReseted        = "Dimensioni originali";

// Database
$lang->dbConnectionFailed = "Connessione al database fallita.";
$lang->dbNotFound         = "Il database non è stato trovato.";
$lang->installSuccessful  = "Installazione riuscita. Reindirizzamento alla pagina iniziale...";
$lang->installFailed      = "Installazione fallita.";
$lang->notYetInstalled    = "Il database non è ancora stato installato. Installarlo ora?";

// FFmpeg
$lang->ffmpegCopyPaste    = "Copia e incolla l'output di";
$lang->ffmpegOutput       = "Output di ffmpeg";

// Errors
$lang->success            = "Successo";
$lang->failed             = "Operazione fallita";
$lang->errFileOpen        = "Errore nell'apertura del file";
$lang->errInvalidData     = "Dati non validi";

// Feedback
$lang->feedback           = "Feedback";
$lang->feedbackWrite      = "Cosa vorresti comunicare allo sviluppatore?";
$lang->feedbackSend       = "Invia";
$lang->feedbackThanks     = "Grazie per il tuo feedback :)";
$lang->yourName           = "Il tuo nome";
$lang->yourMail           = "La tua mail";

?>
