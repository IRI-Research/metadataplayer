# Integrating the Metadataplayer in an HTML page #

WARNING !
This documentation refers to the latest version of Metadataplayer, available in the **default** branch in our repository
http://www.iri.centrepompidou.fr/dev/hg/metadataplayer

## Loading the script ##

The *LdtPlayer-core.js* must be declared in the HTML header.

    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <title>Metadataplayer integration test</title>
        <script type="text/javascript" src="metadataplayer/LdtPlayer-core.js" type="text/javascript"></script>
    </head>

## Declaration of a container HTML element ##

    <body>
        <div id="Metadataplayer"></div>

The script for configuring and loading the Metadataplayer must be executed after this element is declared either by :
    - Adding a <*script*> element at the bottom of the page
    - Using an event such as *body.onload*
    - Using jQuery's *$(function(){})* syntax or an equivalent in your favorite framework

    <script type="text/javascript">

## Interface language configuration ##

Language is defined ISO 639-1 (e.g., "es" pour l’Espagnol, "ja" pour le Japonais, "eu" pour le Basque). As of July 2012, only English ("en") and French ("fr") are available.

    IriSP.language = "fr";

## Library location configuration ##

By default (as defined in *defaults.js*), librairies are loaded from either a CDN (Content Distribution Network) or from the *js/libs* directory.

Configuration is done by overriding the properties of *IriSP.libFiles*

To use the CDN:

    IriSP.libFiles.useCdn = true;

To change the location of the library directory:

    IriSP.libFiles.defaultDir = "/path/libs";

To change individual locations or to point to files outside the default directory:

    IriSP.libFiles.locations.jQueryUI = "libs/jquery-ui-1.8.16.custom.min.js";
    IriSP.libFiles.locations.jwPlayerSWF = "libs/jwplayer/player.swf";

## Configuration of metadata source ##

A metadata source is defined by its url and file type (which defines the *serializer* to use).

Example:

    var metadataSource = {
        url: "data/mydata.json",
        type: "ldt"
    };

Metadata sources are then used to configure both the video player and the widgets.

## Configuration of the video player ##

The video player is configured through an object having the following properties:

- **metadata**: Metadata source.
- **type**: Video player type :
    - **"jwplayer"**: Uses flash-based jwPlayer, compatible with many video and audio formats, including MP3 audio, MP4 video and RTMP streams.
    - **"html5"**: Uses the Popcorn.js library to play HTML5 videos. Supported formats : OGG and WebM on Firefox and Chrome, H.264 on Internet Explorer, Safari and Chrome.
    - **"youtube"**: Uses Popcorn's Youtube plugin.
    - **"dailymotion"**
    - **"auto"**: Replaced by *Youtube* or *Dailymotion* for a video hosted on one of these platform, or *jwPlayer* in other cases.
- **width** and **height** of the video player.
- **video**: Video URL. Optional: If present, it overrides the video URL defined in the metadata source.
- Player-specific options, such as **provider** or **streamer** for JwPlayer

Example:

    var playerConfig = {
        metadata: metadataSource,
        type: "jwplayer",
        height: 350,
        width: 620,
        provider: "rtmp"
    };

## User Interface Configuration ##

L’interface se configure par un objet GUI, contenant les propriétés suivantes:

- **container**: l’ID de l’élément HTML dans lequel le player sera instancié.
- **width** et **height**: largeur et hauteur de l’interface (*height* est optionnel).
- **default\_options**: des options de configuration communes à tous les widgets, par exemple, comme ci-dessous, une source de métadonnées communes.
- **css**: l’URL du fichier CSS de base (LdtPlayer-core.css)
- **widgets**: la liste des widgets, sous la forme [ { type: *Type du widget*, option_1: *Valeur de l’option 1* } ]. Pour les options des widgets, se référer au document *Architecture générale*

Exemple:

    var guiConfig = {
        container : "Metadataplayer",
        default_options: {
            metadata: metadataSource
        },
        css : "metadataplayer/css/LdtPlayer-core.css",
        widgets: [
            {
                type: "Slider"
            },{
                type: "Controller",
                disable\_annotate\_btn: true
            },{
                type: "Segments",
                annotation\_type: "Chapters"
            },{
                type: "AnnotationsList",
                container: "AnnotationsListContainer"
            }
        ]
    };

## Instanciation du player ##

Le player s’instancie en créant un objet de type **IriSP.Metadataplayer**.

Exemple:

    var config = {
        player: playerConfig,
        gui: guiConfig
    };
    var monPlayer = new IriSP.Metadataplayer(config);
