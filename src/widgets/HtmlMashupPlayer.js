IriSP.Widgets.HtmlMashupPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.HtmlMashupPlayer.prototype = new IriSP.Widgets.Widget();


IriSP.Widgets.HtmlMashupPlayer.prototype.defaults = {
    aspect_ratio: 14/9,
    background: "#333333"
};

IriSP.Widgets.HtmlMashupPlayer.prototype.draw = function() {
    
    if (!this.height && this.aspect_ratio) {
        this.height = this.width / this.aspect_ratio;
        this.$.css("height", this.height);
    }
    
    if (this.background) {
        this.$.css("background", this.background);
    }
    
    var mashup = this.media,
        sel = this.$,
        width = this.width,
        height = this.height,
        url_transform = this.url_transform;
    
    mashup.currentMedia = null;
    mashup.currentAnnotation = null;
    mashup.seeking = false;
    var mashupSegmentBegin,
        mashupSegmentEnd,
        mashupTimecode = 0,
 //       seekdiv = $(".video-wait"),
        mashupTimedelta;
        
/*    
    function showSeek() {
        if (currentMedia.seeking) {
            seekdiv.show();
        }
    }
*/

    function changeCurrentAnnotation() {
        if (mashupTimecode >= mashup.duration) {
            if (!mashup.paused) {
                mashup.paused = true;
                mashup.trigger("pause");
            }
            mashupTimecode = 0;
        }
        var _annotation = mashup.getAnnotationAtTime( mashupTimecode );
        if (typeof _annotation === "undefined") {
            if (mashup.currentMedia) {
                mashup.currentMedia.pause();
                if (!mashup.paused) {
                    mashup.paused = true;
                    mashup.trigger("pause");
                }
            }
            return;
        }
        mashup.currentAnnotation = _annotation;
        mashupSegmentBegin = mashup.currentAnnotation.annotation.begin.milliseconds;
        mashupSegmentEnd = mashup.currentAnnotation.annotation.end.milliseconds;
        mashupTimedelta = mashupSegmentBegin - mashup.currentAnnotation.begin.milliseconds;
        mashup.currentMedia = mashup.currentAnnotation.getMedia();
        mashup.getMedias().forEach(function(_media) {
            if (_media !== mashup.currentMedia) {
                _media.hide();
                _media.pause();
            } else {
                _media.show();
            }
        });
        
        mashup.currentMedia.setCurrentTime( mashupTimecode + mashupTimedelta);
        mashup.currentMedia.seeking = true;
        
        if (!mashup.paused) {
            mashup.currentMedia.play();
            mashup.seeking = true;
//            setTimeout(showSeek,200);
        }
        mashup.trigger("timeupdate", new IriSP.Model.Time(mashupTimecode));

    }
    
    mashup.getMedias().forEach(addMedia);
    changeCurrentAnnotation();
    mashup.trigger("loadedmetadata");
    
    function addMedia(media) {
        if (media.has_player) {
            return;
        }
        media.has_player = true;
        var videourl = media.video;
        if (typeof url_transform === "function") {
            videourl = url_transform(media.video);
        }
        var videoid = "video_" + media.id,
            videoElement;
        
        media.show = function() {
            
            if (document.getElementById(videoid)) {
                return;
            }
            
            media.loaded = false;
            media.paused = true;
            var videoSelector = $('<video>');
            
            videoSelector.attr({
                id : videoid,
                width : width,
                height : height
            }).css({
                width: width,
                height: height
            });
            
            if (typeof videourl === "string") {
                videoSelector.attr( "src", videourl );
            } else {
                for (var i = 0; i < videourl.length; i++) {
                    var _srcNode = IriSP.jQuery('<source>');
                    _srcNode.attr({
                        src: videourl[i].src,
                        type: videourl[i].type
                    });
                    videoSelector.append(_srcNode);
                }
            }
            
            sel.append(videoSelector);
            
            videoElement = videoSelector[0];
            
            // Binding DOM events to media
            
            function getVolume() {
                media.muted = videoElement.muted;
                media.volume = videoElement.volume;
            }
            
            videoSelector.on("loadedmetadata", function() {
                getVolume();
                media.loaded = true;
                media.trigger("loadedmetadata");
                media.trigger("volumechange");
            });
            
            videoSelector.on("timeupdate", function() {
                media.trigger("timeupdate", new IriSP.Model.Time(1000*videoElement.currentTime));
            });
            
            videoSelector.on("volumechange", function() {
                getVolume();
                media.trigger("volumechange");
            });
            
            videoSelector.on("play", function() {
                media.trigger("play");
            });
            
            videoSelector.on("pause", function() {
                media.trigger("pause");
            });
            
            videoSelector.on("seeking", function() {
                media.trigger("seeking");
            });
            
            videoSelector.on("seeked", function() {
                media.trigger("seeked");
            });
        };
        
        media.hide = function() {
            videoElement = undefined;
            sel.find("#" + videoid).remove();
        };
        
        // Binding functions to Media Element Functions
        
        var deferredTime = undefined,
            deferredPlayPause = undefined;
        
        media.on("setcurrenttime", function(_milliseconds) {
            if (videoElement && videoElement.readyState >= videoElement.HAVE_METADATA) {
                try {
                    videoElement.currentTime = (_milliseconds / 1000);
                    deferredTime = undefined;
                } catch(err) {
                    deferredTime = _milliseconds;
                }
            } else {
                deferredTime = _milliseconds;
            }
        });
        
        media.on("setvolume", function(_vol) {
            if (videoElement && videoElement.readyState >= videoElement.HAVE_METADATA) {
                media.volume = _vol;
                videoElement.volume = _vol;
            }
        });
        
        media.on("setmuted", function(_muted) {
            if (videoElement && videoElement.readyState >= videoElement.HAVE_METADATA) {
                media.muted = _muted;
                videoElement.muted = _muted;
            }
        });
        
        media.on("setplay", function() {
            if (videoElement && videoElement.readyState >= videoElement.HAVE_METADATA) {
                try {
                    videoElement.play();
                    deferredPlayPause = undefined;
                } catch(err) {
                    deferredPlayPause = true;
                }
            } else {
                deferredPlayPause = true;
            }
        });

        media.on("setpause", function() {
            if (videoElement && videoElement.readyState >= videoElement.HAVE_METADATA) {
                try {
                    videoElement.pause();
                    deferredPlayPause = undefined;
                } catch(err) {
                    deferredPlayPause = false;
                }
            } else {
                deferredPlayPause = false;
            }
        });
        
        media.on("loadedmetadata", function() {
            if (typeof deferredTime !== "undefined") {
                media.setCurrentTime(deferredTime);
            }
            if (typeof deferredPlayPause !== "undefined") {
                if (deferredPlayPause) {
                    media.play();
                } else {
                    media.pause();
                }
            }
        });
        
        // Binding UI Events and Mashup Playing to Media
        
        media.on("play", function() {
            if (media === mashup.currentMedia) {
                mashup.trigger("play");
            }
        });
        
        media.on("pause", function() {
            if (media === mashup.currentMedia) {
                mashup.trigger("pause");
            }
        });
        
        media.on("timeupdate", function(_time) {
            if (!mashup.paused && media === mashup.currentMedia && !media.seeking) {
                if ( _time < mashupSegmentEnd ) {
                    if ( _time >= mashupSegmentBegin ) {
                        mashupTimecode = _time - mashupTimedelta;
                    } else {
                        mashupTimecode = mashupSegmentBegin - mashupTimedelta;
                        media.setCurrentTime(mashupSegmentBegin);
                    }
                } else {
                    mashupTimecode = mashupSegmentEnd - mashupTimedelta;
                    media.pause();
                    changeCurrentAnnotation();
                }
                mashup.trigger("timeupdate", new IriSP.Model.Time(mashupTimecode));
            }
        });
        
        media.on("seeked", function() {
            media.seeking = false;
            if (media === mashup.currentMedia && mashup.seeking) {
                mashup.seeking = false;
            }
//            seekdiv.hide();
        });
        
        media.on("volumechange", function() {
            mashup.muted = media.muted;
            mashup.volume = media.volume;
            mashup.trigger("volumechange");
        });
        
    }

    // Mashup Events
    
    mashup.on("setcurrenttime", function(_milliseconds) {
        mashupTimecode = _milliseconds;
        changeCurrentAnnotation();
    });
    
    mashup.on("setvolume", function(_vol) {
        mashup.getMedias().forEach(function(_media) {
            _media.setVolume(_vol);
        });
        mashup.volume = _vol;
    });
    
    mashup.on("setmuted", function(_muted) {
        mashup.getMedias().forEach(function(_media) {
            _media.setMuted(_muted);
        });
        mashup.muted = _muted;
    });
    
    mashup.on("setplay", function() {
        mashup.paused = false;
        changeCurrentAnnotation();
    });
    
    mashup.on("setpause", function() {
        mashup.paused = true;
        if (mashup.currentMedia) {
            mashup.currentMedia.pause();
        }
    });
    
    mashup.on("loadedmetadata", function() {
        changeCurrentAnnotation();
    });
    
};