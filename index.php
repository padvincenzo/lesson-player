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
$dbh->close();

?>
<!DOCTYPE html>
<html lang="<?php echo $langCode; ?>">
	<head>
		<title>Lesson Player</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="manifest" href="manifest.json">

		<!-- Disable cache (to avoid problems in updates. Better solutions are welcome) -->
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />

		<!-- VideoJS -->
		<!-- <script type="text/javascript">window.HELP_IMPROVE_VIDEOJS = false;</script> -->
		<!-- <script src="https://unpkg.com/video.js@7/dist/video.min.js"></script> -->
		<!-- <link href="https://unpkg.com/video.js@7/dist/video-js.min.css" rel="stylesheet"> -->
		<script src="video.js@7.11.8/video.min.js"></script>
		<link href="video.js@7.11.8/video-js.min.css" rel="stylesheet">
		<link href="video.js@7.11.8/theme.css" rel="stylesheet">

		<link href="style/style.css" rel="stylesheet">
		<link href="style/message.css" rel="stylesheet">
		<link href="style/player.css" rel="stylesheet">
		<link href="style/cards.css" rel="stylesheet">
		<link href="style/form.css" rel="stylesheet">

		<!-- Change the theme of the site. Default is "themes/dark.css" -->
		<link id="theme" href="themes/dark.css" rel="stylesheet">

		<script type="text/javascript">
			const lang = <?php echo json_encode($lang); ?>;
			const themes = <?php echo json_encode(glob("themes/*.css")) ?>;
		</script>

		<script src="code.js" type="text/javascript"></script>
		<script src="js/ui.js" type="text/javascript"></script>
		<script src="js/message.js" type="text/javascript"></script>
		<script src="js/form.js" type="text/javascript"></script>
		<script src="js/lesson.js" type="text/javascript"></script>
		<script src="js/class.js" type="text/javascript"></script>
		<script src="js/player.js" type="text/javascript"></script>

		<link rel="icon" href="img/icon.svg" type="image/svg+xml" />
		<link rel="shortcut icon" href="img/icon.ico" type="image/x-icon" />
		<link rel="apple-touch-icon" href="img/icon.svg" type="image/svg+xml" />
	</head>

	<body>

		<div id="header">
			<div id="header-logo" title="<?php echo $lang->homePage; ?>">
				<img src="img/icon.svg" alt="Lesson Player">
				<p>Lesson Player</p>
			</div>
			<div id="header-title">
				<p id="header-class"></p>
				<p id="header-separator"></p>
				<p id="header-lesson"></p>
			</div>
		</div>

		<div id="my-p-background" tabindex="1">
			<div id="my-p-wrapper">
				<video id="my-player" class="video-js vjs-theme-lesson"></video>
			</div>
		</div>

		<div id="container"></div>

		<footer>
			<p>Developed by <a href="https://vincenzopadula.altervista.org" target="_blank">Vincenzo Padula</a></p>
			<p>
				<a href="JavaScript:UI.showCredits();"><?php echo $lang->credits; ?></a>
				&middot;
				<a href="JavaScript:UI.feedback();">Feedback</a>
				&middot;
				<a href="https://vincenzopadula.altervista.org/docs/lesson-player/" target="_blank"><?php echo $lang->documentation; ?></a>
				&middot;
				<a href="JavaScript:UI.settings();"><?php echo $lang->settings; ?></a>
				&middot;
				<a href="JavaScript:UI.showKeyboardShortcuts();"><?php echo $lang->shortcuts; ?></a>
			</p>
			<p id="ip-address"></p>
		</footer>

	</body>
</html>
