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

include("languages/it.php");

// Database credentials
$host = "localhost";
$user = "root";
$password = "";
$database = "lessons";

// Create connection
$dbh = new mysqli($host, $user, $password);

// Check connection
if ($dbh->connect_error) {
  die($lang->dbConnectionFailed . ": " . $dbh->connect_error);
}

if(! $dbh->select_db($database)) {
  die($lang->dbNotFound);
}


class Input {
  public static $e = array();

  public static function err($id) {
    global $lang;
    Input::$e[] = $lang->$id;
    return false;
  }

  public static function errors() {
    return !empty(Input::$e);
  }

  public static function number($from, $id) {
    $exp = "/^[0-9]+$/";

    if(isset($from->$id) && (is_int($from->$id) || preg_match($exp, $from->$id)))
      return true;

    return Input::err($id);
  }

  public static function float($from, $id) {
    $exp = "/^[0-9]+(\.[0-9]+)?$/";

    if(isset($from->$id) && preg_match($exp, $from->$id))
      return true;

    return Input::err($id);
  }

  public static function text($from, $id, $maxlength = 150) {
    $exp = "/^[A-Za-z0-9\-\.\*_~%]+$/";

    if(isset($from->$id) && preg_match($exp, $from->$id) && strlen($from->$id) <= $maxlength)
      return true;

    return Input::err($id);
  }

  public static function date($from, $id) {
    $exp = "/^\d{4}\-\d{2}\-\d{2}$/";

    if(isset($from->$id)) {
      $from->$id = rawurldecode($from->$id);
      if(preg_match($exp, $from->$id))
        return true;
    }

    return Input::err($id);
  }
}

class Response {
  public $response;

  function __construct($result = false, $message = "", $data = "") {
    $this->response = (object) [];
    $this->response->result = $result;
    $this->response->message = $message;
    $this->response->data = $data;
  }

  function __destruct() {
    global $dbh;
    if($dbh)
      $dbh->close();
    echo json_encode($this->response);
  }

  public static function err($message = null) {
    global $lang;
    if($message == null)
      $message = $lang->failed;
    return new Response(false, $message);
  }

  public static function ok($message = null, $data = "") {
    global $lang;
    if($message == null)
      $message = $lang->success;
    return new Response(true, $message, $data);
  }

  public static function err_data() {
    global $lang;
    return Response::err($lang->errInvalidData . ": " . join("; ", Input::$e));
  }
}

?>
