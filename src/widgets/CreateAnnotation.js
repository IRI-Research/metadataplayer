/* TODO: Add Social Network Sharing */

IriSP.Widgets.CreateAnnotation = function (player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    if (_this.editable_storage != '' && window.localStorage[_this.editable_storage]) {
        this.source.onLoad(function () {
            var _export = _this.player.sourceManager.newLocalSource({serializer: IriSP.serializers['ldt_localstorage']});
            _export.deSerialize(window.localStorage[_this.editable_storage]);
            _this.source.merge(_export);
        });
    };
};

IriSP.Widgets.CreateAnnotation.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.CreateAnnotation.prototype.defaults = {
    show_title_field : true,
    show_creator_field : true,
    creator_field_readonly : false,
    start_visible : true,
    always_visible : false,
    show_slice : true,
    show_arrow : true,
    show_mic_record: false,
    show_mic_play: false,
    show_time: true,
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
    }, {
        keyword: "--",
        background_color: "#c00000",
        text_color: "#ffffff"
    }, {
        keyword: "??",
        background_color: "#0000e0",
        text_color: "#ffffff"
    }, {
        keyword: "==",
        background_color: "#f0e000",
        text_color: "#000000"
    }],
    slice_annotation_type: "chap",
    annotation_type: "Contributions",
    post_at_segment_time: false,
    segment_annotation_type: "chap",
    api_serializer: "ldt_annotate",
    api_endpoint_template: "",
    api_method: "POST",
    // Id that will be used as localStorage key
    editable_storage: "",
    project_id: "",
    after_send_timeout: 0,
    close_after_send: false,
    tag_prefix: "#",
    pause_when_displaying: false,
    custom_send_button: false,
    custom_cancel_button: false,
    custom_description_placeholder: false,
    preview_mode: false
};

IriSP.Widgets.CreateAnnotation.prototype.messages = {
    en: {
        from_time: "from",
        to_time: "to",
        at_time: "at",
        submit: "Submit",
        preview_submit: "You cannot submit annotations in preview mode",
        cancel: "Cancel",
        add_keywords_: "Add keywords:",
        add_polemic_keywords_: "Add polemic attributes :",
        your_name_: "Your name:",
        annotate_video: "New note",
        type_title: "Annotation title",
        type_description: "Enter a new note...",
        wait_while_processing: "Please wait while your annotation is being processed...",
        error_while_contacting: "An error happened while contacting the server. Your annotation has not been saved.",
        annotation_saved: "Thank you, your annotation has been saved.",
        share_annotation: "Would you like to share it on social networks ?",
        close_widget: "Hide the annotation form",
        "polemic++": "Agree",
        "polemic--": "Disagree",
        "polemic??": "Question",
        "polemic==": "Reference",
        "in_tooltip": "Set begin time to current player time",
        "out_tooltip": "Set begin time to current player time",
        "play_tooltip": "Play the fragment"
    },
    fr: {
        from_time: "de",
        to_time: "à",
        at_time: "à",
        submit: "Envoyer",
        preview_submit: "Vous ne pouvez pas envoyer d'annotation en mode aperçu",
        cancel: "Annuler",
        add_keywords_: "Ajouter des mots-clés\u00a0:",
        add_polemic_keywords_: "Ajouter des attributs polémiques\u00a0:",
        your_name_: "Votre nom\u00a0:",
        annotate_video: "Entrez une nouvelle note...",
        type_title: "Titre de l'annotation",
        type_description: "Prenez vos notes...",
        wait_while_processing: "Veuillez patienter pendant le traitement de votre annotation...",
        error_while_contacting: "Une erreur s'est produite en contactant le serveur. Votre annotation n'a pas été enregistrée.",
        annotation_saved: "Merci, votre annotation a été enregistrée.",
        share_annotation: "Souhaitez-vous la partager sur les réseaux sociaux ?",
        close_widget: "Cacher le formulaire de création d'annotations",
        "polemic++": "Accord",
        "polemic--": "Désaccord",
        "polemic??": "Question",
        "polemic==": "Référence",
        "in_tooltip": "Utiliser le temps courant comme début",
        "out_tooltip": "Utiliser le temps courant comme fin",
        "play_tooltip": "Jouer le fragment"
    }
};

