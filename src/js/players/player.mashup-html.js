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
            _videoEl = IriSP.jQuery('<video>');
            
        _videoEl
            .attr({
                src : _media.video,
                id : _tmpId,
                width : _w,
                height : _h
            })
            .css({
                position: "absolute",
                top: 0,
                left: 0
            });

        _this.$.append(_videoEl);
        _media.videoEl = _videoEl;
        _media.popcorn = Popcorn("#" + _tmpId);
        _media.popcorn.on("timeupdate", function() {
            if (!_this.media.paused && _media === _this.currentMedia) {
                var _time = _media.popcorn.currentTime();
             //   var _status = "Timeupdate from " + _media.id + " at time " + _time;
                if ( _time < _this.segmentEnd ) {
                    if ( _time >= _this.segmentBegin ) {
                        _this.timecode = _time - _this.timedelta;
                  //      _status += " within segment";
                    } else {
                        _this.timecode = _this.segmentBegin - _this.timedelta;
                        _media.popcorn.currentTime(_this.segmentBegin);
                   //     _status += " before segment begin";
                    }
                } else {
                    _this.timecode = _this.segmentEnd - _this.timedelta;
                    _media.popcorn.pause();
                    _this.changeCurrentAnnotation();
                 //   _status += " after segment end";
                }
            /*    _status += ", translated to " + _this.timecode;
                console.log(_status); */
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
            return _this.timecode;
        },
        seek: function(pos) {
            _this.timecode = pos;
            _this.changeCurrentAnnotation();
        },
        getMute: function() {
            return
                typeof _this.currentMedia !== "undefined"
                ? _this.currentMedia.popcorn.muted()
                : false;
        },
        setMute: function(p) {
            var _mute = !!p;
            for (var _i = 0; _i < _this.mashup.medias.length; _i++) {
                _this.mashup.medias[_i].popcorn.muted(_mute);
            }
        },
        getVolume: function() {
            return
                typeof _this.currentMedia !== "undefined"
                ? _this.currentMedia.popcorn.volume()
                : .5;
        },
        setVolume: function(_vol) {
            for (var _i = 0; _i < _this.mashup.medias.length; _i++) {
                _this.mashup.medias[_i].popcorn.volume(_vol);
            }
        }
    }
/*
    options.events = this.callbacks;

    _player.setup(options);
    */
};

IriSP.PopcornReplacement.htmlMashup.prototype = new IriSP.PopcornReplacement.player("", {});

IriSP.PopcornReplacement.htmlMashup.prototype.changeCurrentAnnotation = function() {
    var _annotation = this.mashup.getAnnotationAtTime( 1000 * this.timecode );
    if (typeof _annotation == "undefined") {
        if (typeof this.currentMedia !== "undefined") {
            this.currentMedia.popcorn.pause();
            this.media.paused = true;
        }
        return;
    }
    if (_annotation !== this.currentAnnotation) {
        this.currentAnnotation = _annotation;
        this.segmentBegin = this.currentAnnotation.annotation.begin.getSeconds();
        this.segmentEnd = this.currentAnnotation.annotation.end.getSeconds();
        this.timedelta = this.segmentBegin - this.currentAnnotation.begin.getSeconds();
        this.currentMedia = this.currentAnnotation.getMedia();
        
        for (var _i = 0; _i < this.mashup.medias.length; _i++) {
            if (this.mashup.medias[_i].id !== this.currentMedia.id) {
                this.mashup.medias[_i].videoEl.hide();
                this.mashup.medias[_i].popcorn.pause();
            } else {
                this.mashup.medias[_i].videoEl.show();
            }
        }
    }
    if (this.currentMedia.popcorn.readyState()) {
        this.currentMedia.popcorn.currentTime(this.timecode + this.timedelta);
    }
    if (!this.media.paused) {
        this.currentMedia.popcorn.play();
    }
}
