IriSP.Widgets.Renkan = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Renkan.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Renkan.prototype.defaults = {
    annotation_regexp: /player\/([a-zA-Z0-9_-]+)\/.*id=([a-zA-Z0-9_-]+)/,
    tag_regexp: /search=([^&=]+)/,
    min_duration: 5000
}

IriSP.Widgets.Renkan.prototype.messages = {
    "fr": {
    },
    "en": {
    }
}

IriSP.Widgets.Renkan.prototype.template =
    '<div class="Ldt-Renkan"></div>';

IriSP.Widgets.Renkan.prototype.draw = function() {
    this.renderTemplate();
    var _id = IriSP.Model.getUID();
    this.$.find(".Ldt-Renkan").attr("id", _id);
    this.renkan = new Rkns.Renkan({
        container: _id
    });
    if (typeof this.data === "string") {
        this.data = [ this.data ];
    }
    var _this = this,
        _list = this.getWidgetAnnotations();
    this.node_times = [];
    Rkns._(this.data).each(function(_url, _key) {
        var _opts = {
            url: _url
        }
        if (!_key) {
            _opts.callback = function(_p) {
                _this.renkan.renderProject(_p);
            }
        }
        var _proj = _this.renkan.addProject(_opts);
        _proj.on("add:nodes", function(_node) {
            var _uri = _node.get("uri"),
                _annmatch = _uri.match(_this.annotation_regexp);
            if (_annmatch) {
                var _annotations = _list.filter(function(_ann) {
                    return _ann.getMedia().id == _annmatch[1] && _ann.id == _annmatch[2];
                });
                _annotations.forEach(function(_ann) {
                    var _duration = _ann.getDuration(),
                        _preroll = + ( _duration < _this.min_duration ) * ( _this.min_duration / 2);
                    var _nt = {
                        selected: false,
                        node: _node,
                        begin: _ann.begin - _preroll,
                        end: _ann.end + _preroll
                    }
                    _this.node_times.push(_nt);
                    _ann.on("select", function(_stop) {
                        if (!_stop) {
                            _node.trigger("select",true);
                        }
                    });
                    _node.on("select", function(_stop) {
                        if (!_stop) {
                            _ann.trigger("select",true);
                        }
                    });
                    _ann.on("unselect", function(_stop) {
                        if (!_stop) {
                            _node.trigger("unselect",true);
                        }
                    });
                    _node.on("unselect", function(_stop) {
                        _nt.selected = false;
                        if (!_stop) {
                            _ann.trigger("unselect",true);
                        }
                    });
                    _node.on("click", function() {
                        _this.media.setCurrentTime(_ann.begin);
                        _this.player.trigger("Mediafragment.setHashToAnnotation", _ann.id);
                    });
                });
            }
            var _tagmatch = _uri.match(_this.tag_regexp);
            if (_tagmatch) {
                _node.on("select", function() {
                    _this.source.getAnnotations().search(_tagmatch[1]);
                })
                _node.on("unselect", function() {
                    _this.source.getAnnotations().search("");
                })
            }
        });
    })
    this.onMediaEvent("timeupdate","onTimeupdate");
}

IriSP.Widgets.Renkan.prototype.onTimeupdate = function(_time) {
    IriSP._(this.node_times).each(function(_nt) {
        if (_nt.begin <= _time && _nt.end >= _time) {
            if (!_nt.selected) {
                _nt.selected = true;
                _nt.node.trigger("select", true);
            }
        } else {
            if (_nt.selected) {
                _nt.node.trigger("unselect", true);
            }
        }
    });
}
