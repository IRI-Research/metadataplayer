# Intégration du Metadataplayer #

ATTENTION !
Cette documentation se réfère à la dernière version du Metadataplayer, disponible dans la branche **default** du repository
http://www.iri.centrepompidou.fr/dev/hg/metadataplayer

## Chargement du script ##

Le fichier *LdtPlayer-core.js* doit être référencé dans l'entête du fichier HTML

    <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <title>Test d’intégration du Metadataplayer</title>
        <script type="text/javascript" src="metadataplayer/LdtPlayer-core.js" type="text/javascript"></script>
    </head>

## Création d'un élément conteneur pour le Metadataplayer ##

    <body>
        <div id="Metadataplayer"></div>

Le script doit se faire après le chargement de l’élément, soit en rajoutant un élément <*script*> en bas de page, soit en utilisant un événement de type *body.onload* ou, avec jQuery, *$(document).ready()*

    <script type="text/javascript">

## Configuration de la langue de l’interface ##

La langue est définie par un code ISO 639-1 (par exemple, "es" pour l’Espagnol, "ja" pour le Japonais, "eu" pour le Basque, "ee" pour l’Ewe). Pour l’instant, seuls l’Anglais ("en") et le Français ("fr") sont disponibles.

    IriSP.language = "fr";

## Configuration des emplacements des bibliothèques ##

Par défaut (fichier *defaults.js*), les bibliothèques sont chargées soit depuis un CDN (Content Distribution Network), soit depuis le répertoire *js/libs*

La configuration se fait par les propriétés de l’objet *IriSP.libFiles*

Pour utiliser le CDN:

    IriSP.libFiles.useCdn = true;

Pour changer la localisation du répertoire des bibliothèques:

    IriSP.libFiles.defaultDir = "/chemin/libs";

Pour changer la localisation d’une bibliothèque individuellement:

    IriSP.libFiles.locations.jQueryUI = "libs/jquery-ui-1.8.16.custom.min.js";
    IriSP.libFiles.locations.jwPlayerSWF = "libs/jwplayer/player.swf";

## Configuration de sources de métadonnées ##

Une source de métadonnées est définie par son URL et le type de sérialiseur à utiliser.

Par exemple:

    var metadataSource = {
        url: "data/mydata.json",
        type: "ldt"
    };

Les sources de métadonnées sont utilisées ensuite dans la configuration de la fenêtre vidéo et de ses widgets.

## Configuration de la fenêtre vidéo ##

Dans cette version, la fenêtre vidéo est désormais un widget. Cette section est donc obsolète.

## Configuration de l’interface utilisateur ##

L’interface se configure par un objet contenant les propriétés suivantes:

- **container**: l’ID de l’élément HTML dans lequel le player sera instancié.
- **width** et **height**: largeur et hauteur de l’interface (*height* est optionnel).
- **default\_options**: des options de configuration communes à tous les widgets, par exemple, comme ci-dessous, une source de métadonnées communes.
- **css**: l’URL du fichier CSS de base (LdtPlayer-core.css)
- **widgets**: la liste des widgets, sous la forme [ { type: *Type du widget*, option_1: *Valeur de l’option 1* } ]. Pour les options des widgets, se référer au document *Architecture générale*

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

## Instanciation du player ##

Le player s’instancie en créant un objet de classe **IriSP.Metadataplayer**.

Exemple:

    var monPlayer = new IriSP.Metadataplayer(config);
