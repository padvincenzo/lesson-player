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
    return listClasses();
  }
  case "add": {
    return addClass();
  }
  case "edit": {
    return editClass();
  }
}


function toDirectory($directory) {
  if(substr($directory, -1) != "/")
    $directory .= "/";

  return $directory;
}

function editClass() {
  global $dbh, $lang, $data;

  Input::number($data, "idclass");
  Input::text($data, "className", 150);
  Input::text($data, "professor", 150);
  Input::text($data, "directory", 200);
  if(Input::errors())
    return Response::err_data();

  $idclass = $data->idclass;
  $className = $data->className;
  $professor = $data->professor;
  $directory = toDirectory($data->directory);

  $result = mysqli_query($dbh, "update class set name = '$className', professor = '$professor', directory = '$directory' where idclass = '$idclass';");
  if($result) {
    return Response::ok($lang["classEdited"], array(
      "name" => $className,
      "professor" => $professor,
      "directory" => $directory
    ));
  }

  return Response::err($lang["classNotEdited"]);
}

function addClass() {
  global $dbh, $lang, $data;

  Input::text($data, "className", 150);
  Input::text($data, "professor", 150);
  Input::text($data, "directory", 200);
  if(Input::errors())
    return Response::err_data();

  $className = $data->className;
  $professor = $data->professor;
  $directory = toDirectory($data->directory);

  $result = mysqli_query($dbh, "insert into class (name, professor, directory) values ('$className', '$professor', '$directory');");
  if($result) {
    return Response::ok($lang["classAdded"], array(
      "idclass" => mysqli_insert_id($dbh),
      "name" => $className,
      "professor" => $professor,
      "directory" => $directory,
      "n" => 0
    ));
  }

  return Response::err($lang["classNotAdded"]);
}

function listClasses() {
  global $dbh, $lang;
  $result = mysqli_query($dbh, "select c.idclass, c.name, c.professor, c.directory, count(l.idclass) as nLessons, sum(l.watched) as nWatched
    from class c left join lesson l
    on l.idclass = c.idclass
    group by c.idclass
    order by l.lastPlayed desc;");
  $classes = mysqli_fetch_all($result, MYSQLI_ASSOC);
  return Response::ok($lang["classList"], $classes);
}

?>
