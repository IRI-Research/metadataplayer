IriSP.Widgets.Tagger = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Tagger.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Tagger.prototype.defaults = {
    created_annotation_type: "Contributions",
    creator_name: 'anonymous',
    api_endpoint: "/metadataplayer/test/post-test.php",
    api_method: "PUT",
    pause_on_write : true,
    api_serializer: "ldt_annotate",
}

IriSP.Widgets.Tagger.prototype.messages = {
    en: {
        add_a_tag: "Add a tag",
        submit: "Submit"
    },
    fr: {
        add_a_tag: "Ajouter un tag",
        submit: "Envoyer"
    }
}

IriSP.Widgets.Tagger.prototype.template =
    '<form class="Ldt-Tagger"><input class="Ldt-Tagger-Input" placeholder="{{l10n.add_a_tag}}" />'
    + '<input class="Ldt-Tagger-Submit" type="submit" value="{{l10n.submit}}" /></form>';

IriSP.Widgets.Tagger.prototype.draw = function() {
    this.renderTemplate();
    var _tags = this.source.getTags().getTitles(),
        _this = this,
        _input = this.$.find(".Ldt-Tagger-Input");
    _input.autocomplete({
        source: _tags
    });
    if (this.pause_on_write) {
        _input.keyup(function() {
            _this.player.popcorn.pause();
        });
    }
    this.$.find(".Ldt-Tagger").submit(function() {
        var _tagvalue = _input.val();
        if (_tagvalue) {
            
            /* Création d'une liste d'annotations contenant une annotation afin de l'envoyer au serveur */
            var _exportedAnnotations = new IriSP.Model.List(_this.player.sourceManager),
                /* Création d'un objet source utilisant un sérialiseur spécifique pour l'export */
                _export = _this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[_this.api_serializer]}),
                /* Création d'une annotation dans cette source avec un ID généré à la volée (param. false) */
                _annotation = new IriSP.Model.Annotation(false, _export),
                /* Récupération du type d'annotation dans lequel l'annotation doit être ajoutée */
                _annotationTypes = _this.source.getAnnotationTypes().searchByTitle(_this.created_annotation_type),
                /* Si le Type d'Annotation n'existe pas, il est créé à la volée */
                _annotationType = (_annotationTypes.length ? _annotationTypes[0] : new IriSP.Model.AnnotationType(false, _export)),
                /* L'objet Tag qui sera envoyé */
                _tag = new IriSP.Model.Tag(false, _export);
            /* L'objet Tag doit avoir pour titre le texte du tag envoyé */
            _tag.title = _tagvalue;
            /* Si nous avons dû générer un ID d'annotationType à la volée... */
            if (!_annotationTypes.length) {
                /* Il ne faudra pas envoyer l'ID généré au serveur */
                _annotationType.dont_send_id = true;
                /* Il faut inclure le titre dans le type d'annotation */
                _annotationType.title = _this.created_annotation_type;
            }
            
            /*
             * Nous remplissons les données de l'annotation générée à la volée
             * ATTENTION: Si nous sommes sur un MASHUP, ces éléments doivent se référer AU MEDIA D'ORIGINE
             * */
            var _now = 1000*_this.player.popcorn.currentTime(),
                _pilotAnnotation = null;
            if (_this.source.currentMedia.elementType == "mashup") {
                /* Si c'est un mashup, on récupère l'annotation d'origine pour caler le temps */
                var _pilotAnnotation = _this.source.currentMedia.getAnnotationAtTime(_now).annotation;
            } else {
                /* Sinon, on recherche une annotation correspondant au temps */
                var _annotations = _this.getWidgetAnnotationsAtTime(_now);
                if (_annotations.length) {
                    _pilotAnnotation = _annotations[0];
                }
            }
            if (_pilotAnnotation) {
                console.log(_pilotAnnotation);
                _annotation.setBegin(_pilotAnnotation.begin);
                _annotation.setEnd(_pilotAnnotation.end);
                /* Id du média annoté */
                _annotation.setMedia(_pilotAnnotation.getMedia().id);
            } else {
                _annotation.setBegin(_now);
                _annotation.setEnd(_now);
                /* Id du média annoté */
                _annotation.setMedia(_this.source.currentMedia.id);
            }
            
            /* Id du type d'annotation */
            _annotation.setAnnotationType(_annotationType.id); 
            
            _annotation.title = _tagvalue;
            _annotation.created = new Date(); /* Date de création de l'annotation */
            _annotation.description = _tagvalue;
            
            _annotation.setTags([_tag.id]); /*Liste des ids de tags */
            
            /* Les données créateur/date de création sont envoyées non pas dans l'annotation, mais dans le projet */
            _export.creator = _this.creator_name;
            _export.created = new Date();
            /* Ajout de l'annotation à la liste à exporter */
            _exportedAnnotations.push(_annotation);
            /* Ajout de la liste à exporter à l'objet Source */
            _export.addList("annotation",_exportedAnnotations);
            
            IriSP.jQuery.ajax({
                url: _this.api_endpoint,
                type: _this.api_method,
                contentType: 'application/json',
                data: _export.serialize(), /* L'objet Source est sérialisé */
                success: function(_data) {
                    console.log("success");
                    /* Pour éviter les doublons, on supprime l'annotation qui a été envoyée */
                    _export.getAnnotations().removeElement(_annotation, true);
                    /* On désérialise les données reçues pour les réinjecter */
                    _export.deSerialize(_data);
                    /* On récupère les données réimportées dans l'espace global des données */
                    _this.source.merge(_export);
                    if (_this.pause_on_write && _this.player.popcorn.media.paused) {
                        _this.player.popcorn.play();
                    }
                    /* On force le rafraîchissement du widget AnnotationsList */
                    _this.player.popcorn.trigger("IriSP.AnnotationsList.refresh");
                },
                error: function(_xhr, _error, _thrown) {
                    console.log("Error when sending annotation", _thrown);
                    _export.getAnnotations().removeElement(_annotation, true);
                }
            });
            
            _input.val("");
        }
        return false;
    });
}