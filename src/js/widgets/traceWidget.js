IriSP.TraceWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.lastEvent = "";
  var _this = this,
    _listeners = [
        "IriSP.ArrowWidget.releaseArrow",
        "IriSP.SliceWidget.hide",
        "IriSP.AnnotationsWidget.show",
        "IriSP.AnnotationsWidget.hide",
        "IriSP.ArrowWidget.blockArrow",
        "IriSP.SliceWidget.position",
        "IriSP.SliceWidget.show",
        "IriSP.SliceWidget.hide",
        "IriSP.createAnnotationWidget.addedAnnotation",
        "IriSP.search.open",
        "IriSP.search.closed",
        "IriSP.search",
        "IriSP.search.cleared",
        "IriSP.search.matchFound",
        "IriSP.search.noMatchFound",
        "IriSP.search.triggeredSearch",
        "IriSP.TraceWidget.MouseEvents",
        "play",
        "pause",
        "volumechange",
        "timeupdate",
        "seeked",
        "play",
        "pause"
    ];
    IriSP._(_listeners).each(function(_listener) {
      _this._Popcorn.listen(_listener, function(_arg) {
          _this.eventHandler(_listener, _arg);
      });
    });
  
}

IriSP.TraceWidget.prototype = new IriSP.Widget();

IriSP.TraceWidget.prototype.draw = function() {
    this.mouseLocation = '';
    var _this = this;
    IriSP.jQuery(".Ldt-Widget").bind("click mouseover mouseout dragstart dragstop", function(_e) {
        var _widget = this.id.match('LdtPlayer_widget_([^_]+)')[1],
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
            _data.target = _name + (_id.length ? '#' + _id : '') + (_class.length ? '.' + _class.replace(/\s/g,'.').replace(/\.Ldt-(Widget|TraceMe)/g,'') : '');
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
    console.log("trace('" + _traceName + "', " + JSON.stringify(_arg) + ");");
}
