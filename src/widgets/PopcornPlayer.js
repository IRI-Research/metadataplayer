IriSP.Widgets.PopcornPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.PopcornPlayer.prototype = new IriSP.Widgets.Widget();

/* A Popcorn-based player for HTML5 Video, Youtube and Vimeo */

IriSP.Widgets.PopcornPlayer.prototype.defaults = {
};

IriSP.Widgets.PopcornPlayer.prototype.draw = function() {
    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }

    if (this.url_transform) {
        this.video = this.url_transform(this.video);
    }

    var _url = this.video;

    if (/^(https?:\/\/)?(www\.)?youtube\.com/.test(this.video)) {
        /* YOUTUBE */
        var _urlparts = this.video.split(/[?&]/),
            _params = {};
        for (var i = 1; i < _urlparts.length; i++) {
            var _ppart = _urlparts[i].split('=');
            _params[_ppart[0]] = decodeURIComponent(_ppart[1]);
        }
        _params.controls = 0;
        _params.modestbranding = 1;
        if (this.autostart || this.autoplay) {
            _params.autoplay = 1;
        }
        _url = _urlparts[0] + '?' + IriSP.jQuery.param(_params);

    }// else {
    //     /* DEFAULT HTML5 */
    //     var _tmpId = IriSP._.uniqueId("popcorn"),
    //         _videoEl = IriSP.jQuery('<video>');
    //     _videoEl.attr({
    //         id : _tmpId,
    //         width : this.width,
    //         height : this.height || undefined
    //     });
    //     if(typeof this.video === "string"){
    //         _videoEl.attr("src",this.video);
    //     } else {
    //         for (var i = 0; i < this.video.length; i++) {
    //             var _srcNode = IriSP.jQuery('<source>');
    //             _srcNode.attr({
    //                 src: this.video[i].src,
    //                 type: this.video[i].type
    //             });
    //             _videoEl.append(_srcNode);
    //         }
    //     }
    //     this.$.html(_videoEl);
    // }

    var _popcorn = Popcorn.smart("#"+this.container, _url);

    if (this.autostart || this.autoplay) {
        _popcorn.autoplay(true);
    }

    var _media = this.media;

    // Binding functions to Popcorn

    _media.on("setcurrenttime", function(_milliseconds) {
        _popcorn.currentTime(_milliseconds / 1000);
    });

    _media.on("setvolume", function(_vol) {
        _popcorn.volume(_vol);
        _media.volume = _vol;
    });

    _media.on("setmuted", function(_muted) {
        _popcorn.muted(_muted);
        _media.muted = _muted;
    });

    _media.on("setplay", function() {
        _popcorn.play();
    });

    _media.on("setpause", function() {
        _popcorn.pause();
    });
    _media.on("settimerange", function(_timeRange){
        _media.timeRange = _timeRange;
        try {
            if (_media.getCurrentTime() > _timeRange[0] || _media.getCurrentTime() < _timeRange){
                _popcorn.currentTime(_timeRange[0] / 1000);
            }
        } catch (err) {
        }
    })
    _media.on("resettimerange", function(){
        _media.timeRange = false;
    })
    // Binding Popcorn events to media

    function getVolume() {
        _media.muted = _popcorn.muted();
        _media.volume = _popcorn.volume();
    }

    _popcorn.on("loadedmetadata", function() {
        getVolume();
        _media.trigger("loadedmetadata");
        _media.trigger("volumechange");
    });

    _popcorn.on("timeupdate", function() {
        _media.trigger("timeupdate", new IriSP.Model.Time(1000*_popcorn.currentTime()));
    });

    _popcorn.on("volumechange", function() {
        getVolume();
        _media.trigger("volumechange");
    });

    _popcorn.on("play", function(e) {
        _media.trigger("play");
    });

    _popcorn.on("pause", function() {
        _media.trigger("pause");
    });

    _popcorn.on("seeked", function() {
        _media.trigger("seeked");
    });

};
