/* This is a fake player, for when no video is available */

IriSP.Widgets.PlaceholderPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.PlaceholderPlayer.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.PlaceholderPlayer.prototype.defaults = {
    autostart: false
};

IriSP.Widgets.PlaceholderPlayer.prototype.template = '<div class="Ldt-PlaceholderPlayer">(loading)</div>';

IriSP.Widgets.PlaceholderPlayer.prototype.draw = function() {
    
    this.renderTemplate();
    
    var paused = true,
        timeDelta = 0,
        currentTime = new IriSP.Model.Time(0),
        media = this.media,
        sel = this.$.find(".Ldt-PlaceholderPlayer");
    
    function updateTime() {
        if (!paused) {
            currentTime = new IriSP.Model.Time(new Date().valueOf() - timeDelta);
            if (currentTime <= media.duration) {
                media.trigger("timeupdate", currentTime);
                setTimeout(updateTime, 100);
            } else {
                currentTime = media.duration;
                media.pause();
            }
        }
        sel.text(currentTime.toString(true));
    }
    
    
    // Binding functions to Popcorn
    media.on("setcurrenttime", function(_milliseconds) {
        timeDelta = new Date().valueOf() - _milliseconds;
        currentTime = new IriSP.Model.Time(_milliseconds);
        media.trigger("seeked");
        media.trigger("timeupdate", currentTime);
        sel.text(currentTime.toString(true));
    });
    
    media.on("setplay", function() {
        paused = false;
        timeDelta = new Date().valueOf() - currentTime
        media.trigger("play");
        updateTime();
    });
    
    media.on("setpause", function() {
        paused = true;
        media.trigger("pause");
        updateTime();
    });
    
    media.trigger("loadedmetadata");
    media.trigger("setcurrenttime", 0);
    
    if (this.autostart) {
        media.trigger("setplay");
    }
    
};