# Architecture du Metadataplayer #

ATTENTION !
Cette documentation se réfère à la dernière version du Metadataplayer, disponible dans la branche **default** du repository
http://www.iri.centrepompidou.fr/dev/hg/metadataplayer

## Bibliothèques extérieures ##

Les bibliothèques utilisées par le Metadataplayer sont regroupées dans *src/libs*

### LAB.js ###

- **Fichier**: LAB.min.js
- **Licence**: MIT.
- **Rôle**: Charge les autres bibliothèques extérieures et les widgets.
- **Utilisé par**: Code principal.
- Du fait de ce mode de chargement, il s’agit de la seule bibliothèque nécessaire au moment de l’initialisation du code.
- **Site**: http://labjs.com/

### jQuery ###

- **Fichier**: jquery.min.js
- **Licence**: Double, MIT et GPL.
- **Rôle**: Gère les actions du code sur la structure du document HTML (DOM)
- **Utilisé par**: Code principal et tous les widgets.
- **Site**: http://jquery.org/

### jQuery UI ###

- **Fichiers**: jquery-ui.min.js et jquery-ui.css
- **Licence**: Double, MIT et GPL.
- **Rôle**: Fournit des éléments d’interface utilisateurs, tels que *Sliders*
- **Utilisé par**: Widgets, Controller (pour le volume) et Slider (pour le *Slider de progression*)
- **Site**: http://jqueryui.com/

### Underscore ###

- **Fichier**: underscore-min.js
- **Licence**: MIT.
- **Rôle**: Fournit des fonctionnalités orientées programmation fonctionnelle pour manipuler tableaux, objets et fonctions.
- **Utilisé par**: Code principal et widgets.
- **Site**: http://documentcloud.github.com/underscore/

### Popcorn ###

- **Fichier**: popcorn-complete.min.js
- **Licence**: MIT.
- **Rôle**: Fournit une gestion de la lecture de vidéos HTML5.
- **Utilisé par**: Players HTML5 et Youtube, ainsi que pour la communication avec le reste du Metadataplayer lorsque l’un de ces players est utilisé.
- **Site**: http://popcornjs.org/

### Mustache ###

- **Fichier**: mustache.js
- **Licence**: MIT.
- **Rôle**: Permet de remplir des gabarits (*templates*) HTML.
- **Utilisé par**: widgets.
- **Site**: http://mustache.github.com/

### Raphael ###

- **Fichier**: raphael-min.js
- **Licence**: MIT.
- **Rôle**: Fournit une interface de dessin vectoriel (utilise SVG ou VML selon les navigateurs)
- **Utilisé par**: Widgets Arrow et Sparkline
- **Site**: http://raphaeljs.com/

### ZeroClipboard ###

- **Fichiers**: ZeroClipboard.js et ZeroClipboard.swf
- **Licence**: MIT.
- **Rôle**: Permet l’accès au presse-papiers (using Flash)
- **Utilisé par**: Widget Social
- **Site**: http://code.google.com/p/zeroclipboard/

### ktbs4js Tracemanager ###

- **Fichier**: tracemanager.js
- **Licence**: LGPL.
- **Rôle**: Permet de s’interfacer avec le système de gestion de traces KTBS, créé par Olivier Aubert (Liris)
- **Utilisé par**: TraceWidget
- **Site**: http://github.com/oaubert/ktbs4js

## Code principal (core) du Metadataplayer ##

Dans la version *release* du metadataplayer, les fichiers Javascript et CSS sont répartis entre le *core* et les *widgets*.

*LdtPlayer-core.js* est compilé à partir de plusieurs fichiers Javascript situés (sauf LAB.min.js) dans *src/js*:

### header.js ###

Contient les crédits du Metadataplayer, ainsi que les informations sur la licence (*CeCILL-C*)

### LAB.js ###

cf. Bibliothèques extérieures.

### init.js ###

