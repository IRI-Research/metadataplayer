IriSP.Widgets.PopcornPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.PopcornPlayer.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.PopcornPlayer.prototype.defaults = {
}

IriSP.Widgets.PopcornPlayer.prototype.draw = function() {
    var _tmpId = Popcorn.guid("video"),
        _videoEl = IriSP.jQuery('<video>');
    
    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }
    
    if (this.url_transform) {
        this.video = this.url_transform(this.video);
    }
    
    _videoEl.attr({
        "src" : this.video,
        "id" : _tmpId
    })

    if(this.width) {
        _videoEl.attr("width", this.width);
    }
    if(this.height) {
        _videoEl.attr("height", this.height);
    }
    this.$.append(_videoEl);
    var _popcorn = Popcorn("#" + _tmpId);

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