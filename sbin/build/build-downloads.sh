#!/bin/sh
./compil.sh
cd ../doc
./convertdocs.sh
cd ../../

rm downloads/*.zip

zip -r downloads/metadataplayer-$(date +%Y%m%d).zip test/ src doc/*.html -x *.mp4 *.webm *.ogv

