IriSP.Widgets.PopcornPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.PopcornPlayer.prototype = new IriSP.Widgets.Widget();

/* A Popcorn-based player for HTML5 Video, Youtube and Vimeo */

IriSP.Widgets.PopcornPlayer.prototype.defaults = {
    aspect_ratio: 14/9
}

IriSP.Widgets.PopcornPlayer.prototype.draw = function() {

    
    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }
    
    if (this.url_transform) {
        this.video = this.url_transform(this.video);
    }
    
    if (!this.height) {
        this.height = Math.floor(this.width/this.aspect_ratio);
        this.$.css({
                height: this.height
            });
    }
    
    if (/^(https?:\/\/)?(www\.)?vimeo\.com/.test(this.video)) {
        
        /* VIMEO */
        
        var _popcorn = Popcorn.vimeo(this.container, this.video);
        
    } else if (/^(https?:\/\/)?(www\.)?youtube\.com/.test(this.video)) {
        
        /* YOUTUBE */
       
        var _urlparts = this.video.split(/[?&]/),
            _params = {};
        for (var i = 1; i < _urlparts.length; i++) {
            var _ppart = _urlparts[i].split('=');
            _params[_ppart[0]] = decodeURIComponent(_ppart[1]);
        }
        _params.controls = 0;
        _params.modestbranding = 1;
        _url = _urlparts[0] + '?' + IriSP.jQuery.param(_params);
        
        var _popcorn = Popcorn.youtube(this.container, _url);
        
    } else {
        
        /* DEFAULT HTML5 */
        
        var _tmpId = IriSP._.uniqueId("popcorn"),
            _videoEl = IriSP.jQuery('<video>');
        _videoEl.attr({
            id : _tmpId,
            width : this.width,
            height : this.height
        });
        if(typeof this.video === "string"){
            _videoEl.attr("src",this.video);
        } else {
            for (var i = 0; i < this.video.length; i++) {
                var _srcNode = IriSP.jQuery('<source>');
                _srcNode.attr({
                    src: this.video[i].src,
                    type: this.video[i].type
                });
                _videoEl.append(_srcNode);
            }
        }
        this.$.html(_videoEl);
        var _popcorn = Popcorn("#" + _tmpId);
    }

    // Binding functions to Popcorn
    
    this.media.getCurrentTime = function() {
        return new IriSP.Model.Time(1000*_popcorn.currentTime());
    }
    this.media.getVolume = function() {
        return _popcorn.volume();
    }
    this.media.getPaused = function() {
        return _popcorn.media.paused;
    }
    this.media.getMuted = function() {
        return _popcorn.muted();
    }
    this.media.setCurrentTime = function(_milliseconds) {
        return _popcorn.currentTime(_milliseconds / 1000);
    }
    this.media.setVolume = function(_vol) {
        return _popcorn.volume(_vol);
    }
    this.media.mute = function() {
        return _popcorn.muted(true);
    }
    this.media.unmute = function() {
        return _popcorn.muted(false);
    }
    this.media.play = function() {
        return _popcorn.play();
    }
    this.media.pause = function() {
        return _popcorn.pause();
    }
    
    // Binding Popcorn events to media
    
    var _media = this.media;
    _popcorn.on("timeupdate", function() {
        _media.trigger("timeupdate", _media.getCurrentTime());
    });
    
    function simpleEventBind(_eventname) {
        _popcorn.on(_eventname, function() {
            _media.trigger(_eventname);
        });
    }
    
    simpleEventBind("play");
    simpleEventBind("pause");
    simpleEventBind("seeked");
    simpleEventBind("loadedmetadata");
    simpleEventBind("volumechange");
    
}