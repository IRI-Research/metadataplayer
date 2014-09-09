IriSP.Widgets.AnnotationsList = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastIds = [];
    var _this = this;
    this.throttledRefresh = IriSP._.throttle(function() {
        _this.refresh(false);
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
        now_playing: "Now playing..."
    },
    fr: {
        voice_annotation: "Annotation Vocale",
        now_playing: "Lecture en cours..."
    }
};

IriSP.Widgets.AnnotationsList.prototype.template =
    '<div class="Ldt-AnnotationsListWidget">'
    + '{{#show_audio}}<div class="Ldt-AnnotationsList-Audio"></div>{{/show_audio}}'
    + '{{#show_controls}}<div class="Ldt-AnnotationsList-Controls"><span class="Ldt-AnnotationsList-Control-Prev">Previous</span> | <span class="Ldt-AnnotationsList-Control-Next">Next</span></div>{{/show_controls}}'
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
    + '<div class="Ldt-AnnotationsList-Duration"><span class="Ldt-AnnotationsList-Begin Ldt-live-editable" data-editable_value="{{begin}}" data-editable_id="{{id}}" data-editable_field="begin" data-editable_type="timestamp">{{begin}}</span>{{#show_end_time}} - <span class="Ldt-AnnotationsList-End Ldt-live-editable" data-editable_value="{{end}}" data-editable_id="{{id}}" data-editable_field="end" data-editable_type="timestamp">{{end}}</span>{{/show_end_time}}</div>'
    + '<h3 class="Ldt-AnnotationsList-Title" draggable="true">'
    +   '<a href="{{url}}" class="Ldt-live-editable" data-editable_value="{{htitle}}" data-editable_id="{{id}}" data-editable_field="title">{{{htitle}}}</a>'
    + '</h3>'
    + '<p class="Ldt-AnnotationsList-Description Ldt-live-editable" data-editable_value="{{hdescription}}" data-editable_id="{{id}}" data-editable_field="description">{{{hdescription}}}</p>'
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
    + '{{#editable}}<div class="Ldt-AnnotationsList-Delete" data-editable_id="{{id}}">Delete</div>{{/editable}}'
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
                    : document.location.href.replace(/#.*$/,'') + '#id=' + _annotation.id
                    )
            );
            var _title = "",
                _description = _annotation.description,
                _thumbnail = (typeof _annotation.thumbnail !== "undefined" && _annotation.thumbnail ? _annotation.thumbnail : _this.default_thumbnail);
            // Update : display creator
            if (_annotation.creator && _this.show_creator) {
            	_title = _annotation.creator;
            }
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
                hdescription : IriSP.textFieldHtml(_description),
                begin : _annotation.begin.toString(),
                end : _annotation.end.toString(),
                begin_ms : _annotation.begin.milliseconds,
                end_ms : _annotation.end.milliseconds,
                thumbnail : _thumbnail,
                url : _url,
                tags : _annotation.getTagTexts(),
                specific_style : (typeof _bgcolor !== "undefined" ? "background-color: " + _bgcolor : ""),
                l10n: _this.l10n,
                editable: _this.editable
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

            var load_local_annotations = function() {
                // Update local storage
                if (widget.localSource === undefined) {
                    // Initialize local source
                    widget.localSource = widget.player.sourceManager.newLocalSource({serializer: IriSP.serializers['ldt_localstorage']});
                }
                // Load current local annotations
                widget.localSource.deSerialize(window.localStorage[widget.editable_storage]);
            };

            var save_local_annotations = function() {
                // Save annotations back
                window.localStorage[widget.editable_storage] = widget.localSource.serialize();
                // Merge modifications into widget source
                widget.source.merge(widget.localSource);
            };

            var delete_local_annotation = function(i) {
                load_local_annotations();
                widget.localSource.getAnnotations().removeId(i);
                widget.source.getAnnotations().removeId(i);
                save_local_annotations();
                widget.refresh(true);
            };

            this.$.find('.Ldt-AnnotationsList-Delete').click(function(e) {
                // Delete annotation
                delete_local_annotation(this.dataset.editable_id);
            });

            this.$.find('.Ldt-live-editable').dblclick(function(e) {
                var _this = this;
                var $ = IriSP.jQuery;
                var feedback_wrong = "#FF9999";
                var feedback_ok = "#99FF99";

                e.preventDefault();
                this.contentEditable = true;
            
                function feedback(color) {
                    // Give some feedback
                    var previous_color = $(_this).css("background-color");
                    $(_this).stop().css("background-color", color)
                        .animate({ backgroundColor: previous_color}, 1000);
                }

                function clearSelection() {
                    if (document.selection && document.selection.empty) {
                        document.selection.empty();
                    } else if (window.getSelection) {
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                    }
                }
                clearSelection();
                
                function cancelChanges(s) {
                    _this.contentEditable = false;
                    if ($(_this).text() == _this.dataset.editable_value) {
                        return;
                    }
                    // Restore previous value
                    $(_this).text(_this.dataset.editable_value);
                    feedback(feedback_wrong);
                }
                function validateChanges() {
                    _this.contentEditable = false;
                    var n = $(_this).text();
                    if (n == _this.dataset.editable_value) {
                        return;
                    }
                    if (n == '') {
                        // Delete annotation
                        delete_local_annotation(_this.dataset.editable_id);
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
                    }

                    load_local_annotations();

                    // We cannot use .getElement since it fetches
                    // elements from the global Directory
                    var an = IriSP._.first(IriSP._.filter(widget.localSource.getAnnotations(), function (a) { return a.id ==_this.dataset.editable_id; }));
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
                        an.contributor = "COCo User";
                        widget.localSource.merge( [ an ] );

                        save_local_annotations();

                        feedback(feedback_ok);
                    }
                                      
                }
                $(this).bind('keydown', function(e) {
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
            });
        }

        this.$.find('.Ldt-AnnotationsList-Tag-Li').click(function() {
            _this.source.getAnnotations().search(IriSP.jQuery(this).text().replace(/(^\s+|\s+$)/g,''));
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
        _this.throttledRefresh();
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
