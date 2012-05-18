IriSP.Widgets.CreateAnnotation = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastAnnotation = false;
};

IriSP.Widgets.CreateAnnotation.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.CreateAnnotation.prototype.defaults = {
    show_title_field : false,
    user_avatar : "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png",
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
    creator_name: "",
    api_serializer: "ldt_annotate"
/*

        remote_tags : false,
        random_tags : false,
        show_from_field : false,
        disable_share : false,
        polemic_mode : true, // enable polemics
        polemics : [{
            className: "positive",
            keyword: "++"
        }, {
            className: "negative",
            keyword: "--"
        }, {
            className: "reference",
            keyword: "=="
        }, {
            className: "question",
            keyword: "??"
        }],
        cinecast_version : false, // put to false to enable the platform version, true for the festival cinecast one.

        // where does the widget PUT the annotations - this is a mustache template. id refers to the id of the media and is filled by the widget.
         
        api_endpoint_template : "", // platform_url + "/ldtplatform/api/ldt/annotations/{{id}}.json",
        api_method : "PUT"
 */
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
        cancel: "Cancel"
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
        cancel: "Cancel"
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
    + '<div class="Ldt-CreateAnnotation-Avatar"><img src="{{user_avatar}}"></img></div>'
    + '<input type="submit" class="Ldt-CreateAnnotation-Submit" value="{{l10n.submit}}" />'
    + '{{#tags.length}}<div class="Ldt-CreateAnnotation-Tags"><div class="Ldt-CreateAnnotation-TagTitle">{{l10n.add_keywords_}}</div><ul class="Ldt-CreateAnnotation-TagList">'
    + '{{#tags}}<li class="Ldt-CreateAnnotation-TagLi" tag-id="{{id}}"><span class="Ldt-CreateAnnotation-TagButton">{{title}}</span></li>{{/tags}}</ul></div>{{/tags.length}}'
    + '{{#polemics.length}}<div class="Ldt-CreateAnnotation-Polemics"><div class="Ldt-CreateAnnotation-PolemicTitle">{{l10n.add_polemic_keywords_}}</div><ul class="Ldt-CreateAnnotation-PolemicList">'
    + '{{#polemics}}<li class="Ldt-CreateAnnotation-PolemicLi" style="background-color: {{background_color}}; color: {{text_color}}">{{keyword}}</li>{{/polemics}}</ul></div>{{/polemics.length}}'
    + '</form>'
    + '<div style="clear: both;"></div></div></div>';
    
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
    this.renderTemplate();
    var _this = this;
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

IriSP.Widgets.CreateAnnotation.prototype.show = function() {
    this.visible = true;
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
    this.begin = new IriSP.Model.Time(_values[0]);
    this.end = new IriSP.Model.Time(_values[1]);
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
    _field.css("border-color", !!_contents ? "#666666" : "#c00000");
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
    _field.css("border-color", !!_contents ? "#666666" : "#c00000");
    return !!_contents;
}

IriSP.Widgets.CreateAnnotation.prototype.onSubmit = function() {
    if (!this.onDescriptionChange() || (!this.onTitleChange() && this.show_title_field)) {
        return;
    }
    
    var _exportedAnnotations = new IriSP.Model.List(this.player.sourceManager);
        _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]}),
        _annotation = new IriSP.Model.Annotation(false, _export),
        _annotationType = new IriSP.Model.AnnotationType(false, _export);

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
    
    _export.creator = this.creator;
    _export.created = new Date();
    _exportedAnnotations.push(_annotation);
    _export.addList("annotation",_exportedAnnotations);
    console.log(_export.serialize());
    
    return false;
}
    
