IriSP.Widgets.AnnotationsList = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.searchString = false;
    this.lastIds = [];
    var _this = this;
    this.throttledRefresh = IriSP._.throttle(function() {
        _this.refresh(false);
    }, 1500);
    this.mashupMode = (this.source.currentMedia.elementType === "mashup");
};

IriSP.Widgets.AnnotationsList.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.AnnotationsList.prototype.defaults = {
    /* URL when the annotations are to be reloaded from an LDT-like segment API
     * e.g. http://ldt.iri.centrepompidou.fr/ldtplatform/api/ldt/segments/{{media}}/{{begin}}/{{end}}?callback=?
     */
    ajax_url : false,
    /* number of milliseconds before/after the current timecode when calling the segment API
     */
    ajax_granularity : 300000, 
    default_thumbnail : "http://ldt.iri.centrepompidou.fr/static/site/ldt/css/imgs/video_sequence.png",
    /* URL when the annotation is not in the current project,
     * e.g. http://ldt.iri.centrepompidou.fr/ldtplatform/ldt/front/player/{{media}}/{{project}}/{{annotationType}}#id={{annotation}}
     */
    foreign_url : "",
    annotation_type : false,
    refresh_interval : 0,
    limit_count : 10,
    newest_first : false
};

IriSP.Widgets.AnnotationsList.prototype.template =
    '<div class="Ldt-AnnotationsListWidget">'
    + '<ul class="Ldt-AnnotationsList-ul">'
    + '{{#annotations}}'
    + '<li class="Ldt-AnnotationsList-li Ldt-TraceMe" trace-info="annotation-id:{{id}}">'
    + '<div class="Ldt-AnnotationsList-ThumbContainer">'
    + '<a href="{{url}}">'
    + '<img class="Ldt-AnnotationsList-Thumbnail" src="{{thumbnail}}" />'
    + '</a>'
    + '</div>'
    + '<div class="Ldt-AnnotationsList-Duration">{{begin}} - {{end}}</div>'
    + '<h3 class="Ldt-AnnotationsList-Title">'
    + '<a href="{{url}}">{{title}}</a>'
    + '</h3>'
    + '<p class="Ldt-AnnotationsList-Description">{{description}}</p>'
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
    + '</li>'
    + '{{/annotations}}'
    + '</ul>'
    + '</div>';

IriSP.Widgets.AnnotationsList.prototype.onSearch = function(searchString) {
    this.searchString = typeof searchString !== "undefined" ? searchString : '';
    var _n = this.refresh(true);
    if (this.searchString) {
        if (_n) {
            this.player.popcorn.trigger("IriSP.search.matchFound");
        } else {
            this.player.popcorn.trigger("IriSP.search.noMatchFound");
        }
    }
}

//obj.url = this.project_url + "/" + media + "/" + annotations[i].meta.project + "/" + annotations[i].meta["id-ref"] + '#id=' + annotations[i].id;