Définit l’objet *IriSP*, qui sert d’espace de nommage pour tout le Metadataplayer.
Contient la classe *IriSP.Metadataplayer*, dont l’instanciation est la porte d’entrée principale du code.

### pop.js ###

Contient *IriSP.PopcornReplacement*, c’est à dire une version simplifiée de Popcorn pour communiquer avec des lecteurs vidéos non-supportés par Popcorn.
Au moment de la création de cette partie, l’interfaçage Popcorn-jwplayer n’était pas satisfaisant, à remplacer éventuellement par de vrais players/plugins pour Popcorn.

### utils.js ###

Contient quelques fonctions utilitaires, telles que *IriSP.loadCss*, qui est l’équivalent pour les fichiers CSS de LAB.js.

### model.js ###

Contient les classes de gestion du modèle de données Cinelab, regroupées sous l’espace de nommage *IriSP.Model*.

### widgets.js ###

Contient la classe de base *IriSP.Widgets.Widget*, qui fournit les fonctionnalités de base pour les widgets.

### players ###

Les lecteurs vidéos sont maintenant des widgets. Cf la section widgets pour leur configuration.

### serializers ###

Les Sérialiseurs servent d’interface entre les formats de données utilisés pour les échanges avec les serveurs.

Deux sérialiseurs existent à l’heure actuelle:

1. **ldt**, pour lire les flux JSON fournis par la plateforme *Lignes de Temps*.
2. **ldt\_annotate**, pour communiquer avec l’API d’ajout d’annotations de la plateforme, dont le format est légèrement différent.

## Widgets ##

Les Widgets sont des modules, visibles ou non, permettant de rajouter des fonctionnalités au Metadataplayer.

Situés dans le répertoire *src/widgets*, ils contiennent nécessairement un fichier de code *NomDuWidget.js* et, optionnellement un fichier de style *NomDuWidget.css*

### Options courantes des widgets lecteurs vidéo ###

- **video**, URL du fichier vidéo.
- **height**, hauteur du lecteur vidéo (la largeur est défini dans la *config* générale du IriSP.Metadataplayer(*config*) ).
- **autostart**, comme son nom l'indique, *true* ou *false*.
- **url\_transform**, fonction pour traiter l'url s'il y a besoin de la transformer avant de l'intégrer.

Voici la liste des widgets player actuellement disponibles avec leurs options. Aucun player n'utilise de fichier css spécifique.

#### HtmlPlayer ####

- **Rôle** : lecteur pur html 5.

#### JwpPlayer ####

- **Rôle** : interface avec le JW Player, souvent utile pour les url de stream flash en rtmp ou le fallback des fichiers mp4. Dernière version livrée : 6.5.3609.

#### PopcornPlayer ####

- **Rôle** : interface avec le player popcorn, qui permet de lire des vidéos html5, youtube et vimeo. Version de popcorn livrée : 1.3.
- **Option**:
    - **video**: URL du fichier vidéo ou de la page youtube/vimeo, par exemple http://www.youtube.com/watch?v=Eb7U-umL5L4 ou http://vimeo.com/80887929.

#### DailymotionPlayer ####

- **Rôle** : interface avec le player dailymotion pour les vidéos issues de ce site.
- **Option**:
    - **video**: URL de la page dailymotion, par exemple http://www.dailymotion.com/video/x16kajy.

#### AdaptivePlayer ####

- **Rôle** : sélectionne JwpPlayer ou HtmlPlayer en fonction de l'url.

#### AutoPlayer ####

- **Rôle** : sélectionne le player approprié en fonction de l'url parmi tous les players disponibles. Par exemple rtmp donnera JwpPlayer, youtube donnera PopcornPlayer, webm donnera HtmlPlayer, etc.

#### PlaceholderPlayer ####

- **Rôle** : Placeholder, ne lit aucune vidéo.

#### HtmlMashupPlayer ####

- **Rôle** : Permet de réaliser des bout à bout de vidéos html5.

#### MashupPlayer ####

