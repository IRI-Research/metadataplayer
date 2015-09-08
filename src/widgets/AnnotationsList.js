IriSP.Widgets.AnnotationsList = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastIds = [];
    var _this = this;
    this.throttledRefresh = IriSP._.throttle(function(full) {
        _this.refresh(full);
    }, 800);
    this.searchString = false;
    this.lastSearch = false;
    this.localSource = undefined;
};

IriSP.Widgets.AnnotationsList.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.AnnotationsList.prototype.defaults = {
    /* URL when the annotations are to be reloaded from an LDT-like segment API
     * e.g. http://ldt.iri.centrepompidou.fr/ldtplatform/api/ldt/segments/{{media}}/{{begin}}/{{end}}?callback=?
     */
    ajax_url : false,
    /* number of milliseconds before/after the current timecode when calling the segment API
     */
    ajax_granularity : 600000,
    default_thumbnail : "",
    /* URL when the annotation is not in the current project,
     * e.g. http://ldt.iri.centrepompidou.fr/ldtplatform/ldt/front/player/{{media}}/{{project}}/{{annotationType}}#id={{annotation}}
     */
    foreign_url : "",
    annotation_type : false,
    refresh_interval : 0,
    limit_count : 20,
    newest_first : false,
    show_audio: true,
    show_creator: false,
    show_controls: false,
    show_end_time: true,
    show_publish: false,
    show_twitter: false,
    twitter_hashtag: '',
    publish_type: "PublicContribution",
    // Used to publish annotations
    api_endpoint_template: "",
    api_serializer: "ldt_annotate",
    api_method: "POST",
    editable: false,
    // Id that will be used as localStorage key
    editable_storage: "",
    polemics : [{
        keyword: "++",
        background_color: "#c9ecc6"
    },{
        keyword: "--",
        background_color: "#f9c5c6"
    },{
        keyword: "??",
        background_color: "#cec5f9"
    },{
        keyword: "==",
        background_color: "#f9f4c6"
    }]
};

IriSP.Widgets.AnnotationsList.prototype.messages = {
    en: {
        voice_annotation: "Voice Annotation",
        now_playing: "Now playing...",
        previous: "Previous",
        next: "Next",
        set_time: "Double-click to update to current player time",
        edit_annotation: "Edit note",
        delete_annotation: "Delete note",
        publish_annotation: "Make note public",
        import_annotations: "Paste or load notes in this field and press Import.",
        confirm_delete_message: "You are about to delete {{ annotation.title }}. Are you sure you want to delete it?",
        confirm_publish_message: "You are about to publish {{ annotation.title }}. Are you sure you want to make it public?",
        tweet_annotation: "Tweet annotation"
    },
    fr: {
        voice_annotation: "Annotation Vocale",
        now_playing: "Lecture en cours...",
        previous: "Précédent",
        next: "Suivant",
        set_time: "Double-cliquer pour fixer au temps du lecteur",
        edit_annotation: "Éditer la note",
        delete_annotation: "Supprimer la note",
        publish_annotation: "Rendre la note publique",
        import_annotations: "Copiez ou chargez des notes dans ce champ et appuyez sur Import",
        confirm_delete_message: "Vous allez supprimer {{ annotation.title }}. Êtes-vous certain(e) ?",
        confirm_publish_message: "Vous allez publier {{ annotation.title }}. Êtes-vous certain(e) ?",
        tweet_annotation: "Tweeter l'annotation"
    }
};

IriSP.Widgets.AnnotationsList.prototype.template =
    '<div class="Ldt-AnnotationsListWidget">'
    + '{{#show_audio}}<div class="Ldt-AnnotationsList-Audio"></div>{{/show_audio}}'
    + '{{#show_controls}}<div class="Ldt-AnnotationsList-Controls"><span class="Ldt-AnnotationsList-Control-Prev">{{ l10n.previous }}</span> | <span class="Ldt-AnnotationsList-Control-Next">{{ l10n.next }}</span></div>{{/show_controls}}'
    + '<ul class="Ldt-AnnotationsList-ul">'
    + '</ul>'
    + '</div>';

