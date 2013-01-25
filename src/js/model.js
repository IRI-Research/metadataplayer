/* TODO: Separate Project-specific data from Source */

/* model.js is where data is stored in a standard form, whatever the serializer */
IriSP.Model = (function (ns) {
    
    function pad(n, x, b) {
        b = b || 10;
        var s = (x).toString(b);
        while (s.length < n) {
            s = "0" + s;
        }
        return s;
    }
    
    function rand16(n) {
        return pad(n, Math.floor(Math.random()*Math.pow(16,n)), 16);
    }
    
    var uidbase = rand16(8) + "-" + rand16(4) + "-", uidincrement = Math.floor(Math.random()*0x10000);
    
    var charsub = [
        '[aáàâä]',
        '[cç]',
        '[eéèêë]',
        '[iíìîï]',
        '[oóòôö]',
        '[uùûü]'
    ];
    
    var removeChars = [
        String.fromCharCode(768), String.fromCharCode(769), String.fromCharCode(770), String.fromCharCode(771), String.fromCharCode(807),
        "｛", "｝", "（", "）", "［", "］", "【", "】", "、", "・", "‥", "。", "「", "」", "『", "』", "〜", "：", "！", "？", "　",
        ",", " ", ";", "(", ")", ".", "*", "+", "\\", "?", "|", "{", "}", "[", "]", "^", "#", "/"
    ]
    
var Model = {
    _SOURCE_STATUS_EMPTY : 0,
    _SOURCE_STATUS_WAITING : 1,
    _SOURCE_STATUS_READY : 2,
    getUID : function() {
        return uidbase + pad(4, (++uidincrement % 0x10000), 16) + "-" + rand16(4) + "-" + rand16(6) + rand16(6);
    },
    isLocalURL : function(url) {
        var matches = url.match(/^(\w+:)\/\/([^/]+)/);
        if (matches) {
            return(matches[1] === document.location.protocol && matches[2] === document.location.host)
        }
        return true;
    },
    regexpFromTextOrArray : function(_textOrArray, _testOnly, _iexact) {
        var _testOnly = _testOnly || false,
            _iexact = _iexact || false;
        function escapeText(_text) {
            return _text.replace(/([\\\*\+\?\|\{\[\}\]\(\)\^\$\.\#\/])/gm, '\\$1');
        }
        var _source = 
            typeof _textOrArray === "string"
            ? escapeText(_textOrArray)
            : ns._(_textOrArray).map(escapeText).join("|"),
            _flags = 'im';
        if (!_testOnly) {
            _source = '(' + _source + ')';
            _flags += 'g';
        }
        if (_iexact) {
            _source = '^' + _source + '$';
        }
        return new RegExp( _source, _flags);
    },
    fullTextRegexps: function(_text) {
        var remsrc = "[\\" + removeChars.join("\\") + "]",
            remrx = new RegExp(remsrc,"gm"),
            txt = _text.toLowerCase().replace(remrx,"")
            res = [],
            charsrx = ns._(charsub).map(function(c) {
                return new RegExp(c);
            }),
            src = "";
        for (var j = 0; j < txt.length; j++) {
            if (j) {
                src += remsrc + "*";
            }
            var l = txt[j];
            ns._(charsub).each(function(v, k) {
                l = l.replace(charsrx[k], v);
            });
            src += l;
        }
        return "(" + src + ")";
    },
    isoToDate : function(_str) {
        // http://delete.me.uk/2005/03/iso8601.html
        var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
        var d = _str.match(new RegExp(regexp));
    
        var offset = 0;
        var date = new Date(d[1], 0, 1);
    
        if (d[3]) { date.setMonth(d[3] - 1); }
        if (d[5]) { date.setDate(d[5]); }
        if (d[7]) { date.setHours(d[7]); }
        if (d[8]) { date.setMinutes(d[8]); }
        if (d[10]) { date.setSeconds(d[10]); }
        if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
        if (d[14]) {
            offset = (Number(d[16]) * 60) + Number(d[17]);
            offset *= ((d[15] == '-') ? 1 : -1);
        }
    
        offset -= date.getTimezoneOffset();
        time = (Number(date) + (offset * 60 * 1000));
        var _res = new Date();
        _res.setTime(Number(time));
        return _res;
    },
    dateToIso : function(_d) {
        var d = _d ? new Date(_d) : new Date();
        return d.getUTCFullYear()+'-'  
            + pad(2, d.getUTCMonth()+1)+'-'  
            + pad(2, d.getUTCDate())+'T'  
            + pad(2, d.getUTCHours())+':'  
            + pad(2, d.getUTCMinutes())+':'  
            + pad(2, d.getUTCSeconds())+'Z'  
    }
}

/*
 * Model.List is a class for a list of elements (e.g. annotations, medias, etc. that each have a distinct ID)
 */
Model.List = function(_directory) {
    Array.call(this);
    this.directory = _directory;
    this.idIndex = [];
    this.__events = {};
    if (typeof _directory == "undefined") {
        console.trace();
        throw "Error : new Model.List(directory): directory is undefined";
    }
    var _this =  this;
    this.on("clear-search", function() {
        _this.searching = false;
        _this.regexp = undefined;
        _this.forEach(function(_element) {
            _element.found = undefined;
        });
        _this.trigger("search-cleared");
    })
}

Model.List.prototype = new Array();

Model.List.prototype.hasId = function(_id) {
    return ns._(this.idIndex).include(_id);
}

/* On recent browsers, forEach and map are defined and do what we want.
 * Otherwise, we'll use the Underscore.js functions
 */
if (typeof Array.prototype.forEach === "undefined") {
    Model.List.prototype.forEach = function(_callback) {
        var _this = this;
        ns._(this).forEach(function(_value, _key) {
            _callback(_value, _key, _this);
        });
    }
}

if (typeof Array.prototype.map === "undefined") {
    Model.List.prototype.map = function(_callback) {
        var _this = this;
        return ns._(this).map(function(_value, _key) {
            return _callback(_value, _key, _this);
        });
    }
}

Model.List.prototype.pluck = function(_key) {
    return this.map(function(_value) {
        return _value[_key];
    });
}

/* We override Array's filter function because it doesn't return an Model.List
 */
Model.List.prototype.filter = function(_callback) {
    var _this = this,
        _res = new Model.List(this.directory);
    _res.addElements(ns._(this).filter(function(_value, _key) {
        return _callback(_value, _key, _this);
    }));
    return _res;
}

Model.List.prototype.slice = function(_start, _end) {
    var _res = new Model.List(this.directory);
    _res.addElements(Array.prototype.slice.call(this, _start, _end));
    return _res;
}

Model.List.prototype.splice = function(_start, _end) {
    var _res = new Model.List(this.directory);
    _res.addElements(Array.prototype.splice.call(this, _start, _end));
    this.idIndex.splice(_start, _end);
    return _res;
}

/* Array has a sort function, but it's not as interesting as Underscore.js's sortBy
 * and won't return a new Model.List
 */
Model.List.prototype.sortBy = function(_callback) {
    var _this = this,
        _res = new Model.List(this.directory);
    _res.addElements(ns._(this).sortBy(function(_value, _key) {
        return _callback(_value, _key, _this);
    }));
    return _res;
}

/* Title and Description are basic information for (almost) all element types,
 * here we can search by these criteria
 */
Model.List.prototype.searchByTitle = function(_text, _iexact) {
    var _iexact = _iexact || false,
        _rgxp = Model.regexpFromTextOrArray(_text, true, _iexact);
    return this.filter(function(_element) {
        return _rgxp.test(_element.title);
    });
}

Model.List.prototype.searchByDescription = function(_text, _iexact) {
    var _iexact = _iexact || false,
        _rgxp = Model.regexpFromTextOrArray(_text, true, _iexact);
    return this.filter(function(_element) {
        return _rgxp.test(_element.description);
    });
}

Model.List.prototype.searchByTextFields = function(_text, _iexact) {
    var _iexact = _iexact || false,
        _rgxp =  Model.regexpFromTextOrArray(_text, true, _iexact);
    return this.filter(function(_element) {
        var keywords = (_element.keywords || _element.getTagTexts() || []).join(", ");
        return _rgxp.test(_element.description) || _rgxp.test(_element.title) || _rgxp.test(keywords);
    });
}

Model.List.prototype.search = function(_text) {
    if (!_text) {
        this.trigger("clear-search");
        return this;
    }
    this.searching = true;
    this.trigger("search", _text);
    var rxsource = Model.fullTextRegexps(_text)
        rgxp = new RegExp(rxsource,"im"),
        this.regexp = new RegExp(rxsource,"gim");
    var res = this.filter(function(_element, _k) {
        var titlematch = rgxp.test(_element.title),
            descmatch = rgxp.test(_element.description),
            _isfound = !!(titlematch || descmatch);
        _element.found = _isfound;
        _element.trigger(_isfound ? "found" : "not-found");
        return _isfound;
    });
    this.trigger(res.length ? "found" : "not-found",res);
    return res;
}

Model.List.prototype.getTitles = function() {
    return this.map(function(_el) {
        return _el.title;
    });
}

Model.List.prototype.addId = function(_id) {
    var _el = this.directory.getElement(_id)
    if (!this.hasId(_id) && typeof _el !== "undefined") {
        this.idIndex.push(_id);
        Array.prototype.push.call(this, _el);
    }
}

Model.List.prototype.push = function(_el) {
    if (typeof _el === "undefined") {
        return;
    }
    var _index = (ns._(this.idIndex).indexOf(_el.id));
    if (_index === -1) {
        this.idIndex.push(_el.id);
        Array.prototype.push.call(this, _el);
    } else {
        this[_index] = _el;
    }
}

Model.List.prototype.addIds = function(_array) {
    var _l = _array.length,
        _this = this;
    ns._(_array).forEach(function(_id) {
        _this.addId(_id);
    });
}

Model.List.prototype.addElements = function(_array) {
    var _this = this;
    ns._(_array).forEach(function(_el) {
        _this.push(_el);
    });
}

Model.List.prototype.removeId = function(_id, _deleteFromDirectory) {
    var _deleteFromDirectory = _deleteFromDirectory || false,
        _index = (ns._(this.idIndex).indexOf(_id));
    if (_index !== -1) {
        this.splice(_index,1);
    }
    if (_deleteFromDirectory) {
        delete this.directory.elements[_id];
    }
}

Model.List.prototype.removeElement = function(_el, _deleteFromDirectory) {
    var _deleteFromDirectory = _deleteFromDirectory || false;
    this.removeId(_el.id);
}

Model.List.prototype.removeIds = function(_list, _deleteFromDirectory) {
    var _deleteFromDirectory = _deleteFromDirectory || false,
        _this = this;
    ns._(_list).forEach(function(_id) {
        _this.removeId(_id);
    });
}

Model.List.prototype.removeElements = function(_list, _deleteFromDirectory) {
    var _deleteFromDirectory = _deleteFromDirectory || false,
        _this = this;
    ns._(_list).forEach(function(_el) {
        _this.removeElement(_el);
    });
}

Model.List.prototype.on = function(_event, _callback) {
    if (typeof this.__events[_event] === "undefined") {
        this.__events[_event] = [];
    }
    this.__events[_event].push(_callback);
}

Model.List.prototype.off = function(_event, _callback) {
    if (typeof this.__events[_event] !== "undefined") {
        this.__events[_event] = ns._(this.__events[_event]).reject(function(_fn) {
            return _fn === _callback;
        });
    }
}

Model.List.prototype.trigger = function(_event, _data) {
    var _list = this;
    ns._(this.__events[_event]).each(function(_callback) {
        _callback.call(_list, _data);
    });
}

/* A simple time management object, that helps converting millisecs to seconds and strings,
 * without the clumsiness of the original Date object.
 */

Model.Time = function(_milliseconds) {
    this.milliseconds = 0;
    this.setMilliseconds(_milliseconds);
}

Model.Time.prototype.setMilliseconds = function(_milliseconds) {
    var _ante = this.milliseconds;
    switch(typeof _milliseconds) {
        case "string":
            this.milliseconds = parseInt(_milliseconds);
            break;
        case "number":
            this.milliseconds = Math.floor(_milliseconds);
            break;
        case "object":
            this.milliseconds = parseInt(_milliseconds.valueOf());
            break;
        default:
            this.milliseconds = 0;
    }
    if (this.milliseconds === NaN) {
        this.milliseconds = _ante;
    }
}

Model.Time.prototype.setSeconds = function(_seconds) {
    this.milliseconds = 1000 * _seconds;
}

Model.Time.prototype.getSeconds = function() {
    return this.milliseconds / 1000;
}

Model.Time.prototype.getHMS = function() {
    var _totalSeconds = Math.abs(Math.floor(this.getSeconds()));
    return {
        hours : Math.floor(_totalSeconds / 3600),
        minutes : (Math.floor(_totalSeconds / 60) % 60),
        seconds : _totalSeconds % 60,
        milliseconds: this.milliseconds % 1000
    } 
}

Model.Time.prototype.add = function(_milliseconds) {
    this.milliseconds += new Model.Time(_milliseconds).milliseconds;
}

Model.Time.prototype.valueOf = function() {
    return this.milliseconds;
}

Model.Time.prototype.toString = function(showCs) {
    var _hms = this.getHMS(),
        _res = '';
    if (_hms.hours) {
        _res += _hms.hours + ':'
    }
    _res += pad(2, _hms.minutes) + ':' + pad(2, _hms.seconds);
    if (showCs) {
        _res += "." + Math.floor(_hms.milliseconds / 100)
    }
    return _res;
}

/* Model.Reference handles references between elements
 */

Model.Reference = function(_source, _idRef) {
    this.source = _source;
    this.id = _idRef;
    if (typeof _idRef === "object") {
        this.isList = true;
    } else {
        this.isList = false;
    }
    this.refresh();
}

Model.Reference.prototype.refresh = function() {
    if (this.isList) {
        this.contents = new Model.List(this.source.directory);
        this.contents.addIds(this.id);
    } else {
        this.contents = this.source.getElement(this.id);
    }
    
}

Model.Reference.prototype.getContents = function() {
    if (typeof this.contents === "undefined" || (this.isList && this.contents.length != this.id.length)) {
        this.refresh();
    }
    return this.contents;
}

Model.Reference.prototype.isOrHasId = function(_idRef) {
    if (this.isList) {
        return (ns._(this.id).indexOf(_idRef) !== -1)
    } else {
        return (this.id == _idRef);
    }
}

/* */

Model.Element = function(_id, _source) {
    this.elementType = 'element';
    this.title = "";
    this.description = "";
    this.__events = {}
    if (typeof _source === "undefined") {
        return;
    }
    if (typeof _id === "undefined" || !_id) {
        _id = Model.getUID();
    }
    this.id = _id;
    this.source = _source;
    if (_source !== this) {
        this.source.directory.addElement(this);
    }
}

Model.Element.prototype.toString = function() {
    return this.elementType + (this.elementType !== 'element' ? ', id=' + this.id + ', title="' + this.title + '"' : '');
}

Model.Element.prototype.setReference = function(_elementType, _idRef) {
    this[_elementType] = new Model.Reference(this.source, _idRef);
}

Model.Element.prototype.getReference = function(_elementType) {
    if (typeof this[_elementType] !== "undefined") {
        return this[_elementType].getContents();
    }
}

Model.Element.prototype.getRelated = function(_elementType, _global) {
    _global = (typeof _global !== "undefined" && _global);
    var _this = this;
    return this.source.getList(_elementType, _global).filter(function(_el) {
        var _ref = _el[_this.elementType];
        return _ref && _ref.isOrHasId(_this.id);
    });
}

Model.Element.prototype.on = function(_event, _callback) {
    if (typeof this.__events[_event] === "undefined") {
        this.__events[_event] = [];
    }
    this.__events[_event].push(_callback);
}

Model.Element.prototype.off = function(_event, _callback) {
    if (typeof this.__events[_event] !== "undefined") {
        this.__events[_event] = ns._(this.__events[_event]).reject(function(_fn) {
            return _fn === _callback;
        });
    }
}

Model.Element.prototype.trigger = function(_event, _data) {
    var _element = this;
    ns._(this.__events[_event]).each(function(_callback) {
        _callback.call(_element, _data);
    });
}

/* */

Model.Playable = function(_id, _source) {
    Model.Element.call(this, _id, _source);
    if (typeof _source === "undefined") {
        return;
    }
    this.elementType = 'playable';
    this.currentTime = new Model.Time();
    this.volume = .5;
    this.paused = true;
    this.muted = false;
    this.loadedMetadata = false;
    var _this = this;
    this.on("play", function() {
        _this.paused = false;
    });
    this.on("pause", function() {
        _this.paused = true;
    });
    this.on("timeupdate", function(_time) {
        _this.currentTime = _time;
        _this.getAnnotations().filter(function(_a) {
            return (_a.end <= _time || _a.begin > _time) && _a.playing
        }).forEach(function(_a) {
            _a.playing = false;
            _a.trigger("leave");
            _this.trigger("leave-annotation",_a);
        });
        _this.getAnnotations().filter(function(_a) {
            return _a.begin <= _time && _a.end > _time && !_a.playing
        }).forEach(function(_a) {
            _a.playing = true;
            _a.trigger("enter");
            _this.trigger("enter-annotation",_a);
        });
    });
    this.on("loadedmetadata", function() {
        _this.loadedMetadata = true;
    })
}

Model.Playable.prototype = new Model.Element();

Model.Playable.prototype.getCurrentTime = function() { 
    return this.currentTime;
}

Model.Playable.prototype.getVolume = function() {
    return this.volume;
}

Model.Playable.prototype.getPaused = function() {
    return this.paused;
}

Model.Playable.prototype.getMuted = function() {
    return this.muted;
}

Model.Playable.prototype.setCurrentTime = function(_time) {
    this.trigger("setcurrenttime",_time);
}

Model.Playable.prototype.setVolume = function(_vol) {
    this.trigger("setvolume",_vol);
}

Model.Playable.prototype.setMuted = function(_muted) {
    this.trigger("setmuted",_muted);
}

Model.Playable.prototype.play = function() {
    this.trigger("setplay");
}

Model.Playable.prototype.pause = function() {
    this.trigger("setpause");
}

Model.Playable.prototype.show = function() {}

Model.Playable.prototype.hide = function() {}

/* */

Model.Media = function(_id, _source) {
    Model.Playable.call(this, _id, _source);
    this.elementType = 'media';
    this.duration = new Model.Time();
    this.video = '';
    var _this = this;
}

Model.Media.prototype = new Model.Playable();

/* Default functions to be overriden by players */
    
Model.Media.prototype.setDuration = function(_durationMs) {
    this.duration.setMilliseconds(_durationMs);
}

Model.Media.prototype.getAnnotations = function() {
    return this.getRelated("annotation");
}

Model.Media.prototype.getAnnotationsByTypeTitle = function(_title) {
    var _annTypes = this.source.getAnnotationTypes().searchByTitle(_title).pluck("id");
    if (_annTypes.length) {
        return this.getAnnotations().filter(function(_annotation) {
            return ns._(_annTypes).indexOf(_annotation.getAnnotationType().id) !== -1;
        });
    } else {
        return new Model.List(this.source.directory)
    }
}

/* */

Model.Tag = function(_id, _source) {
    Model.Element.call(this, _id, _source);
    this.elementType = 'tag';
}

Model.Tag.prototype = new Model.Element();

Model.Tag.prototype.getAnnotations = function() {
    return this.getRelated("annotation");
}

/* */
Model.AnnotationType = function(_id, _source) {
    Model.Element.call(this, _id, _source);
    this.elementType = 'annotationType';
}

Model.AnnotationType.prototype = new Model.Element();

Model.AnnotationType.prototype.getAnnotations = function() {
    return this.getRelated("annotation");
}

/* Annotation
 * */

Model.Annotation = function(_id, _source) {
    Model.Element.call(this, _id, _source);
    this.elementType = 'annotation';
    this.begin = new Model.Time();
    this.end = new Model.Time();
    this.tag = new Model.Reference(_source, []);
    this.playing = false;
    var _this = this;
    this.on("click", function() {
        _this.getMedia().setCurrentTime(_this.begin);
    });
}

Model.Annotation.prototype = new Model.Element();

Model.Annotation.prototype.setBegin = function(_beginMs) {
    this.begin.setMilliseconds(Math.max(0,_beginMs));
    this.trigger("change-begin");
    if (this.end < this.begin) {
        this.setEnd(this.begin);
    }
}

Model.Annotation.prototype.setEnd = function(_endMs) {
    this.end.setMilliseconds(Math.min(_endMs, this.getMedia().duration.milliseconds));
    this.trigger("change-end");
    if (this.end < this.begin) {
        this.setBegin(this.end);
    }
}

Model.Annotation.prototype.setDuration = function(_durMs) {
    this.setEnd(_durMs + this.begin.milliseconds);
}

Model.Annotation.prototype.setMedia = function(_idRef) {
    this.setReference("media", _idRef);
}

Model.Annotation.prototype.getMedia = function() {
    return this.getReference("media");
}

Model.Annotation.prototype.setAnnotationType = function(_idRef) {
    this.setReference("annotationType", _idRef);
}

Model.Annotation.prototype.getAnnotationType = function() {
    return this.getReference("annotationType");
}

Model.Annotation.prototype.setTags = function(_idRefs) {
    this.setReference("tag", _idRefs);
}

Model.Annotation.prototype.getTags = function() {
    return this.getReference("tag");
}

Model.Annotation.prototype.getTagTexts = function() {
    return this.getTags().getTitles();
}

Model.Annotation.prototype.getDuration = function() {
    return new Model.Time(this.end.milliseconds - this.begin.milliseconds)
}

/* */

Model.MashedAnnotation = function(_mashup, _annotation) {
    Model.Element.call(this, _mashup.id + "_" + _annotation.id, _annotation.source);
    this.elementType = 'mashedAnnotation';
    this.annotation = _annotation;
    this.begin = new Model.Time();
    this.end = new Model.Time();
    this.duration = new Model.Time();
    this.title = this.annotation.title;
    this.description = this.annotation.description;
    this.color = this.annotation.color;
    var _this = this;
    this.on("click", function() {
        _mashup.setCurrentTime(_this.begin);
    });
    this.on("enter", function() {
        _this.annotation.trigger("enter");
    });
    this.on("leave", function() {
        _this.annotation.trigger("leave");
    });
}

Model.MashedAnnotation.prototype = new Model.Element(null);

Model.MashedAnnotation.prototype.getMedia = function() {
    return this.annotation.getReference("media");
}

Model.MashedAnnotation.prototype.getAnnotationType = function() {
    return this.annotation.getReference("annotationType");
}

Model.MashedAnnotation.prototype.getTags = function() {
    return this.annotation.getReference("tag");
}

Model.MashedAnnotation.prototype.getTagTexts = function() {
    return this.annotation.getTags().getTitles();
}

Model.MashedAnnotation.prototype.getDuration = function() {
    return this.annotation.getDuration();
}

Model.MashedAnnotation.prototype.setBegin = function(_begin) {
    this.begin.setMilliseconds(_begin);
    this.duration.setMilliseconds(this.annotation.getDuration());
    this.end.setMilliseconds(_begin + this.duration);
}

/* */

Model.Mashup = function(_id, _source) {
    Model.Playable.call(this, _id, _source);
    this.elementType = 'mashup';
    this.duration = new Model.Time();
    this.segments = new Model.List(_source.directory);
    this.loaded = false;
    var _this = this;
    this._updateTimes = function() {
        _this.updateTimes();
        _this.trigger("change");
    }
    this.on("add", this._updateTimes);
    this.on("remove", this._updateTimes);
}

Model.Mashup.prototype = new Model.Playable();

Model.Mashup.prototype.updateTimes = function() {
    var _time = 0;
    this.segments.forEach(function(_segment) {
        _segment.setBegin(_time);
        _time = _segment.end;
    });
    this.duration.setMilliseconds(_time);
}

Model.Mashup.prototype.addAnnotation = function(_annotation, _defer) {
    var _mashedAnnotation = new Model.MashedAnnotation(this, _annotation),
        _defer = _defer || false;
    this.segments.push(_mashedAnnotation);
    _annotation.on("change-begin", this._updateTimes);
    _annotation.on("change-end", this._updateTimes);
    if (!_defer) {
        this.trigger("add");
    }
}

Model.Mashup.prototype.addAnnotationById = function(_elId, _defer) {
    var _annotation = this.source.getElement(_elId),
        _defer = _defer || false;
    if (typeof _annotation !== "undefined") {
        this.addAnnotation(_annotation, _defer);
    }
}

Model.Mashup.prototype.addAnnotations = function(_segments) {
    var _this = this;
    ns._(_segments).forEach(function(_segment) {
        _this.addAnnotation(_segment, true);
    });
    this.trigger("add");
}

Model.Mashup.prototype.addAnnotationsById = function(_segments) {
    var _this = this;
    ns._(_segments).forEach(function(_segment) {
        _this.addAnnotationById(_segment, true);
    });
    this.trigger("add");
}

Model.Mashup.prototype.removeAnnotation = function(_annotation, _defer) {
    var _defer = _defer || false;
    _annotation.off("change-begin", this._updateTimes);
    _annotation.off("change-end", this._updateTimes);
    this.segments.removeId(this.id + "_" + _annotation.id);
    if (!_defer) {
        this.trigger("remove");
    }
}

Model.Mashup.prototype.removeAnnotationById = function(_annId, _defer) {
    var _defer = _defer || false;
    var _annotation = this.source.getElement(_annId);

    if (_annotation) {
        this.removeAnnotation(_annotation, _defer);
    }
    if (!_defer) {
        this.trigger("remove");
    }
}

Model.Mashup.prototype.setAnnotations = function(_segments) {
    while (this.segments.length) {
        this.removeAnnotation(this.segments[0].annotation, true);
    }
    this.addAnnotations(_segments);
}

Model.Mashup.prototype.setAnnotationsById = function(_segments) {
    while (this.segments.length) {
        this.removeAnnotation(this.segments[0].annotation, true);
    }
    this.addAnnotationsById(_segments);
}

Model.Mashup.prototype.hasAnnotation = function(_annotation) {
    return !!ns._(this.segments).find(function(_s) {
        return _s.annotation === _annotation
    });
}

Model.Mashup.prototype.getAnnotation = function(_annotation) {
    return ns._(this.segments).find(function(_s) {
        return _s.annotation === _annotation
    });
}

Model.Mashup.prototype.getAnnotationById = function(_id) {
    return ns._(this.segments).find(function(_s) {
        return _s.annotation.id === _id
    });
}

Model.Mashup.prototype.getAnnotations = function() {
    return this.segments;
}

Model.Mashup.prototype.getOriginalAnnotations = function() {
    var annotations = new Model.List(this.source.directory);
    this.segments.forEach(function(_s) {
        annotations.push(_s.annotation);
    });
    return annotations;
}

Model.Mashup.prototype.getMedias = function() {
    var medias = new Model.List(this.source.directory);
    this.segments.forEach(function(_annotation) {
        medias.push(_annotation.getMedia())
    })
    return medias;
}

Model.Mashup.prototype.getAnnotationsByTypeTitle = function(_title) {
    var _annTypes = this.source.getAnnotationTypes().searchByTitle(_title).pluck("id");
    if (_annTypes.length) {
        return this.getAnnotations().filter(function(_annotation) {
            return ns._(_annTypes).indexOf(_annotation.getAnnotationType().id) !== -1;
        });
    } else {
        return new Model.List(this.source.directory)
    }
}

Model.Mashup.prototype.getAnnotationAtTime = function(_time) {
    var _list = this.segments.filter(function(_annotation) {
        return _annotation.begin <= _time && _annotation.end > _time;
    });
    if (_list.length) {
        return _list[0];
    } else {
        return undefined;
    }
}

Model.Mashup.prototype.getMediaAtTime = function(_time) {
    var _annotation = this.getAnnotationAtTime(_time);
    if (typeof _annotation !== "undefined") {
        return _annotation.getMedia();
    } else {
        return undefined;
    }
}

/* */

Model.Source = function(_config) {
    Model.Element.call(this, false, this);
    this.status = Model._SOURCE_STATUS_EMPTY;
    this.elementType = "source";
    if (typeof _config !== "undefined") {
        var _this = this;
        ns._(_config).forEach(function(_v, _k) {
            _this[_k] = _v;
        })
        this.callbackQueue = [];
        this.contents = {};
        this.get();
    }
}

Model.Source.prototype = new Model.Element();

Model.Source.prototype.addList = function(_listId, _contents) {
    if (typeof this.contents[_listId] === "undefined") {
        this.contents[_listId] = new Model.List(this.directory);
    }
    this.contents[_listId].addElements(_contents);
}

Model.Source.prototype.getList = function(_listId, _global) {
    _global = (typeof _global !== "undefined" && _global);
    if (_global) {
        return this.directory.getGlobalList().filter(function(_e) {
            return (_e.elementType === _listId);
        });
    } else {
        return this.contents[_listId] || new IriSP.Model.List(this.directory);
    }
}

Model.Source.prototype.forEach = function(_callback) {
    var _this = this;
    ns._(this.contents).forEach(function(_value, _key) {
        _callback.call(_this, _value, _key);
    })
}

Model.Source.prototype.getElement = function(_elId) {
    return this.directory.getElement(_elId);
}

Model.Source.prototype.get = function() {
    this.status = Model._SOURCE_STATUS_WAITING;
    this.handleCallbacks();
}

/* We defer the callbacks calls so they execute after the queue is cleared */
Model.Source.prototype.deferCallback = function(_callback) {
    var _this = this;
    ns._.defer(function() {
        _callback.call(_this);
    });
}

Model.Source.prototype.handleCallbacks = function() {
    this.status = Model._SOURCE_STATUS_READY;
    while (this.callbackQueue.length) {
        this.deferCallback(this.callbackQueue.splice(0,1)[0]);
    }
}
Model.Source.prototype.onLoad = function(_callback) {
    if (this.status === Model._SOURCE_STATUS_READY) {
        this.deferCallback(_callback);
    } else {
        this.callbackQueue.push(_callback);
    }
}

Model.Source.prototype.serialize = function() {
    return this.serializer.serialize(this);
}

Model.Source.prototype.deSerialize = function(_data) {
    this.serializer.deSerialize(_data, this);
}

Model.Source.prototype.getAnnotations = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("annotation", _global);
}

Model.Source.prototype.getMedias = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("media", _global);
}

Model.Source.prototype.getTags = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("tag", _global);
}

Model.Source.prototype.getMashups = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("mashup", _global);
}

Model.Source.prototype.getAnnotationTypes = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("annotationType", _global);
}

