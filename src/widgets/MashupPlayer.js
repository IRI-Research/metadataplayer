IriSP.Widgets.MashupPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.is_mashup = true;
};

IriSP.Widgets.MashupPlayer.prototype = new IriSP.Widgets.Widget();

/* A Popcorn-based player for HTML5 Video, Youtube and Vimeo */

IriSP.Widgets.MashupPlayer.prototype.defaults = {
    aspect_ratio: 14/9,
    player_type: "PopcornPlayer"
}

IriSP.Widgets.MashupPlayer.prototype.draw = function() {
    var _this = this,
        _mashup = this.media,
        _pauseState = true,
        _currentMedia = null,
        _currentAnnotation = null,
        _segmentBegin,
        _segmentEnd,
        _timecode = 0,
        _timedelta;
    
    function changeCurrentAnnotation() {
        var _annotation = _mashup.getAnnotationAtTime( _timecode );
        if (typeof _annotation === "undefined") {
            if (_currentMedia) {
                _currentMedia.pause();
                if (!_pauseState) {
                    _pauseState = true;
                    _mashup.trigger("pause");
                }
            }
            return;
        }
        if (_annotation !== _currentAnnotation) {
            _currentAnnotation = _annotation;
            _segmentBegin = _currentAnnotation.annotation.begin.milliseconds;
            _segmentEnd = _currentAnnotation.annotation.end.milliseconds;
            _timedelta = _segmentBegin - _currentAnnotation.begin.milliseconds;
            _currentMedia = _currentAnnotation.getMedia();
            
            for (var _i = 0; _i < _mashup.medias.length; _i++) {
                if (_mashup.medias[_i].id !== _currentMedia.id) {
                    _mashup.medias[_i].hide();
                    _mashup.medias[_i].pause();
                } else {
                    _mashup.medias[_i].show();
                }
            }
            
    /* PRELOADING */
            var _preloadedMedias = [],
                _toPreload = _mashup.getAnnotations().filter(function(_a) {
                return (_a.begin >= _currentAnnotation.end && _a.getMedia() !== _currentMedia);
            });
            IriSP._(_toPreload).each(function(_a) {
                var _media = _a.getMedia();
                if (IriSP._(_preloadedMedias).indexOf(_media.id) === -1) {
                    _preloadedMedias.push(_media.id);
                    _media.setCurrentTime(_a.annotation.begin.getSeconds());
                    //console.log("Preloading ", _media.id, " at t=", _a.annotation.begin.getSeconds());
                }
            });
            
    //        console.log("Changed segment: media="+ this.currentMedia.id + ", from=" + this.segmentBegin + " to=" + this.segmentEnd +", timedelta = ", this.timedelta)
    //    } else {
    //        console.log("changeCurrentAnnotation called, but segment hasn't changed");
        }

        _currentMedia.setCurrentTime( _timecode + _timedelta);
        _mashup.trigger("timeupdate", new IriSP.Model.Time(_timecode));

        if (!_pauseState) {
            _currentMedia.play();
        }
    }
    
    if (!this.height) {
        this.height = Math.floor(this.width/this.aspect_ratio);
        this.$.css({
            height: this.height
        });
    }

    IriSP._(_mashup.medias).each(function(_media) {
        var _el = IriSP.jQuery('<div>');
        _el.css({
            position: "absolute",
            top: 0,
            left: 0,
            height: _this.height,
            width: _this.width
        });
        _this.$.append(_el);
        
        _this.insertSubwidget(
            _el,
            {
                type: _this.player_type,
                media_id: _media.id,
                height: _this.height,
                width: _this.width,
                url_transform: _this.url_transform
            }
        );
        
        _media.loadedMetadata = false;
        _media.show = function() {
            _el.show();
        };
        _media.hide = function() {
            _el.hide();
        };
        _media.on("loadedmetadata", function() {
            _media.loadedMetadata = true;
            var _allLoaded = true;
            for (var _i = 0; _i < _mashup.medias.length; _i++) {
                _allLoaded = _allLoaded && _mashup.medias[_i].loadedMetadata;
            }
            if (_allLoaded) {
                changeCurrentAnnotation();
                _mashup.trigger("loadedmetadata");
            }
        });
        _media.on("timeupdate", function(_time) {
            if (!_pauseState && _media === _currentMedia) {
//                var _status = "Timeupdate from " + _media.id + " at time " + _time;
                if ( _time < _segmentEnd ) {
                    if ( _time >= _segmentBegin ) {
                        _timecode = _time - _timedelta;
//                        _status += " within segment";
                    } else {
                        _timecode = _segmentBegin - _timedelta;
                        _media.setCurrentTime(_segmentBegin);
//                        _status += " before segment";
                    }
                } else {
                    _timecode = _segmentEnd - _timedelta;
                    _media.pause();
                    changeCurrentAnnotation();
//                    _status += " after segment";
                }
//                _status += " (" + _this.segmentBegin + " to " + _this.segmentEnd + ")" + ", translated to " + _this.timecode;
//                console.log(_status);
                _mashup.trigger("timeupdate", new IriSP.Model.Time(_timecode));
            }
        });
        _media.on("play", function() {
            if (_media === _currentMedia) {
                _mashup.trigger("play");
            }
        });
        _media.on("pause", function() {
            if (_media === _currentMedia) {
                _mashup.trigger("pause");
            }
        });
    });
  
    _mashup.getCurrentTime = function() {
        return new IriSP.Model.Time(_timecode);
    }
    _mashup.getVolume = function() {
        return ( _currentMedia ? _currentMedia.getVolume() : .5 );
    }
    _mashup.getPaused = function() {
        return _pauseState;
    }
    _mashup.getMuted = function() {
        return ( _currentMedia ? _currentMedia.getMuted() : false );
    }
    _mashup.setCurrentTime = function(_milliseconds) {
        _timecode = _milliseconds;
        changeCurrentAnnotation();
    }
    _mashup.setVolume = function(_vol) {
        for (var _i = 0; _i < _mashup.medias.length; _i++) {
            _mashup.medias[_i].setVolume(_vol);
        }
    }
    _mashup.mute = function() {
        for (var _i = 0; _i < _mashup.medias.length; _i++) {
            _mashup.medias[_i].mute();
        }
    }
    _mashup.unmute = function() {
        for (var _i = 0; _i < _mashup.medias.length; _i++) {
            _mashup.medias[_i].unmute();
        }
    }
    _mashup.play = function() {
        _pauseState = false;
        changeCurrentAnnotation();
    }
    _mashup.pause = function() {
        _pauseState = true;
        if (_currentMedia) {
            _currentMedia.pause();
        }
    }
    
    changeCurrentAnnotation();
   
}