IriSP.Widgets.AnnotationsList.prototype.annotationTemplate =
    '<li class="Ldt-AnnotationsList-li Ldt-Highlighter-Annotation Ldt-TraceMe" data-annotation="{{ id }}" data-begin="{{ begin_ms }}" data-end="{{ end_ms }}" trace-info="annotation-id:{{id}}, media-id:{{media_id}}" style="{{specific_style}}">'
    + '<div class="Ldt-AnnotationsList-ThumbContainer">'
    +   '<a href="{{url}}" draggable="true">'
    +     '<img title="{{ begin }} - {{ atitle }}" class="Ldt-AnnotationsList-Thumbnail" src="{{thumbnail}}" />'
    +   '</a>'
    + '</div>'
    + '<div title="{{l10n.set_time}}" class="Ldt-AnnotationsList-Duration"><span class="Ldt-AnnotationsList-Begin Ldt-live-editable Ldt-AnnotationsList-TimeEdit" data-editable_value="{{begin}}" data-editable_id="{{id}}" data-editable_field="begin" data-editable_type="timestamp">{{begin}}</span>{{#show_end_time}} - <span class="Ldt-AnnotationsList-End Ldt-live-editable" data-editable_value="{{end}}" data-editable_id="{{id}}" data-editable_field="end" data-editable_type="timestamp">{{end}}</span>{{/show_end_time}}</div>'
    + '<h3 class="Ldt-AnnotationsList-Title Ldt-Annotation-Timecode" data-timecode="{{ begin_ms }}" draggable="true">'
    +   '<span class="Ldt-AnnotationsList-TitleContent Ldt-live-editable" data-editable_value="{{title}}" data-editable_type="multiline" data-editable_id="{{id}}" data-editable_field="title">{{{htitle}}}</span>'
    + '{{#show_creator}}<span class="Ldt-AnnotationsList-Creator">{{ creator }}</span>{{/show_creator}}'
    + '</h3>'
    + '<p class="Ldt-AnnotationsList-Description Ldt-live-editable" data-editable_type="multiline" data-editable_value="{{description}}" data-editable_id="{{id}}" data-editable_field="description">{{{hdescription}}}</p>'
    + '{{#tags.length}}'
    + '<ul class="Ldt-AnnotationsList-Tags">'
    +   '{{#tags}}'
    +   '{{#.}}'
    +   '<li class="Ldt-AnnotationsList-Tag-Li">'
    +     '<span>{{.}}</span>'
    +   '</li>'
    +   '{{/.}}'
    +   '{{/tags}}'
    + '</ul>'
    + '{{/tags.length}}'
    + '{{#audio}}<div class="Ldt-AnnotationsList-Play" data-annotation-id="{{id}}">{{l10n.voice_annotation}}</div>{{/audio}}'
    + '<div class="Ldt-AnnotationsList-EditControls">'
    +    '{{#show_twitter}}<a title="{{l10n.tweet_annotation}}" target="_blank" href="https://twitter.com/intent/tweet?{{twitter_param}}"><img width="16" height="16" src="metadataplayer/img/twitter.svg"></a>{{/show_twitter}}'
    +    '{{#show_publish}}<div title="{{l10n.publish_annotation}}" class="Ldt-AnnotationsList-PublishAnnotation" data-editable_id="{{id}}"></div>{{/show_publish}}'
    +    '{{#editable}}<div title="{{l10n.edit_annotation}}" class="Ldt-AnnotationsList-Edit" data-editable_id="{{id}}"></div>'
    +    '<div title="{{l10n.delete_annotation}}" class="Ldt-AnnotationsList-Delete" data-editable_id="{{id}}"></div>{{/editable}}'
    + '</div>'
    + '</li>';

//obj.url = this.project_url + "/" + media + "/" + annotations[i].meta.project + "/" + annotations[i].meta["id-ref"] + '#id=' + annotations[i].id;

IriSP.Widgets.AnnotationsList.prototype.ajaxSource = function() {
    var _currentTime = this.media.getCurrentTime(),
        _duration = this.media.duration;
    this.lastAjaxQuery = _currentTime;
    var _url = Mustache.to_html(this.ajax_url, {
        media : this.source.currentMedia.id,
        begin : Math.max(0, _currentTime - this.ajax_granularity),
        end : Math.min(_duration.milliseconds, _currentTime + this.ajax_granularity)
    });
    this.currentSource = this.player.loadMetadata(IriSP._.defaults({
        "url" : _url
    }, this.metadata));
};