IriSP.Widgets.AnnotationsList.prototype.ajaxSource = function() {
    var _currentTime = this.player.popcorn.currentTime(),
        _duration = this.source.getDuration();
    if (typeof _currentTime == "undefined") {
        _currentTime = 0;
    }
    this.lastAjaxQuery = _currentTime;
    _currentTime = Math.floor(1000 * _currentTime);
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
    var _currentTime = this.player.popcorn.currentTime();
    if (typeof _currentTime == "undefined") {
        _currentTime = 0;
    }
    var _currentAnnotation = this.source.currentMedia.getAnnotationAtTime(_currentTime * 1000);
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
        _currentTime = this.player.popcorn.currentTime();
    if (typeof _currentTime == "undefined") {
        _currentTime = 0;
    }
    var _list = this.annotation_type ? this.currentSource.getAnnotationsByTypeTitle(this.annotation_type) : this.currentSource.getAnnotations();
    if (this.mashupMode) {
        var _currentAnnotation = this.source.currentMedia.getAnnotationAtTime(_currentTime * 1000);
        if (typeof _currentAnnotation !== "undefined") {
            _currentTime = _currentTime - _currentAnnotation.begin.getSeconds() + _currentAnnotation.annotation.begin.getSeconds();
            var _mediaId = _currentAnnotation.getMedia().id;
            _list = _list.filter(function(_annotation) {
                return _annotation.getMedia().id === _mediaId;
            });
        }
    }
    if (this.searchString) {
        _list = _list.searchByTextFields(this.searchString);
    }
    if (this.limit_count) {
        _list = _list.sortBy(function(_annotation) {
            return Math.abs(_annotation.begin.getSeconds() - _currentTime);
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
    
    if (_forceRedraw || !IriSP._.isEqual(_ids, this.lastIds)) {
        /* This part only gets executed if the list needs updating */
        this.lastIds = _ids;
        var _data = _list.map(function(_annotation) {
                    var _url = (
                        ( typeof _annotation.url !== "undefined" && _annotation.url)
                        ? _annotation.url
                        : (
                            ( typeof _this.source.projectId !== "undefined" && typeof _annotation.project !== "undefined" && _annotation.project && _this.source.projectId !== _annotation.project )
                            ? Mustache.to_html(
                                _this.foreign_url,
                                {
                                    project : _annotation.project,
                                    media : _annotation.media.id.replace(/^.*:/,''),
                                    annotation : _annotation.id,
                                    annotationType : _annotation.annotationType.id.replace(/^.*:/,'')
                                }
                            )
                            : '#id=' + _annotation.id
                            )
                    );
                    var _res = {
                        id : _annotation.id,
                        title : _annotation.title.replace(_annotation.description,''),
                        description : _annotation.description,
                        begin : _annotation.begin.toString(),
                        end : _annotation.end.toString(),
                        thumbnail : typeof _annotation.thumbnail !== "undefined" && _annotation.thumbnail ? _annotation.thumbnail : _this.default_thumbnail,
                        url : _url,
                        tags : _annotation.getTagTexts()
                    }
                    return _res;
            }),
            _html = Mustache.to_html(
                this.template,
                {
                    annotations : _data
                });
    
        this.$.html(_html);
        
        /* Correct the empty tag bug */
        this.$.find('.Ldt-AnnotationsList-Tag-Li').each(function() {
            var _el = IriSP.jQuery(this);
            if (!_el.text().replace(/(^\s+|\s+$)/g,'')) {
                _el.detach();
            }
        });
    
        this.$.find('.Ldt-AnnotationsList-Tag-Li').click(function() {
            _this.player.popcorn.trigger("IriSP.search.triggeredSearch", IriSP.jQuery(this).text().replace(/(^\s+|\s+$)/g,''));
        })
        
        if(this.searchString) {
            var _searchRe = new RegExp('(' + this.searchString.replace(/(\W)/gm,'\\$1') + ')','gim');
            this.$.find(".Ldt-AnnotationsList-Title a, .Ldt-AnnotationsList-Description").each(function() {
                var _$ = IriSP.jQuery(this);
                _$.html(_$.text().replace(/(^\s+|\s+$)/g,'').replace(_searchRe, '<span class="Ldt-AnnotationsList-highlight">$1</span>'))
            })
        }
    }
    
    if (this.ajax_url) {
        if (this.mashupMode) {
            this.ajaxMashup();
        } else {
            if (Math.abs(_currentTime - this.lastAjaxQuery) > (this.ajax_granularity / 2000)) {
                this.ajaxSource();
            }
        }
    }
    return _list.length;
}

IriSP.Widgets.AnnotationsList.prototype.draw = function() {
    
    this.bindPopcorn("IriSP.search", "onSearch");
    this.bindPopcorn("IriSP.search.closed", "onSearch");
    this.bindPopcorn("IriSP.search.cleared", "onSearch");
    this.bindPopcorn("IriSP.AnnotationsList.refresh","refresh");
    
    var _this = this;
    
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
    
    var _events = [
        "IriSP.createAnnotationWidget.addedAnnotation",
        "timeupdate",
        "seeked",
        "loadedmetadata"
    ];
    for (var _i = 0; _i < _events.length; _i++) {
        this.player.popcorn.listen(_events[_i], this.throttledRefresh);
    }
    
    this.throttledRefresh();

};