IriSP.Widgets.CreateAnnotation.prototype.template =
    '{{#show_slice}}<div class="Ldt-CreateAnnotation-Slice Ldt-TraceMe"></div>{{/show_slice}}'
    + '{{^show_slice}}{{#show_arrow}}<div class="Ldt-CreateAnnotation-Arrow"></div>{{/show_arrow}}{{/show_slice}}'
    + '<div class="Ldt-CreateAnnotation"><div class="Ldt-CreateAnnotation-Inner">'
    + '<form class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Main">'
    + '<h3><span class="Ldt-CreateAnnotation-h3Left">{{l10n.annotate_video}}{{#show_title_field}}</span></h3>'
    + '<h3><span class="Ldt-CreateAnnotation-h3Left"><input class="Ldt-CreateAnnotation-Title empty" placeholder="{{l10n.type_title}}" />{{/show_title_field}}'
    + '{{#show_time}}<span class="Ldt-CreateAnnotation-Times"> {{#show_slice}}{{l10n.from_time}} {{/show_slice}}{{^show_slice}}{{l10n.at_time}} {{/show_slice}} <span class="Ldt-CreateAnnotation-Begin">00:00</span>{{/show_time}}'
    + '{{#show_slice}} {{l10n.to_time}} <span class="Ldt-CreateAnnotation-End">{{end}}</span>{{/show_slice}}</span></span>'
    + '{{#show_creator_field}}{{l10n.your_name_}} <input class="Ldt-CreateAnnotation-Creator empty" value="{{creator_name}}" {{#creator_field_readonly}}readonly{{/creator_field_readonly}}/>{{/show_creator_field}}</h3>'
    + '{{#show_controls}}<div class="Ldt-CreateAnnotation-Controls">'
    +   '<span title="{{l10n.in_tooltip}}" class="Ldt-CreateAnnotation-Control-In">In</span>'
    +   '<span title="{{l10n.out_tooltip}}" class="Ldt-CreateAnnotation-Control-Out">Out</span>'
    +   '<span title="{{l10n.play_tooltip}}" class="Ldt-CreateAnnotation-Control-Play">Play</span>'
    + '</div>{{/show_controls}}'
    + '<textarea class="Ldt-CreateAnnotation-Description Ldt-TraceMe empty" placeholder="{{#custom_description_placeholder}}{{custom_description_placeholder}}{{/custom_description_placeholder}}{{^custom_description_placeholder}}{{l10n.type_description}}{{/custom_description_placeholder}}"></textarea>'
    + '{{#show_creator_field}}<div class="Ldt-CreateAnnotation-Avatar"><img src="{{creator_avatar}}" title="{{creator_name}}"></img></div>{{/show_creator_field}}'
    + '<div class="Ldt-CreateAnnotation-SubmitArea Ldt-TraceMe">'
    +  '{{#preview_mode}}<input type="button" class="Ldt-CreateAnnotation-PreviewSubmit" title="{{l10n.preview_submit}}" value="{{#custom_send_button}}{{custom_send_button}}{{/custom_send_button}}{{^custom_send_button}}{{l10n.submit}}{{/custom_send_button}}" />{{/preview_mode}}'
    +  '{{^preview_mode}}<input type="submit" class="Ldt-CreateAnnotation-Submit" value="{{#custom_send_button}}{{custom_send_button}}{{/custom_send_button}}{{^custom_send_button}}{{l10n.submit}}{{/custom_send_button}}" />{{/preview_mode}}'
    +   '<input type="button" class="Ldt-CreateAnnotation-Cancel" value="{{#custom_cancel_button}}{{custom_cancel_button}}{{/custom_cancel_button}}{{^custom_cancel_button}}{{l10n.cancel}}{{/custom_cancel_button}}" />'
    +   '<div class="Ldt-CreateAnnotation-Begin Ldt-CreateAnnotation-Times">00:00</div>'
    + '</div>'
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
    + '{{#tags}}<li class="Ldt-CreateAnnotation-TagLi" tag-id="{{id}}" data-text="{{tag_prefix}}{{title}}"><span class="Ldt-CreateAnnotation-TagButton">{{title}}</span></li>{{/tags}}</ul></div>{{/tags.length}}'
    + '{{#polemics.length}}<div class="Ldt-CreateAnnotation-Polemics"><div class="Ldt-CreateAnnotation-PolemicTitle">{{l10n.add_polemic_keywords_}}</div><ul class="Ldt-CreateAnnotation-PolemicList">'
    + '{{#polemics}}<li class="Ldt-CreateAnnotation-PolemicLi" style="background-color: {{background_color}}; color: {{text_color}}" data-text="{{keyword}}">{{keyword}}</li>{{/polemics}}</ul></div>{{/polemics.length}}'
    + '<div style="clear: both;"></div></form>'
    + '<div class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Wait"><div class="Ldt-CreateAnnotation-InnerBox">{{l10n.wait_while_processing}}</div></div>'
    + '<div class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Error">{{^always_visible}}<a title="{{l10n.close_widget}}" class="Ldt-CreateAnnotation-Close" href="#"></a>{{/always_visible}}<div class="Ldt-CreateAnnotation-InnerBox">{{l10n.error_while_contacting}}</div></div>'
    + '<div class="Ldt-CreateAnnotation-Screen Ldt-CreateAnnotation-Saved">{{^always_visible}}<a title="{{l10n.close_widget}}" class="Ldt-CreateAnnotation-Close" href="#"></a>{{/always_visible}}<div class="Ldt-CreateAnnotation-InnerBox">{{l10n.annotation_saved}}</div></div>'
    + '</div></div>';

