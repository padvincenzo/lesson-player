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

include("_language.php");

// Credenziali database
$host = 'localhost';
$user = 'root';
$database = 'lessons';
$psw = '';

$dbh = mysqli_connect($host, $user, $psw, $database);

if(!$dbh) {
  Response::err($lang["dbConnectionFailed"]);
  die();
}

class Input {
  public static $errors = array();

  public static function err($id) {
    Input::$errors[] = $id;
    return false;
  }

  public static function number($from, $id) {
    $exp = "/^[0-9]+$/";

    if(isset($from[$id]) && (is_int($from[$id]) || preg_match($exp, $from[$id])))
      return true;
    else
      return Input::err($id);
  }

  public static function float($from, $id) {
    $exp = "/^[0-9]+(\.[0-9]+)?$/";

    if(isset($from[$id]) && preg_match($exp, $from[$id]))
      return true;
    else
      return Input::err($id);
  }

  public static function text($from, $id, $maxlenght = 150) {
    $exp = "/^[a-zA-Z0-9\/\-\.\*\(\)\[\]\{\}_ &!@#àèìòùáéíóú]+$/";

    if(isset($from[$id]) && preg_match($exp, $from[$id]) && strlen($from[$id]) <= $maxlenght)
      return true;
    else
      return Input::err($id);
  }

  public static function date($from, $id) {
    $exp = "/^\d{4}\-\d{2}\-\d{2}$/";

    if(isset($from[$id]) && preg_match($exp, $from[$id]))
      return true;
    else
      return Input::err($id);
  }
}

class Response {
  public $response;

  function __construct($result = false, $message = "", $data = "") {
    $this->response = array(
      "result" => $result,
      "message" => $message,
      "data" => $data
    );
  }

  function __destruct() {
    global $dbh;
    mysqli_close($dbh);
    echo json_encode($this->response);
  }

  public static function err($message = null) {
    global $lang;
    if($message == null)
      $message = $lang["failed"];
    return new Response(false, $message);
  }

  public static function ok($message = null, $data = "") {
    global $lang;
    if($message == null)
      $message = $lang["success"];
    return new Response(true, $message, $data);
  }

  public static function err_data() {
    global $lang;
    return Response::err($lang["invalidData"] . ": " . join("; ", Input::$errors));
  }
}

?>
