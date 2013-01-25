/* TODO: Add Social Network Sharing */

IriSP.Widgets.CreateAnnotation = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.CreateAnnotation.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.CreateAnnotation.prototype.defaults = {
    show_title_field : true,
    show_creator_field : true,
    start_visible : true,
    always_visible : false,
    show_slice : true,
    show_arrow : true,
    show_mic_record: false,
    show_mic_play: false,
    minimize_annotation_widget : true,
    creator_name : "",
    creator_avatar : "",
    tags : false,
    tag_titles : false,
    pause_on_write : true,
    max_tags : 8,
    polemics : [{
        keyword: "++",
        background_color: "#00a000",
        text_color: "#ffffff"
    },{
        keyword: "--",
        background_color: "#c00000",
        text_color: "#ffffff"
    },{
        keyword: "??",
        background_color: "#0000e0",
        text_color: "#ffffff"
    },{
        keyword: "==",
        background_color: "#f0e000",
        text_color: "#000000"
    }],
    slice_annotation_type: "chap",
    annotation_type: "Contributions",
    api_serializer: "ldt_annotate",
    api_endpoint_template: "",
    api_method: "POST",
    after_send_timeout: 0,
    close_after_send: false,
}

IriSP.Widgets.CreateAnnotation.prototype.messages = {
    en: {
        from_time: "from",
        to_time: "to",
        at_time: "at",
        submit: "Submit",
        add_keywords_: "Add keywords:",
        add_polemic_keywords_: "Add polemic keywords:",
        your_name_: "Your name:",
        annotate_video: "Annotate this video",
        type_title: "Annotation title",
        type_description: "Type the full contents of your annotation here.",
        wait_while_processing: "Please wait while your annotation is being processed...",
        error_while_contacting: "An error happened while contacting the server. Your annotation has not been saved.",
        annotation_saved: "Thank you, your annotation has been saved.",
        share_annotation: "Would you like to share it on social networks ?",
        close_widget: "Hide the annotation form",
        "polemic++": "Agree",
        "polemic--": "Disagree",
        "polemic??": "Question",
        "polemic==": "Reference"
    },
    fr: {
        from_time: "de",
        to_time: "à",
        at_time: "à",
        submit: "Envoyer",
        add_keywords_: "Ajouter des mots-clés&nbsp;:",
        add_polemic_keywords_: "Ajouter des mots-clés polémiques&nbsp;:",
        your_name_: "Votre nom&nbsp;:",
        annotate_video: "Annoter cette vidéo",
        type_title: "Titre de l'annotation",
        type_description: "Rédigez ici le contenu de votre annotation.",
        wait_while_processing: "Veuillez patienter pendant le traitement de votre annotation...",
        error_while_contacting: "Une erreur s'est produite en contactant le serveur. Votre annotation n'a pas été enregistrée.",
        annotation_saved: "Merci, votre annotation a été enregistrée.",
        share_annotation: "Souhaitez-vous la partager sur les réseaux sociaux ?",
        close_widget: "Cacher le formulaire de création d'annotations",
        "polemic++": "Accord",
        "polemic--": "Désaccord",
        "polemic??": "Question",
        "polemic==": "Référence"
    }
}

