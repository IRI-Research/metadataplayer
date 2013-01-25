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
}

IriSP.Widgets.AnnotationsList.prototype.template =
    '<div class="Ldt-AnnotationsListWidget">'
    + '{{#show_audio}}<div class="Ldt-AnnotationsList-Audio"></div>{{/show_audio}}'
    + '<ul class="Ldt-AnnotationsList-ul">'
    + '</ul>'
    + '</div>';

IriSP.Widgets.AnnotationsList.prototype.annotationTemplate = 
    '<li class="Ldt-AnnotationsList-li Ldt-TraceMe" trace-info="annotation-id:{{id}}, media-id:{{media_id}}" style="{{specific_style}}">'
    + '<div class="Ldt-AnnotationsList-ThumbContainer">'
    + '<a href="{{url}}">'
    + '<img class="Ldt-AnnotationsList-Thumbnail" src="{{thumbnail}}" />'
    + '</a>'
    + '</div>'
    + '<div class="Ldt-AnnotationsList-Duration">{{begin}} - {{end}}</div>'
    + '<h3 class="Ldt-AnnotationsList-Title">'
    + '<a href="{{url}}">{{{title}}}</a>'
    + '</h3>'
    + '<p class="Ldt-AnnotationsList-Description">{{{description}}}</p>'
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
    + '{{#audio}}<div class="Ldt-AnnotationsList-Play" data-audio={{audio}}>{{l10n.voice_annotation}}</div>{{/audio}}'
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
}

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
        }).slice(0, this.limit_count)
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
                    : '#id=' + _annotation.id
                    )
            );
            var _title = (_annotation.title || "").replace(_annotation.description,''),
                _description = _annotation.description;
            if (!_annotation.title) {
                _title = _annotation.creator;
            }
            if (!_annotation.description && _annotation.creator) {
                _description = _annotation.title;
                _title = _annotation.creator;
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
                title : IriSP.textFieldHtml(_title),
                description : IriSP.textFieldHtml(_description),
                begin : _annotation.begin.toString(),
                end : _annotation.end.toString(),
                thumbnail : typeof _annotation.thumbnail !== "undefined" && _annotation.thumbnail ? _annotation.thumbnail : _this.default_thumbnail,
                url : _url,
                tags : _annotation.getTagTexts(),
                specific_style : (typeof _bgcolor !== "undefined" ? "background-color: " + _bgcolor : ""),
                audio : (_this.show_audio && _annotation.audio && _annotation.audio.href && _annotation.audio.href != "null" ? _annotation.audio.href : undefined),
                l10n: _this.l10n
            };
            var _html = Mustache.to_html(_this.annotationTemplate, _data),
                _el = IriSP.jQuery(_html),
                _onselect = function() {
                    _this.annotations_$.removeClass("selected");
                    _el.addClass("selected");
                },
                _onunselect = function() {
                    _this.annotations_$.removeClass("selected");
                };
            _el.mouseover(function() {
                    _annotation.trigger("select");
                })
                .mouseout(function() {
                    _annotation.trigger("unselect");
                })
                .appendTo(_this.list_$);
            _el.on("remove", function() {
                _annotation.off("select", _onselect);
                _annotation.off("unselect", _onunselect);
            });
            _annotation.on("select", _onselect);
            _annotation.on("unselect", _onunselect);
        });
        
        this.annotations_$ = this.$.find('.Ldt-AnnotationsList-li');
        
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
                _audiofile = _el.attr("data-audio").replace(_this.rtmp_streamer,"");
            _el.text(_this.l10n.now_playing);
            _this.jwplayer.load({
                file: _audiofile,
                streamer: _this.rtmp_streamer
            });
            _this.jwplayer.play(true);
            _this.media.pause();
            _this.jw_paused_media = true;
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
}

IriSP.Widgets.AnnotationsList.prototype.draw = function() {
    
    this.mashupMode = (this.media.elementType === "mashup");
    
    this.renderTemplate();
    
    var _this = this;
    
    if (this.show_audio) {
        var _tmpId = "jwplayer-" + IriSP.Model.getUID();
        this.$.find(".Ldt-AnnotationsList-Audio").attr("id", _tmpId);
        this.jwplayer = jwplayer(_tmpId);
        this.jwplayer.setup({
            flashplayer: IriSP.getLib("jwPlayerSWF"),
            width: 1,
            height: 1,
            provider: "rtmp",
            events: {
                onIdle: function() {
                    if (_this.jw_paused_media) {
                        _this.jw_paused_media = false;
                        _this.media.play();
                    }
                    _this.$.find(".Ldt-AnnotationsList-Play").text(_this.l10n.voice_annotation)
                }
            }
        });
        this.jw_paused_media = false;
    }
    
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
            _this.currentSource.get()
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
