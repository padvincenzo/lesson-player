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
		<title>Lesson Player</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<!-- VideoJS -->
		<!-- <script type="text/javascript">window.HELP_IMPROVE_VIDEOJS = false;</script> -->
		<!-- <script src="https://unpkg.com/video.js@7/dist/video.min.js"></script> -->
		<!-- <link href="https://unpkg.com/video.js@7/dist/video-js.min.css" rel="stylesheet"> -->
		<script src="video.js@7.11.8/video.min.js"></script>
		<link href="video.js@7.11.8/video-js.min.css" rel="stylesheet">
		<link href="video.js@7.11.8/theme.css" rel="stylesheet">

		<link href="style.css" rel="stylesheet">

		<script type="text/javascript">
			<?php echo "const lang = " . json_encode($lang) . ";"; ?>
		</script>

		<script src="code.js" type="text/javascript"></script>
		<script src="js/ui.js" type="text/javascript"></script>
		<script src="js/message.js" type="text/javascript"></script>
		<script src="js/form.js" type="text/javascript"></script>
		<script src="js/lesson.js" type="text/javascript"></script>
		<script src="js/class.js" type="text/javascript"></script>
		<script src="js/player.js" type="text/javascript"></script>

		<link rel="icon" href="img/icon.svg">
	</head>

	<body>

		<div id="my-p-background" tabindex="1">
			<div id="my-p-wrapper">
				<video id="my-player"
					class="video-js vjs-theme-lesson"
					data-setup='{"fluid": true, "controls": true, "autoplay": false, "preload": "auto", "playbackRates": [0.8, 1, 1.25, 1.5, 2, 2.5], "rewind": true}'>
				</video>
			</div>
		</div>

		<div id="container"></div>

		<footer>
			<p>Developed by Vincenzo Padula</p>
			<p><a href="credits.php" target="_blank">Credits</a></p>
		</footer>

	</body>
</html>
