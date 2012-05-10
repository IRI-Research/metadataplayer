#!/bin/sh
sh ../res/ant/bin/ant -f client.xml
cp ../../build/LdtPlayer-core.js ../../test/metadataplayer/LdtPlayer-core.js
cp ../../src/widgets/* ../../test/metadataplayer