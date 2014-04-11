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

## Configuration of a metadata source ##

A metadata source is defined by its url and file type (which defines the *serializer* to use).

Example:

    var metadataSource = {
        url: "data/mydata.json",
        type: "ldt"
    };

Metadata sources are then used to configure both the video player and the widgets.

## Configuration of the video player ##

In this version, the video player is now a widget. This section is therefore obsolete

## User Interface Configuration ##

The interface is configured with the following properties:

- **container**: ID of the DOM element in which the metadataplayer will be instantiated.
- **width** et **height**: width and height of the interface (*height* is optional).
- **default\_options**: Configuration options that will be passed to all widgets. In the example below, all widgets will connect to the same metadata source.
- **css**: The URL of the base CSS stylesheet (LdtPlayer-core.css)
- **widgets**: A list of widgets, in the following format: [ { type: *Widget type*, option_1: *Option 1 value* } ]. For widget options, please refer to the *general architecture* document

Exemple:

    var config = {
        container : "Metadataplayer",
        default_options: {
            metadata: metadataSource
        },
        css : "metadataplayer/css/LdtPlayer-core.css",
        widgets: [
            {
                type: "AutoPlayer"
            },
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

## Player instanciation ##

The metadataplayer is instantiated by creating an object of class **IriSP.Metadataplayer**.

Exemple:

    var myPlayer = new IriSP.Metadataplayer(config);