IriSP.Widgets.CreateAnnotation.prototype.template =
    '{{#show_slice}}<div class="Ldt-CreateAnnotation-Slice"></div>{{/show_slice}}'
    + '{{^show_slice}}{{#show_arrow}}<div class="Ldt-CreateAnnotation-Arrow"></div>{{/show_arrow}}{{/show_slice}}'
    + '<div class="Ldt-CreateAnnotation"><div class="Ldt-CreateAnnotation-Inner">'
    + '<form class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Main">'
    + '<h3><span class="Ldt-CreateAnnotation-h3Left">{{l10n.annotate_video}}{{#show_title_field}}</span></h3>'
    + '<h3><span class="Ldt-CreateAnnotation-h3Left"><input class="Ldt-CreateAnnotation-Title empty" placeholder="{{l10n.type_title}}" />{{/show_title_field}}'
    + '<span class="Ldt-CreateAnnotation-Times"> {{#show_slice}}{{l10n.from_time}} {{/show_slice}}{{^show_slice}}{{l10n.at_time}} {{/show_slice}} <span class="Ldt-CreateAnnotation-Begin">00:00</span>'
    + '{{#show_slice}} {{l10n.to_time}} <span class="Ldt-CreateAnnotation-End">{{end}}</span>{{/show_slice}}</span></span>'
    + '{{#show_creator_field}}{{l10n.your_name_}} <input class="Ldt-CreateAnnotation-Creator empty" value="{{creator_name}}" />{{/show_creator_field}}</h3>'
    + '<textarea class="Ldt-CreateAnnotation-Description empty" placeholder="{{l10n.type_description}}"></textarea>'
    + '<div class="Ldt-CreateAnnotation-Avatar"><img src="{{creator_avatar}}" title="{{creator_name}}"></img></div>'
    + '<input type="submit" class="Ldt-CreateAnnotation-Submit" value="{{l10n.submit}}" />'
    + '{{#show_mic_record}}<div class="Ldt-CreateAnnotation-RecBlock"><div class="Ldt-CreateAnnotation-RecLabel">Add voice annotation</div>'
    + '    <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="220" height="160">'
    + '        <param name="movie" value="{{record_swf}}" />'
    + '        <param name="quality" value="high" />'
    + '        <param name="bgcolor" value="#ffffff" />'
    + '        <param name="play" value="true" />'
    + '        <param name="loop" value="true" />'
    + '        <param name="wmode" value="transparent" />'
    + '        <param name="scale" value="showall" />'
    + '        <param name="menu" value="true" />'
    + '        <param name="devicefont" value="false" />'
    + '        <param name="salign" value="" />'
    + '        <param name="allowScriptAccess" value="always" />'
    + '        <param name="allowFullScreen" value="true" />'
    + '        <param name="flashvars" value="playVisible={{show_mic_play}}">'
    + '        <embed src="{{record_swf}}"" quality="high" bgcolor="#ffffff"'
    + '             width="220" height="160" name="ExternalInterfaceExample" align="middle"'
    + '             play="true" loop="false" quality="high" allowScriptAccess="always" '
    + '             type="application/x-shockwave-flash" allowFullScreen="true" wmode="transparent" '
    + '             flashvars="playVisible={{show_mic_play}}"'
    + '             pluginspage="http://www.macromedia.com/go/getflashplayer">'
    + '        </embed>'
    + '    </object>'
    + '</div>{{/show_mic_record}}' 
    + '{{#tags.length}}<div class="Ldt-CreateAnnotation-Tags"><div class="Ldt-CreateAnnotation-TagTitle">{{l10n.add_keywords_}}</div><ul class="Ldt-CreateAnnotation-TagList">'
    + '{{#tags}}<li class="Ldt-CreateAnnotation-TagLi" tag-id="{{id}}"><span class="Ldt-CreateAnnotation-TagButton">{{title}}</span></li>{{/tags}}</ul></div>{{/tags.length}}'
    + '{{#polemics.length}}<div class="Ldt-CreateAnnotation-Polemics"><div class="Ldt-CreateAnnotation-PolemicTitle">{{l10n.add_polemic_keywords_}}</div><ul class="Ldt-CreateAnnotation-PolemicList">'
    + '{{#polemics}}<li class="Ldt-CreateAnnotation-PolemicLi" style="background-color: {{background_color}}; color: {{text_color}}">{{keyword}}</li>{{/polemics}}</ul></div>{{/polemics.length}}'
    + '<div style="clear: both;"></div></form>'
    + '<div class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Wait"><div class="Ldt-CreateAnnotation-InnerBox">{{l10n.wait_while_processing}}</div></div>'
    + '<div class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Error">{{^always_visible}}<a title="{{l10n.close_widget}}" class="Ldt-CreateAnnotation-Close" href="#"></a>{{/always_visible}}<div class="Ldt-CreateAnnotation-InnerBox">{{l10n.error_while_contacting}}</div></div>'
    + '<div class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Saved">{{^always_visible}}<a title="{{l10n.close_widget}}" class="Ldt-CreateAnnotation-Close" href="#"></a>{{/always_visible}}<div class="Ldt-CreateAnnotation-InnerBox">{{l10n.annotation_saved}}</div></div>'
    + '</div></div>';
    
