This is the README for MetaDataPlayer, an opensource web player with metadata support.

Features
========

    o Reads json-converted cinelab metadata
    o Reads from Youtube, Dailymotion and Flash backends
    o Loads the data as JSON as well as JSONP
    

Requirements
============

- jQuery 1.4
- jQuery UI 1.4
- the java jre (for building the sources)

Building the library
====================

The library files are scattered in many files. An ant build script has been made to make the developer and
minified versions of the player. It is located in sbin/build/client.xml.
To build the library, simply run sbin/build/compil.bat if you are running windows, or sbin/build/compil.sh
if you're running Unix.

Running the examples
====================

You'll have to have a web server configured to serve the metadataplayer directory, because
of the flash cross-domain policy.

The code
========

The code is scattered among several files, which are concatenated and minified during the
build process. The html templates in the templates/ directory are also "jsified" during
this process, to be used by the js code.
