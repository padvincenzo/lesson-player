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

include("_connect.php");

if(!isset($_POST["data"])) {
  Response::err(Lang::dataMiss);
  die();
}

$data = json_decode($_POST["data"], true);
$request = isset($data["request"]) ? $data["request"] : "list";

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
  default: {
    Response::err_data();
  }
}


function getNext() {
  global $dbh, $data;

  if(! Input::number($data, "idclass"))
    return Response::err_data();

  $idclass = $data["idclass"];

  $result = mysqli_query($dbh, "select * from lesson where idclass = '$idclass' and watched = false order by dated asc limit 1;");
  if($result) {
    $lesson = mysqli_fetch_array($result);
    return Response::ok(Lang::nextLesson, $lesson);
  }

  return Response::err();
}

function getPrevious() {
  global $dbh, $data;

  if(! Input::number($data, "idclass"))
    return Response::err_data();

  $idclass = $data["idclass"];

  // !!! Watch out !!!
  $result = mysqli_query($dbh, "select * from lesson where idclass = '$idclass' and watched = true order by dated desc limit 1;");
  if($result) {
    $lesson = mysqli_fetch_array($result);
    return Response::ok(Lang::previousLesson, $lesson);
  }

  return Response::err();
}

function markLesson() {
  global $dbh, $data;

  if(! Input::number($data, "idlesson") ||
    ! Input::float($data, "mark"))
    return Response::err_data();

  $idlesson = $data["idlesson"];
  $mark = $data["mark"];

  $result = mysqli_query($dbh, "update lesson set mark = '$mark', lastPlayed = now() where idlesson = '$idlesson';");
  return $result ? Response::ok() : Response::err();
}

function changeRate() {
  global $dbh, $data;

  if(! Input::number($data, "idlesson") ||
    ! Input::float($data, "rate"))
    return Response::err_data();

  $idlesson = $data["idlesson"];
  $rate = $data["rate"];

  $result = mysqli_query($dbh, "update lesson set playbackRate = '$rate' where idlesson = '$idlesson';");
  return $result ? Response::ok() : Response::err();
}

function getSilences() {
  global $dbh, $data;

  if(! Input::number($data, "idlesson"))
    return Response::err_data();

  $idlesson = $data["idlesson"];

  $result = mysqli_query($dbh, "select t_start, t_end from silence where idlesson = '$idlesson' order by t_start asc;");
  $silences = mysqli_fetch_all($result, MYSQLI_ASSOC);
  return Response::ok(Lang::silencesList, $silences);
}

function setAsWatched() {
  global $dbh, $data;

  if(! Input::number($data, "idlesson"))
    return Response::err_data();

  $idlesson = $data["idlesson"];

  $result = mysqli_query($dbh, "update lesson set mark = 0, watched = true, lastPlayed = now() where idlesson = '$idlesson';");
  return $result ? Response::ok() : Response::err();
}

function editLesson() {
  global $dbh, $data;

  if(! Input::number($data, "idlesson") ||
    ! Input::date($data, "dated") ||
    ! Input::text($data, "title", 50) ||
    ! Input::text($data, "professor", 50) ||
    ! Input::text($data, "filename", 100))
    return Response::err_data();

  $idlesson = $data["idlesson"];
  $dated = $data["dated"];
  $title = $data["title"];
  $professor = $data["professor"];
  $filename = $data["filename"];

  $result = mysqli_query($dbh, "update lesson set dated = '$dated', title = '$title', professor = '$professor', filename = '$filename' where idlesson = '$idlesson';");
  if($result) {
    insertSilences();
    return Response::ok(Lang::lessonEdited, array(
      "dated" => $dated,
      "title" => $title,
      "professor" => $professor,
      "filename" => $filename
    ));
  }

  return Response::err(Lang::lessonNotEdited);
}

function addLesson() {
  global $dbh, $data;

  if(! Input::number($data, "idclass") ||
    ! Input::date($data, "dated") ||
    ! Input::text($data, "title", 50) ||
    ! Input::text($data, "professor", 50) ||
    ! Input::text($data, "filename", 100))
    return Response::err_data();

  $idclass = $data["idclass"];
  $dated = $data["dated"];
  $title = $data["title"];
  $professor = $data["professor"];
  $filename = $data["filename"];

  $result = mysqli_query($dbh, "insert into lesson (idclass, dated, title, professor, filename) values ('$idclass', '$dated', '$title', '$professor', '$filename');");
  if($result) {
    $data["idlesson"] = $idlesson = mysqli_insert_id($dbh);
    insertSilences();
    return Response::ok(Lang::lessonAdded, array(
      "idclass" => $idclass,
      "idlesson" => $idlesson,
      "dated" => $dated,
      "title" => $title,
      "professor" => $professor,
      "filename" => $filename
    ));
  }

  return Response::err(Lang::lessonNotAdded);
}

function listLessons() {
  global $dbh, $data;

  if(! Input::number($data, "idclass"))
    return Response::err_data();

  $idclass = $data["idclass"];
  $result = mysqli_query($dbh, "select * from lesson where idclass = '$idclass' order by dated, idlesson;");
  $lessons = mysqli_fetch_all($result, MYSQLI_ASSOC);
  return Response::ok(Lang::lessonList, $lessons);
}

function insertSilences() {
  global $dbh, $data;

  if(! isset($data["silences"]) || $data["silences"] == "")
    return;

  $idlesson = $data["idlesson"];
  $silences = $data["silences"];

  // Remove any previous silences
  $result = mysqli_query($dbh, "delete from silence where idlesson = '$idlesson';");

  // Parse ffmpeg output
  $exp = "/silence_(start|end): (-?\d+(.\d+)?)/";
  $timestamps = array();

  if(preg_match_all($exp, $silences, $matches)) {
    for ($i = 0; $i < count($matches[0]) - 1; $i += 2) {
      $t_start = $matches[2][$i] + 0.25;
      $t_end = $matches[2][$i + 1] - 2;
      $timestamps[] = "('$idlesson', '$t_start', '$t_end')";
    }
  }

  if(count($timestamps) > 0) {
    // echo $header . join(", ", $timestamps);
    $result = mysqli_query($dbh, "insert into silence (idlesson, t_start, t_end) values" . join(", ", $timestamps));
  }
}

?>
