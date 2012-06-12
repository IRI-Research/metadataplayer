/* TODO: Add Social Network Sharing and from field */

IriSP.Widgets.CreateAnnotation = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastAnnotation = false;
};

IriSP.Widgets.CreateAnnotation.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.CreateAnnotation.prototype.defaults = {
    show_title_field : true,
    creator_name : "",
    creator_avatar : "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png",
    tags : false,
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
    annotation_type: "Contributions",
    api_serializer: "ldt_annotate",
    api_endpoint_template: "",
    api_method: "PUT",
    close_widget_timeout: 0
}

IriSP.Widgets.CreateAnnotation.prototype.messages = {
    en: {
        from_time: "from",
        to_time: "to",
        submit: "Submit",
        add_keywords_: "Add keywords:",
        add_polemic_keywords_: "Add polemic keywords:",
        your_name: "Your name",
        no_title: "Annotate this video",
        type_title: "Annotation title",
        type_description: "Type the full description of your annotation here.",
        wait_while_processing: "Please wait while your request is being processed...",
        error_while_contacting: "An error happened while contacting the server. Your annotation has not been saved.",
        empty_annotation: "Your annotation is empty. Please write something before submitting.",
        annotation_saved: "Thank you, your annotation has been saved.",
        share_annotation: "Would you like to share it on social networks ?",
        share_on: "Share on",
        more_tags: "More tags",
        cancel: "Cancel",
        close_widget: "Cacher la zone de création d'annotations"
    },
    fr: {
        from_time: "de",
        to_time: "à",
        submit: "Envoyer",
        add_keywords_: "Ajouter des mots-clés&nbsp;:",
        add_polemic_keywords_: "Ajouter des mots-clés polémiques&nbsp;:",
        your_name: "Votre nom",
        no_title: "Annoter cette vidéo",
        type_title: "Titre de l'annotation",
        type_description: "Rédigez le contenu de votre annotation ici.",
        wait_while_processing: "Veuillez patienter pendant le traitement de votre requête...",
        error_while_contacting: "Une erreur s'est produite en contactant le serveur. Votre annotation n'a pas été enregistrée",
        empty_annotation: "Votre annotation est vide. Merci de rédiger un texte avant de l'envoyer.",
        annotation_saved: "Merci, votre annotation a été enregistrée.",
        share_annotation: "Souhaitez-vous la partager sur les réseaux sociaux ?",
        share_on: "Partager sur",
        more_tags: "Plus de mots-clés",
        cancel: "Cancel",
        close_widget: "Hide the annotation creating block"
    }
}

IriSP.Widgets.CreateAnnotation.prototype.template =
    '<div class="Ldt-CreateAnnotation"><div class="Ldt-CreateAnnotation-Inner">'
    + '<form class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Main">'
    + '<h3>{{#show_title_field}}<input class="Ldt-CreateAnnotation-Title" placeholder="{{l10n.type_title}}" />{{/show_title_field}}'
    + '{{^show_title_field}}<span class="Ldt-CreateAnnotation-NoTitle">{{l10n.no_title}} </span>{{/show_title_field}}'
    + ' <span class="Ldt-CreateAnnotation-Times">{{l10n.from_time}} <span class="Ldt-CreateAnnotation-Begin"></span>'
    + ' {{l10n.to_time}} <span class="Ldt-CreateAnnotation-End"></span></span></h3>'
    + '<textarea class="Ldt-CreateAnnotation-Description" placeholder="{{l10n.type_description}}"></textarea>'
    + '<div class="Ldt-CreateAnnotation-Avatar"><img src="{{creator_avatar}}" title="{{creator_name}}"></img></div>'
    + '<input type="submit" class="Ldt-CreateAnnotation-Submit" value="{{l10n.submit}}" />'
    + '{{#tags.length}}<div class="Ldt-CreateAnnotation-Tags"><div class="Ldt-CreateAnnotation-TagTitle">{{l10n.add_keywords_}}</div><ul class="Ldt-CreateAnnotation-TagList">'
    + '{{#tags}}<li class="Ldt-CreateAnnotation-TagLi" tag-id="{{id}}"><span class="Ldt-CreateAnnotation-TagButton">{{title}}</span></li>{{/tags}}</ul></div>{{/tags.length}}'
    + '{{#polemics.length}}<div class="Ldt-CreateAnnotation-Polemics"><div class="Ldt-CreateAnnotation-PolemicTitle">{{l10n.add_polemic_keywords_}}</div><ul class="Ldt-CreateAnnotation-PolemicList">'
    + '{{#polemics}}<li class="Ldt-CreateAnnotation-PolemicLi" style="background-color: {{background_color}}; color: {{text_color}}">{{keyword}}</li>{{/polemics}}</ul></div>{{/polemics.length}}'
    + '<div style="clear: both;"></div></form>'
    + '<div class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Wait"><div class="Ldt-CreateAnnotation-InnerBox">{{l10n.wait_while_processing}}</div></div>'
    + '<div class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Error"><a title="{{l10n.close_widget}}" class="Ldt-CreateAnnotation-Close" href="#"></a><div class="Ldt-CreateAnnotation-InnerBox">{{l10n.error_while_contacting}}</div></div>'
    + '<div class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Saved"><a title="{{l10n.close_widget}}" class="Ldt-CreateAnnotation-Close" href="#"></a><div class="Ldt-CreateAnnotation-InnerBox">{{l10n.annotation_saved}}</div></div>'
    + '</div></div>';
    
