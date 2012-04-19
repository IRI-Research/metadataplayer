IriSP.AnnotationsListWidget = function(player, config) {
    IriSP.Widget.call(this, player, config);
    this.bindPopcorn("IriSP.search", "searchHandler");
    this.bindPopcorn("IriSP.search.closed", "searchHandler");
    this.bindPopcorn("IriSP.search.cleared", "searchHandler");
    this.searchString = false;
    this.lastIds = [];
    var _this = this;
    this.throttledRefresh = IriSP._.throttle(function() {
        _this.refresh(false);
    }, 1500);
};

IriSP.AnnotationsListWidget.prototype = new IriSP.Widget();

IriSP.AnnotationsListWidget.prototype.clear = function() {
};

IriSP.AnnotationsListWidget.prototype.clearWidget = function() {
};

IriSP.AnnotationsListWidget.prototype.searchHandler = function(searchString) {
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

IriSP.AnnotationsListWidget.prototype.ajaxSource = function() {
    var _currentTime = this.player.popcorn.currentTime(),
        _duration = this.source.getDuration();
    if (typeof _currentTime == "undefined") {
        _currentTime = 0;
    }
    this.lastAjaxQuery = _currentTime;
    _currentTime = Math.floor(1000 * _currentTime);
    var _url = Mustache.to_html(this.ajax_url, {
        media : this.source.currentMedia.namespacedId.name,
        begin : Math.max(0, _currentTime - this.ajax_granularity),
        end : Math.min(_duration.milliseconds, _currentTime + this.ajax_granularity)
    });
    this.currentSource = this.player.loadMetadata(IriSP._.defaults({
        "url" : _url
    }, this.metadata));
}

IriSP.AnnotationsListWidget.prototype.refresh = function(_forceRedraw) {
    _forceRedraw = (typeof _forceRedraw !== "undefined" && _forceRedraw);
    if (this.currentSource.status !== IriSP.Model._SOURCE_STATUS_READY) {
        return 0;
    }
    var _this = this,
        _currentTime = this.player.popcorn.currentTime();
    if (typeof _currentTime == "undefined") {
        _currentTime = 0;
    }
    var _list = this.annotation_type ? this.currentSource.getAnnotationsByTypeTitle(this.annotation_type, true) : this.currentSource.getAnnotations();
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
       
        var _html = IriSP.templToHTML(
            IriSP.annotationsListWidget_template,
            {
                annotations : _list.map(function(_annotation) {
                    var _url = (
                        ( typeof _annotation.url !== "undefined" )
                        ? _annotation.url
                        : (
                            ( typeof _this.source.projectId !== "undefined" && typeof _annotation.project !== "undefined" && _this.source.projectId !== _annotation.project )
                            ? Mustache.to_html(
                                this.foreign_url,
                                {
                                    project : _annotation.project,
                                    media : _annotation.media.id.replace(/^.*:/,''),
                                    annotation : _annotation.namespacedId.name,
                                    annotationType : _annotation.annotationType.id.replace(/^.*:/,'')
                                }
                            )
                            : '#id=' + _annotation.namespacedId.name
                            )
                    );
                    var _res = {
                        id : _annotation.id,
                        title : _annotation.title.replace(_annotation.description,''),
                        description : _annotation.description,
                        begin : _annotation.begin.toString(),
                        end : _annotation.end.toString(),
                        thumbnail : typeof _annotation.thumbnail !== "undefined" ? _annotation.thumbnail : _this.default_thumbnail,
                        url : _url,
                        tags : _annotation.getTagTexts()
                    }
                    return _res;
                })
            });
    
        this.$.html(_html);
    
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
    
    if (this.ajax_url && this.ajax_granularity) {
        if (Math.abs(_currentTime - this.lastAjaxQuery) > this.ajax_granularity / 2) {
            this.ajaxSource();
        }
    }
    return _list.length;
}

IriSP.AnnotationsListWidget.prototype.draw = function() {
    var _this = this;
    
    if (this.ajax_url && this.ajax_granularity) {
        this.ajaxSource();
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
