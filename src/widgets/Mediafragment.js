IriSP.Widgets.Mediafragment = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.last_hash_key = "";
    this.last_hash_value = "";
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

IriSP.Widgets.Mediafragment.prototype.getLastHash = function() {
    var _tab = document.location.hash.replace(/^#/,'').split('&');
    _tab = IriSP._(_tab).filter(function(_el) {
        return _el && !/^(id|t)=/.test(_el);
    });
    if (this.last_hash_key) {
        _tab.push(this.last_hash_key + '=' + this.last_hash_value);
    }
    return '#' + _tab.join('&');
}

IriSP.Widgets.Mediafragment.prototype.goToHash = function() {
    if (document.location.hash !== this.getLastHash()) {
        var _tab = document.location.hash.replace(/^#/,'').split('&');
        for (var _i = 0; _i < _tab.length; _i++) {
            var _subtab = _tab[_i].split("=");
            if (_subtab[0] == "id" || _subtab[0] == "t") {
                this.last_hash_key = _subtab[0];
                this.last_hash_value = _subtab[1];
                if (this.last_hash_key == "id") {
                    var _annotation = this.source.getElement(this.last_hash_value);
                    if (typeof _annotation !== "undefined") {
                        this.player.popcorn.currentTime(_annotation.begin.getSeconds());
                    }
                }
                if (this.last_hash_key == "t") {
                    this.player.popcorn.currentTime(this.last_hash_value);
                }
                break;
            }
        }
    }
}

IriSP.Widgets.Mediafragment.prototype.setHashToAnnotation = function(_annotationId) {
    this.setHash( 'id', this.source.unNamespace(_annotationId) );
}

IriSP.Widgets.Mediafragment.prototype.setHashToTime = function(_time) {
    if (_time !== NaN) {
        this.setHash( 't', this.player.popcorn.currentTime() );
    }
}

IriSP.Widgets.Mediafragment.prototype.setHash = function(_key, _value) {
    if (!this.blocked && (this.last_hash_key !== _key || this.last_hash_value !== _value)) {
        this.last_hash_key = _key;
        this.last_hash_value = _value;
        var _hash = this.getLastHash();
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