- **Rôle** : Permet de réaliser des bout à bout de vidéos html5.


### Options courantes des autres widgets ###

- **metadata**, source de métadonnées, sous la forme { url: *URL de la source de données*, type: *Type de sérialiseur utilisé* }
- **container**, à utiliser seulement si le widget ne doit pas être aligné en dessous des autres widgets, pour spécifier l’ID de l’élément HTML dans lequel il doit être affiché.
- **annotation\_type**, dans les widgets affichant des annotations. Cette option peut prendre les valeurs suivantes:
    - Chaîne de caractères: prend en compte les types d’annotations dont le titre contient la chaîne. Exemple: "chap" permet notamment d’afficher les annotations dans le type d’annotation "Chapitrage"
    - Tableau de chaînes: pour prendre en compte plusieurs types d’annotations
    - false: pour prendre en compte toutes les annotations du projet
- **requires**, qui permet d’encapsuler un widget dans un autre.

Voici la liste des widgets actuellement disponibles, avec leurs options:


#### Annotation ####

- **Rôle**: Affiche les informations relatives à une annotation au moment où celle-ci est jouée
- **Options**:
    - **annotation\_type**: (défaut: "chapitrage"), cf. *Options courantes*, plus haut.
    - **show\_top\_border**: (défaut: false), afficher ou non la bordure en haut du widget (au cas où il est utilisé sans/avec le widget *Arrow*)
    - **site\_name**: "Lignes de Temps", nom du site à afficher lorsque l’on clique sur les boutons de partage pour réseaux sociaux.
- Utilise un fichier CSS: oui

#### AnnotationsList ####

- **Rôle**: Affiche une liste d’annotations
- **Options**:
    - **ajax\_url**: (défaut: false), spécifie un gabarit d’URL lorsque les annotations doivent être chargées par une API spécifique (API de segment). Dans l’URL, {{media}} sera remplacé par l’ID du média, {{begin}} par le *timecode* de début en millisecondes, {{end}} par le *timecode* de fin en millisecondes. Si le réglage est à *false*, les annotations affichées seront celles chargées à l’initialisation du Widget. Sur la plateforme *Lignes de Temps*, cette URL est http://ldt.iri.centrepompidou.fr/ldtplatform/api/ldt/segments/{{media}}/{{begin}}/{{end}}?callback=?
    - **ajax\_granularity**: (défaut: 300000 ms = 5 minutes), spécifie la durée qui doit être chargée par l’API de segment, de part et d’autre du timecode courant (cf. ci-dessus) 
    - **default\_thumbnail**: imagette à afficher par défaut à côté d’une annotation lorsque l’annotation n’a pas d’imagette.
    - **foreign\_url**: spécifie un gabarit d’URL lorsque l’annotation n’a pas d’information d’URL et que l’annotation est dans un autre projet. Dans l’URL, {{media}} sera remplacé par l’ID du média, {{project}} par l’ID du projet, {{annotationType}} par l’ID du type d’annotation, {{annotation}} par l’ID de l’annotation. Sur la plateforme *Lignes de temps*, cette URL est http://ldt.iri.centrepompidou.fr/ldtplatform/ldt/front/player/{{media}}/{{project}}/{{annotationType}}#id={{annotation}}
    - **annotation\_type**: (défaut: false), cf. *Options courantes*, plus haut.
    - **refresh\_interval**: (défaut: 0), intervalle auquel le widget recharge en Ajax la liste des annotations (que l’on utilise l’API de segment ou non)
    - **limit\_count**: (défaut: 10), nombre maximum d’annotations à afficher simultanément.
    - **newest\_first**: (défaut: false), *true*: classe les annotations par ordre antéchronologique de création, *false*: classe les annotations par ordre chronologique de leur timecode vidéo.
- Utilise un fichier CSS: oui

#### Arrow ####

