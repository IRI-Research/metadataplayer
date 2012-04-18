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
/** effectively redraw the widget - called by drawList */
IriSP.AnnotationsListWidget.prototype.do_redraw = function(list) {
/*    var _html = IriSP.templToHTML(IriSP.annotationsListWidget_template, {
        annotations : list
    }), _this = this;

    this.selector.html(_html);

    this.selector.find('.Ldt-AnnotationsList-Tag-Li').click(function() {
        _this.player.popcorn.trigger("IriSP.search.triggeredSearch", IriSP.jQuery(this).text().trim());
    })
    if(this.searchRe !== null) {
        this.selector.find(".Ldt-AnnotationsList-Title a, .Ldt-AnnotationsList-Description").each(function() {
            var _$ = IriSP.jQuery(this);
            _$.html(_$.text().trim().replace(_this.searchRe, '<span class="Ldt-AnnotationsList-highlight">$1</span>'))
        })
    } */
};

IriSP.AnnotationsListWidget.prototype.transformAnnotation = function(a) {
/*    var _this = this;
    return {
        "id" : a.id,
        "title" : this.cinecast_version ? IriSP.get_aliased(a.meta, ['creator_name', 'creator']) : a.content.title,
        "desc" : this.cinecast_version ? a.content.data : a.content.description,
        "begin" : IriSP.msToTime(a.begin),
        "end" : IriSP.msToTime(a.end),
        "thumbnail" : ( typeof a.meta == "object" && typeof a.meta.thumbnail == "string") ? a.meta.thumbnail : this.default_thumbnail,
        "url" : ( typeof a.meta == "object" && typeof a.meta.url == "string") ? a.meta.url : null,
        "created_at" : ( typeof a.meta == "object" && typeof a.meta.created == "string") ? Date.parse(a.meta.created.replace(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}\:\d{2}\:\d{2}).*$/, "$2/$3/$1 $4 UTC+0000")) : null,
        "tags" : typeof a.tags == "object" ? IriSP.underscore(a.tags).chain().map(function(_t) {
            if( typeof _t == "string") {
                return _t.replace(/^.*:/, '#');
            } else {
                if( typeof _t['id-ref'] != "undefined") {
                    var _f = IriSP.underscore.find(_this._serializer._data.tags, function(_tag) {
                        return _tag.id == _t['id-ref'];
                    });
                    if( typeof _f != "undefined") {
                        return IriSP.get_aliased(_f.meta, ['dc:title', 'title']);
                    }
                }
            }
            return null;
        }).filter(function(_t) {
            return _t !== null && _t !== ""
        }).value() : []
    } */
}
/** draw the annotation list */
IriSP.AnnotationsListWidget.prototype.drawList = function(force_redraw) {
/*    var _this = this;

    //  var view_type = this._serializer.getContributions();
    var annotations = this._serializer._data.annotations;
    var currentTime = this.player.popcorn.currentTime();
    var list = [];

    for( i = 0; i < annotations.length; i++) {
        var obj = this.transformAnnotation(annotations[i]);
        obj.iterator = i;
        obj.distance = Math.abs((annotations[i].end + annotations[i].begin) / 2000 - currentTime);
        if(!this.cinecast_version || annotations[i].type == "cinecast:UserAnnotation") {
            list.push(obj);
        }

    }

    if(this.searchRe !== null) {
        list = list.filter(function(_a) {
            return (_this.searchRe.test(_a.desc) || _this.searchRe.test(_a.title));
        });
        if(list.length) {
            this.player.popcorn.trigger("IriSP.search.matchFound");
        } else {
            this.player.popcorn.trigger("IriSP.search.noMatchFound");
        }
    }
    list = IriSP.underscore(list).chain().sortBy(function(_o) {
        return _o.distance;
    }).first(10).sortBy(function(_o) {
        return (_this.cinecast_version ? -_o.created_at : _o.iterator);
    }).value();
    var idList = IriSP.underscore.pluck(list, "id").sort();

    if(!IriSP.underscore.isEqual(this.__oldList, idList) || this.lastSearch !== this.searchRe || typeof (force_redraw) !== "undefined") {
        this.do_redraw(list);
        this.__oldList = idList;
        this.lastSearch = this.searchRe;
    }
    /* save for next call */

};

