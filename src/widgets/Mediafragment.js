IriSP.Widgets.Mediafragment = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.last_hash = "";
    window.onhashchange = this.functionWrapper("goToHash");
    this.player.bindPopcorn("pause","setHashToTime");
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
    this.last_hash = '#id=' + this.source.unNamespace(_annotationId);
    
}

IriSP.Widgets.Mediafragment.prototype.setHashToTime = function() {
    this.last_hash = '#t=' + this.source.popcorn.currentTime();
}

IriSP.Widgets.Mediafragment.prototype.setHash = function(_hash) {
    if (this.last_hash !== _hash) {
        this.last_hash = _hash;
        document.location.hash = _hash;
    }
}