- **Rôle**: Dessine la flèche indiquant la position de l’annotation
- **Options**:
    - **arrow\_height**: (défaut: 16), hauteur en pixels de la flèche
    - **arrow\_width**: (défaut: 24), largeur en pixels de la flèche
    - **base\_height**: (défaut: 0), hauteur entre le bas de la flèche et le bas du widget. Nécessaire si l’on souhaite faire un widget aux bords arrondis.
    - **base\_curve**: (défaut: 0), rayon de courbure des bords arrondis du widget.
    - **fill\_url**: URL d’une image de remplissage pour le widget
    - **fill\_color**: (défaut: "#ffffff" = blanc), couleur de remplissage du widget. Peut-être remplacé par un dégradé sous la forme angle en degrés-couleur de début-couleur de fin, ex: "90-#000-#fff"
    - **stroke\_color**: (défaut: "#b7b7b7" = gris), couleur de la bordure du widget.
    - **stroke\_width**: (défaut: 1.5), épaisseur en pixels de la bordure du widget.
    - **animation\_speed**: (défaut: 20), vitesse de déplacement de la flèche.
    - **pilot\_widget**: (défaut: "Annotation"), widget commandant la position de la flèche.
- Utilise la bibliothèque: Raphael
- Utilise un fichier CSS: non

#### Controller ####

- **Rôle**: Boutons Lecture/Pause, Rechercher, Ouvrir l’annotateur et contrôle du volume
- **Options**:
    - **disable\_annotate\_btn**: (défaut: false), permet de désactiver le bouton d’ouverture de l’annotateur s’il est à *true*
    - **disable\_search\_btn**: (défaut: true), permet de désactiver le bouton de recherche d’annotations
- Utilise la bibliothèque: jQuery UI
- Utilise un fichier CSS: oui

#### CreateAnnotation ####

- **Rôle**: Permet de créer une annotation en affichant un formulaire
- **Options**:
    - **show\_title\_field**: (défaut: true), affiche un champ permettant de saisir le titre de l’annotation.
    - **creator\_name**: nom d’utilisateur du créateur de l’annotation.
    - **creator\_avatar**: URL de l’image de profil du créateur de l’annotation.
    - **tags**: (défaut: false), liste des tags à afficher, sous la forme d’un tableau d’objets type [ { id: "tag-001", title: "" } ]. Si la valeur est false, affiche les tags les plus utilisés du projet.
    - **max\_tags**: (défaut: 8), nombre de tags à afficher.
    - **polemics**: boutons polémiques à afficher, sous la forme d’un tableau d’objets indiquant mot-clé à ajouter, couleur du fond du bouton, couleur du bouton, ex: [ { keyword: "++", background\_color: "#00a000", text\_color: "#ffffff" } ]
    - **annotation\_type**: (défaut: "Contributions"), cf. *Options courantes*, plus haut.
    - **api\_serializer**: (défaut: "ldt\_annotate"), sérialiseur à utiliser pour l’envoi des annotations.
    - **api\_endpoint\_template**: URL de l’API, où {{id\}\} est remplacé par l’ID du projet, ex: "http://ldt.iri.centrepompidou.fr/ldtplatform/api/ldt/annotations/{{id}}.json".
    - **api\_method**: (défaut: "PUT"), méthode HTTP utilisée pour envoyer les annotations. La plateforme *Lignes de temps* utilise PUT, mais cette méthode devrait être réservée pour la création d’une ressource dont l’URL est connue à l’avance.
    - **close\_widget\_timeout**: (défaut: 0), durée en millisecondes avant que le widget ne soit refermé après l’envoi d’une annotation. Si la valeur est 0, le widget ne se referme pas.
- Utilise un fichier CSS: oui

#### HelloWorld ####

- **Rôle**: Widget d’exemple démontrant l’API de création de widgets
- **Options**:
    - **text**: (défaut: "world"), texte à afficher après "Hello, "
- Utilise un fichier CSS: oui

#### Media ####