IriSP.Widgets.CreateAnnotation.prototype.draw = function() {
    if (!this.tags) {
        this.tags = this.source.getTags()
            .sortBy(function (_tag) {
                return -_tag.getAnnotations().length;
            })
            .slice(0, this.max_tags)
            .map(function(_tag) {
                return _tag;
            });
        // We have to use the map function because Mustache doesn't like our tags object
    }
    var _this = this;
    this.renderTemplate();
    this.$.find(".Ldt-CreateAnnotation-Close").click(function() {
        _this.hide();
        return false;
    });
    this.$.find(".Ldt-CreateAnnotation-TagLi, .Ldt-CreateAnnotation-PolemicLi").click(function() {
        _this.addKeyword(IriSP.jQuery(this).text().replace(/(^\s+|\s+$)/g,''));
        return false;
    });
    this.$.find(".Ldt-CreateAnnotation-Description").bind("change keyup input paste", this.functionWrapper("onDescriptionChange"));
    if (this.show_title_field) {
        this.$.find(".Ldt-CreateAnnotation-Title").bind("change keyup input paste", this.functionWrapper("onTitleChange"));
    }
    
    this.$.hide();
    this.hide();
    this.bindPopcorn("IriSP.CreateAnnotation.toggle","toggle");
    this.bindPopcorn("IriSP.Slice.boundsChanged","onBoundsChanged");
    this.begin = new IriSP.Model.Time();
    this.end = this.source.getDuration();
    this.$.find("form").submit(this.functionWrapper("onSubmit"));
}

IriSP.Widgets.CreateAnnotation.prototype.showScreen = function(_screenName) {
    this.$.find('.Ldt-CreateAnnotation-' + _screenName).show()
        .siblings().hide();
}

IriSP.Widgets.CreateAnnotation.prototype.show = function() {
    this.visible = true;
    this.showScreen('Main');
    this.$.find(".Ldt-CreateAnnotation-Description").val("").css("border-color", "#666666");
    this.$.find(".Ldt-CreateAnnotation-Title").val("").css("border-color", "#666666");
    this.$.find(".Ldt-CreateAnnotation-TagLi, .Ldt-CreateAnnotation-PolemicLi").removeClass("selected");
    this.$.slideDown();
    this.player.popcorn.trigger("IriSP.Annotation.minimize");
    this.player.popcorn.trigger("IriSP.Slice.show");
}

IriSP.Widgets.CreateAnnotation.prototype.hide = function() {
    this.visible = false;
    this.$.slideUp();
    this.player.popcorn.trigger("IriSP.Annotation.maximize");
    this.player.popcorn.trigger("IriSP.Slice.hide");
}

IriSP.Widgets.CreateAnnotation.prototype.toggle = function() {
    if (this.visible) {
        this.hide();
    } else {
        this.show();
    }
}

IriSP.Widgets.CreateAnnotation.prototype.onBoundsChanged = function(_values) {
    this.begin = new IriSP.Model.Time(_values[0] || 0);
    this.end = new IriSP.Model.Time(_values[1] || 0);
    this.$.find(".Ldt-CreateAnnotation-Begin").html(this.begin.toString());
    this.$.find(".Ldt-CreateAnnotation-End").html(this.end.toString());
}

