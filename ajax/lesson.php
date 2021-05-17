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

include("../_connect.php");

$data = json_decode(file_get_contents("php://input"));
$request = isset($data->request) ? $data->request : "list";

switch($request) {
  case "list": {
    return listLessons();
  }
  case "add": {
    return addLesson();
  }
  case "edit": {
    return editLesson();
  }
  case "mark": {
    return markLesson();
  }
  case "setToBeWatched": {
    return setToBeWatched();
  }
  case "setAsWatched": {
    return setAsWatched();
  }
  case "getNext": {
    return getNext();
  }
  case "getPrevious": {
    return getPrevious();
  }
  case "getSilences": {
    return getSilences();
  }
  case "rate": {
    return changeRate();
  }
}


function getNext() {
  global $dbh, $lang, $data;

  Input::number($data, "idclass");
  if(Input::errors())
    return Response::err_data();

  $idclass = $data->idclass;

  $result = $dbh->query("select * from lesson where idclass = '$idclass' and watched = false order by dated asc limit 1;");
  if($result) {
    $lesson = $result->fetch_assoc();
    return Response::ok($lang->nextLesson, $lesson);
  }

  return Response::err();
}

function getPrevious() {
  global $dbh, $lang, $data;

  Input::number($data, "idclass");
  if(Input::errors())
    return Response::err_data();

  $idclass = $data->idclass;

  // !!! Watch out !!!
  $result = $dbh->query("select * from lesson where idclass = '$idclass' and watched = true order by dated desc limit 1;");
  if($result) {
    $lesson = $result->fetch_assoc();
    return Response::ok($lang->previousLesson, $lesson);
  }

  return Response::err();
}

function markLesson() {
  global $dbh, $lang, $data;

  Input::number($data, "idlesson");
  Input::float($data, "mark");
  if(Input::errors())
    return Response::err_data();

  $idlesson = $data->idlesson;
  $mark = $data->mark;

  $result = $dbh->query("update lesson set mark = '$mark', lastPlayed = now() where idlesson = '$idlesson';");
  return $result ? Response::ok() : Response::err();
}

function changeRate() {
  global $dbh, $lang, $data;

  Input::number($data, "idlesson");
  Input::float($data, "rate");
  if(Input::errors())
    return Response::err_data();

  $idlesson = $data->idlesson;
  $rate = $data->rate;

  $result = $dbh->query("update lesson set playbackRate = '$rate' where idlesson = '$idlesson';");
  return $result ? Response::ok() : Response::err();
}

function getSilences() {
  global $dbh, $lang, $data;

  Input::number($data, "idlesson");
  if(Input::errors())
    return Response::err_data();

  $idlesson = $data->idlesson;

  $result = $dbh->query("select t_start, t_end from silence where idlesson = '$idlesson' order by t_start asc;");
  $silences = $result->fetch_all(MYSQLI_ASSOC);
  return Response::ok($lang->silencesList, $silences);
}

function setToBeWatched() {
  global $dbh, $lang, $data;

  Input::number($data, "idlesson");
  if(Input::errors())
    return Response::err_data();

  $idlesson = $data->idlesson;

  $result = $dbh->query("update lesson set mark = 0, watched = false where idlesson = '$idlesson';");
  return $result ? Response::ok() : Response::err();
}

function setAsWatched() {
  global $dbh, $lang, $data;

  Input::number($data, "idlesson");
  if(Input::errors())
    return Response::err_data();

  $idlesson = $data->idlesson;

  $result = $dbh->query("update lesson set mark = 0, watched = true, lastPlayed = now() where idlesson = '$idlesson';");
  return $result ? Response::ok() : Response::err();
}

function editLesson() {
  global $dbh, $lang, $data;

  Input::number($data, "idlesson");
  Input::date($data, "dated");
  Input::text($data, "title", 150);
  Input::text($data, "professor", 150);
  Input::text($data, "filename", 200);
  if(Input::errors())
    return Response::err_data();

  $idlesson = $data->idlesson;
  $dated = $data->dated;
  $title = $data->title;
  $professor = $data->professor;
  $filename = $data->filename;

  $result = $dbh->query("update lesson set dated = '$dated', title = '$title', professor = '$professor', filename = '$filename' where idlesson = '$idlesson';");
  if($result) {
    insertSilences();
    return Response::ok($lang->lessonEdited, array(
      "dated" => $dated,
      "title" => $title,
      "professor" => $professor,
      "filename" => $filename
    ));
  }

  return Response::err($lang->lessonNotEdited);
}

function addLesson() {
  global $dbh, $lang, $data;

  Input::number($data, "idclass");
  Input::date($data, "dated");
  Input::text($data, "title", 150);
  Input::text($data, "professor", 150);
  Input::text($data, "filename", 200);
  if(Input::errors())
    return Response::err_data();

  $idclass = $data->idclass;
  $dated = $data->dated;
  $title = $data->title;
  $professor = $data->professor;
  $filename = $data->filename;

  $result = $dbh->query("insert into lesson (idclass, dated, title, professor, filename) values ('$idclass', '$dated', '$title', '$professor', '$filename');");
  if($result) {
    $data->idlesson = $idlesson = $dbh->insert_id();
    insertSilences();
    return Response::ok($lang->lessonAdded, array(
      "idclass" => $idclass,
      "idlesson" => $idlesson,
      "dated" => $dated,
      "title" => $title,
      "professor" => $professor,
      "filename" => $filename
    ));
  }

  return Response::err($lang->lessonNotAdded);
}

function listLessons() {
  global $dbh, $lang, $data;

  Input::number($data, "idclass");
  if(Input::errors())
    return Response::err_data();

  $idclass = $data->idclass;
  $result = $dbh->query("select * from lesson where idclass = '$idclass' order by dated, idlesson;");
  $lessons = $result->fetch_all(MYSQLI_ASSOC);
  return Response::ok($lang->lessonList, $lessons);
}

function insertSilences() {
  global $dbh, $lang, $data;

  if(! isset($data->silences) || $data->silences == "")
    return;

  $idlesson = $data->idlesson;
  $silences = rawurldecode($data->silences);

  // Remove any previous silences
  $result = $dbh->query("delete from silence where idlesson = '$idlesson';");

  // Arbitrary margins
  $marginLeft = 0.25; // seconds after silence starts
  $marginRight = 2; // seconds before silence ends

  // Parse ffmpeg output
  $exp = "/silence_(start|end): (-?\d+(.\d+)?(e[+\-]?\d+)?)/";
  $timestamps = array();

  if(preg_match_all($exp, $silences, $matches)) {
    for ($i = 0; $i < count($matches[0]) - 1; $i += 2) {
      $t_start = $matches[2][$i] + $marginLeft;
      $t_end = $matches[2][$i + 1] - $marginRight;
      if($t_end - $t_start > 0)
        $timestamps[] = "('$idlesson', '$t_start', '$t_end')";
    }
  }

  if(count($timestamps) > 0) {
    // echo $header . join(", ", $timestamps);
    $result = $dbh->query("insert into silence (idlesson, t_start, t_end) values" . join(", ", $timestamps));
  }
}

?>
