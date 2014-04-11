IriSP.Widgets.Renkan = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Renkan.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Renkan.prototype.defaults = {
    annotation_regexp: /player\/([a-zA-Z0-9_-]+)\/.*id=([a-zA-Z0-9_-]+)/,
    tag_regexp: /search=([^&=]+)/,
    min_duration: 5000,
    renkan_options: {}
};

IriSP.Widgets.Renkan.prototype.messages = {
    "fr": {
    },
    "en": {
    }
};

IriSP.Widgets.Renkan.prototype.template =
    '<div class="Ldt-Renkan-Container"><div class="Ldt-Renkan"></div></div>';

IriSP.Widgets.Renkan.prototype.draw = function() {
    this.renderTemplate();
    var _id = IriSP.Model.getUID();
    this.$.find(".Ldt-Renkan").attr("id", _id);
    var renkan_options = IriSP._.extend({
        container: _id,
        editor_mode: false,
        show_bins: false,
        show_top_bar: false,
        force_resize: true,
        language: IriSP.language
    }, this.renkan_options);
    this.renkan = new Rkns.Renkan(renkan_options);
    this.node_times = [];
    var _this = this,
        _list = this.getWidgetAnnotations();
    this.renkan.project.on("add:nodes", function(_node) {
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
                    uri: _uri,
                    selected: false,
                    node: _node,
                    annotation: _ann,
                    begin: _ann.begin - _preroll,
                    end: _ann.end + _preroll
                };
                _this.node_times.push(_nt);
                var _annselected = false,
                    _nodeselected = false;
                _ann.on("select", function() {
                    _annselected = true;
                    if (!_nodeselected) {
                        _node.trigger("select",true);
                    }
                });
                _node.on("selected", function() {
                    _nodeselected = true;
                    if (!_annselected) {
                        _ann.trigger("select",true);
                    }
                });
                _ann.on("unselect", function() {
                    _annselected = false;
                    if (_nodeselected) {
                        _node.trigger("unselect",true);
                    }
                });
                _node.on("unselected", function() {
                    _nodeselected = false;
                    _nt.selected = false;
                    if (_annselected) {
                        _ann.trigger("unselect",true);
                    }
                });
                _node.on("clicked", function() {
                    _ann.trigger("click");
                });
            });
        }
        var _tagmatch = _uri.match(_this.tag_regexp);
        if (_tagmatch) {
            _node.on("select", function() {
                _this.source.getAnnotations().search(_tagmatch[1]);
            });
            _node.on("unselect", function() {
                _this.source.getAnnotations().search("");
            });
        }
    });
    Rkns.jsonIO(this.renkan, {
        url: this.data
    });
    
    this.onMediaEvent("timeupdate","onTimeupdate");
    
    this.$.find(".Rk-Editor").on("click", "a", function() {
        var href = this.href,
            times = _this.node_times.filter(function(t) {
                return t.uri == href;
            });
        if (times.length) {
            IriSP._(times).each(function(t) {
                t.annotation.trigger("click");
            });
            return false;
        }
    });
};

IriSP.Widgets.Renkan.prototype.onTimeupdate = function(_time) {
    IriSP._(this.node_times).each(function(_nt) {
        if (_nt.begin <= _time && _nt.end >= _time) {
            if (!_nt.selected) {
                _nt.selected = true;
                _nt.node.trigger("select");
            }
        } else {
            if (_nt.selected) {
                _nt.node.trigger("unselect");
            }
        }
    });
};
