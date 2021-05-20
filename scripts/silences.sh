#!/bin/bash

# 1. Move this file where your videos are;
# 2. Open the terminal in the same directory;
# 3. Run ./silences.sh

# This script will save the output produced by ffmpeg in text files with the same name of your videos.

for lesson in *.mp4 ; do
	echo -n "Detecting silences of ${lesson} ..."
	txt=${lesson}.txt
	ffmpeg -hide_banner -nostats -vn -i "${lesson}" -af silencedetect=n=0.002:d=2.3 -f null - 2>&1 | grep -E 'silence_(start|end)' > "${txt}"
	echo " done"
done