/*    
    + '        <div class="Ldt-CreateAnnotation-Screen Ldt-createAnnotation-startScreen">'
    + '            <div style="margin-bottom: 7px; overflow: auto;">'
    + '                <div class="Ldt-createAnnotation-Title"></div>'
    + '                <div class="Ldt-createAnnotation-TimeFrame"></div>'
    + '                {{^cinecast_version}} <div class="Ldt-createAnnotation-Minimize Ldt-TraceMe" title="Cancel"></div>'
    + '                {{/cinecast_version}}'
    + '            </div>'
    + '            <div class="Ldt-createAnnotation-Container">'
    + '                {{#show_from_field}}'
    + '                <label>{{l10n.your_name}}&nbsp;: </label><input class="Ldt-createAnnotation-userName Ldt-TraceMe" value="{{user_name}}" />'
    + '                {{/show_from_field}}'
    + '                <textarea class="Ldt-createAnnotation-Description Ldt-TraceMe"></textarea>'
    + '                <div class="Ldt-createAnnotation-userAvatar Ldt-TraceMe">'
    + '                    {{^user_avatar}} <img src="https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png"></img>'
    + '                    {{/user_avatar}}'
    + '                    {{#user_avatar}} <img src="{{ user_avatar }}"></img>'
    + '                    {{/user_avatar}}'
    + '                </div>'
    + '                <div class="Ldt-createAnnotation-profileArrow"></div>'
    + '            </div>'
    + '            <button class="Ldt-createAnnotation-submitButton Ldt-TraceMe">{{l10n.submit}}</button>'
    + '            {{#tags.length}}'
    + '            <div class="Ldt-createAnnotation-btnblock Ldt-createAnnotation-keywords">'
    + '                <label>{{l10n.add_keywords}} :</label>'
    + '                <ul class="Ldt-floatList">'
    + '                {{#tags}}'
    + '                    <li><button class="Ldt-createAnnotation-keyword-button Ldt-TraceMe" tag-id="{{id}}">{{meta.description}}</button></li>'
    + '                {{/tags}}'
    + '                </ul>'
    + '            </div>'
    + '            {{#random_tags}}'
    + '                <button class="Ldt-createAnnotation-moar-keywordz">{{l10n.more_tags}}</button>'
    + '            {{/random_tags}}'
    + '            {{/tags.length}}'
    + '            {{#polemic_mode}}'
    + '            {{#polemics.length}}'
    + '            <div class="Ldt-createAnnotation-btnblock Ldt-createAnnotation-polemics">'
    + '                <label>{{l10n.add_polemic_keywords}} :</label>'
    + '                <ul class="Ldt-floatList">'
    + '                {{#polemics}}'
    + '                    <li><button class="Ldt-createAnnotation-polemic-{{className}} Ldt-createAnnotation-polemic-button Ldt-TraceMe">{{keyword}}</button></li>'
    + '                {{/polemics}}'
    + '                </ul>'
    + '            </div>'
    + '            {{/polemics.length}}'
    + '            {{/polemic_mode}}'
    + '        </div>'
    + '        <div class="Ldt-createAnnotation-screen Ldt-createAnnotation-waitScreen" style="display: none; text-align: center">'
    + '            <div class="Ldt-createAnnotation-spinner"></div>'
    + '            {{l10n.wait_while_processed}}'
    + '        </div>'
    + '        <div class="Ldt-createAnnotation-screen Ldt-createAnnotation-errorScreen" style="display: none; text-align: center">'
    + '            <div class="Ldt-createAnnotation-Minimize" title="Hide"></div>'
    + '            {{l10n.error_while_contacting}}'
    + '        </div>'
    + '        <div class="Ldt-createAnnotation-screen Ldt-createAnnotation-endScreen" style="display: none">'
    + '            <div class="Ldt-createAnnotation-Minimize" title="Hide"></div>'
    + '            {{l10n.annotation_saved}}'
    + '            <br>'
    + '            {{^disable_share}}'
    + '            {{l10n.share_annotation}}'
    + '            <div style="margin-top: 12px; text-align: center;">'
    + '                <a target="_blank" class="Ldt-createAnnotation-endScreen-TweetLink Ldt-TraceMe"></a>'
    + '                <a target="_blank" class="Ldt-createAnnotation-endScreen-FbLink Ldt-TraceMe"></a>'
    + '                <a target="_blank" class="Ldt-createAnnotation-endScreen-GplusLink Ldt-TraceMe"></a>'
    + '            </div>'
    + '            {{/disable_share}}'
    + '        </div>'
    + '        <div class="Ldt-floatClear"></div>'
*/

