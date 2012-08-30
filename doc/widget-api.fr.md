# API de programmation de widgets #

ATTENTION !
Cette documentation se réfère à la v.3 du Metadataplayer, actuellement disponible dans la branche **new-model** du repository
http://www.iri.centrepompidou.fr/dev/hg/metadataplayer

## Types et fichiers ##

Les widgets sont créés au moment de l’instanciation du Metadataplayer, en lisant la propriété *gui.widgets* des paramètres de configuration.

Exemple:

    var monPlayer = new IriSP.Metadataplayer({
        player: {...},
        gui: {
            container: ...,
            widgets: [
                {
                    type: "Slider"
                },
                {
                    type: "Controller"
                },
                {
                    type: "MonWidget",
                    option: "valeur"
                },
                ...
            ]
        }
    });

Le *type* du widget détermine quels fichiers, javascript et CSS, seront appelés et quelle classe d'objet sera instanciée.

Par exemple, pour le *type* **MonWidget**, seront appelés **MonWidget.js**, **MonWidget.css** et l’initialisation du widget se fera en appelant la classe **IriSP.Widgets.MonWidget**

Le fichier **MonWidget.js** doit donc contenir une implémentation de **IriSP.Widgets.MonWidget**

## Implémentation d’une classe de widget ##

La classe de Widget doit hériter de IriSP.Widgets.Widget. Le code permettant l’héritage est le suivant:

    IriSP.Widgets.MonWidget = function(player, config) {
        IriSP.Widgets.Widget.call(this, player, config);
    }
    
    IriSP.Widgets.MonWidget.prototype = new IriSP.Widgets.Widget();

### Paramètres d’appel de l’objet Widget ###

Le paramètre **player** correspond à l’objet IriSP.Metadataplayer qui a appelé le widget.

Il sera ensuite accessible dans les fonctions du widget par:

    this.player

Le paramètre **config** correspond aux paramètres de configuration du widget. Dans notre exemple, il s’agit d’un objet contenant:

    {
        type: "MonWidget",
        option: "valeur de l’option"
    }

Les options de configuration sont recopiées dans les propriétés de l’objet widget:

    this.type    => "MonWidget"
    this.option  => "valeur de l’option"

### Propriétés accessibles par le widget ###

#### Popcorn ####

Les fonctions de gestion de la lecture vidéo sont accessibles par la propriété **popcorn** du Metadataplayer.

Par exemple:

    this.player.popcorn.trigger("Evenement"); => déclenche un événement Popcorn de type "Evenement"
    this.player.popcorn.play();               => met le player en lecture
    this.player.popcorn.currentTime()         => obtient le timecode courant, en secondes

#### Source de métadonnées ####

La source de métadonnées est accessible par la propriété **source** du Widget.

Par exemple:

    this.source.getAnnotations();  => obtient la liste des annotations
    this.source.getDuration();     => obtient la durée du média en cours, en millisecondes

#### Sélecteur jQuery ####

Le contenu du widget est géré par la bibliothèque jQuery. Pour accéder à ce contenu, il suffit d’appeller la propriété **$** du widget

Par exemple:

    this.$.html();                         => renvoie le code HTML contenu dans le widget.
    this.$.find("p").html("Hello, world")  => écrit "Hello, world" dans le(s) élément(s) <P> du widget.

### Fonctions facilitatrices du widget ###

Quelques fonctions ont été rajoutées pour faciliter quelques tâches courantes:

#### getWidgetAnnotations ####

Retourne la liste des annotations selon la valeur de la propriété **annotation\_type** du widget:
    - Chaîne de caractères: prend en compte les types d’annotations dont le titre contient la chaîne. Exemple: "chap" permet notamment d’afficher les annotations dans le type d’annotation "Chapitrage"
    - Tableau de chaînes: pour prendre en compte plusieurs types d’annotations
    - false: pour prendre en compte toutes les annotations du projet
    
    this.getWidgetAnnotations();

#### functionWrapper ####

