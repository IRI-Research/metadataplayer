IriSP.Widgets.Mediafragment = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.last_hash = "";
    window.onhashchange = this.functionWrapper("goToHash");
    if (typeof window.addEventListener !== "undefined") {
        window.addEventListener('message', function(_msg) {
            if (_msg.data.type === "hashchange") {
                document.location.hash = _msg.data.hash;
            }
        })
    };
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
    if (_time !== NaN) {
        this.setHash( '#t=' + this.player.popcorn.currentTime() );
    }
}

IriSP.Widgets.Mediafragment.prototype.setHash = function(_hash) {
    if (!this.blocked && this.last_hash !== _hash) {
        this.last_hash = _hash;
        document.location.hash = _hash;
        if (window.parent !== window) {
            window.parent.postMessage({
                type: "hashchange",
                hash: _hash
            })
        }
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
