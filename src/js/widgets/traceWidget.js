IriSP.TraceWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.lastEvent = "";
  var _this = this,
    _listeners = {
        "IriSP.createAnnotationWidget.addedAnnotation" : 0,
        "IriSP.search.open" : 0,
        "IriSP.search.closed" : 0,
        "IriSP.search" : 0,
        "IriSP.search.cleared" : 0,
        "IriSP.search.matchFound" : 0,
        "IriSP.search.noMatchFound" : 0,
        "IriSP.search.triggeredSearch" : 0,
        "IriSP.TraceWidget.MouseEvents" : 0,
        "play" : 0,
        "pause" : 0,
        "volumechange" : 0,
        "seeked" : 0,
        "play" : 0,
        "pause" : 0,
        "timeupdate" : 2000
    };
    IriSP._(_listeners).each(function(_ms, _listener) {
        var _f = function(_arg) {
            _this.eventHandler(_listener, _arg);
        }
        if (_ms) {
            _f = IriSP.underscore.throttle(_f, _ms);
        }
        _this._Popcorn.listen(_listener, _f);
    });
    this._Popcorn.listen("timeupdate", IriSP.underscore.throttle(function(_arg) {
        _this.eventHandler(_listener, _arg);
    }));
    
    this.tracer = IriSP.TraceManager(IriSP.jQuery).init_trace("test", this._config);
    this.tracer.trace("StartTracing", { "hello": "world" });
    
}

IriSP.TraceWidget.prototype = new IriSP.Widget();

IriSP.TraceWidget.prototype.draw = function() {
    this.mouseLocation = '';
    var _this = this;
    IriSP.jQuery(".Ldt-Widget").bind("click mouseover mouseout dragstart dragstop", function(_e) {
        var _widget = IriSP.jQuery(this).attr("widget-type"),
            _class = _e.target.className;
        var _data = {
            "type": _e.type,
            "x": _e.clientX,
            "y": _e.clientY,
            "widget": _widget
        }
        if (typeof _class == "string" && _class.indexOf('Ldt-TraceMe') != -1) {
            var _name = _e.target.localName,
                _id = _e.target.id,
                _text = _e.target.textContent.trim(),
                _title = _e.target.title,
                _value = _e.target.value;
            _data.target = _name + (_id.length ? '#' + IriSP.jqEscape(_id) : '') + (_class.length ? ('.' + IriSP.jqEscape(_class).replace(/\s/g,'.')).replace(/\.Ldt-(Widget|TraceMe)/g,'') : '');
            if (typeof _title == "string" && _title.length && _title.length < 140) {
                _data.title = _title;
            }
            if (typeof _text == "string" && _text.length && _text.length < 140) {
                _data.text = _text;
            }
            if (typeof _value == "string" && _value.length) {
                _data.value = _value;
            }
            _this._Popcorn.trigger('IriSP.TraceWidget.MouseEvents', _data);
        } else {
            //console.log(_e.type+','+_this.mouseLocation+','+_widget);
            if (_e.type == "mouseover") {
                if (_this.mouseLocation != _widget) {
                    _this._Popcorn.trigger('IriSP.TraceWidget.MouseEvents', _data);
                } else {
                    if (typeof _this.moTimeout != "undefined") {
                        clearTimeout(_this.moTimeout);
                        delete _this.moTimeout;
                    }
                }
            }
            if (_e.type == "click") {
                _this._Popcorn.trigger('IriSP.TraceWidget.MouseEvents', _data);
            }
            if (_e.type == "mouseout") {
                if (typeof _this.moTimeout != "undefined") {
                    clearTimeout(_this.moTimeout);
                }
                _this.moTimeout = setTimeout(function() {
                   if (_data.widget != _this.mouseLocation) {
                       _this._Popcorn.trigger('IriSP.TraceWidget.MouseEvents', _data);
                   }
                },100);
            }
        }
        _this.mouseLocation = _widget;
    });
}

IriSP.TraceWidget.prototype.eventHandler = function(_listener, _arg) {
    var _traceName = 'Mdp_';
    if (typeof _arg == "string" || typeof _arg == "number") {
        _arg = { "value" : _arg }
    }
    if (typeof _arg == "undefined") {
        _arg = {}
    }
    switch(_listener) {
        case 'IriSP.TraceWidget.MouseEvents':
            _traceName += _arg.widget + '_' + _arg.type;
            delete _arg.widget;
            delete _arg.type;
        break;
        case 'timeupdate':
        case 'play':
        case 'pause':
            _arg.time = this._Popcorn.currentTime() * 1000;
        case 'seeked':
        case 'volumechange':
            _traceName += 'Popcorn_' + _listener;
        break;
        default:
            _traceName += _listener.replace('IriSP.','').replace('.','_');
    }
    this.lastEvent = _traceName;
    this.tracer.trace(_traceName, _arg);
    if (this._config.js_console) {
        console.log("tracer.trace('" + _traceName + "', " + JSON.stringify(_arg) + ");");
    }
}
