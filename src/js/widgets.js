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
    
    /* Setting all the configuration options */
    var _type = config.type,
        _config = IriSP._.defaults({}, config, player.config.gui.default_options, this.defaults),
        _this = this;
    
    IriSP._(_config).forEach(function(_value, _key) {
       _this[_key] = _value;
    });
    
    if (typeof this.width === "undefined") {
        this.width = player.config.gui.width;
    }
    
    /* Setting this.player at the end in case it's been overriden
     * by a configuration option of the same name :-(
     */
    this.player = player;
    
    /* Getting metadata */
    this.source = player.loadMetadata(this.metadata);
    
    /* Call draw when loaded */
    this.source.onLoad(function() {
        _this.draw();
    });
   
    /* Adding classes and html attributes */
    this.$ = IriSP.jQuery('#' + this.container);
    this.$.addClass("Ldt-TraceMe Ldt-Widget").attr("widget-type", _type);
    
    /* Does the widget require other widgets ? */
    if (typeof this.requires !== "undefined") {
        for (var _i = 0; _i < this.requires.length; _i++) {
            var _subconfig = this.requires[_i];
            _subconfig.container = IriSP._.uniqueId(this.container + '_' + _subconfig.type + '_');
            this.$.append(IriSP.jQuery('<div>').attr("id",_subconfig.container));
            this.player.loadWidget(_subconfig, function(_widget) {
                _this[_subconfig.type.replace(/^./,function(_s){return _s.toLowerCase();})] = _widget
            });
        }
    }
    
    this.l10n = (
        typeof this.messages[IriSP.language] !== "undefined"
        ? this.messages[IriSP.language]
        : (
            IriSP.language.length > 2 && typeof this.messages[IriSP.language.substr(0,2)] !== "undefined"
            ? this.messages[IriSP.language.substr(0,2)]
            : this.messages["en"]
        )
    );
    
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
        console.log("Error, Unknown function IriSP." + this.type + "." + _name)
    }
}

IriSP.Widgets.Widget.prototype.bindPopcorn = function(_popcornEvent, _functionName) {
    this.player.popcorn.listen(_popcornEvent, this.functionWrapper(_functionName))
}

IriSP.Widgets.Widget.prototype.getWidgetAnnotations = function() {
    var _curmedia = this.source.currentMedia;
    return typeof this.annotation_type !== "undefined" && this.annotation_type ? _curmedia.getAnnotationsByTypeTitle(this.annotation_type) : _curmedia.getAnnotations();
}

IriSP.Widgets.Widget.prototype.getWidgetAnnotationsAtTime = function() {
    var _time = Math.floor(this.player.popcorn.currentTime() * 1000);
    return this.getWidgetAnnotations().filter(function(_annotation) {
        return _annotation.begin <= _time && _annotation.end > _time;
    });
}

/**
 * This method responsible of drawing a widget on screen.
 */
IriSP.Widgets.Widget.prototype.draw = function() {
    /* implemented by "sub-classes" */
};