Model.Source.prototype.getAnnotationsByTypeTitle = function(_title, _global) {
    _global = (typeof _global !== "undefined" && _global);
    var _res = new Model.List(this.directory),
        _annTypes = this.getAnnotationTypes(_global).searchByTitle(_title);
    _annTypes.forEach(function(_annType) {
        _res.addElements(_annType.getAnnotations(_global));
    })
    return _res;
}

Model.Source.prototype.getDuration = function() {
    var _m = this.currentMedia;
    if (typeof _m !== "undefined") {
        return this.currentMedia.duration;
    }
}

Model.Source.prototype.getCurrentMedia = function(_opts) {
    if (typeof this.currentMedia === "undefined") {
        if (_opts.is_mashup) {
            var _mashups = this.getMashups();
            if (_mashups.length) {
                this.currentMedia = _mashups[0];
            }
        } else {
            var _medias = this.getMedias();
            if (_medias.length) {
                this.currentMedia = _medias[0];
            }
        }
    }
    return this.currentMedia;
}

Model.Source.prototype.merge = function(_source) {
    var _this = this;
    _source.forEach(function(_value, _key) {
        _this.getList(_key).addElements(_value);
    });
}

/* */

Model.RemoteSource = function(_config) {
    Model.Source.call(this, _config);
}

