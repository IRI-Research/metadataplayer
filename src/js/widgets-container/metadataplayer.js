/* widgets-container/metadataplayer.js - initialization and configuration of the widgets
*/

/* The Metadataplayer Object, single point of entry, replaces IriSP.init_player */

(function(ns) {

var formerJQuery, formerUnderscore, former$;

var Metadataplayer = ns.Metadataplayer = function(config) {
    ns.log("IriSP.Metadataplayer constructor");
    for (var key in ns.guiDefaults) {
        if (ns.guiDefaults.hasOwnProperty(key) && !config.hasOwnProperty(key)) {
            config[key] = ns.guiDefaults[key]
        }
    }
    var _container = document.getElementById(config.container);
    _container.innerHTML = '<h3 class="Ldt-Loader">Loading... Chargement...</h3>';
    this.sourceManager = new ns.Model.Directory();
    this.config = config;
    this.__events = {};
    this.loadLibs();
};

Metadataplayer.prototype.toString = function() {
    return 'Metadataplayer in #' + this.config.container;
};

Metadataplayer.prototype.on = function(_event, _callback) {
    if (typeof this.__events[_event] === "undefined") {
        this.__events[_event] = [];
    }
    this.__events[_event].push(_callback);
};

Metadataplayer.prototype.trigger = function(_event, _data) {
    var _element = this;
    ns._(this.__events[_event]).each(function(_callback) {
        _callback.call(_element, _data);
    });
};

Metadataplayer.prototype.loadLibs = function() {
    ns.log("IriSP.Metadataplayer.prototype.loadLibs");
    var $L = $LAB
        .queueScript(ns.getLib("Mustache"));
    formerJQuery = !!window.jQuery;
    former$ = !!window.$;
    formerUnderscore = !!window._;

    if (typeof ns.jQuery === "undefined") {
        $L.queueScript(ns.getLib("jQuery"));
    }

    if (typeof ns._ === "undefined") {
        $L.queueScript(ns.getLib("underscore"));
    }

    if (typeof window.JSON == "undefined") {
        $L.queueScript(ns.getLib("json"));
    }
    $L.queueWait().queueScript(ns.getLib("jQueryUI")).queueWait();

    /* widget specific requirements */
    for(var _i = 0; _i < this.config.widgets.length; _i++) {
        var _t = this.config.widgets[_i].type;
        if (typeof ns.widgetsRequirements[_t] !== "undefined" && typeof ns.widgetsRequirements[_t].requires !== "undefined" ) {
            for (var _j = 0; _j < ns.widgetsRequirements[_t].requires.length; _j++) {
                $L.queueScript(ns.getLib(ns.widgetsRequirements[_t].requires[_j]));
            }
        }
    }

    var _this = this;
    $L.queueWait(function() {
        _this.onLibsLoaded();
    });
    
    $L.runQueue();
};

Metadataplayer.prototype.onLibsLoaded = function() {
    ns.log("IriSP.Metadataplayer.prototype.onLibsLoaded");

    if (typeof ns.jQuery === "undefined" && typeof window.jQuery !== "undefined") {
        ns.jQuery = window.jQuery;
        if (former$ || formerJQuery) {
            window.jQuery.noConflict(formerJQuery);
        }
    }
    if (typeof ns._ === "undefined" && typeof window._ !== "undefined") {
        ns._ = window._;
        if (formerUnderscore) {
            _.noConflict();
        }
    }
    
    ns.loadCss(ns.getLib("cssjQueryUI"));
    ns.loadCss(this.config.css);

    this.$ = ns.jQuery('#' + this.config.container);
    this.$.css({
        "width": this.config.width,
        "clear": "both"
    });
    if (typeof this.config.height !== "undefined") {
        this.$.css("height", this.config.height);
    }

    this.widgets = [];
    var _this = this;
    ns._(this.config.widgets).each(function(widgetconf, key) {
        _this.widgets.push(null);
        _this.loadWidget(widgetconf, function(widget) {
            _this.widgets[key] = widget;
            if (widget.isLoaded()) {
                _this.trigger("widget-loaded");
            }
        });
    });
    this.$.find('.Ldt-Loader').detach();

    this.widgetsLoaded = false;

    this.on("widget-loaded", function() {
        if (_this.widgetsLoaded) {
            return;
        }
        var isloaded = !ns._(_this.widgets).any(function(w) {
            return !(w && w.isLoaded());
        });
        if (isloaded) {
            _this.widgetsLoaded = true;
            _this.trigger("widgets-loaded");
        }
    });
};

Metadataplayer.prototype.loadLocalAnnotations = function(localsourceidentifier) {
    if (this.localSource === undefined)
        this.localSource = this.sourceManager.newLocalSource({serializer: IriSP.serializers['ldt_localstorage']});
    // Load current local annotations
    if (localsourceidentifier) {
        // Allow to override localsourceidentifier when necessary (usually at init time)
        this.localSource.identifier = localsourceidentifier;
    }
    this.localSource.deSerialize(window.localStorage[this.localSource.identifier] || "[]");
    return this.localSource;
};

Metadataplayer.prototype.saveLocalAnnotations = function() {
    // Save annotations back to localstorage
    window.localStorage[this.localSource.identifier] = this.localSource.serialize();
    // Merge modifications into widget source
    // this.source.merge(this.localSource);
};

Metadataplayer.prototype.addLocalAnnotation = function(a) {
    this.loadLocalAnnotations();
    this.localSource.getAnnotations().push(a);
    this.saveLocalAnnotations();
};

Metadataplayer.prototype.deleteLocalAnnotation = function(ident) {
    this.localSource.getAnnotations().removeId(ident, true);
    this.saveLocalAnnotations();
};

Metadataplayer.prototype.getLocalAnnotation = function (ident) {
    this.loadLocalAnnotations();
    // We cannot use .getElement since it fetches
    // elements from the global Directory
    return IriSP._.first(IriSP._.filter(this.localSource.getAnnotations(), function (a) { return a.id == ident; }));
};

Metadataplayer.prototype.loadMetadata = function(_metadataInfo) {
    if (_metadataInfo.elementType === "source") {
        return _metadataInfo;
    }
    if (typeof _metadataInfo.serializer === "undefined" && typeof _metadataInfo.format !== "undefined") {
        _metadataInfo.serializer = ns.serializers[_metadataInfo.format];
    }
    if (typeof _metadataInfo.url !== "undefined" && typeof _metadataInfo.serializer !== "undefined") {
        return this.sourceManager.remoteSource(_metadataInfo);
    } else {
        return this.sourceManager.newLocalSource(_metadataInfo);
    }
};

Metadataplayer.prototype.loadWidget = function(_widgetConfig, _callback) {
    /* Creating containers if needed */
    if (typeof _widgetConfig.container === "undefined") {
        var _divs = this.layoutDivs(_widgetConfig.type);
        _widgetConfig.container = _divs[0];
    }

    var _this = this;

    if (typeof ns.Widgets[_widgetConfig.type] !== "undefined") {
        ns._.defer(function() {
            _callback(new ns.Widgets[_widgetConfig.type](_this, _widgetConfig));
        });
    } else {
        /* Loading Widget CSS */
        if (typeof ns.widgetsRequirements[_widgetConfig.type] === "undefined" || typeof ns.widgetsRequirements[_widgetConfig.type].noCss === "undefined" || !ns.widgetsRequirements[_widgetConfig.type].noCss) {
            ns.loadCss(ns.widgetsDir + '/' + _widgetConfig.type + '.css');
        }
        /* Loading Widget JS    */
        $LAB.script(ns.widgetsDir + '/' + _widgetConfig.type + '.js').wait(function() {
            _callback(new ns.Widgets[_widgetConfig.type](_this, _widgetConfig));
        });
    }
};

/** create a subdiv with an unique id, and a spacer div as well.
    @param widgetName the name of the widget.
    @return an array of the form [createdivId, spacerdivId].
*/
Metadataplayer.prototype.layoutDivs = function(_name, _height) {
    if (typeof(_name) === "undefined") {
       _name = "";
    }
    var newDiv = ns._.uniqueId(this.config.container + "_widget_" + _name + "_"),
        spacerDiv = ns._.uniqueId("LdtPlayer_spacer_"),
        divHtml = ns.jQuery('<div>')
            .attr("id",newDiv)
            .css({
                width: this.config.width + "px",
                position: "relative",
                clear: "both"
            }),
        spacerHtml = ns.jQuery('<div>')
            .attr("id",spacerDiv)
            .css({
                width: this.config.width + "px",
                height: this.config.spacer_div_height + "px",
                position: "relative",
                clear: "both"
            });
    if (typeof _height !== "undefined") {
        divHtml.css("height", _height);
    }

    this.$.append(divHtml);
    this.$.append(spacerHtml);

    return [newDiv, spacerDiv];
};

})(IriSP);

/* End of widgets-container/metadataplayer.js */
