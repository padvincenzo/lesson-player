@echo off
title silences.bat

rem 1. Move this file and ffmpeg.exe where your videos are.
rem 2. Double click on this file

rem This script will save the output produced by ffmpeg in text files with the same name of your videos.

rem Note: If you have an antivirus running, it may deny the execution of this script on the first run.

for %%l in ("*.mp4") do (
	echo|set /p="Detecting silences of %%l ... "
	ffmpeg.exe -hide_banner -nostats -vn -i "%%l" -af silencedetect=n=0.002:d=2.3 -f null - 2> "%%l.txt"
	echo done
)

echo All done
pause