Gère l’accès au fonctions du widget dans des callbacks. Ceci sert à pallier au fait qu’en Javascript, appeler directement une fonction dans un callback ne l’applique pas à l’objet dans lequel elle a été appelée.

**functionWrapper** demande un argument, une chaîne qui est le nom de la fonction à appeler.

Par exemple:

    this.$.click(this.functionWrapper("onClick"));  => Appellera this.onClick() lors d’un click sur le widget

#### bindPopcorn ####

Attache un événement *Popcorn* à une fonction, sur le même mode que *functionWrapper*

Par exemple:

    this.bindPopcorn("timeupdate","onTimeupdate");  => Appellera this.onTimeupdate() lorsque l’événement Popcorn "timeupdate" est déclenché.

#### Autres fonctions ####

Les fonctions relatives aux gabarits seront explicités dans la section Gabarits

### Implémentation de la fonction draw ###

La fonction **draw()** est appelée automatiquement lorsque les métadonnées ont fini d’être chargées. C’est le lieu privilégié pour les fonctions gérant l’apparence du widget.

    IriSP.Widgets.MonWidget.prototype.draw = function() {
        this.$.html("Hello, world");
    }

## Utilisation des gabarits ##

Les gabarits ou *templates* en anglais permettent d’injecter des données dans du code HTML.

### Utilisation de Mustache ###

Le Metadataplayer utilise la bibliothèque *Mustache.js* pour réaliser cette opération.

Voici un exemple d’utilisation de *Mustache* seul:

    var gabarit = "<b>{{hello}}</b>, {{world}}";
    var donnees = {
        hello: "Bonjour",
        world: "monde"
    }
    Mustache.to_html(gabarit, donnees);           => "<b>Bonjour</b>, monde"

### templateToHtml ###

Les gabarits sont souvent utilisés directement avec les propriétés du widget. Un raccourci existe pour injecter directement celles-ci dans un gabarit:

    this.templateToHtml("<h3>{{type}}</h3><p>{{option}}</p>");  => "<h3>MonWidget</h3><p>valeur de l’option</p>"

### renderTemplate ###

Dans les cas les plus fréquents, le gabarit sera implémenté directement dans la propriété *template* du widget, par exemple:

    IriSP.Widgets.MonWidget.prototype.template = "<h3>{{type}}</h3><p>{{option}}</p>";

De plus, le code généré par le gabarit a pour vocation d’être rajouté directement au contenu du widget, généralement à l’intérieur de la fonction draw(). Ceci peut être réalisé avec la fonction *renderTemplate*.

    this.renderTemplate();   => ajoute directement "<h3>MonWidget</h3><p>valeur de l’option</p>" dans le code HTML du widget

## Internationalisation du widget ##

Le Metadataplayer a été conçu pour être multilingue. Pour ceci, les différents textes de l’interface doivent être séparés du reste du code et des gabarits.

### Définition des textes ###

Les textes sont définis dans la propriété **messages** du widget et regroupés par langue, dans un objet dont les clés sont les codes ISO 639-1 de la langue. Chaque langue est elle-même un objet, associant un nom de texte unique à sa traduction.

    IriSP.Widgets.MonWidget.prototype.message = {
        en: {
            hello: "Hello",
            world: "world"
        },
        fr: {
            hello: "Bonjour",
            world: "monde"
        }
    }

### Accès aux textes dans la langue de l’interface ###

La langue de l’interface est définie par *IriSP.language*. Un accès direct aux messages se fait par la propriété *l10n* (raccourci pour "localization") du widget.

    this.l10n.hello;   => "Hello" si l’interface est en anglais, "Bonjour" si l’interface est en français.

### Accès aux textes dans un gabarit ###

Cette propriété *l10n* permet d’accéder directement aux textes dans les gabarits:

    this.templateToHtml("{{l10n.hello}}, {{l10n.world}}!");  => "Hello, world!" en anglais ou "Bonjour, monde!" en français.

