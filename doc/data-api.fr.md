# API d’accès aux métadonnées #

ATTENTION !
Cette documentation se réfère à la dernière version du Metadataplayer, disponible dans la branche **default** du repository
http://www.iri.centrepompidou.fr/dev/hg/metadataplayer

## Élément de base ##

    IriSP.Model.Element

### Rôle ###

Classe de base dont héritent les différents types d’objets utilisés dans le Metadataplayer: annotations, types d’annotations, médias, etc.

### Instanciation ###

**Element** fonctionne comme une classe abstraite est n’est jamais instancié directement.

Néanmoins, tous les objets en héritant seront instanciés de la manière suivante :

    var myElement = new IriSP.Model.Element(id, source);

- **id** est l’identifiant unique de l’élément. S’il est à *false*, un identifiant unique sera généré.
- **source** identifie la source de données dont provient l’élément (cf. Source de Données, *IriSP.Model.Source*, plus bas).

### Propriétés ###

#### type ####

Type d’élément, surchargé par les classes qui héritent de l’élément de base:

- **element** pour IriSP.Model.Element
- **media** pour IriSP.Model.Media
- **annotationType** pour IriSP.Model.AnnotationType
- **tag** pour IriSP.Model.Tag
- **annotation** pour IriSP.Model.Annotation
- **mashup** pour IriSP.Model.Mashup
- **mashedAnnotation** pour IriSP.Model.MashedAnnotation

#### id ####

Identifiant unique de l’élément

#### title ####

Titre de l’élément, par défaut une chaîne vide ("")

#### description ####

Description de l’élément, par défaut une chaîne vide ("")

## Media ##

    IriSP.Model.Media

### Rôle ###

Représente un média (vidéo ou audio).

Hérite de l’Élément de base

### Propriétés ###

#### video ####

Il s’agit de l’URL de la vidéo à charger

#### duration ####

Il s’agit de la durée du média (telle que renseignée dans les métadonnées -- peut ne pas être égale à la durée telle que lue dans la fenêtre vidéo).

Il s’agit d’un objet durée (cf. *IriSP.Model.Time* plus bas)

### Méthodes ###

#### getDuration ####

Permet de spécifier la durée du média, en millisecondes

#### getAnnotations ####

Retourne la liste des annotations associées au média

#### getAnnotationsByTypeTitle ####

Retourne la liste des annotations associées au média et dont le type d’annotation (ou découpage, ou ligne, c.f. Type d’Annotation plus bas) correspond à l’argument de la fonction

## Type d’Annotation ##

    IriSP.Model.AnnotationType

### Rôle ###

Représente un type d’annotation, correspondant également à ce qui peut être nommé découpage ou ligne dans *Lignes de Temps*

Hérite de l’Élément de base.

### Méthodes ###

#### getAnnotations ####

Retourne la liste des annotations associées au type d’annotation

## Annotation ##

    IriSP.Model.Annotation

### Rôle ###

Représente une annotation, correspondant à un segment temporel (dont la durée peut être nulle) d’un média

Hérite de l’Élément de base.

### Propriétés ###

#### begin ####

Timecode de fin de l’annotation. Est un objet de type durée (cf. plus bas)

#### begin ####

Timecode de début de l’annotation. Est un objet de type durée (cf. plus bas)

### Méthodes ###

#### getMedia ####

Retourne l’objet **Média** (*IriSP.Model.Media*) auquel se réfère l’annotation

#### getAnnotationType ####

Retourne l’objet **Type d’Annotation** (*IriSP.Model.AnnotationType*) auquel se réfère l’annotation

#### getTags ####

Retourne la liste (cf. Liste d’éléments *IriSP.Model.List*) des tags associés à l’annotation.

#### getTagTexts ####

## Mashup ##

    IriSP.Model.Mashup

### Rôle ###

Il s’agit d’un bout à bout, composé d’une liste de segments (définis par des annotations de durée non nulle) accolés les uns après les autres.

### Méthodes ###

**À compléter**

## Liste d’éléments ##

    IriSP.Model.List

### Rôle ###

Etend les fonctionnalités des tableaux javascript (*Array*) pour lister des éléments (cf. types d’éléments ci-dessus).

### Instanciation ###

    var myList = new IriSP.Model.List(directory);

- **directory** est le répertoire de données auxquelles la liste permet d’accéder (cf. plus bas)

### Méthodes ###

#### Méthodes de parcours de liste ####

Ces méthodes sont fournies grâce à la bibliothèque extérieure *underscore.js* et sont documentées sur http://documentcloud.github.com/underscore/

Il s’agit de:

