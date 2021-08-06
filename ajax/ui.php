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
$request = isset($data->request) ? $data->request : "nothing";

if($request == "nothing") {
  $dbh->close();
  die();
}

switch($request) {
  case "ip": {
    return getLocalIPAddress();
  }
}


function getLocalIPAddress() {
	global $dbh, $lang;

	try {
		/* Based on https://stackoverflow.com/a/36604437 */
		$sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);

		if($sock === false) {
			return Response::err($lang->IPNotAvailable);
		}

		@socket_connect($sock, "8.8.8.8", 53);

		if(@dns_get_record("127.0.0.1") === false) {
			return Response::err($lang->IPNotAvailable);
		}

		socket_getsockname($sock, $ip); // $name passed by reference

		// This is the local machine's external IP address
		return Response::ok("", $ip);

	} catch(Exception $e) {
		return Response::err($lang->IPNotAvailable);
	}
}
