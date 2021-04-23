#!/bin/bash

# 1. Move this file where your videos are.
# 2. Open the terminal;
# 3. Run ./silences.sh
#
# This script will save the output produced by ffmpeg in files with the same name of your videos.

for lesson in * ; do
	if [[ $lesson =~ \.mp4$ ]]; then
		echo -n "Detecting silences of ${lesson} ... "
		name=`echo $lesson | cut -d '.' -f 1`
		txt=${name}.txt
		ffmpeg -hide_banner -nostats -vn -i "${lesson}" -af silencedetect=n=0.002:d=2.3 -f null - &> "${txt}"
		echo "done"
	fi
done


