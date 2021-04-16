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
?>

<!DOCTYPE html>
<html lang="<?php echo $langCode; ?>">
	<head>
		<title><?php echo $lang["credits"]; ?> | Lesson Player</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<link href="style.css" rel="stylesheet">
		<link rel="icon" href="img/icon.svg">

		<style media="screen">
			body {
				padding: 2vh 2vw;
			}

			li {
				margin: 1vh 0;
			}
		</style>
	</head>

	<body>

		<h2><?php echo $lang["credits"]; ?></h2>
		<ul>
			<li>Using <a href="https://videojs.com/" target="_blank">video.js</a> version 7.11.8 and a modified version of <a href="https://github.com/videojs/themes" target="_blank">theme City</a></li>
			<li>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></li>
		</ul>

	</body>
</html>