- **Rôle**: Affiche le média en cours, ainsi que la liste des autres médias du projet. Utilisé principalement pour les mashups
- **Options**:
    - **default\_thumbnail**: imagette à afficher par défaut à côté d’un média lorsque le média n’a pas d’imagette.
    - **media\_url\_template**: spécifie un gabarit d’URL lorsque le média n’a pas d’information d’URL, par exemple: "http://ldt.iri.centrepompidou.fr/ldtplatform/ldt/front/player/{{media}}/"
- Utilise un fichier CSS: oui

#### Mediafragment ####

- **Rôle**: Gère les URLs à la norme *Mediafragment*: change la position de la tête de lecture en fonction de l’URL et inversement.
- Une URL finissant par #id=*id de l’annotation* pointe sur une annotation, par #t=*temps en secondes* vers un timecode de la vidéo.
- Pas d’options
- Utilise un fichier CSS: non.

#### Polemic ####

- **Rôle**: Affiche la *timeline polémique*, c’est à dire les tweets colorés en fonction de la syntaxe polémique. Selon le volume de tweets, deux modes de représentation existent:
    - Avec un faible volume, les tweets sont des carrés dessinés individuellement.
    - Avec un volume élevé, les colonnes présentent les volumes agrégés de tweets par couleur.
- **Options**:
    - **element\_width**: (défaut: 5), largeur en pixels d’une tranche de tweets.
    - **element\_height**: (défaut: 5), hauteur en pixels d’un tweet, en mode faible volume.
    - **max\_elements**: (défaut: 15), nombre de tweets dans une colonne à partir duquel le mode de représentation change.
    - **annotation\_type**: (défaut: "tweet"), cf. *Options courantes*, plus haut.
    - **defaultcolor**: (défaut: "#585858" = gris), couleur des tweets qui n’ont pas d’annotation polémique.
    - **foundcolor**: (défaut: "#fc00ff" = mauve), couleur d’affichage des tweets correspondant à un résultat de recherche.
    - **polemics**: couleurs polémiques à afficher, en fonction d’une recherche de termes, type [ { keywords: [ "++" ], color: "#1D973D" } ]
- Utilise un fichier CSS: oui

#### Renkan ####

- **Rôle**: Interface avec le projet *Renkan*
- Utilise les bibliothèques: jQuery Mousewheel, Backbone, Backbone Relational, Renkan-Publish
- Utilise un fichier CSS: oui

#### Segments ####

- **Rôle**: Affiche le *chapitrage* du média, en horizontal.
- **Options**:
    - **colors**: liste de couleurs à utiliser lorsque les annotations ne contiennent pas d’information de couleur.
    - **height**: hauteur du widget
- Utilise un fichier CSS: oui

#### MultiSegments ####

- **Rôle**: Affiche tous les *annotation\_type* du média sous forme de Segment, en horizontal.
- **Options**:
    - **visible_by_default**: true ou false, comme son nom l'indique.
- Utilise un fichier CSS: non

#### Slider ####

- **Rôle**: Barre de progression et *Slider* indiquant la position de la tête de lecture vidéo et permettant de la déplacer.
- **Options**:
   - **minimized\_height**: (défaut: 4), hauteur en pixels du *Slider* en mode minimisé
   - **maximized\_height**: (défaut: 10), hauteur en pixels du *Slider* en mode maximisé (lorsque la souris passe dessus)
   - **minimize\_timeout**: (défaut: 1500), durée en millisecondes avant que le *Slider* ne se minimise. À une valeur de 0, le *Slider* ne se minimise plus.
- Utilise la bibliothèque: jQuery UI
- Utilise un fichier CSS: oui

#### Social ####

- **Role**: Affiche des boutons pour partager une URL sur les réseaux sociaux
- **Options**:
    - **text**: un texte à afficher (dans le tweet, etc.)
    - **url**: l’URL à partager
    - **show_url**: Affiche un bouton pour copier-coller une URL.
    - **show_twitter**: Affiche un bouton pour partager sur Twitter.
    - **show_fb**: Affiche un bouton pour partager sur Facebook.
    - **show_gplus**: Affiche un bouton pour partager sur Google+.
    - **show_mail**: Affiche un bouton pour partager par e-mail.