IriSP.Widgets.AnnotationsList.prototype.ajaxMashup = function() {
    var _currentTime = this.media.getCurrentTime();
    var _currentAnnotation = this.source.currentMedia.getAnnotationAtTime(_currentTime);
    if (typeof _currentAnnotation !== "undefined" && _currentAnnotation.id !== this.lastMashupAnnotation) {
        this.lastMashupAnnotation = _currentAnnotation.id;
        var _currentMedia = _currentAnnotation.getMedia(),
            _url = Mustache.to_html(this.ajax_url, {
                media : _currentMedia.id,
                begin : Math.max(0, _currentAnnotation.annotation.begin.milliseconds - this.ajax_granularity),
                end : Math.min(_currentMedia.duration.milliseconds, _currentAnnotation.annotation.end.milliseconds + this.ajax_granularity)
            });
        this.currentSource = this.player.loadMetadata(IriSP._.defaults({
            "url" : _url
        }, this.metadata));
    }
};

/*
 * Import annotations
 */
IriSP.Widgets.AnnotationsList.prototype.importAnnotations = function () {
    var widget = this;
    var $ = IriSP.jQuery;
    var textarea = $("<textarea>");
    var el = $("<div>")
            .append($("<span>")
                    .addClass("importAnnotationsLabel")
                    .text(widget.messages.import_annotations))
            .addClass("importContainer")
            .dialog({
                title: "Annotation import",
                autoOpen: true,
                width: '80%',
                minHeight: '400',
                height: 400,
                buttons: [ { text: "Close", click: function() { $( this ).dialog( "close" ); } },
                           // { text: "Load", click: function () {
                           //     // TODO
                           //     // http://www.html5rocks.com/en/tutorials/file/dndfiles/?redirect_from_locale=fr
                           //     console.log("Load from a file");
                           // } },
                           { text: "Import", click: function () {
                               // FIXME: this should be a model.Source method
                               var time_regexp = /(\[[\d:]+\])/;
                               console.log("Import data");
                               // widget.localSource
                               // Dummy parsing for the moment
                               var data = textarea[0].value
                                       .split(time_regexp)
                                       .filter( function (s) { return ! s.match(/^\s*$/)});
                               var begin = null,
                                   end = null,
                                   content = null,
                                   // Previous is either null, timestamp or text
                                   previous = null;
                               for (var i = 0; i < data.length; i++) {
                                   var el = data[i];
                                   if (el.match(time_regexp)) {
                                       if (previous == 'text') {
                                           // Timestamp following text. Let's make it an annotation
                                           end = IriSP.timestamp2ms(el.slice(1, -1));
                                           TODO.createAnnotation(begin, end, content);
                                           // Preserve the end value, which may be the begin value of the next annotation.
                                           begin = end;
                                           end = null;
                                           content = null;
                                       } else {
                                           //  (previous == 'timestamp' || previous == null)
                                           // 2 consecutive timestamps. Let's start a new annotation
                                           content = null;
                                           begin = IriSP.timestamp2ms(el.slice(1, -1));
                                           end = null;
                                       };
                                       previous = 'timestamp';
                                   } else {
                                       // Text content
                                       content = el;
                                       previous = 'text';
                                   }
                                   // Last textual value
                                   if (previous == 'text' && begin !== null) {
                                       TODO.createAnnotation(begin, begin, content);
                                   }
                               }
                           } } ]
            });

}

