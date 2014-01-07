IriSP.Widgets.MashupPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.is_mashup = true;
};

IriSP.Widgets.MashupPlayer.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.MashupPlayer.prototype.defaults = {
    aspect_ratio: 14/9,
    split_screen: false,
    player_type: "PopcornPlayer",
    background: "#000000"
};

IriSP.Widgets.MashupPlayer.prototype.draw = function() {
    var _this = this,
        _mashup = this.media,
        _currentMedia = null,
        _currentAnnotation = null,
        _segmentBegin,
        _segmentEnd,
        _timecode = 0,
        _seeking = false,
        _seekdiv,
        _timedelta,
        medialist = _mashup.getMedias();
    
    _mashup.paused = (!this.autostart && !this.autoplay);
    
    function changeCurrentAnnotation() {
        if (_timecode >= _mashup.duration) {
            if (!_mashup.paused) {
                _mashup.paused = true;
                _mashup.trigger("pause");
            }
            _timecode = 0;
        }
        var _annotation = _mashup.getAnnotationAtTime( _timecode );
        if (typeof _annotation === "undefined") {
            if (_currentMedia) {
                _currentMedia.pause();
                if (!_mashup.paused) {
                    _mashup.paused = true;
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
            
            for (var _i = 0; _i < medialist.length; _i++) {
                if (medialist[_i].id !== _currentMedia.id) {
                    if (!_this.split_screen) {
                        medialist[_i].hide();
                    }
                    medialist[_i].pause();
                } else {
                    medialist[_i].show();
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
                    _media.seeking = true;
/*
                    console.log("Preloading ", _media.id, " at t=", _a.annotation.begin.getSeconds());
*/
                }
            });
            
    //        console.log("Changed segment: media="+ this.currentMedia.id + ", from=" + this.segmentBegin + " to=" + this.segmentEnd +", timedelta = ", this.timedelta)
    //    } else {
    //        console.log("changeCurrentAnnotation called, but segment hasn't changed");
        }
        
        _currentMedia.setCurrentTime( _timecode + _timedelta);
        _currentMedia.seeking = true;
        
        if (!_mashup.paused) {
            _currentMedia.play();
            _seeking = true;
            _seekdiv.show();
        }
/*
        console.log("Setting time of media", _currentMedia.id, "to", _timecode + _timedelta)     
*/
        _mashup.trigger("timeupdate", new IriSP.Model.Time(_timecode));

    }
    
    if (!this.height) {
        this.height = Math.floor(this.width/this.aspect_ratio);
        this.$.css({
            height: this.height
        });
    }
    
    this.$.css({
        background: this.background
    });
    
    var _grid = Math.ceil(Math.sqrt(medialist.length)),
        _width = (this.split_screen ? this.width / _grid : this.width),
        _height = (this.split_screen ? this.height / _grid : this.height);

    IriSP._(medialist).each(function(_media, _key) {
        var _el = IriSP.jQuery('<div class="Ldt-MashupPlayer-Media"><div class="Ldt-MashupPlayer-Subwidget"></div></div>');
        _el.css({
            top: (_this.split_screen ? _height * Math.floor(_key / _grid) : 0),
            left: (_this.split_screen ? _width * (_key % _grid) : 0),
            height: _height,
            width: _width,
            display: (_this.split_screen ? "block" : "none")
        });
        _this.$.append(_el);
        
        _this.insertSubwidget(
            _el.find(".Ldt-MashupPlayer-Subwidget"),
            IriSP._({
                type: _this.player_type,
                media_id: _media.id,
                height: _height,
                width: _width,
                url_transform: _this.url_transform
            }).extend(_this.player_options)
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
            for (var _i = 0; _i < medialist.length; _i++) {
                _allLoaded = _allLoaded && medialist[_i].loadedMetadata;
            }
            if (_allLoaded) {
                _seekdiv.fadeOut();
                changeCurrentAnnotation();
                _mashup.trigger("loadedmetadata");
            }
        });
        _media.on("timeupdate", function(_time) {
            if (!_mashup.paused && _media === _currentMedia && !_media.seeking) {
/*
                var _status = "Timeupdate from " + _media.id + " at time " + _time;
*/
                if ( _time < _segmentEnd ) {
                    if ( _time >= _segmentBegin ) {
                        _timecode = _time - _timedelta;
/*
                        _status += " within segment";
*/
                    } else {
                        _timecode = _segmentBegin - _timedelta;
                        _media.setCurrentTime(_segmentBegin);
/*
                        _status += " before segment";
*/
                    }
                } else {
                    _timecode = _segmentEnd - _timedelta;
                    _media.pause();
                    changeCurrentAnnotation();
/*
                    _status += " after segment";
*/
                }
/*
                _status += " (" + _segmentBegin + " to " + _segmentEnd + ")" + ", translated to " + _timecode;
                console.log(_status);
*/
                _mashup.trigger("timeupdate", new IriSP.Model.Time(_timecode));
            }
        });
        _media.on("seeked", function() {
            _media.seeking = false;
            if (_media === _currentMedia && _seeking) {
                _seeking = false;
                _seekdiv.hide();
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
        _media.on("volumechange", function() {
            _mashup.muted = _media.muted;
            _mashup.volume = _media.volume;
            _mashup.trigger("volumechange");
        });
    });
    
    _seekdiv = IriSP.jQuery('<div class="Ldt-MashupPlayer-Waiting"></div>');
    
    this.$.append(_seekdiv);

    // Binding functions to Popcorn
    
    _mashup.on("setcurrenttime", function(_milliseconds) {
        _timecode = _milliseconds;
        changeCurrentAnnotation();
    });
    
    _mashup.on("setvolume", function(_vol) {
        for (var _i = 0; _i < medialist.length; _i++) {
            medialist[_i].setVolume(_vol);
        }
        _mashup.volume = _vol;
    });
    
    _mashup.on("setmuted", function(_muted) {
        for (var _i = 0; _i < medialist.length; _i++) {
            medialist[_i].setMuted(_muted);
        }
        _mashup.muted = _muted;
    });
    
    _mashup.on("setplay", function() {
        _mashup.paused = false;
        changeCurrentAnnotation();
    });
    
    _mashup.on("setpause", function() {
        _mashup.paused = true;
        if (_currentMedia) {
            _currentMedia.pause();
        }
    });
    
    _mashup.on("loadedmetadata", changeCurrentAnnotation);
   
};