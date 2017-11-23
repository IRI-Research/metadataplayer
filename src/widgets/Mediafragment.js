IriSP.Widgets.Mediafragment = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.last_hash_key = "";
    this.last_hash_value = "";
    this.last_extra_key = "";
    this.last_extra_value = "";

    window.onhashchange = this.functionWrapper("goToHash");
    if (typeof window.addEventListener !== "undefined") {
        var _this = this;
        window.addEventListener('message', function(_msg) {
            if (/^#/.test(_msg.data)) {
                _this.setWindowHash(_msg.data);
            }
        });
    };
    this.onMdpEvent("Mediafragment.setHashToAnnotation", "setHashToAnnotation");
    this.blocked = false;
};

IriSP.Widgets.Mediafragment.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Mediafragment.prototype.draw = function() {
    this.onMediaEvent("setpause", "setHashToTime");
    var _this = this;
    this.getWidgetAnnotations().forEach(function(_annotation) {
        _annotation.on("click", function() {
            _this.setHashToAnnotation(_annotation);
        });
    });
    if (this.media.loadedMetadata) {
        this.goToHash();
    } else {
        this.onMediaEvent("loadedmetadata", "goToHash");
    }
};

IriSP.Widgets.Mediafragment.prototype.setWindowHash = function(_hash) {
    if (typeof window.history !== "undefined" && typeof window.history.replaceState !== "undefined") {
        window.history.replaceState({}, "", _hash);
    } else {
        document.location.hash = _hash;
    }
};

IriSP.Widgets.Mediafragment.prototype.getLastHash = function() {
    var _tab = document.location.hash.replace(/^#/, '').split('&');
    _tab = IriSP._(_tab).filter(function(_el) {
        return _el && !/^(id|t)=/.test(_el);
    });
    if (this.last_hash_key) {
        _tab.push(this.last_hash_key + '=' + this.last_hash_value);
    }
    if (this.last_extra_key) {
        _tab.push(this.last_extra_key + '=' + this.last_extra_value);
    }
    return '#' + _tab.join('&');
};

IriSP.Widgets.Mediafragment.prototype.goToHash = function() {
    if (document.location.hash !== this.getLastHash()) {
        var _tab = document.location.hash.replace(/^#/, '').split('&');
        for (var _i = 0; _i < _tab.length; _i++) {
            var _subtab = _tab[_i].split("=");
            if (_subtab[0] == "id" || _subtab[0] == "t") {
                this.last_hash_key = _subtab[0];
                this.last_hash_value = _subtab[1];
                if (this.last_hash_key == "id") {
                    var _annotation = this.source.getElement(this.last_hash_value);
                    if (typeof _annotation !== "undefined") {
                        this.media.setCurrentTime(_annotation.begin);
                        break;
                    }
                }
                if (this.last_hash_key == "t") {
                    this.media.setCurrentTime(1000 * this.last_hash_value);
                    break;
                }
            }
        }
    }
};

IriSP.Widgets.Mediafragment.prototype.setHashToAnnotation = function(_annotation) {
    this.setHash('id', _annotation.id, 't', _annotation.begin / 1000.0);
};

IriSP.Widgets.Mediafragment.prototype.setHashToTime = function() {
    this.setHash('t', this.media.getCurrentTime().getSeconds());
};

IriSP.Widgets.Mediafragment.prototype.setHash = function(_key, _value, _key2, _value2) {
    if (!this.blocked && (this.last_hash_key !== _key || this.last_hash_value !== _value)) {
        this.last_hash_key = _key;
        this.last_hash_value = _value;
        this.last_extra_key = _key2;
        this.last_extra_value = _value2;

        var _hash = this.getLastHash();
        this.setWindowHash(_hash);
        if (window.parent !== window) {
            window.parent.postMessage(_hash, "*");
        }
        this.block();
    }
};

IriSP.Widgets.Mediafragment.prototype.unblock = function() {
    if (typeof this.blockTimeout !== "undefined") {
        window.clearTimeout(this.blockTimeout);
    }
    this.blockTimeout = undefined;
    this.blocked = false;
};

IriSP.Widgets.Mediafragment.prototype.block = function() {
    if (typeof this.blockTimeout !== "undefined") {
        window.clearTimeout(this.blockTimeout);
    }
    this.blocked = true;
    this.blockTimeout = window.setTimeout(this.functionWrapper("unblock"), 1500);
};
