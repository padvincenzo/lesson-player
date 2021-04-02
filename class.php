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
    return listClasses();
  }
  case "add": {
    return addClass();
  }
  case "edit": {
    return editClass();
  }
  default: {
    Response::err_data();
  }
}


function editClass() {
  global $dbh, $data;

  if(!Input::number($data, "idclass") ||
    ! Input::text($data, "className", 50) ||
    ! Input::text($data, "professor", 50) ||
    ! Input::text($data, "directory", 100))
    return Response::err_data();

  $idclass = $data["idclass"];
  $className = $data["className"];
  $professor = $data["professor"];
  $directory = $data["directory"];

  $result = mysqli_query($dbh, "update class set name = '$className', professor = '$professor', directory = '$directory' where idclass = '$idclass';");
  if($result) {
    return Response::ok(Lang::classEdited, array(
      "name" => $className,
      "professor" => $professor,
      "directory" => $directory
    ));
  }

  return Response::err(Lang::classNotEdited);
}

function addClass() {
  global $dbh, $data;

  if(! Input::text($data, "className", 50) ||
    ! Input::text($data, "professor", 50) ||
    ! Input::text($data, "directory", 100))
    return Response::err_data();

  $className = $data["className"];
  $professor = $data["professor"];
  $directory = $data["directory"];

  $result = mysqli_query($dbh, "insert into class (name, professor, directory) values ('$className', '$professor', '$directory');");
  if($result) {
    return Response::ok(Lang::classAdded, array(
      "idclass" => mysqly_insert_id($dbh),
      "name" => $className,
      "professor" => $professor,
      "directory" => $directory,
      "n" => 0
    ));
  }

  return Response::err(Lang::classNotAdded);
}

function listClasses() {
  global $dbh;
  $result = mysqli_query($dbh, "select c.idclass, c.name, c.professor, c.directory, count(l.idclass) as nLessons, sum(l.watched) as nWatched
    from class c left join lesson l
    on l.idclass = c.idclass
    group by c.idclass
    order by l.lastPlayed desc;");
  $classes = mysqli_fetch_all($result, MYSQLI_ASSOC);
  return Response::ok(Lang::classList, $classes);
}

?>
