IriSP.Widgets.Mediafragment = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.last_hash = "";
    window.onhashchange = this.functionWrapper("goToHash");
    this.bindPopcorn("pause","setHashToTime");
    this.bindPopcorn("seeked","setHashToTime");
    this.bindPopcorn("IriSP.Mediafragment.setHashToAnnotation","setHashToAnnotation");
    this.blocked = false;
}

IriSP.Widgets.Mediafragment.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Mediafragment.prototype.draw = function() {
    this.goToHash();
}

IriSP.Widgets.Mediafragment.prototype.goToHash = function() {
    if (document.location.hash !== this.last_hash) {
        this.last_hash = document.location.hash;
        var _tab = this.last_hash.split("=");
        if (_tab[0] === '#id') {
            var _annotation = this.source.getElement(_tab[1]);
            if (typeof _annotation !== "undefined") {
                this.player.popcorn.currentTime(_annotation.begin.getSeconds());
            }
        }
        if (_tab[0] === '#t') {
            this.player.popcorn.currentTime(_tab[1]);
        }
    }
}

IriSP.Widgets.Mediafragment.prototype.setHashToAnnotation = function(_annotationId) {
    this.setHash( '#id=' + this.source.unNamespace(_annotationId) );
}

IriSP.Widgets.Mediafragment.prototype.setHashToTime = function(_time) {
    _time = (typeof _time !== "undefined" ? _time : this.player.popcorn.currentTime() );
    this.setHash( '#t=' + _time );
}

IriSP.Widgets.Mediafragment.prototype.setHash = function(_hash) {
    if (!this.blocked && this.last_hash !== _hash) {
        this.last_hash = _hash;
        document.location.hash = _hash;
        this.block();
    }
}

IriSP.Widgets.Mediafragment.prototype.unblock = function() {
    if (typeof this.blockTimeout !== "undefined") {
        window.clearTimeout(this.blockTimeout);
    }
    this.blockTimeout = undefined;
    this.blocked = false;
}

IriSP.Widgets.Mediafragment.prototype.block = function() {
    if (typeof this.blockTimeout !== "undefined") {
        window.clearTimeout(this.blockTimeout);
    }
    this.blocked = true;
    this.blockTimeout = window.setTimeout(this.functionWrapper("unblock"), 1000);
}