IriSP.Widgets.CreateAnnotation.prototype.draw = function() {
    var _this = this;
    
    this.begin = new IriSP.Model.Time();
    this.end = this.source.getDuration();
    
    if (this.tag_titles && !this.tags) {
        this.tags = IriSP._(this.tag_titles).map(function(_tag_title) {
            var _tag,
                _tags = _this.source.getTags().searchByTitle(_tag_title, true);
            if (_tags.length) {
                _tag = _tags[0];
            } else {
                _tag = new IriSP.Model.Tag(false, _this.source);
                _tag.title = _tag_title;
            }
            return _tag;
        });
    }
    if (!this.tags) {
        this.tags = this.source.getTags()
            .sortBy(function (_tag) {
                return -_tag.getAnnotations().length;
            })
            .slice(0, this.max_tags)
            .map(function(_tag) {
                return _tag;
            });
        /* We have to use the map function because Mustache doesn't like our tags object */
    }
    this.record_swf = IriSP.getLib("recordMicSwf");
    this.renderTemplate();
    if (this.show_mic_record) {
        this.recorder = this.$.find("embed")[0];
        
        window.setAudioUrl = function(_url) {
            _this.audio_url = _url;
        }
    }
    if (this.show_slice) {
        this.insertSubwidget(
            this.$.find(".Ldt-CreateAnnotation-Slice"),
            {
                type: "Slice",
                show_arrow: this.show_arrow,
                annotation_type: this.slice_annotation_type,
                onBoundsChanged: function(_from, _to) {
                    _this.begin = new IriSP.Model.Time(_from || 0);
                    _this.end = new IriSP.Model.Time(_to || 0);
                    _this.$.find(".Ldt-CreateAnnotation-Begin").html(_this.begin.toString());
                    _this.$.find(".Ldt-CreateAnnotation-End").html(_this.end.toString());
                }
            },
            "slice"
        );
    } else {
        if (this.show_arrow) {
            this.insertSubwidget(this.$.find(".Ldt-CreateAnnotation-Arrow"), {type: "Arrow"},"arrow");
        }
        this.onMediaEvent("timeupdate", function(_time) {
            _this.begin = new IriSP.Model.Time(_time || 0);
            _this.end = new IriSP.Model.Time(_time || 0);
            _this.$.find(".Ldt-CreateAnnotation-Begin").html(_this.begin.toString());
            if (_this.arrow) {
                _this.arrow.moveToTime(_time);
            }
        });
    }
    this.$.find(".Ldt-CreateAnnotation-Close").click(function() {
        _this.close_after_send
        ? _this.hide()
        : _this.showScreen("Main");
        return false;
    });
    this.$.find(".Ldt-CreateAnnotation-TagLi, .Ldt-CreateAnnotation-PolemicLi").click(function() {
        _this.addKeyword(IriSP.jQuery(this).text().replace(/(^\s+|\s+$)/g,''));
        return false;
    });
    this.$.find(".Ldt-CreateAnnotation-PolemicLi").each(function() {
        var _el = IriSP.jQuery(this),
            _kw = _el.text().replace(/(^\s+|\s+$)/g,''),
            _msg = _this.l10n["polemic" + _kw];
        if (_msg) {
            _el.attr("title",_msg);
        }
    });
    this.$.find(".Ldt-CreateAnnotation-Description").bind("change keyup input paste", this.functionWrapper("onDescriptionChange"));
    if (this.show_title_field) {
        this.$.find(".Ldt-CreateAnnotation-Title").bind("change keyup input paste", this.functionWrapper("onTitleChange"));
    }
    if (this.show_creator_field) {
        this.$.find(".Ldt-CreateAnnotation-Creator").bind("change keyup input paste", this.functionWrapper("onCreatorChange"));
    }
    
    if (this.start_visible) {
        this.show();
    } else {
        this.$.hide();
        this.hide();
    }
    
    this.onMdpEvent("CreateAnnotation.toggle","toggle");
    this.$.find("form").submit(this.functionWrapper("onSubmit"));
}

IriSP.Widgets.CreateAnnotation.prototype.showScreen = function(_screenName) {
    this.$.find('.Ldt-CreateAnnotation-' + _screenName).show()
        .siblings().hide();
}

IriSP.Widgets.CreateAnnotation.prototype.show = function() {
    this.visible = true;
    this.showScreen('Main');
    this.$.find(".Ldt-CreateAnnotation-Description").val("").css("border-color", "#666666").addClass("empty");
    if (this.show_title_field) {
        this.$.find(".Ldt-CreateAnnotation-Title").val("").css("border-color", "#666666").addClass("empty");
    }
    if (this.show_creator_field) {
        this.$.find(".Ldt-CreateAnnotation-Creator").val(this.creator_name).css("border-color", "#666666");
        if (!this.creator_name) {
            this.$.find(".Ldt-CreateAnnotation-Creator").addClass("empty");
        }
    }
    this.$.find(".Ldt-CreateAnnotation-TagLi, .Ldt-CreateAnnotation-PolemicLi").removeClass("selected");
    this.$.slideDown();
    if (this.minimize_annotation_widget) {
        this.player.trigger("Annotation.minimize");
    }
}