- Utilise un fichier CSS: oui.
- Utilise la bibliothèque: ZeroClipboard

#### Sparkline ####

- **Rôle**: Affiche une courbe indiquant l’évolution du volume d’annotations au cours du temps.
- **Options**:
    - **annotation\_type**: cf. *Options courantes*, plus haut.
    - **lineColor**: (défaut: "#7492b4" = gris-bleu), couleur de la courbe
    - **fillColor**: (défaut: "#aeaeb8" = gris), couleur de la surface sous la courbe
    - **lineWidth**: (défaut: 2), épaisseur en pixels de la courbe
    - **slice\_count**: (défaut: 20), nombre des tranches horaires dans lesquelles les annotations sont réparties pour calculer la courbe
    - **height**: (défaut: 50), hauteur en pixels de la courbe
    - **margin**: (défaut: 5), marge en pixels au-dessus de la courbe
- Utilise la bibliothèque: Raphael
- Utilise un fichier CSS: non

#### Tagcloud ####

- **Rôle**: Affiche un nuage de mots-clés
- **Options**:
    - **include\_titles**: (défaut: true), utiliser le contenu du champ titre des annotations pour calculer le nuage de mots-clés.
    - **include\_descriptions**: (défaut: true), utiliser le contenu du champ description des annotations pour calculer le nuage.
    - **include\_tag\_texts**: (défaut: true), utiliser les textes des tags liés aux annotations pour calculer le nuage de mots-clés.
    - **tag\_count**: (défaut: 30), nombre maximum de mots-clés à afficher.
    - **stopword\_language**: (défaut: "fr"), code de langue correspondant à une liste de mots vides à exclure du nuage.
    - **custom\_stopwords**: (défaut: []), liste de mots-vides à exclure du nuage.
    - **exclude\_pattern**: (défaut: false), expression régulière à exclure du nuage.
    - **annotation\_type**: (défaut: false), cf. *Options courantes*, plus haut. Concerne les annotations dont les contenus sont utilisés pour calculer le nuage.
    - **segment\_annotation\_type**: (défaut: false), permet de définir la segmentation du nuage de mots-clés et de calculer un nuage pour chaque segment du type d’annotation choisi. Lorsque ce paramètre est à *false*, un seul nuage est calculé pour toute la durée de la vidéo.
    - **min\_font\_size**: (défaut: 10), taille de caractères (en pixels) pour le mot le moins fréquent.
    - **max\_font\_size**: (défaut: 26), taille de caractères (en pixels) pour le mot le plus fréquent.
- Utilise un fichier CSS: oui

#### Tooltip ####

- **Rôle**: Affiche une infobulle, utilisé uniquement comme *widget inclus* dans d’autres widgets.
- Pas d’options
- Utilise un fichier CSS: oui

#### Trace ####

- **Rôle**: Envoi des traces au serveur KTBS
- **Options**:
    - **js\_console**: (défaut: false), écriture ou non des traces dans la console du navigateur.
    - **url**: (défaut: "http://traces.advene.org:5000/"), URL du serveur de traces
    - **requestmode**: (défaut: "GET"), méthode HTTP utilisée pour l’envoi des traces (seul *"GET"* permet le *cross-domain*).
    - **syncmode**: (défaut: "sync"), envois groupés (mode *"delayed"*) ou non (*"sync"*) des traces
- Utilise la bibliothèque: ktbs4js tracemanager
- Utilise un fichier CSS: non.

#### Tweet ####

- **Rôle**: Affiche furtivement le contenu d’un tweet
- **Options**:
    - **hide_timeout**: (défaut: 5000), durée en millisecondes, avant que l’affichage du Tweet ne se referme
    - **polemics**: identique au paramètre *polemics* du widget *Polemic*
