/* init.js - initialization and configuration of the widgets
*/

if (typeof window.IriSP === "undefined") {
    window.IriSP = {};
}

/* The Metadataplayer Object, single point of entry, replaces IriSP.init_player */

IriSP.Metadataplayer = function(config) {
    IriSP.log("IriSP.Metadataplayer constructor");
    for (var key in IriSP.guiDefaults) {
        if (IriSP.guiDefaults.hasOwnProperty(key) && !config.hasOwnProperty(key)) {
            config[key] = IriSP.guiDefaults[key]
        }
    }
    var _container = document.getElementById(config.container);
    _container.innerHTML = '<h3 class="Ldt-Loader">Loading... Chargement...</h3>';
    this.sourceManager = new IriSP.Model.Directory();
    this.config = config;
    this.__events = {};
    this.loadLibs();
}

IriSP.Metadataplayer.prototype.toString = function() {
    return 'Metadataplayer in #' + this.config.container;
}

IriSP.Metadataplayer.prototype.on = function(_event, _callback) {
    if (typeof this.__events[_event] === "undefined") {
        this.__events[_event] = [];
    }
    this.__events[_event].push(_callback);
}

IriSP.Metadataplayer.prototype.trigger = function(_event, _data) {
    var _element = this;
    IriSP._(this.__events[_event]).each(function(_callback) {
        _callback.call(_element, _data);
    });
}

IriSP.Metadataplayer.prototype.loadLibs = function() {
    IriSP.log("IriSP.Metadataplayer.prototype.loadLibs");
    var $L = $LAB
        .script(IriSP.getLib("underscore"))
        .script(IriSP.getLib("Mustache"))
        .script(IriSP.getLib("jQuery"));
    
    if (typeof JSON == "undefined") {
        $L.script(IriSP.getLib("json"));
    }
    
    $L.wait()
        .script(IriSP.getLib("jQueryUI"));

    /* widget specific requirements */
    for(var _i = 0; _i < this.config.widgets.length; _i++) {
        var _t = this.config.widgets[_i].type;
        if (typeof IriSP.widgetsRequirements[_t] !== "undefined" && typeof IriSP.widgetsRequirements[_t].requires !== "undefined" ) {
            for (var _j = 0; _j < IriSP.widgetsRequirements[_t].requires.length; _j++) {
                $L.script(IriSP.getLib(IriSP.widgetsRequirements[_t].requires[_j]));
            }
        }
    }
    
    var _this = this;
    
    $L.wait(function() {
        _this.onLibsLoaded();
    });
}

IriSP.Metadataplayer.prototype.onLibsLoaded = function() {
    IriSP.log("IriSP.Metadataplayer.prototype.onLibsLoaded");
    if (typeof IriSP.jQuery === "undefined" && typeof window.jQuery !== "undefined") {
        IriSP.jQuery = window.jQuery;
    }
    if (typeof IriSP._ === "undefined" && typeof window._ !== "undefined") {
        IriSP._ = window._;
    }
    IriSP.loadCss(IriSP.getLib("cssjQueryUI"));
    IriSP.loadCss(this.config.css);
    
    this.$ = IriSP.jQuery('#' + this.config.container);
    this.$.css({
        "width": this.config.width,
        "clear": "both"
    });
    if (typeof this.config.height !== "undefined") {
        this.$.css("height", this.config.height);
    }
      
    this.widgets = [];
    var _this = this;
    IriSP._(this.config.widgets).each(function(widgetconf, key) {
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
        var isloaded = !IriSP._(_this.widgets).any(function(w) {
            return !(w && w.isLoaded())
        });
        if (isloaded) {
            _this.widgetsLoaded = true;
            _this.trigger("widgets-loaded");
        }
    });   
}

IriSP.Metadataplayer.prototype.loadMetadata = function(_metadataInfo) {
    if (_metadataInfo.elementType === "source") {
        return _metadataInfo;
    }
    if (typeof _metadataInfo.serializer === "undefined" && typeof _metadataInfo.format !== "undefined") {
        _metadataInfo.serializer = IriSP.serializers[_metadataInfo.format];
    }
    if (typeof _metadataInfo.url !== "undefined" && typeof _metadataInfo.serializer !== "undefined") {
        return this.sourceManager.remoteSource(_metadataInfo);
    } else {
        return this.sourceManager.newLocalSource(_metadataInfo);
    }
}

IriSP.Metadataplayer.prototype.loadWidget = function(_widgetConfig, _callback) {
    /* Creating containers if needed */
    if (typeof _widgetConfig.container === "undefined") {
        var _divs = this.layoutDivs(_widgetConfig.type);
        _widgetConfig.container = _divs[0];
    }
    
    var _this = this;
    
    if (typeof IriSP.Widgets[_widgetConfig.type] !== "undefined") {
        IriSP._.defer(function() {
            _callback(new IriSP.Widgets[_widgetConfig.type](_this, _widgetConfig));
        });
    } else {
        /* Loading Widget CSS */
        if (typeof IriSP.widgetsRequirements[_widgetConfig.type] === "undefined" || typeof IriSP.widgetsRequirements[_widgetConfig.type].noCss === "undefined" || !IriSP.widgetsRequirements[_widgetConfig.type].noCss) {
            IriSP.loadCss(IriSP.widgetsDir + '/' + _widgetConfig.type + '.css');
        }
        /* Loading Widget JS    */
        $LAB.script(IriSP.widgetsDir + '/' + _widgetConfig.type + '.js').wait(function() {
            _callback(new IriSP.Widgets[_widgetConfig.type](_this, _widgetConfig));
        });
    }
}

/** create a subdiv with an unique id, and a spacer div as well.
    @param widgetName the name of the widget.
    @return an array of the form [createdivId, spacerdivId].
*/
IriSP.Metadataplayer.prototype.layoutDivs = function(_name, _height) {
    if (typeof(_name) === "undefined") {
       _name = "";
    }
    var newDiv = IriSP._.uniqueId(this.config.container + "_widget_" + _name + "_"),
        spacerDiv = IriSP._.uniqueId("LdtPlayer_spacer_"),
        divHtml = IriSP.jQuery('<div>')
            .attr("id",newDiv)
            .css({
                width: this.config.width + "px",
                position: "relative",
                clear: "both"
            }),
        spacerHtml = IriSP.jQuery('<div>')
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