IriSP.Widgets.CreateAnnotation.prototype.draw = function () {
    var _this = this;

    this.begin = new IriSP.Model.Time();
    this.end = this.source.getDuration();

    this.tag_prefix = this.tag_prefix || "";

    if (this.tag_titles && !this.tags) {
        if (!(this.tag_titles.length == 1 && this.tag_titles[0] == "")) {
            this.tags = IriSP._(this.tag_titles).map(function (_tag_title) {
                var _tag,
                    _tags = _this.source.getTags().searchByTitle(_tag_title, true);
                if (_tags.length) {
                    _tag = _tags[0];
                } else {
                    _tag = new IriSP.Model.Tag(false, _this.source);
                    _this.source.getTags().push(_tag);
                    _tag.title = _tag_title;
                }
                return _tag;
            });
        } else {
            // we forced no tags if this.tag_titles = [''] (and not false)
            this.tags = true;
        }
    }
    if (!this.tags) {
        this.tags = this.source.getTags()
            .sortBy(function (_tag) {
                return -_tag.getAnnotations().length;
            })
            .slice(0, this.max_tags)
            .map(function (_tag) {
                return _tag;
            });
        /* We have to use the map function because Mustache doesn't like our tags object */
    }
    this.record_swf = IriSP.getLib("recordMicSwf");
    this.renderTemplate();
    if (this.show_mic_record) {
        this.recorder = this.$.find("embed")[0];

        window.setAudioUrl = function (_url) {
            _this.audio_url = _url;
        };
    }
    if (this.show_slice) {
        this.insertSubwidget(
            this.$.find(".Ldt-CreateAnnotation-Slice"),
            {
                type: "Slice",
                show_arrow: this.show_arrow,
                annotation_type: this.slice_annotation_type,
                onBoundsChanged: function (_from, _to) {
                    _this.setBeginEnd(_from, _to);
                }
            },
            "slice"
        );
    } else {
        if (this.show_arrow) {
            this.insertSubwidget(this.$.find(".Ldt-CreateAnnotation-Arrow"), {type: "Arrow"}, "arrow");
        }
        this.onMediaEvent("timeupdate", function (_time) {
            // Do not update timecode if description is not empty
            if (_this.$.find(".Ldt-CreateAnnotation-Description").val().trim() == "") {
                _this.setBeginEnd(_time, _time);
                if (_this.arrow) {
                    _this.arrow.moveToTime(_time);
                }
            };
        });
    }
    this.$.find(".Ldt-CreateAnnotation-Cancel").click(function () {
        _this.player.trigger("CreateAnnotation.hide");
    });
    this.$.find(".Ldt-CreateAnnotation-Close").click(function () {
        _this.close_after_send
        ? _this.player.trigger("CreateAnnotation.hide")
        : _this.showScreen("Main");
        return false;
    });
    this.$.find(".Ldt-CreateAnnotation-TagLi, .Ldt-CreateAnnotation-PolemicLi").click(function () {
        _this.addKeyword(IriSP.jQuery(this).attr("data-text"));
        return false;
    });
    this.$.find(".Ldt-CreateAnnotation-PolemicLi").each(function () {
        var _el = IriSP.jQuery(this),
            _kw = _el.attr("data-text"),
            _msg = _this.l10n["polemic" + _kw];
        if (_msg) {
            _el.attr("title", _msg);
        }
    });
    this.$.find(".Ldt-CreateAnnotation-Description").bind("change keyup input paste", this.functionWrapper("onDescriptionChange"));
    if (this.show_title_field) {
        this.$.find(".Ldt-CreateAnnotation-Title").bind("change keyup input paste", this.functionWrapper("onTitleChange"));
    }
    if (this.show_creator_field) {
        this.$.find(".Ldt-CreateAnnotation-Creator").bind("change keyup input paste", this.functionWrapper("onCreatorChange"));
    }
    this.$.find("[class^='Ldt-CreateAnnotation-Control-']").click(function () {
        var action = this.className.replace('Ldt-CreateAnnotation-Control-', '');
        switch (action) {
        case "In":
            // Set In bound to current player time
            this.setBegin(_this.media.getCurrentTime());
            break;
        case "Out":
            // Set In bound to current player time
            this.setEnd(_this.media.getCurrentTime() || _this.media.duration);
            break;
        case "Play":
            this.media.setCurrentTime(_this.begin);
            this.media.play();
            break;
        }
        return false;
    });

    if (this.start_visible) {
        this.show();
    } else {
        this.$.hide();
        this.hide();
    }

    this.onMdpEvent("CreateAnnotation.toggle", "toggle");
    this.onMdpEvent("CreateAnnotation.hide", "hide");
    this.onMdpEvent("CreateAnnotation.show", "show");
    this.$.find("form").submit(this.functionWrapper("onSubmit"));
};

