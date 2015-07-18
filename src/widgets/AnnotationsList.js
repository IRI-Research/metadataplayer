IriSP.Widgets.AnnotationsList = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastIds = [];
    var _this = this;
    this.throttledRefresh = IriSP._.throttle(function() {
        _this.refresh(false);
    }, 800);
    this.searchString = false;
    this.lastSearch = false;
};

IriSP.Widgets.AnnotationsList.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.AnnotationsList.prototype.defaults = {
    /*
     * URL when the annotations are to be reloaded from an LDT-like segment API
     * e.g.
     * http://ldt.iri.centrepompidou.fr/ldtplatform/api/ldt/segments/{{media}}/{{begin}}/{{end}}?callback=?
     */
    ajax_url : false,
    /*
     * number of milliseconds before/after the current timecode when calling the
     * segment API
     */
    ajax_granularity : 600000, 
    default_thumbnail : "",
    /*
     * URL when the annotation is not in the current project, e.g.
     * http://ldt.iri.centrepompidou.fr/ldtplatform/ldt/front/player/{{media}}/{{project}}/{{annotationType}}#id={{annotation}}
     */
    foreign_url : "",
    annotation_type : false,
    refresh_interval : 0,
    limit_count : 20,
    newest_first : false,
    always_visible : false,
    start_visible: true,
    show_audio : true,
    show_filters : false,
    show_creation_date : false,
    show_timecode : true, 
    /*
     * Only annotation in the current segment will be displayed. Designed to work with the Segments Widget.
     */
    filter_by_segments: false,
    segments_annotation_type: "chap",
    /*
     * Set to a username if you only want to display annotations from a given user
     */
    show_only_annotation_from_user: false,
    /*
     * Show a text field that filter annotations by username
     */
    filter_by_user: false,
    tags : true,
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
    + '{{#show_filters}}'
    + '<div class="Ldt-AnnotationsList-Filters">'
    +    '<input class="Ldt-AnnotationsList-filter-text" type="text" value="Mot-clés"></input>'
    +    '<select class="Ldt-AnnotationsList-filter-dropdown"></select>'
    +    '<label class="Ldt-AnnotationsList-filter-checkbox"><input type="checkbox">Toutes annotations</label>'
    + '</div>'
    + '{{/show_filters}}'
    + '{{#show_audio}}<div class="Ldt-AnnotationsList-Audio"></div>{{/show_audio}}'
    + '<ul class="Ldt-AnnotationsList-ul">'
    + '</ul>'
    + '</div>';

IriSP.Widgets.AnnotationsList.prototype.annotationTemplate = 
    '<li class="Ldt-AnnotationsList-li Ldt-TraceMe" trace-info="annotation-id:{{id}}, media-id:{{media_id}}" style="{{specific_style}}">'
    + '<div class="Ldt-AnnotationsList-ThumbContainer">'
    + '<a href="{{url}}" draggable="true">'
    + '<img class="Ldt-AnnotationsList-Thumbnail" src="{{thumbnail}}" />'
    + '</a>'
    + '</div>'
    + '{{#show_timecode}}<div class="Ldt-AnnotationsList-Duration">{{begin}} - {{end}}</div>{{/show_timecode}}'
    + '<h3 class="Ldt-AnnotationsList-Title" draggable="true">'
    + '<a href="{{url}}">{{{htitle}}}</a>'
    + '</h3>'
    + '<p class="Ldt-AnnotationsList-Description">{{{hdescription}}}</p>'
    + '{{#created}}'
    + '<div class="Ldt-AnnotationsList-CreationDate">{{{created}}}</div>'
    + '{{/created}}'
    + '{{#tags.length}}'
    + '<ul class="Ldt-AnnotationsList-Tags">'
    + '{{#tags}}'
    + '{{#.}}'
    + '<li class="Ldt-AnnotationsList-Tag-Li">'
    + '<span>{{.}}</span>'
    + '</li>'
    + '{{/.}}'
    + '{{/tags}}'
    + '</ul>'
    + '{{/tags.length}}'
    + '{{#audio}}<div class="Ldt-AnnotationsList-Play" data-annotation-id="{{id}}">{{l10n.voice_annotation}}</div>{{/audio}}'
    + '</li>';

// obj.url = this.project_url + "/" + media + "/" + annotations[i].meta.project
// + "/" + annotations[i].meta["id-ref"] + '#id=' + annotations[i].id;

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
    if (this.filter_by_segments) {
        /*
         *  A given annotation is considered "in" segment if the middle of it is between the segment beginning and the segment end. 
         *  Note this is meant to be used for "markings" annotations (not segments)
         */
        _segmentsAnnotation = this.currentSource.getAnnotationsByTypeTitle(this.segments_annotation_type)
        _currentSegments = _segmentsAnnotation.filter(function(_segment){
            return (_currentTime >= _segment.begin && _currentTime <= _segment.end)
        });
        if (_currentSegments.length == 0) {
            _list = _list.filter(function(_annotation){
                return false;
            });
        }
        else {
            _list = _list.filter(function(_annotation){
                _annotation_time = (_annotation.begin+_annotation.end)/2;
                return (_currentSegments[0].begin <= _annotation_time && _currentSegments[0].end >= _annotation_time)
            });
        }
    }
    if (this.show_only_annotation_from_user){
        _list = _list.filter(function(_annotation){
           return _annotation.creator == _this.show_only_annotation_from_user;
        });
    }
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
            if (_annotation.creator) {
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
            var _created = false;
            if (_this.show_creation_date) {
                _created = _annotation.created.toLocaleDateString()+", "+_annotation.created.toLocaleTimeString();
            }
            if(this.tags == true){
                var _tags = _annotation.getTagTexts();
            }
            else {
                var _tags = false;
            }
            var _data = {
                id : _annotation.id,
                media_id : _annotation.getMedia().id,
                htitle : IriSP.textFieldHtml(_title),
                hdescription : IriSP.textFieldHtml(_description),
                begin : _annotation.begin.toString(),
                end : _annotation.end.toString(),
                created : _created,
                show_timecode : _this.show_timecode,
                thumbnail : _thumbnail,
                url : _url,
                tags : _tags,
                specific_style : (typeof _bgcolor !== "undefined" ? "background-color: " + _bgcolor : ""),
                l10n: _this.l10n
            };
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
                image: _annotation.thumbnail
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

IriSP.Widgets.AnnotationsList.prototype.hide = function() {
    if (this.visible){
        this.visible = false;
        this.widget_$.slideUp()
    }
}

IriSP.Widgets.AnnotationsList.prototype.show = function() {
    if(!this.visible){
        this.visible = true;
        this.widget_$.slideDown()
    }
}


IriSP.Widgets.AnnotationsList.prototype.toggle = function() {
    if (!this.always_visible) {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
};

IriSP.Widgets.AnnotationsList.prototype.draw = function() {
    
    this.jwplayers = {};
    this.mashupMode = (this.media.elementType === "mashup");
    
    this.renderTemplate();
    
    var _this = this;
        
    this.list_$ = this.$.find(".Ldt-AnnotationsList-ul");
    this.widget_$ = this.$.find(".Ldt-AnnotationsListWidget");
    
    
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
    
    this.onMdpEvent("AnnotationsList.toggle","toggle");
    this.onMdpEvent("AnnotationsList.hide", "hide");
    this.onMdpEvent("AnnotationsList.show", "show");
    
    this.onMdpEvent("createAnnotationWidget.addedAnnotation", "refresh");
    var _events = [
        "timeupdate",
        "seeked",
        "loadedmetadata"
    ];
    for (var _i = 0; _i < _events.length; _i++) {
        this.onMediaEvent(_events[_i], this.throttledRefresh);
    }
    
    this.throttledRefresh();
    
    this.visible = true;
    if (!this.start_visible){
        this.hide();
    }
    
};
