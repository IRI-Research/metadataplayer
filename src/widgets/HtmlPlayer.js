IriSP.Widgets.HtmlPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.HtmlPlayer.prototype = new IriSP.Widgets.Widget();


IriSP.Widgets.HtmlPlayer.prototype.defaults = {
}

IriSP.Widgets.HtmlPlayer.prototype.draw = function() {

    
    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }
    
    if (this.url_transform) {
        this.video = this.url_transform(this.video);
    }
        
    var videoEl = IriSP.jQuery('<video>');
    videoEl.attr({
        width : this.width,
        height : this.height || undefined
    });
    if(typeof this.video === "string"){
        videoEl.attr("src",this.video);
    } else {
        for (var i = 0; i < this.video.length; i++) {
            var _srcNode = IriSP.jQuery('<source>');
            _srcNode.attr({
                src: this.video[i].src,
                type: this.video[i].type
            });
            videoEl.append(_srcNode);
        }
    }
    this.$.html(videoEl);
    if (this.autostart || this.autoplay) {
        videoEl.attr("autoplay", true);
    }
    
    var mediaEl = videoEl[0],
        media = this.media;
    
    // Binding functions to Popcorn
    media.on("setcurrenttime", function(_milliseconds) {
        try {
            mediaEl.currentTime = (_milliseconds / 1000);
        } catch (err) {
            
        }
    });
    
    media.on("setvolume", function(_vol) {
        media.volume = _vol;
        try {
            mediaEl.volume = _vol;
        } catch (err) {
            
        }
    });
    
    media.on("setmuted", function(_muted) {
        media.muted = _muted;
        try {
            mediaEl.muted = _muted;
        } catch (err) {
            
        }
    });
    
    media.on("setplay", function() {
        try {
            mediaEl.play();
        } catch (err) {
            
        }
    });
    
    media.on("setpause", function() {
        try {
            mediaEl.pause();
        } catch (err) {
            
        }
    });
    
    // Binding Popcorn events to media
    function getVolume() {
        media.muted = mediaEl.muted;
        media.volume = mediaEl.volume;
    }
    
    videoEl.on("loadedmetadata", function() {
        getVolume();
        media.trigger("loadedmetadata");
        media.trigger("volumechange");
    })
    
    videoEl.on("timeupdate", function() {
        media.trigger("timeupdate", new IriSP.Model.Time(1000*mediaEl.currentTime));
    });
    
    videoEl.on("volumechange", function() {
        getVolume();
        media.trigger("volumechange");
    })
    
    videoEl.on("play", function() {
        media.trigger("play");
    });
    
    videoEl.on("pause", function() {
        media.trigger("pause");
    });
    
    videoEl.on("seeking", function() {
        media.trigger("seeking");
    });
    
    videoEl.on("seeked", function() {
        media.trigger("seeked");
    });
    
}