IriSP.AnnotationsListWidget.prototype.ajaxRedraw = function(timecode) {

    /* the seeked signal sometimes passes an argument - depending on if we're using
     our popcorn lookalike or the real thing - if it's the case, use it as it's
     more precise than currentTime which sometimes contains the place we where at */
    if(IriSP.null_or_undefined(timecode) || typeof (timecode) != "number") {
        var tcode = this.player.popcorn.currentTime();
    } else {
        var tcode = timecode;
    }

    /* the platform gives us a special url - of the type : http://path/{{media}}/{{begin}}/{{end}}
     we double the braces using regexps and we feed it to mustache to build the correct url
     we have to do that because the platform only knows at run time what view it's displaying.
     */

    var media_id = this.currentMedia()["id"];
    var duration = this.getDuration();

    var begin_timecode = (Math.floor(tcode) - 300) * 1000;
    if(begin_timecode < 0)
        begin_timecode = 0;

    var end_timecode = (Math.floor(tcode) + 300) * 1000;
    if(end_timecode > duration)
        end_timecode = duration;

    var templ = Mustache.to_html(this.ajax_url, {
        media : media_id,
        begin : begin_timecode,
        end : end_timecode
    });

    /* we create on the fly a serializer to get the ajax */
    var serializer = new IriSP.JSONSerializer(IriSP.__dataloader, templ);
    serializer.sync(IriSP.wrap(this, function(json) {
        this.processJson(json, serializer)
    }));
};
/** process the received json - it's a bit hackish */
IriSP.AnnotationsListWidget.prototype.processJson = function(json, serializer) {
    /* FIXME: DRY the whole thing */
/*    var annotations = serializer._data.annotations;
    if(IriSP.null_or_undefined(annotations))
        return;

    /*
     commented in case we wanted to discriminate against some annotation types.
     var view_types = serializer.getIds("Contributions");
     */
    var l = [];

    var media = this.currentMedia()["id"];

    for( i = 0; i < annotations.length; i++) {
        var obj = this.transformAnnotation(annotations[i])
        if( typeof obj.url == "undefined" || !obj.url) {
            /* only if the annotation isn't present in the document create an
             external link */
            if(this.annotations_ids.indexOf(obj.id.toLowerCase()) == -1) {
                // braindead url; jacques didn't want to create a new one in the platform,
                // so we append the cutting id to the url.
                obj.url = this.project_url + "/" + media + "/" + annotations[i].meta.project + "/" + annotations[i].meta["id-ref"] + '#id=' + annotations[i].id;

                // obj.url = document.location.href.split("#")[0] + "/" + annotation.meta.project;
            }
        }
        l.push(obj);
    }
    this._ajax_cache = l;
    this.do_redraw(l);
};

IriSP.AnnotationsListWidget.prototype.ajaxSource = function() {
    var _url = Mustache.to_html(this.ajax_url, {
        media : this.source.currentMedia.namespacedId.name,
        begin : 0,
        end : 0
    });
    console.log(_url);
}

IriSP.AnnotationsListWidget.prototype.refresh = function(_forceRedraw) {
    if (this.currentSource.status !== IriSP.Model._SOURCE_STATUS_READY) {
        return 0;
    }
    var _this = this,
        _list = undefined,
        _currentTime = this.player.popcorn.currentTime();
    if (typeof _currentTime == "undefined") {
        _currentTime = 0;
    }
    if (this.annotation_type) {
        _list = this.currentSource.getAnnotationsByTypeTitle(this.annotation_type);
    }
    if (typeof _list === "undefined") {
        _list = this.currentSource.getAnnotations();
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
            return _annotation.begin.milliseconds;
        });
    }
    var _ids = _list.idIndex;
    if (!_forceRedraw && IriSP._.isEqual(_ids, this.lastIds)) {
        return _list.length;
    }
    
    /* This part only gets executed if the list needs updating */
    this.lastIds = _ids;
   
    var _html = IriSP.templToHTML(
        IriSP.annotationsListWidget_template,
        {
            annotations : _list.map(function(_annotation) {
                var _res = {
                    id : _annotation.id,
                    title : _annotation.title.replace(_annotation.description,''),
                    description : _annotation.description,
                    begin : _annotation.begin.toString(),
                    end : _annotation.end.toString(),
                    thumbnail : typeof _annotation.thumbnail !== "undefined" ? _annotation.thumbnail : _this.default_thumbnail,
                    url : typeof _annotation.url !== "undefined" ? _annotation.thumbnail : '#' + _annotation.namespacedId.name,
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
