#!/bin/bash

for lesson in * ; do
	if [[ $lesson =~ \.mp4$ ]]; then
		echo -n Detecting silences of ${lesson} ... 
		name=`echo $lesson | cut -d '.' -f 1`
		txt=${name}.txt
		ffmpeg -hide_banner -nostats -vn -i "${lesson}" -af silencedetect=n=0.002:d=2.3 -f null - &> "${txt}"
		echo done
	fi
done


