#!/bin/sh
sh ../res/ant/bin/ant -f client.xml
cp ../../build/LdtPlayer-core.js ../../test/metadataplayer
cp -R ../../src/css/* ../../test/metadataplayer
cp -R ../../src/widgets/* ../../test/metadataplayer