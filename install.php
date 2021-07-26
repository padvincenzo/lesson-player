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

// Load script
$filename = "database.sql";
$db_file = fopen($filename, "r") or die($lang->errFileOpen);
$script = fread($db_file, filesize($filename));
fclose($db_file);

// Execute script
$result = $dbh->multi_query($script);
$dbh->close();
?>

<!DOCTYPE html>
<html lang="<?php echo $langCode; ?>">
	<head>
		<title>Install | Lesson Player</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<link href="style/style.css" rel="stylesheet">
    <link rel="icon" href="img/icon.svg">

    <?php if($result) echo "<meta http-equiv='refresh' content='5; url=./'>"; ?>
	</head>

	<body>

    <h3><?php echo $result ? $lang->installSuccessful : $lang->installFailed . "<br>" . $dbh->error(); ?></h3>

	</body>
</html>

<?php
if($result) {
  unlink("install.php");
}
?>