IriSP.Widgets.CreateAnnotation.prototype.hide = function() {
    if (this.recorder) {
        this.recorder.stopRecord();
    }
    if (!this.always_visible) {
        this.visible = false;
        this.$.slideUp();
        if (this.minimize_annotation_widget) {
            this.player.trigger("Annotation.maximize");
        }
    }
}

IriSP.Widgets.CreateAnnotation.prototype.toggle = function() {
    if (!this.always_visible) {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

IriSP.Widgets.CreateAnnotation.prototype.addKeyword = function(_keyword) {
    var _field = this.$.find(".Ldt-CreateAnnotation-Description"),
        _rx = IriSP.Model.regexpFromTextOrArray(_keyword),
        _contents = _field.val();
    _contents = ( !!_contents.match(_rx)
        ? _contents.replace(_rx,"")
        : _contents + " " + _keyword
    );
    _field.val(_contents.replace(/\s{2,}/g,' ').replace(/(^\s+|\s+$)/g,''));
    this.onDescriptionChange();
}

IriSP.Widgets.CreateAnnotation.prototype.pauseOnWrite = function() {
    if (this.pause_on_write && !this.media.getPaused()) {
        this.media.pause();
    }
}

IriSP.Widgets.CreateAnnotation.prototype.onDescriptionChange = function() {
    var _field = this.$.find(".Ldt-CreateAnnotation-Description"),
        _contents = _field.val();
    _field.css("border-color", !!_contents ? "#666666" : "#ff0000");
    if (!!_contents) {
        _field.removeClass("empty");
    } else {
        _field.addClass("empty");
    }
    this.$.find(".Ldt-CreateAnnotation-TagLi, .Ldt-CreateAnnotation-PolemicLi").each(function() {
        var _rx = IriSP.Model.regexpFromTextOrArray(IriSP.jQuery(this).text().replace(/(^\s+|\s+$)/g,''));
        if (_contents.match(_rx)) {
            IriSP.jQuery(this).addClass("selected");
        } else {
            IriSP.jQuery(this).removeClass("selected");
        }
    });
    this.pauseOnWrite();
    return !!_contents;
}

IriSP.Widgets.CreateAnnotation.prototype.onTitleChange = function() {
    var _field = this.$.find(".Ldt-CreateAnnotation-Title"),
        _contents = _field.val();
    _field.css("border-color", !!_contents ? "#666666" : "#ff0000");
    if (!!_contents) {
        _field.removeClass("empty");
    } else {
        _field.addClass("empty");
    }
    this.pauseOnWrite();
    return !!_contents;
}


IriSP.Widgets.CreateAnnotation.prototype.onCreatorChange = function() {
    var _field = this.$.find(".Ldt-CreateAnnotation-Creator"),
        _contents = _field.val();
    _field.css("border-color", !!_contents ? "#666666" : "#ff0000");
    if (!!_contents) {
        _field.removeClass("empty");
    } else {
        _field.addClass("empty");
    }
    this.pauseOnWrite();
    return !!_contents;
}

/* Fonction effectuant l'envoi des annotations */
IriSP.Widgets.CreateAnnotation.prototype.onSubmit = function() {
    /* Si les champs obligatoires sont vides, on annule l'envoi */
    if (!this.onDescriptionChange() || (this.show_title_field && !this.onTitleChange()) || (this.show_creator_field && !this.onCreatorChange())) {
        return false;
    }
    
    if (this.recorder) {
        this.recorder.stopRecord();
    }
    
    var _this = this,
        _exportedAnnotations = new IriSP.Model.List(this.player.sourceManager), /* Création d'une liste d'annotations contenant une annotation afin de l'envoyer au serveur */
        _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]}), /* Création d'un objet source utilisant un sérialiseur spécifique pour l'export */
        _annotation = new IriSP.Model.Annotation(false, _export), /* Création d'une annotation dans cette source avec un ID généré à la volée (param. false) */
        _annotationTypes = this.source.getAnnotationTypes().searchByTitle(this.annotation_type, true), /* Récupération du type d'annotation dans lequel l'annotation doit être ajoutée */
        _annotationType = (_annotationTypes.length ? _annotationTypes[0] : new IriSP.Model.AnnotationType(false, _export)), /* Si le Type d'Annotation n'existe pas, il est créé à la volée */
        _url = Mustache.to_html(this.api_endpoint_template, {id: this.source.projectId}); /* Génération de l'URL à laquelle l'annotation doit être envoyée, qui doit inclure l'ID du projet */
    
    /* Si nous avons dû générer un ID d'annotationType à la volée... */
    if (!_annotationTypes.length) {
        /* Il ne faudra pas envoyer l'ID généré au serveur */
        _annotationType.dont_send_id = true;
        /* Il faut inclure le titre dans le type d'annotation */
        _annotationType.title = this.annotation_type;
    }
    
    /*
     * Nous remplissons les données de l'annotation générée à la volée
     * ATTENTION: Si nous sommes sur un MASHUP, ces éléments doivent se référer AU MEDIA D'ORIGINE
     * */
    _annotation.setMedia(this.source.currentMedia.id); /* Id du média annoté */
    _annotation.setBegin(this.begin); /*Timecode de début */
    _annotation.setEnd(this.end); /* Timecode de fin */
   
    _annotation.setAnnotationType(_annotationType.id); /* Id du type d'annotation */
    if (this.show_title_field) {
        /* Champ titre, seulement s'il est visible */
        _annotation.title = this.$.find(".Ldt-CreateAnnotation-Title").val();
    }
    _annotation.created = new Date(); /* Date de création de l'annotation */
    _annotation.description = this.$.find(".Ldt-CreateAnnotation-Description").val(); /* Champ description */
   
    var tagIds = this.$.find(".Ldt-CreateAnnotation-TagLi.selected")
        .map(function() { return IriSP.jQuery(this).attr("tag-id")});
    
    IriSP._(_annotation.description.match(/#[\w\d]+/g)).each(function(_tt) {
        var _tag,
            _tag_title = _tt.replace(/^#/,'')
            _tags = _this.source.getTags().searchByTitle(_tag_title, true);
        if (_tags.length) {
            _tag = _tags[0];
        } else {
            _tag = new IriSP.Model.Tag(false, _this.source);
            _tag.title = _tag_title;
        }
        tagIds.push(_tag.id);
    })
   
    _annotation.setTags(IriSP._(tagIds).uniq()); /*Liste des ids de tags */
    if (this.audio_url) {
        _annotation.audio = {
            src: "mic",
            mimetype: "audio/mp3",
            href: this.audio_url
        };
    }
    if (this.show_creator_field) {
        _annotation.creator = this.$.find(".Ldt-CreateAnnotation-Creator").val();
    } else {
        _annotation.creator = this.creator_name;
    }
    _exportedAnnotations.push(_annotation); /* Ajout de l'annotation à la liste à exporter */
    _export.addList("annotation",_exportedAnnotations); /* Ajout de la liste à exporter à l'objet Source */
    
    var _this = this;
    /* Envoi de l'annotation via AJAX au serveur ! */
    IriSP.jQuery.ajax({
        url: _url,
        type: this.api_method,
        contentType: 'application/json',
        data: _export.serialize(), /* L'objet Source est sérialisé */
        success: function(_data) {
            _this.showScreen('Saved'); /* Si l'appel a fonctionné, on affiche l'écran "Annotation enregistrée" */
            if (_this.after_send_timeout) { /* Selon les options de configuration, on revient à l'écran principal ou on ferme le widget, ou rien */
                window.setTimeout(
                    function() {
                        _this.close_after_send
                        ? _this.hide()
                        : _this.show();
                    },
                    _this.after_send_timeout
                );
            }
            _export.getAnnotations().removeElement(_annotation, true); /* Pour éviter les doublons, on supprime l'annotation qui a été envoyée */
            _export.deSerialize(_data); /* On désérialise les données reçues pour les réinjecter */
            _this.source.merge(_export); /* On récupère les données réimportées dans l'espace global des données */
            if (_this.pause_on_write && _this.media.getPaused()) {
                _this.media.play();
            }
            _this.player.trigger("AnnotationsList.refresh"); /* On force le rafraîchissement du widget AnnotationsList */
        },
        error: function(_xhr, _error, _thrown) {
            IriSP.log("Error when sending annotation", _thrown);
            _export.getAnnotations().removeElement(_annotation, true);
            _this.showScreen('Error');
            window.setTimeout(function(){
                _this.showScreen("Main")
            },
            (_this.after_send_timeout || 5000));
        }
    });
    this.showScreen('Wait');
    
    return false;
}