IriSP.Widgets.CreateAnnotation.prototype.addKeyword = function(_keyword) {
    var _field = this.$.find(".Ldt-CreateAnnotation-Description"),
        _rx = IriSP.Model.regexpFromTextOrArray(_keyword),
        _contents = _field.val();
    _contents = ( _rx.test(_contents)
        ? _contents.replace(_rx,"")
        : _contents + " " + _keyword
    );
    _field.val(_contents.replace(/\s{2,}/g,' ').replace(/(^\s+|\s+$)/g,''));
    this.onDescriptionChange();
}

IriSP.Widgets.CreateAnnotation.prototype.onDescriptionChange = function() {
    var _field = this.$.find(".Ldt-CreateAnnotation-Description"),
        _contents = _field.val();
    _field.css("border-color", !!_contents ? "#666666" : "#ff0000");
    this.$.find(".Ldt-CreateAnnotation-TagLi, .Ldt-CreateAnnotation-PolemicLi").each(function() {
        var _rx = IriSP.Model.regexpFromTextOrArray(IriSP.jQuery(this).text().replace(/(^\s+|\s+$)/g,''));
        if (_rx.test(_contents)) {
            IriSP.jQuery(this).addClass("selected");
        } else {
            IriSP.jQuery(this).removeClass("selected");
        }
    });
    return !!_contents;
}

IriSP.Widgets.CreateAnnotation.prototype.onTitleChange = function() {
    var _field = this.$.find(".Ldt-CreateAnnotation-Title"),
        _contents = _field.val();
    _field.css("border-color", !!_contents ? "#666666" : "#ff0000");
    return !!_contents;
}

IriSP.Widgets.CreateAnnotation.prototype.onSubmit = function() {
    if (!this.onDescriptionChange() || (!this.onTitleChange() && this.show_title_field)) {
        return;
    }
    
    var _exportedAnnotations = new IriSP.Model.List(this.player.sourceManager);
        _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]}),
        _annotation = new IriSP.Model.Annotation(false, _export),
        _annotationTypes = this.source.getAnnotationTypes().searchByTitle(this.annotation_type),
        _annotationType = (_annotationTypes.length ? _annotationTypes[0] : new IriSP.Model.AnnotationType(false, _export)),
        _url = Mustache.to_html(this.api_endpoint_template, {id: this.source.projectId});

    if (!_annotationTypes.length) {
        _annotationType.dont_send_id = true;
    }
    
    _annotationType.title = this.annotation_type;
    _annotation.setBegin(this.begin);
    _annotation.setEnd(this.end);
    _annotation.setMedia(this.source.currentMedia.id);
    _annotation.setAnnotationType(_annotationType.id);
    if (this.show_title_field) {
        _annotation.title = this.$.find(".Ldt-CreateAnnotation-Title").val()
    }
    _annotation.created = new Date();
    _annotation.description = this.$.find(".Ldt-CreateAnnotation-Description").val();
    _annotation.setTags(this.$.find(".Ldt-CreateAnnotation-TagLi.selected").map(function() { return IriSP.jQuery(this).attr("tag-id")}));
    
    _export.creator = this.creator_name;
    _export.created = new Date();
    _exportedAnnotations.push(_annotation);
    _export.addList("annotation",_exportedAnnotations);
    
    var _this = this;
    IriSP.jQuery.ajax({
        url: _url,
        type: this.api_method,
        contentType: 'application/json',
        data: _export.serialize(),
        success: function(_data) {
            _this.showScreen('Saved');
            if (_this.close_widget_timeout) {
                window.setTimeout(_this.functionWrapper("hide"),_this.close_widget_timeout);
            }
            _export.getAnnotations().removeElement(_annotation, true);
            _export.deSerialize(_data);
            _this.source.merge(_export);
            _this.player.popcorn.trigger("IriSP.AnnotationsList.refresh");
        },
        error: function(_xhr, _error, _thrown) {
            IriSP.log("Error when sending annotation", _thrown);
            _export.getAnnotations().removeElement(_annotation, true);
            _this.showScreen('Error');
            window.setTimeout(function(){
                _this.showScreen("Main")
            },
            (_this.close_widget_timeout || 5000));
        }
    });
    this.showScreen('Wait');
    
    return false;
}