IriSP.Widgets.CreateAnnotation.prototype.setBegin = function (t) {
    this.begin = new IriSP.Model.Time(t || 0);
    this.$.find(".Ldt-CreateAnnotation-Begin").html(this.begin.toString());
};

IriSP.Widgets.CreateAnnotation.prototype.setEnd = function (t) {
    this.end = new IriSP.Model.Time(t || 0);
    this.$.find(".Ldt-CreateAnnotation-End").html(this.end.toString());
};

IriSP.Widgets.CreateAnnotation.prototype.setBeginEnd = function (begin, end) {
    this.setBegin(begin);
    this.setEnd(end);
};

IriSP.Widgets.CreateAnnotation.prototype.showScreen = function (_screenName) {
    this.$.find('.Ldt-CreateAnnotation-' + _screenName).show()
        .siblings().hide();
};

IriSP.Widgets.CreateAnnotation.prototype.show = function () {
    if (!this.visible) {
        this.visible = true;
        if (this.pause_when_displaying) {
            this.media.pause();
        }
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
};

IriSP.Widgets.CreateAnnotation.prototype.hide = function () {
    if (this.visible) {
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
};

IriSP.Widgets.CreateAnnotation.prototype.toggle = function () {
    if (!this.always_visible) {
        if (this.visible) {
            this.hide();
        } else {
            var t = this.media.getCurrentTime() || 0;
            this.setBeginEnd(t, t);
            if (this.slice_widget) {
                this.slice_widget.setBounds(this.begin, this.end);
            }
            this.show();
            // Set focus on textarea
            this.$.find(".Ldt-CreateAnnotation-Description").focus();
        }
    }
};

IriSP.Widgets.CreateAnnotation.prototype.addKeyword = function (_keyword) {
    var _field = this.$.find(".Ldt-CreateAnnotation-Description"),
        _rx = IriSP.Model.regexpFromTextOrArray(_keyword),
        _contents = _field.val();
    _contents = (!!_contents.match(_rx)
        ? _contents.replace(_rx, "")
        : _contents + " " + _keyword
    );
    _field.val(_contents.replace(/\s{2,}/g, ' ').replace(/(^\s+|\s+$)/g, ''));
    this.onDescriptionChange();
};

IriSP.Widgets.CreateAnnotation.prototype.pauseOnWrite = function () {
    if (this.pause_on_write && !this.media.getPaused()) {
        this.media.pause();
    }
};

IriSP.Widgets.CreateAnnotation.prototype.onDescriptionChange = function (e) {
    if (e !== undefined && e.keyCode == 13 && !e.shiftKey) {
        // Return: submit. Use shift-Return to insert a LF
        this.onSubmit();
        return true;
    }
    var _field = this.$.find(".Ldt-CreateAnnotation-Description"),
        _contents = _field.val();
    _field.css("border-color", !!_contents ? "#666666" : "#ff0000");
    if (!!_contents) {
        _field.removeClass("empty");
    } else {
        _field.addClass("empty");
    }
    this.$.find(".Ldt-CreateAnnotation-TagLi, .Ldt-CreateAnnotation-PolemicLi").each(function () {
        var _rx = IriSP.Model.regexpFromTextOrArray(IriSP.jQuery(this).attr("data-text"));
        if (_contents.match(_rx)) {
            IriSP.jQuery(this).addClass("selected");
        } else {
            IriSP.jQuery(this).removeClass("selected");
        }
    });
    this.pauseOnWrite();
    return !!_contents;
};

IriSP.Widgets.CreateAnnotation.prototype.onTitleChange = function () {
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
};


IriSP.Widgets.CreateAnnotation.prototype.onCreatorChange = function () {
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
};

IriSP.Widgets.CreateAnnotation.prototype.onSubmit = function () {
    /* If mandatory fields are empty, we cancel the sending */
    if (!this.onDescriptionChange() || (this.show_title_field && !this.onTitleChange()) || (this.show_creator_field && !this.onCreatorChange())) {
        return false;
    }

    if (this.recorder) {
        this.recorder.stopRecord();
    }

    var _this = this,
        _exportedAnnotations = new IriSP.Model.List(this.player.sourceManager), /* We create a List to send to the server that will contains the annotation */
        _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]}), /* We create a source object using a specific serializer for export */
        _local_export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers['ldt_localstorage']}), /* Source object using a specific serializer for local export */
        _annotation = new IriSP.Model.Annotation(false, _export), /* We create an annotation in the source with a generated ID (param. false) */
        _annotationTypes = this.source.getAnnotationTypes().searchByTitle(this.annotation_type, true), /* We get the AnnotationType in which the annotation will be added */
        _annotationType = (_annotationTypes.length ? _annotationTypes[0] : new IriSP.Model.AnnotationType(false, _export)), /* If it doesn't already exists, we create it */
        _url = Mustache.to_html(this.api_endpoint_template, {id: this.source.projectId}); /* We make the url to send the request to, must include project id */

    /* If we created an AnnotationType on the spot ... */
    if (!_annotationTypes.length) {
        /* ... We must not send its id to the server ... */
        _annotationType.dont_send_id = true;
        /* ... And we must include its title. */
        _annotationType.title = this.annotation_type;
    }

    /*
     * Will fill the generated annotation object's data
     * WARNING: If we're on a MASHUP, these datas must refer the ORIGINAL MEDIA
     * */
    _annotation.setMedia(this.source.currentMedia.id); /* Annotated media ID */

    if (this.post_at_segment_time) {
        var _currentTime = this.media.getCurrentTime();
        var _segmentsAnnotations = this.source.getAnnotationsByTypeTitle(this.segments_annotation_type);
        var _currentSegments = _segmentsAnnotations.filter(function (_segment) {
            return (_currentTime >= _segment.begin && _currentTime <= _segment.end);
        });
        if (_currentSegments.length == 0) {
            _annotation.setBegin(this.begin); /* Widget starting timecode */
            _annotation.setEnd(this.end); /* Widget end timecode */
        } else {
            _annotation.setBegin(_currentSegments[0].begin); /* Segment starting timecode */
            _annotation.setEnd(_currentSegments[0].end); /* Segment end timecode */
        }
    } else {
        _annotation.setBeginEnd(this.begin, this.end); /* Widget end/start timecodes */
    }
    _annotation.setAnnotationType(_annotationType.id); /* Annotation type ID */

    _annotation.created = new Date(); /* Annotation creation date */
    _annotation.description = this.$.find(".Ldt-CreateAnnotation-Description").val().trim(); /* Description field */
    if (this.show_title_field) {
        /* Title field, only if it's visible */
        _annotation.title = this.$.find(".Ldt-CreateAnnotation-Title").val();
    } else {
        /* Else we use the first line of the description as title */
        _annotation.title = _annotation.description.split("\n")[0];
    }

    if (this.project_id != "") {
        /* Project id, only if it's been specifiec in the config */
        _annotation.project_id = this.project_id;
    }

    var tagIds = Array.prototype.map.call(
        this.$.find(".Ldt-CreateAnnotation-TagLi.selected"),
        function (el) { return IriSP.jQuery(el).attr("tag-id"); }
    );

    IriSP._(_annotation.description.match(/#[^\s#.,;]+/g)).each(function (_tt) {
        var _tag,
            _tag_title = _tt.replace(/^#/, ''),
            _tags = _this.source.getTags().searchByTitle(_tag_title, true);
        if (_tags.length) {
            _tag = _tags[0];
        } else {
            _tag = new IriSP.Model.Tag(false, _this.source);
            _this.source.getTags().push(_tag);
            _tag.title = _tag_title;
        }
        if (tagIds.indexOf(_tag.id) === -1) {
            tagIds.push(_tag.id);
        }
    });
    _annotation.setTags(IriSP._(tagIds).uniq()); /* Tag ids list */
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

    if (this.editable_storage != '') {
        // Append to localStorage annotations

        // FIXME: handle movie ids
        _local_export.addList("annotation", _exportedAnnotations); /* Ajout de la liste à exporter à l'objet Source */
        _this.source.merge(_local_export); /* On ajoute la nouvelle annotation au recueil original */
        // Import previously saved local annotations
        if (window.localStorage[this.editable_storage]) {
            _local_export.deSerialize(window.localStorage[this.editable_storage]);
        }
        // Save everything back
        window.localStorage[_this.editable_storage] = _local_export.serialize();
        _this.player.trigger("AnnotationsList.refresh"); /* On force le rafraîchissement du widget AnnotationsList */
        _this.player.trigger("Annotation.create", _annotation);
        _this.$.find(".Ldt-CreateAnnotation-Description").val("");
    }

    if (_url !== "") {
        _exportedAnnotations.push(_annotation); /* We add the annotation in the list to export */
        _export.addList("annotation", _exportedAnnotations); /* We add the list to the source object */
        /* We send the AJAX request to the server ! */
        IriSP.jQuery.ajax({
            url: _url,
            type: this.api_method,
            contentType: 'application/json',
            data: _export.serialize(), /* Source is serialized */
            success: function (_data) {
                _this.showScreen('Saved');
                if (_this.after_send_timeout) {
                    window.setTimeout(
                        function () {
                            _this.close_after_send
                                ? _this.player.trigger("CreateAnnotation.hide")
                                : _this.player.trigger("CreateAnnotation.show");
                        },
                        _this.after_send_timeout
                    );
                }
                _export.getAnnotations().removeElement(_annotation, true); /* We delete the sent annotation to avoid redundancy */
                _export.deSerialize(_data); /* Data deserialization */
                _this.source.merge(_export); /* We merge the deserialized data with the current source data */
                if (_this.pause_on_write && _this.media.getPaused()) {
                    _this.media.play();
                }
                _this.player.trigger("AnnotationsList.refresh");
            },
            error: function (_xhr, _error, _thrown) {
                IriSP.log("Error when sending annotation", _thrown);
                _export.getAnnotations().removeElement(_annotation, true);
                _this.showScreen('Error');
                window.setTimeout(function () {
                    _this.showScreen("Main");
                },
                                  (_this.after_send_timeout || 5000));
            }
        });
        this.showScreen('Wait');
    };
    return false;
};