- **map**: Renvoie un tableau (*Array*) dont les éléments correspondent aux éléments de la liste, via une fonction passée en argument de map
- **forEach**: Itère une fonction sur la liste.
- **filter**: Ne renvoie que les éléments de la liste dont la valeur correspond au résultat d’une fonction.
- **sortBy**: Fonction de tri, par ordre croissant de la valeur retournée par la fonction passée en argument.

#### searchByTitle, searchByDescription, searchByTextFields ####

Méthodes retournant une nouvelle liste d’éléments, contenant les éléments de la liste dont respectivement le titre, la description ou les deux correspondent à l’argument de la méthode.

    myList.searchByTitle("texte"); // => un *IriSP.Model.List* contenant les éléments de myList dont le titre contient "texte"

## Durée ##

    IriSP.Model.Time

### Rôle ###

Facilite la gestion des durées en millisecondes utilisées dans le Metadataplayer

### Instanciation ###

    var myTime = new IriSP.Model.Time(ms);

- **ms** est une durée en millisecondes

### Méthodes ###

#### getSeconds ####

Renvoie la durée convertie en secondes

#### toString ####

Renvoie la durée au format (hh:)mm:ss

#### setSeconds ####

Permet d’affecter une durée en secondes

    myTime.setSeconds(12); // 12000 millisecondes

## Source de données ##

    IriSP.Model.Source

et
    IriSP.Model.RemoteSource

### Rôle ###

Gère une source de données : fichier externe JSON, XML, etc. pour *IriSP.Model.RemoteSource*, projet créé à la volée pour *IriSP.Model.Source*.

*IriSP.Model.RemoteSource* hérite de *IriSP.Model.Source* et ne diffère que par son implémentation de la méthode *get*.

Sur la plateforme *Lignes de Temps*, il existe plusieurs API qui sont utilisées comme sources :

- L’API projet, qui renvoie un fichier JSON contenant un projet LDT complet.
- L’API segment, qui renvoie toutes les annotations d’un média situées entre deux timecodes fournis en argument.
- L’API de publication d’annotation, qui demande l’envoi (par la méthode HTTP PUT) d’une liste d’annotation et renvoie celle-ci en retour, avec les identifiants des annotations en base de données.

### Instanciation ###

    var config = { directory: myDirectory };
    var mySource = new IriSP.Model.Source(config);

- **config** est un objet contenant les options de configuration:
    - Il doit nécessairement contenir une propriété **directory**, désignant le répertoire de données (cf. plus bas).
    - La propriété **serializer** doit désigner le *Sérialiseur* utilisé pour désérialiser les données importées ou sérialiser l’export.
    - un *IriSP.Model.RemoteSource* doit également être appelé avec une propriété **url**, désignant l’URL de la source.

Une Source ne doit pas être instanciée directement, ce rôle est donné aux répertoires de données, ce qui permet notamment d’éviter des accès multiples à une même URL.

### Propriétés ###

#### currentMedia ####

*TODO: transférer dans un objet "Project"*

Donne accès au média en cours du projet. Peut désigner un vrai média ou un mashup.

### Méthodes ###

#### get ####

Permet de récupérer ou de rafraîchir, via Ajax, les données de la source. Pour un *IriSP.Model.Source* de base, n’a aucun effet.

#### onLoad ####

Permet d’exécuter une fonction, passée en argument, au chargement de la source.

#### serialize, deSerialize ####

Transforme les données de la source en données sérialisées, au format du sérialiseur associées à la source, et inversement.

#### getAnnotations, getAnnotationTypes, getMedias, getTags, getMashups ####

Retourne les listes respectives d’annotations, types d’annotations, médias, tags et mashups de la source.

#### getAnnotationsByTypeTitle ####

Retourne la liste des annotations dont le type d’annotation correspond à l’argument de la fonction.

## Répertoire de données ##

    IriSP.Model.Directory

### Rôle ###

Gère l’instanciation des sources de données et la mise en cache de ces sources lorsque plusieurs appels à la même URLs sont faits.

Permet également aux objets de plusieurs sources d’interagir entre eux.

### Instanciation ###

    var myDirectory = new IriSP.Model.Directory

### Méthodes ###

#### newLocalSource ####

Crée une nouvelle source non attachée à une URL. S’il faut exporter des données, un sérialiseur doit être passé en paramètres.

    var myConfig = { serializer: IriSP.serializers.ldt };
    var myLocalSource = myDirectory.newLocalSource(myConfig);

#### remoteSource ####

Crée ou récupère (si celle-ci existe déjà) une source attachée à une URL. Le sérialiseur est obligatoire.

    var myConfig = { url: "source-data.json", serializer: IriSP.serializers.ldt };
    var myLocalSource = myDirectory.remoteSource(myConfig);
