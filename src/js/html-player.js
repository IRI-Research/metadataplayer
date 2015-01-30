/* HTML player, to be reused in a widget, or elsewhere */

IriSP.htmlPlayer = function(media, jqselector, options) {
    
    var opts = options || {},
        videoURL = opts.video || media.video;
    
    if (typeof opts.url_transform === "function") {
        videoURL = opts.url_transform(videoURL);
    }
        
    var videoEl = IriSP.jQuery('<video>');
    
    videoEl.attr({
        width : opts.width || undefined,
        height : opts.height || undefined,
        controls : opts.controls || undefined,
        autoplay : opts.autostart || opts.autoplay || undefined
    });
    
    if(typeof videoURL === "string"){
        videoEl.attr("src",videoURL);
    } else {
        for (var i = 0; i < videoURL.length; i++) {
            var _srcNode = IriSP.jQuery('<source>');
            _srcNode.attr({
                src: videoURL[i].src,
                type: videoURL[i].type
            });
            videoEl.append(_srcNode);
        }
    }
    
    jqselector.html(videoEl);
    
    var mediaEl = videoEl[0];
    
    // Binding HTML video functions to media events
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
    
    // Binding DOM events to media
    function getVolume() {
        media.muted = mediaEl.muted;
        media.volume = mediaEl.volume;
    }
    
    videoEl.on("loadedmetadata", function() {
        getVolume();
        media.trigger("loadedmetadata");
        media.trigger("volumechange");
    });
    
    videoEl.on("timeupdate", function() {
        media.trigger("timeupdate", new IriSP.Model.Time(1000*mediaEl.currentTime));
    });
    
    videoEl.on("volumechange", function() {
        getVolume();
        media.trigger("volumechange");
    });
    
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
    
    videoEl.on("dblclick", function () {
        // Toggle fullscreen
        var elem = videoEl[0];
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    });
};