IriSP.Widgets.AnnotationsList.prototype.refresh = function(_forceRedraw) {
    _forceRedraw = (typeof _forceRedraw !== "undefined" && _forceRedraw);
    if (this.currentSource.status !== IriSP.Model._SOURCE_STATUS_READY) {
        return 0;
    }
    var _this = this,
        _currentTime = this.media.getCurrentTime();
    var _list = this.annotation_type ? this.currentSource.getAnnotationsByTypeTitle(this.annotation_type) : this.currentSource.getAnnotations();
    if (this.mashupMode) {
        var _currentAnnotation = this.source.currentMedia.getAnnotationAtTime(_currentTime);
        if (typeof _currentAnnotation !== "undefined") {
            _currentTime = _currentTime - _currentAnnotation.begin + _currentAnnotation.annotation.begin;
            var _mediaId = _currentAnnotation.getMedia().id;
            _list = _list.filter(function(_annotation) {
                return _annotation.getMedia().id === _mediaId;
            });
        }
    }
    _list = _list.filter(function(_annotation) {
        return _annotation.found !== false;
    });
    if (this.limit_count) {
        /* Get the n annotations closest to current timecode */
        _list = _list.sortBy(function(_annotation) {
            return Math.abs((_annotation.begin + _annotation.end) / 2 - _currentTime);
        }).slice(0, this.limit_count);
    }
    if (this.newest_first) {
        _list = _list.sortBy(function(_annotation) {
            return -_annotation.created.valueOf();
        });
    } else {
        _list = _list.sortBy(function(_annotation) {
            return _annotation.begin;
        });
    }

    var _ids = _list.idIndex;

    if (_forceRedraw || !IriSP._.isEqual(_ids, this.lastIds) || this.searchString !== this.lastSearch) {
        /* This part only gets executed if the list needs updating */
        this.lastSearch = this.searchString;
        this.lastIds = _ids;
        this.list_$.html("");
        _list.forEach(function(_annotation) {
            var _url = (
                ( typeof _annotation.url !== "undefined" && _annotation.url)
                ? _annotation.url
                : (
                    ( typeof _this.source.projectId !== "undefined" && typeof _annotation.project !== "undefined" && _annotation.project && _this.source.projectId !== _annotation.project )
                    ? Mustache.to_html(
                        _this.foreign_url,
                        {
                            project : _annotation.project,
                            media : _annotation.media.id,
                            annotation : _annotation.id,
                            annotationType : _annotation.annotationType.id
                        }
                    )
                    : document.location.href.replace(/#.*$/,'') + '#id=' + _annotation.id + '&t=' + (_annotation.begin / 1000.0)
                    )
            );
            var _title = "",
                _description = _annotation.description,
                _thumbnail = (typeof _annotation.thumbnail !== "undefined" && _annotation.thumbnail ? _annotation.thumbnail : _this.default_thumbnail);
            if (_annotation.title) {
            	var tempTitle = _annotation.title;
            	if( tempTitle.substr(0, _title.length + 1) == (_title + ":") ){
            		_title = "";
            	}
                _title = _title + ( (_title=="") ? "" : ": ") + _annotation.title;
            }
            var _bgcolor;
            IriSP._(_this.polemics).each(function(_polemic) {
                var _rgxp = IriSP.Model.regexpFromTextOrArray(_polemic.keyword, true);
                if (_rgxp.test(_title + " " + _description)) {
                    _bgcolor = _polemic.background_color;
                }
            });
            var _data = {
                id : _annotation.id,
                media_id : _annotation.getMedia().id,
                atitle: IriSP.textFieldHtml(_annotation.title),
                htitle : IriSP.textFieldHtml(_title),
                title: _title,
                creator: _annotation.creator ? ' (' + _annotation.creator + ')' : "",
                hdescription : IriSP.textFieldHtml(_description),
                description: _description,
                begin : _annotation.begin.toString(),
                end : _annotation.end.toString(),
                begin_ms : _annotation.begin.milliseconds,
                end_ms : _annotation.end.milliseconds,
                thumbnail : _thumbnail,
                url : _url,
                tags : _annotation.getTagTexts(),
                specific_style : (typeof _bgcolor !== "undefined" ? "background-color: " + _bgcolor : ""),
                l10n: _this.l10n,
                editable: _this.editable,
                show_publish: _this.show_publish,
                show_creator: _this.show_creator,
                show_twitter: _this.show_twitter,
                twitter_param: IriSP.jQuery.param({ url: _url, text: IriSP.textFieldHtml(_title) + (_this.twitter_hashtag ? ' #' + _this.twitter_hashtag : "") })
            };
            if (_this.show_controls) {
                _this.$.find(".Ldt-AnnotationsList-Control-Prev").on("click", function (e) { e.preventDefault(); _this.navigate(-1); });
                _this.$.find(".Ldt-AnnotationsList-Control-Next").on("click", function (e) { e.preventDefault(); _this.navigate(+1); });
           }
            if (_this.show_audio && _annotation.audio && _annotation.audio.href && _annotation.audio.href != "null") {
                _data.audio = true;
                if (!_this.jwplayers[_annotation.id]) {
                    var _audiofile = _annotation.audio.href;
                    if (_this.audio_url_transform) {
                        _audiofile = _this.audio_url_transform(_annotation.audio.href);
                    }
                    var _tmpId = "jwplayer-" + IriSP.Model.getUID();
                    _this.jwplayers[_annotation.id] = _tmpId;
                    _this.$.find(".Ldt-AnnotationsList-Audio").append(IriSP.jQuery("<div>").attr("id", _tmpId));
                    jwplayer(_tmpId).setup({
                        flashplayer: IriSP.getLib("jwPlayerSWF"),
                        file: _audiofile,
                        fallback: false,
                        primary: "flash",
                        controls: false,
                        width: 1,
                        height: 1,
                        events: {
                            onPause: function() {
                                _this.$.find(".Ldt-AnnotationsList-Play[data-annotation-id=" + _annotation.id + "]").text(_this.l10n.voice_annotation);
                            },
                            onPlay: function() {
                                _this.$.find(".Ldt-AnnotationsList-Play[data-annotation-id=" + _annotation.id + "]").text(_this.l10n.now_playing);
                            }
                        }
                    });
                }
            }
            var _html = Mustache.to_html(_this.annotationTemplate, _data),
                _el = IriSP.jQuery(_html),
                _onselect = function() {
                    _this.$.find('.Ldt-AnnotationsList-li').removeClass("selected");
                    _el.addClass("selected");
                },
                _onunselect = function() {
                    _this.$.find('.Ldt-AnnotationsList-li').removeClass("selected");
                };
            _el.mouseover(function() {
                    _annotation.trigger("select");
                })
                .mouseout(function() {
                    _annotation.trigger("unselect");
                })
                .appendTo(_this.list_$);
            IriSP.attachDndData(_el.find("[draggable]"), {
            	title: _title,
            	description: _description,
            	uri: _url,
                image: _annotation.thumbnail,
                text: '[' + _annotation.begin.toString() + '] ' + _title
            });
            _el.on("remove", function() {
                _annotation.off("select", _onselect);
                _annotation.off("unselect", _onunselect);
            });
            _annotation.on("select", _onselect);
            _annotation.on("unselect", _onunselect);
        });

        /* Correct the empty tag bug */
        this.$.find('.Ldt-AnnotationsList-Tag-Li').each(function() {
            var _el = IriSP.jQuery(this);
            if (!_el.text().replace(/(^\s+|\s+$)/g,'')) {
                _el.remove();
            }
        });

        if (this.editable) {
            var widget = _this;
            var $ = IriSP.jQuery;

            var edit_element = function (_this, insertion_point) {
                var feedback_wrong = "#FF9999";
                var feedback_ok = "#99FF99";

                // insertion_point can be used to specify where to
                // insert the input field.  Firefox is buggy wrt input
                // fields inside <a> or <h?> tags, it does not
                // propagate mouse clicks. If _this is a <a> then we
                // have to specify the ancestor before which we can
                // insert the input widget.
                if (insertion_point === undefined)
                    insertion_point = _this;

                // Insert input element
                var input_element = $(_this.dataset.editable_type === 'multiline' ? "<textarea>" : "<input>")
                        .addClass("editableInput")
                        .insertBefore($(insertion_point));
                input_element[0].value = _this.dataset.editable_value;
                $(input_element).show().focus();
                $(_this).addClass("editing");

                function feedback(color) {
                    // Give some feedback
                    $(_this).removeClass("editing");
                    input_element.remove();
                    var previous_color = $(_this).css("background-color");
                    $(_this).stop().css("background-color", color)
                        .animate({ backgroundColor: previous_color}, 1000);
                }

                function cancelChanges(s) {
                    feedback(feedback_wrong);
                }
                function validateChanges() {
                    var n = input_element[0].value;
                    if (n == _this.dataset.editable_value) {
                        // No change
                        feedback(feedback_ok);
                        return;
                    }
                    if (n == '') {
                        // Delete annotation
                        delete_local_annotation(_this.dataset.editable_id);
                        widget.player.trigger("Annotation.delete", _this.dataset.editable_id);
                        return;
                    } else {
                        // Convert value if necessary.
                        var val = n;
                        if (_this.dataset.editable_type == 'timestamp') {
                            val = IriSP.timestamp2ms(n);
                            if (Number.isNaN(val)) {
                                // Invalid value. Cancel changes
                                cancelChanges();
                                return;
                            }
                        }
                        _this.dataset.editable_value = n;
                        n = val;
                        $(_this).text(val);
                    }

                    // We cannot use .getElement since it fetches
                    // elements from the global Directory
                    var an = get_local_annotation(_this.dataset.editable_id);
                    if (an === undefined) {
                        console.log("Strange error: cannot find edited annotation");
                        feedback(feedback_wrong);
                    } else {
                        _this.dataset.editable_value = n;
                        // Update annotation for storage
                        if (_this.dataset.editable_field == 'begin')
                            an.setBegin(n);
                        else if (_this.dataset.editable_field == 'end')
                            an.setEnd(n);
                        else
                            an[_this.dataset.editable_field] = n;
                        an.modified = new Date();
                        // FIXME: use user name, when available
                        an.contributor = widget.player.config.username || "COCo User";
                        widget.player.addLocalAnnotation(an);
                        widget.player.trigger("Annotation.update", an);
                        feedback(feedback_ok);
                    }
                }
                $(input_element).bind('keydown', function(e) {
                    if (e.which == 13) {
                        e.preventDefault();
                        validateChanges();
                    } else if (e.which == 27) {
                        e.preventDefault();
                        cancelChanges();
                    }
                }).bind("blur", function (e) {
                    validateChanges();
                });
            };

            var get_local_annotation = function (ident) {
                return widget.player.getLocalAnnotation(ident);
            };

            var save_local_annotations = function() {
                widget.player.saveLocalAnnotations();
                // Merge modifications into widget source
                widget.source.merge(widget.player.localSource);
            };

            var delete_local_annotation = function(ident) {
                widget.source.getAnnotations().removeId(ident, true);
                widget.player.deleteLocalAnnotation(ident);
                widget.refresh(true);
            };

            this.$.find('.Ldt-AnnotationsList-Delete').click(function(e) {
                // Delete annotation
                var _annotation = get_local_annotation(this.dataset.editable_id);
                if (confirm(Mustache.to_html(widget.l10n.confirm_delete_message, { annotation: _annotation })))
                    delete_local_annotation(this.dataset.editable_id);
                widget.refresh(true);
            });
            this.$.find('.Ldt-AnnotationsList-Edit').click(function(e) {
                // Edit annotation title. We have to specify the insertion point.
                var element = $(this).parents(".Ldt-AnnotationsList-li").find(".Ldt-AnnotationsList-TitleContent.Ldt-live-editable");
                edit_element(element[0]);
            });
            this.$.find('.Ldt-AnnotationsList-PublishAnnotation').click(function(e) {
                var _annotation = get_local_annotation(this.dataset.editable_id);
                // Publish annotation to the server
                if (!confirm(Mustache.to_html(widget.l10n.confirm_publish_message, { annotation: _annotation })))
                    return;
                var _url = Mustache.to_html(widget.api_endpoint_template, {id: widget.source.projectId});
                if (_url !== "") {
                    var _export = widget.player.sourceManager.newLocalSource({serializer: IriSP.serializers[widget.api_serializer]});

                    if (widget.publish_type) {
                        // If publish_type is specified, try to set the annotation type of the exported annotation
                        var at = widget.source.getAnnotationTypes().filter(function(at) { return at.title == widget.publish_type; });
                        if (at.length == 1) {
                            _annotation.setAnnotationType(at[0].id);
                        }
                    }
                    var _exportedAnnotations = new IriSP.Model.List(widget.player.sourceManager);
                    _exportedAnnotations.push(_annotation);
                    _export.addList("annotation", _exportedAnnotations);
                    IriSP.jQuery.ajax({
                        url: _url,
                        type: widget.api_method,
                        contentType: 'application/json',
                        data: _export.serialize(),
                        success: function(_data) {
                            $(this).addClass("published");
                            // Save the published information
                            var an = get_local_annotation(_annotation.id);
                            // FIXME: handle "published" tag
                            an.setTags( [ "published" ]);
                            save_local_annotations();
                            widget.player.trigger("Annotation.publish", _annotation);
                        },
                        error: function(_xhr, _error, _thrown) {
                            IriSP.log("Error when sending annotation", _thrown);
                        }
                    });
                }
            });
            this.$.find('.Ldt-AnnotationsList-TimeEdit').dblclick(function(e) {
                var _this = this;
                // Use current player time
                var an = get_local_annotation(_this.dataset.editable_id);
                if (an !== undefined) {
                    // FIXME: implement Undo feature
                    an.setBegin(widget.media.getCurrentTime().milliseconds);
                    save_local_annotations();
                    widget.player.trigger("Annotation.update", an);
                    widget.refresh(true);
                }
            });
        };

        this.$.find('.Ldt-AnnotationsList-Tag-Li').click(function() {
            _this.source.getAnnotations().search(IriSP.jQuery(this).text().replace(/(^\s+|\s+$)/g,''));
        });
        this.$.find('.Ldt-Annotation-Timecode').click(function () {
            _this.media.setCurrentTime(Number(this.dataset.timecode));
        });

        this.$.find(".Ldt-AnnotationsList-Play").click(function() {
            var _el = IriSP.jQuery(this),
                _annid = _el.attr("data-annotation-id");
            if (_this.jwplayers[_annid]) {
                jwplayer(_this.jwplayers[_annid]).play();
            }
            _this.media.pause();
        });

        if (this.source.getAnnotations().searching) {
            var rx = _this.source.getAnnotations().regexp || false;
            this.$.find(".Ldt-AnnotationsList-Title a, .Ldt-AnnotationsList-Description").each(function() {
                var _$ = IriSP.jQuery(this);
                _$.html(IriSP.textFieldHtml(_$.text(), rx));
            });
        }
    }

    if (this.ajax_url) {
        if (this.mashupMode) {
            this.ajaxMashup();
        } else {
            if (Math.abs(_currentTime - this.lastAjaxQuery) > (this.ajax_granularity)) {
                this.ajaxSource();
            }
        }
    }
    return _list.length;
};

IriSP.Widgets.AnnotationsList.prototype.draw = function() {

    this.jwplayers = {};
    this.mashupMode = (this.media.elementType === "mashup");

    this.renderTemplate();

    var _this = this;

    this.list_$ = this.$.find(".Ldt-AnnotationsList-ul");


    this.source.getAnnotations().on("search", function(_text) {
        _this.searchString = _text;
        if (_this.source !== _this.currentSource) {
            _this.currentSource.getAnnotations().search(_text);
            _this.throttledRefresh();
        }
    });
    this.source.getAnnotations().on("found", function() {
        _this.throttledRefresh();
    });
    this.source.getAnnotations().on("not-found", function() {
        _this.throttledRefresh();
    });
    this.source.getAnnotations().on("clear-search", function() {
        _this.searchString = false;
        if (_this.source !== _this.currentSource) {
            _this.currentSource.getAnnotations().trigger("clear-search");
        }
    });
    this.source.getAnnotations().on("search-cleared", function() {
        _this.throttledRefresh();
    });

    this.onMdpEvent("AnnotationsList.refresh", function() {
        if (_this.ajax_url) {
            if (_this.mashupMode) {
                _this.ajaxMashup();
            } else {
                _this.ajaxSource();
            }
        }
        _this.throttledRefresh(false);
    });

    this.onMdpEvent("AnnotationsList.update", function() {
        if (_this.ajax_url) {
            if (_this.mashupMode) {
                _this.ajaxMashup();
            } else {
                _this.ajaxSource();
            }
        }
        _this.throttledRefresh(true);
    });

    if (this.ajax_url) {
        if (this.mashupMode) {
            this.ajaxMashup();
        } else {
            this.ajaxSource();
        }
    } else {
        this.currentSource = this.source;
    }

    if (this.refresh_interval) {
        window.setInterval(function() {
            _this.currentSource.get();
        }, this.refresh_interval);
    }

    this.onMdpEvent("createAnnotationWidget.addedAnnotation");
    var _events = [
        "timeupdate",
        "seeked",
        "loadedmetadata"
    ];
    for (var _i = 0; _i < _events.length; _i++) {
        this.onMediaEvent(_events[_i], this.throttledRefresh);
    }

    this.throttledRefresh();

};
