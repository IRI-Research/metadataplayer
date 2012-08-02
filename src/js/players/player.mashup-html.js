/* To wrap a player the develop should create a new class derived from 
   the IriSP.PopcornReplacement.player and defining the correct functions */

/** jwplayer player wrapper */
IriSP.PopcornReplacement.htmlMashup = function(container, options, metadata) {
    /* appel du parent pour initialiser les structures communes à tous les players */
    IriSP.PopcornReplacement.player.call(this, container, options);
    
    this.mashup = metadata.currentMedia;
    this.$ = IriSP.jQuery(container);
    
    var _w = this.$.width(),
        _h = this.$.height(),
        _this = this;
    
    IriSP._(metadata.currentMedia.medias).each(function(_media) {
        var _tmpId = Popcorn.guid("video"),
            _videoEl = IriSP.jQuery('<video>'),
            _videoUrl = _media.video;
        if (typeof options.url_transform === "function") {
            _videoUrl = options.url_transform(_videoUrl);
        }
		
        _videoEl
            .attr({
                //src : _videoUrl,
                id : _tmpId,
                width : _w,
                height : _h
            })
            .css({
                position: "absolute",
                top: 0,
                left: 0
            });
        
        if(typeof _videoUrl === "string"){
        	_videoEl.attr({src : _videoUrl});
	    }
        else{
        	// _videoUrl is an array of {src:"u",type:"m"}
        	l = _videoUrl.length;
        	for (var _i = 0; _i < l; _i++) {
        		srcNode = IriSP.jQuery('<source>');
        		srcNode.attr({src:_videoUrl[_i]["src"], type:_videoUrl[_i]["type"]});
        		_videoEl.append(srcNode);
            }
	    }
        _this.$.append(_videoEl);
        _media.videoEl = _videoEl;
        _media.popcorn = Popcorn("#" + _tmpId);
        _media.loadedMetadata = false;
        _media.popcorn.on("loadedmetadata", function() {
            _media.loadedMetadata = true;
            var _allLoaded = true;
            for (var _i = 0; _i < metadata.currentMedia.medias.length; _i++) {
                _allLoaded = _allLoaded && metadata.currentMedia.medias[_i].loadedMetadata;
            }
            if (_allLoaded) {
                _this.changeCurrentAnnotation();
                _this.trigger("loadedmetadata");
            }
        });
        _media.popcorn.on("timeupdate", function() {
            if (!_this.media.paused && _media === _this.currentMedia) {
                var _time = Math.round( 1000 * _media.popcorn.currentTime() );
//                var _status = "Timeupdate from " + _media.id + " at time " + _time;
                if ( _time < _this.segmentEnd ) {
                    if ( _time >= _this.segmentBegin ) {
                        _this.timecode = _time - _this.timedelta;
//                        _status += " within segment";
                    } else {
                        _this.timecode = _this.segmentBegin - _this.timedelta;
                        _media.popcorn.currentTime(_this.segmentBegin / 1000);
//                        _status += " before segment";
                    }
                } else {
                    _this.timecode = _this.segmentEnd - _this.timedelta;
                    _media.popcorn.pause();
                    _this.changeCurrentAnnotation();
//                    _status += " after segment";
                }
//                _status += " (" + _this.segmentBegin + " to " + _this.segmentEnd + ")" + ", translated to " + _this.timecode;
//                console.log(_status);
                _this.trigger("timeupdate");
            }
        });
    });
    
    this.timecode = 0;
  
  /* Définition des fonctions de l'API */
    this.playerFns = {
        play: function() {
            _this.changeCurrentAnnotation();
        },
        pause: function() {
            _this.currentMedia.popcorn.pause();
        },
        getPosition: function() {
            return _this.timecode / 1000;
        },
        seek: function(pos) {
            _this.timecode = Math.round(pos * 1000);
            _this.changeCurrentAnnotation();
        },
        getMute: function() {
            var _res = (
                typeof _this.currentMedia !== "undefined"
                ? _this.currentMedia.popcorn.muted()
                : false
            );
            return _res;
        },
        setMute: function(p) {
            var _mute = !!p;
            for (var _i = 0; _i < _this.mashup.medias.length; _i++) {
                _this.mashup.medias[_i].popcorn.muted(_mute);
            }
        },
        getVolume: function() {
            var _res = (
                typeof _this.currentMedia !== "undefined"
                ? _this.currentMedia.popcorn.volume()
                : .5
            );
            return _res;
        },
        setVolume: function(_vol) {
            for (var _i = 0; _i < _this.mashup.medias.length; _i++) {
                _this.mashup.medias[_i].popcorn.volume(_vol);
            }
        }
    }
    
};

IriSP.PopcornReplacement.htmlMashup.prototype = new IriSP.PopcornReplacement.player("", {});

IriSP.PopcornReplacement.htmlMashup.prototype.changeCurrentAnnotation = function() {
    var _annotation = this.mashup.getAnnotationAtTime( this.timecode );
    if (typeof _annotation == "undefined") {
        if (typeof this.currentMedia !== "undefined") {
            this.currentMedia.popcorn.pause();
            if (!this.media.paused) {
                this.media.paused = true;
                this.trigger("pause");
            }
        }
        return;
    }
    if (_annotation !== this.currentAnnotation) {
        this.currentAnnotation = _annotation;
        this.segmentBegin = this.currentAnnotation.annotation.begin.milliseconds;
        this.segmentEnd = this.currentAnnotation.annotation.end.milliseconds;
        this.timedelta = this.segmentBegin - this.currentAnnotation.begin.milliseconds;
        this.currentMedia = this.currentAnnotation.getMedia();
        
        for (var _i = 0; _i < this.mashup.medias.length; _i++) {
            if (this.mashup.medias[_i].id !== this.currentMedia.id) {
                this.mashup.medias[_i].videoEl.hide();
                this.mashup.medias[_i].popcorn.pause();
            } else {
                this.mashup.medias[_i].videoEl.show();
            }
        }
/* PRELOADING */
        var _this = this,
            _preloadedMedias = [],
            _toPreload = this.mashup.getAnnotations().filter(function(_a) {
            return (_a.begin >= _this.currentAnnotation.end && _a.getMedia().id !== _this.currentMedia.id);
        });
        IriSP._(_toPreload).each(function(_a) {
            var _media = _a.getMedia();
            if (IriSP._(_preloadedMedias).indexOf(_media.id) === -1) {
                _preloadedMedias.push(_media.id);
                _media.popcorn.currentTime(_a.annotation.begin.getSeconds());
                //console.log("Preloading ", _media.id, " at t=", _a.annotation.begin.getSeconds());
            }
        });
        
//        console.log("Changed segment: media="+ this.currentMedia.id + ", from=" + this.segmentBegin + " to=" + this.segmentEnd +", timedelta = ", this.timedelta)
//    } else {
//        console.log("changeCurrentAnnotation called, but segment hasn't changed");
    }
    if (this.currentMedia.popcorn.readyState()) {
        this.currentMedia.popcorn.currentTime( (this.timecode + this.timedelta) / 1000);
        this.trigger("timeupdate");
    }
    if (!this.media.paused) {
        this.currentMedia.popcorn.play();
    }
}
