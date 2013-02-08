/* Definition of an ancestor for the Widget classes */

if (typeof IriSP.Widgets === "undefined") {
    IriSP.Widgets = {}
}

/**
 * @class IriSP.Widget is an "abstract" class. It's mostly used to define some properties common to every widget.
 *
 *  Note that widget constructors are never called directly by the user. Instead, the widgets are instantiated by functions
 *  defined in init.js
 *
 * @constructor
 * @param player - a reference to the player widget
 * @param config - configuration options for the widget
 */


IriSP.Widgets.Widget = function(player, config) {
    
    if( typeof player === "undefined") {
        /* Probably an abstract call of the class when
         * individual widgets set their prototype */
        return;
    }
    
    this.__subwidgets = [];
    
    /* Setting all the configuration options */
    var _type = config.type,
        _config = IriSP._.defaults({}, config, player.config.default_options, this.defaults),
        _this = this;
    
    IriSP._(_config).forEach(function(_value, _key) {
       _this[_key] = _value;
    });
    
    this.$ = IriSP.jQuery('#' + this.container);
    
    if (typeof this.width === "undefined") {
        this.width = this.$.width();
    } else {
        this.$.css("width", this.width);
    }
    
    if (typeof this.height !== "undefined") {
        this.$.css("height", this.height);
    }
    
    /* Setting this.player at the end in case it's been overriden
     * by a configuration option of the same name :-(
     */
    this.player = player;
    
    /* Adding classes and html attributes */
    this.$.addClass("Ldt-TraceMe Ldt-Widget").attr("widget-type", _type);
    
    this.l10n = (
        typeof this.messages[IriSP.language] !== "undefined"
        ? this.messages[IriSP.language]
        : (
            IriSP.language.length > 2 && typeof this.messages[IriSP.language.substr(0,2)] !== "undefined"
            ? this.messages[IriSP.language.substr(0,2)]
            : this.messages["en"]
        )
    );
    
    /* Loading Metadata if required */
    
    if (this.metadata) {
        /* Getting metadata */
        this.source = player.loadMetadata(this.metadata);
        
        /* Call draw when loaded */
        this.source.onLoad(function() {
            if (_this.media_id) {
                _this.media = this.getElement(_this.media_id);
            } else {
                var _mediaopts = {
                    is_mashup: _this.is_mashup || false
                }
                _this.media = this.getCurrentMedia(_mediaopts);
            }
            
            _this.draw();
            player.trigger("widget-loaded");
        });
    } else {
        this.draw();
    }
    
    
};

IriSP.Widgets.Widget.prototype.defaults = {}

IriSP.Widgets.Widget.prototype.template = '';

IriSP.Widgets.Widget.prototype.messages = {"en":{}};

IriSP.Widgets.Widget.prototype.templateToHtml = function(_template) {
    return Mustache.to_html(_template, this);
}

IriSP.Widgets.Widget.prototype.renderTemplate = function() {
    this.$.append(this.templateToHtml(this.template));
}

IriSP.Widgets.Widget.prototype.functionWrapper = function(_name) {
    var _this = this,
        _function = this[_name];
    if (typeof _function !== "undefined") {
        return function() {
            return _function.apply(_this, Array.prototype.slice.call(arguments, 0));
        }
    } else {
        console.log("Error, Unknown function IriSP.Widgets." + this.type + "." + _name)
    }
}

IriSP.Widgets.Widget.prototype.getFunctionOrName = function(_functionOrName) {
    switch (typeof _functionOrName) {
        case "function":
            return _functionOrName;
        case "string":
            return this.functionWrapper(_functionOrName);
        default:
            return undefined;
    }
}

IriSP.Widgets.Widget.prototype.onMdpEvent = function(_eventName, _functionOrName) {
    this.player.on(_eventName, this.getFunctionOrName(_functionOrName));
}

IriSP.Widgets.Widget.prototype.onMediaEvent = function(_eventName, _functionOrName) {
    this.media.on(_eventName, this.getFunctionOrName(_functionOrName));
}

IriSP.Widgets.Widget.prototype.getWidgetAnnotations = function() {
    if (typeof this.annotation_type === "undefined") {
        return this.media.getAnnotations();
    }
    if (this.annotation_type.elementType === "annotationType") {
        return this.annotation_type.getAnnotations();
    }
    return this.media.getAnnotationsByTypeTitle(this.annotation_type);
}

IriSP.Widgets.Widget.prototype.getWidgetAnnotationsAtTime = function() {
    var _time = this.media.getCurrentTime();
    return this.getWidgetAnnotations().filter(function(_annotation) {
        return _annotation.begin <= _time && _annotation.end > _time;
    });
}

IriSP.Widgets.Widget.prototype.isLoaded = function() {
    var isloaded = !IriSP._(this.__subwidgets).any(function(w) {
        return !(w && w.isLoaded());
    });
    return isloaded;
}

IriSP.Widgets.Widget.prototype.insertSubwidget = function(_selector, _widgetoptions, _propname) {
    var _id = _selector.attr("id"),
        _this = this,
        _type = _widgetoptions.type,
        $L = $LAB,
        key = this.__subwidgets.length;
    this.__subwidgets.push(null);
    if (typeof _id == "undefined") {
        _id = IriSP._.uniqueId(this.container + '_sub_widget_' + _widgetoptions.type);
        _selector.attr("id", _id);
    }
    _widgetoptions.container = _id;
    if (typeof IriSP.widgetsRequirements[_type] !== "undefined" && typeof IriSP.widgetsRequirements[_type].requires !== "undefined" ) {
        for (var _j = 0; _j < IriSP.widgetsRequirements[_type].requires.length; _j++) {
            $L.script(IriSP.getLib(IriSP.widgetsRequirements[_type].requires[_j]));
        }
    }
    $L.wait(function() {
        _this.player.loadWidget(_widgetoptions, function(_widget) {
            if (_propname) {
                _this[_propname] = _widget;
            }
            _this.__subwidgets[key] = _widget;
        });
    });
}

/**
 * This method responsible of drawing a widget on screen.
 */
IriSP.Widgets.Widget.prototype.draw = function() {
    /* implemented by "sub-classes" */
};