Model.RemoteSource.prototype = new Model.Source();

Model.RemoteSource.prototype.get = function() {
    this.status = Model._SOURCE_STATUS_WAITING;
    var _this = this,
        urlparams = this.url_params || {},
        dataType = (Model.isLocalURL(this.url) ? "json" : "jsonp");
    urlparams.format = dataType;
    ns.jQuery.ajax({
        url: this.url,
        dataType: dataType,
        data: urlparams,
        traditional: true,
        success: function(_result) {
            _this.deSerialize(_result);
            _this.handleCallbacks();
        }
    });
}

/* */

Model.Directory = function() {
    this.remoteSources = {};
    this.elements = {};
}

Model.Directory.prototype.remoteSource = function(_properties) {
    if (typeof _properties !== "object" || typeof _properties.url === "undefined") {
        throw "Error : Model.Directory.remoteSource(configuration): configuration.url is undefined";
    }
    var _config = ns._({ directory: this }).extend(_properties);
    _config.url_params = _config.url_params || {};
    var _hash = _config.url + "?" + ns.jQuery.param(_config.url_params);
    if (typeof this.remoteSources[_hash] === "undefined") {
        this.remoteSources[_hash] = new Model.RemoteSource(_config);
    }
    return this.remoteSources[_hash];
}

Model.Directory.prototype.newLocalSource = function(_properties) {
    var _config = ns._({ directory: this }).extend(_properties),
        _res = new Model.Source(_config);
    return _res;
}

Model.Directory.prototype.getElement = function(_id) {
    return this.elements[_id];
}

Model.Directory.prototype.addElement = function(_element) {
    this.elements[_element.id] = _element;
}

Model.Directory.prototype.getGlobalList = function() {
    var _res = new Model.List(this);
    _res.addIds(ns._(this.elements).keys());
    return _res;
}

return Model;

})(IriSP);

/* END model.js */

