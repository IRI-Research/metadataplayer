/* TODO: Separate Project-specific data from Source */

/* model.js is where data is stored in a standard form, whatever the serializer */

IriSP.Model = {
    _SOURCE_STATUS_EMPTY : 0,
    _SOURCE_STATUS_WAITING : 1,
    _SOURCE_STATUS_READY : 2,
    _ID_AUTO_INCREMENT : 0,
    _ID_BASE : (function(_d) {
        function pad(n){return n<10 ? '0'+n : n}
        function fillrand(n) {
            var _res = ''
            for (var i=0; i<n; i++) {
                _res += Math.floor(16*Math.random()).toString(16);
            }
            return _res;
        }
        return _d.getUTCFullYear() + '-'  
            + pad(_d.getUTCMonth()+1) + '-'  
            + pad(_d.getUTCDate()) + '-'
            + fillrand(16);
    })(new Date()),
    getUID : function() {
        var _n = (++this._ID_AUTO_INCREMENT).toString();
        while (_n.length < 4) {
            _n = '0' + _n
        }
        return "autoid-" + this._ID_BASE + '-' + _n;
    },
    regexpFromTextOrArray : function(_textOrArray, _testOnly) {
        var _testOnly = _testOnly || false;
        function escapeText(_text) {
            return _text.replace(/([\\\*\+\?\|\{\[\}\]\(\)\^\$\.\#\/])/gm, '\\$1');
        }
        var _source = 
            typeof _textOrArray === "string"
            ? escapeText(_textOrArray)
            : IriSP._(_textOrArray).map(escapeText).join("|");
        if (_testOnly) {
            return new RegExp( _source, 'im');
        } else {
            return new RegExp( '(' + _source + ')', 'gim');
        }
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
    dateToIso : function(d) {
        function pad(n){return n<10 ? '0'+n : n}  
        return d.getUTCFullYear()+'-'  
            + pad(d.getUTCMonth()+1)+'-'  
            + pad(d.getUTCDate())+'T'  
            + pad(d.getUTCHours())+':'  
            + pad(d.getUTCMinutes())+':'  
            + pad(d.getUTCSeconds())+'Z'  
    }
}

/*
 * IriSP.Model.List is a class for a list of elements (e.g. annotations, medias, etc. that each have a distinct ID)
 */
IriSP.Model.List = function(_directory) {
    Array.call(this);
    this.directory = _directory;
    this.idIndex = [];
    this.__events = {};
    if (typeof _directory == "undefined") {
        console.trace();
        throw "Error : new IriSP.Model.List(directory): directory is undefined";
    }
}

IriSP.Model.List.prototype = new Array();

IriSP.Model.List.prototype.hasId = function(_id) {
    return IriSP._(this.idIndex).include(_id);
}

/* On recent browsers, forEach and map are defined and do what we want.
 * Otherwise, we'll use the Underscore.js functions
 */
if (typeof Array.prototype.forEach === "undefined") {
    IriSP.Model.List.prototype.forEach = function(_callback) {
        var _this = this;
        IriSP._(this).forEach(function(_value, _key) {
            _callback(_value, _key, _this);
        });
    }
}

if (typeof Array.prototype.map === "undefined") {
    IriSP.Model.List.prototype.map = function(_callback) {
        var _this = this;
        return IriSP._(this).map(function(_value, _key) {
            return _callback(_value, _key, _this);
        });
    }
}

IriSP.Model.List.prototype.pluck = function(_key) {
    return this.map(function(_value) {
        return _value[_key];
    });
}

/* We override Array's filter function because it doesn't return an IriSP.Model.List
 */
IriSP.Model.List.prototype.filter = function(_callback) {
    var _this = this,
        _res = new IriSP.Model.List(this.directory);
    _res.addElements(IriSP._(this).filter(function(_value, _key) {
        return _callback(_value, _key, _this);
    }));
    return _res;
}

IriSP.Model.List.prototype.slice = function(_start, _end) {
    var _res = new IriSP.Model.List(this.directory);
    _res.addElements(Array.prototype.slice.call(this, _start, _end));
    return _res;
}

IriSP.Model.List.prototype.splice = function(_start, _end) {
    var _res = new IriSP.Model.List(this.directory);
    _res.addElements(Array.prototype.splice.call(this, _start, _end));
    this.idIndex.splice(_start, _end);
    return _res;
}

/* Array has a sort function, but it's not as interesting as Underscore.js's sortBy
 * and won't return a new IriSP.Model.List
 */
IriSP.Model.List.prototype.sortBy = function(_callback) {
    var _this = this,
        _res = new IriSP.Model.List(this.directory);
    _res.addElements(IriSP._(this).sortBy(function(_value, _key) {
        return _callback(_value, _key, _this);
    }));
    return _res;
}

/* Title and Description are basic information for (almost) all element types,
 * here we can search by these criteria
 */
IriSP.Model.List.prototype.searchByTitle = function(_text) {
    var _rgxp = IriSP.Model.regexpFromTextOrArray(_text, true);
    return this.filter(function(_element) {
        return _rgxp.test(_element.title);
    });
}

IriSP.Model.List.prototype.searchByDescription = function(_text) {
    var _rgxp = IriSP.Model.regexpFromTextOrArray(_text, true);
    return this.filter(function(_element) {
        return _rgxp.test(_element.description);
    });
}

IriSP.Model.List.prototype.searchByTextFields = function(_text) {
    var _rgxp =  IriSP.Model.regexpFromTextOrArray(_text, true);
    return this.filter(function(_element) {
        return _rgxp.test(_element.description) || _rgxp.test(_element.title);
    });
}

IriSP.Model.List.prototype.getTitles = function() {
    return this.map(function(_el) {
        return _el.title;
    });
}

IriSP.Model.List.prototype.addId = function(_id) {
    var _el = this.directory.getElement(_id)
    if (!this.hasId(_id) && typeof _el !== "undefined") {
        this.idIndex.push(_id);
        Array.prototype.push.call(this, _el);
    }
}

IriSP.Model.List.prototype.push = function(_el) {
    if (typeof _el === "undefined") {
        return;
    }
    var _index = (IriSP._(this.idIndex).indexOf(_el.id));
    if (_index === -1) {
        this.idIndex.push(_el.id);
        Array.prototype.push.call(this, _el);
    } else {
        this[_index] = _el;
    }
}

IriSP.Model.List.prototype.addIds = function(_array) {
    var _l = _array.length,
        _this = this;
    IriSP._(_array).forEach(function(_id) {
        _this.addId(_id);
    });
}

IriSP.Model.List.prototype.addElements = function(_array) {
    var _this = this;
    IriSP._(_array).forEach(function(_el) {
        _this.push(_el);
    });
}

IriSP.Model.List.prototype.removeId = function(_id, _deleteFromDirectory) {
    var _deleteFromDirectory = _deleteFromDirectory || false,
        _index = (IriSP._(this.idIndex).indexOf(_id));
    if (_index !== -1) {
        this.splice(_index,1);
    }
    if (_deleteFromDirectory) {
        delete this.directory.elements[_id];
    }
}

IriSP.Model.List.prototype.removeElement = function(_el, _deleteFromDirectory) {
    var _deleteFromDirectory = _deleteFromDirectory || false;
    this.removeId(_el.id);
}

IriSP.Model.List.prototype.removeIds = function(_list, _deleteFromDirectory) {
    var _deleteFromDirectory = _deleteFromDirectory || false,
        _this = this;
    IriSP._(_list).forEach(function(_id) {
        _this.removeId(_id);
    });
}

IriSP.Model.List.prototype.removeElements = function(_list, _deleteFromDirectory) {
    var _deleteFromDirectory = _deleteFromDirectory || false,
        _this = this;
    IriSP._(_list).forEach(function(_el) {
        _this.removeElement(_el);
    });
}

IriSP.Model.List.prototype.on = function(_event, _callback) {
    if (typeof this.__events[_event] === "undefined") {
        this.__events[_event] = [];
    }
    this.__events[_event].push(_callback);
}

IriSP.Model.List.prototype.trigger = function(_event, _data) {
    var _list = this;
    IriSP._(this.__events[_event]).each(function(_callback) {
        _callback.call(_list, _data);
    });
}

/* A simple time management object, that helps converting millisecs to seconds and strings,
 * without the clumsiness of the original Date object.
 */

IriSP.Model.Time = function(_milliseconds) {
    this.milliseconds = 0;
    this.setMilliseconds(_milliseconds);
}

IriSP.Model.Time.prototype.setMilliseconds = function(_milliseconds) {
    var _ante = _milliseconds;
    switch(typeof _milliseconds) {
        case "string":
            this.milliseconds = parseFloat(_milliseconds);
            break;
        case "number":
            this.milliseconds = _milliseconds;
            break;
        case "object":
            this.milliseconds = parseFloat(_milliseconds.valueOf());
            break;
        default:
            this.milliseconds = 0;
    }
    if (this.milliseconds === NaN) {
        this.milliseconds = _ante;
    }
}

IriSP.Model.Time.prototype.setSeconds = function(_seconds) {
    this.milliseconds = 1000 * _seconds;
}

IriSP.Model.Time.prototype.getSeconds = function() {
    return this.milliseconds / 1000;
}

IriSP.Model.Time.prototype.getHMS = function() {
    var _totalSeconds = Math.abs(Math.floor(this.getSeconds()));
    return {
        hours : Math.floor(_totalSeconds / 3600),
        minutes : (Math.floor(_totalSeconds / 60) % 60),
        seconds : _totalSeconds % 60
    } 
}

IriSP.Model.Time.prototype.add = function(_milliseconds) {
    this.milliseconds += new IriSP.Model.Time(_milliseconds).milliseconds;
}

IriSP.Model.Time.prototype.valueOf = function() {
    return this.milliseconds;
}

IriSP.Model.Time.prototype.toString = function() {
    function pad(_n) {
        var _res = _n.toString();
        while (_res.length < 2) {
            _res = '0' + _res;
        }
        return _res;
    }
    var _hms = this.getHMS(),
        _res = '';
    if (_hms.hours) {
        _res += pad(_hms.hours) + ':'
    }
    _res += pad(_hms.minutes) + ':' + pad(_hms.seconds);
    return _res;
}

/* IriSP.Model.Reference handles references between elements
 */

IriSP.Model.Reference = function(_source, _idRef) {
    this.source = _source;
    this.id = _idRef;
    if (typeof _idRef === "object") {
        this.isList = true;
    } else {
        this.isList = false;
    }
    this.refresh();
}

IriSP.Model.Reference.prototype.refresh = function() {
    if (this.isList) {
        this.contents = new IriSP.Model.List(this.source.directory);
        this.contents.addIds(this.id);
    } else {
        this.contents = this.source.directory.getElement(this.id);
    }
    
}

IriSP.Model.Reference.prototype.getContents = function() {
    if (typeof this.contents === "undefined" || (this.isList && this.contents.length != this.id.length)) {
        this.refresh();
    }
    return this.contents;
}

IriSP.Model.Reference.prototype.isOrHasId = function(_idRef) {
    if (this.isList) {
        return (IriSP._(this.id).indexOf(_idRef) !== -1)
    } else {
        return (this.id == _idRef);
    }
}

/* */

IriSP.Model.Element = function(_id, _source) {
    this.elementType = 'element';
    if (typeof _source === "undefined") {
        return;
    }
    if (typeof _id === "undefined" || !_id) {
        _id = IriSP.Model.getUID();
    }
    this.source = _source;
    this.id = _id;
    this.title = "";
    this.description = "";
    this.__events = {}
    this.source.directory.addElement(this);
}

IriSP.Model.Element.prototype.toString = function() {
    return this.elementType + (this.elementType !== 'element' ? ', id=' + this.id + ', title="' + this.title + '"' : '');
}

IriSP.Model.Element.prototype.setReference = function(_elementType, _idRef) {
    this[_elementType] = new IriSP.Model.Reference(this.source, _idRef);
}

IriSP.Model.Element.prototype.getReference = function(_elementType) {
    if (typeof this[_elementType] !== "undefined") {
        return this[_elementType].getContents();
    }
}

IriSP.Model.Element.prototype.getRelated = function(_elementType, _global) {
    _global = (typeof _global !== "undefined" && _global);
    var _this = this;
    return this.source.getList(_elementType, _global).filter(function(_el) {
        var _ref = _el[_this.elementType];
        return _ref.isOrHasId(_this.id);
    });
}

IriSP.Model.Element.prototype.on = function(_event, _callback) {
    if (typeof this.__events[_event] === "undefined") {
        this.__events[_event] = [];
    }
    this.__events[_event].push(_callback);
}

IriSP.Model.Element.prototype.trigger = function(_event, _data) {
    var _element = this;
    IriSP._(this.__events[_event]).each(function(_callback) {
        _callback.call(_element, _data);
    });
}

/* */

IriSP.Model.Media = function(_id, _source) {
    IriSP.Model.Element.call(this, _id, _source);
    this.elementType = 'media';
    this.duration = new IriSP.Model.Time();
    this.video = '';
}

IriSP.Model.Media.prototype = new IriSP.Model.Element();

IriSP.Model.Media.prototype.setDuration = function(_durationMs) {
    this.duration.setMilliseconds(_durationMs);
}

IriSP.Model.Media.prototype.getAnnotations = function() {
    return this.getRelated("annotation");
}

IriSP.Model.Media.prototype.getAnnotationsByTypeTitle = function(_title) {
    var _annTypes = this.source.getAnnotationTypes().searchByTitle(_title).pluck("id");
    if (_annTypes.length) {
        return this.getAnnotations().filter(function(_annotation) {
            return IriSP._(_annTypes).indexOf(_annotation.getAnnotationType().id) !== -1;
        });
    } else {
        return new IriSP.Model.List(this.source.directory)
    }
}

/* */

IriSP.Model.Tag = function(_id, _source) {
    IriSP.Model.Element.call(this, _id, _source);
    this.elementType = 'tag';
}

IriSP.Model.Tag.prototype = new IriSP.Model.Element();

IriSP.Model.Tag.prototype.getAnnotations = function() {
    return this.getRelated("annotation");
}

/* */

IriSP.Model.AnnotationType = function(_id, _source) {
    IriSP.Model.Element.call(this, _id, _source);
    this.elementType = 'annotationType';
}

IriSP.Model.AnnotationType.prototype = new IriSP.Model.Element();

IriSP.Model.AnnotationType.prototype.getAnnotations = function() {
    return this.getRelated("annotation");
}

/* Annotation
 * */

IriSP.Model.Annotation = function(_id, _source) {
    IriSP.Model.Element.call(this, _id, _source);
    this.elementType = 'annotation';
    this.begin = new IriSP.Model.Time();
    this.end = new IriSP.Model.Time();
}

IriSP.Model.Annotation.prototype = new IriSP.Model.Element(null);

IriSP.Model.Annotation.prototype.setBegin = function(_beginMs) {
    this.begin.setMilliseconds(_beginMs);
}

IriSP.Model.Annotation.prototype.setEnd = function(_beginMs) {
    this.end.setMilliseconds(_beginMs);
}

IriSP.Model.Annotation.prototype.setMedia = function(_idRef) {
    this.setReference("media", _idRef);
}

IriSP.Model.Annotation.prototype.getMedia = function() {
    return this.getReference("media");
}

IriSP.Model.Annotation.prototype.setAnnotationType = function(_idRef) {
    this.setReference("annotationType", _idRef);
}

IriSP.Model.Annotation.prototype.getAnnotationType = function() {
    return this.getReference("annotationType");
}

IriSP.Model.Annotation.prototype.setTags = function(_idRefs) {
    this.setReference("tag", _idRefs);
}

IriSP.Model.Annotation.prototype.getTags = function() {
    return this.getReference("tag");
}

IriSP.Model.Annotation.prototype.getTagTexts = function() {
    return this.getTags().getTitles();
}

IriSP.Model.Annotation.prototype.getDuration = function() {
    return new IriSP.Model.Time(this.end.milliseconds - this.begin.milliseconds)
}

/* */

IriSP.Model.MashedAnnotation = function(_mashup, _annotation) {
    IriSP.Model.Element.call(this, _mashup.id + "_" + _annotation.id, _annotation.source);
    this.elementType = 'mashedAnnotation';
    this.annotation = _annotation;
    this.begin = new IriSP.Model.Time(_mashup.duration);
    this.end = new IriSP.Model.Time(_mashup.duration + _annotation.getDuration());
    this.title = this.annotation.title;
    this.description = this.annotation.description;
    this.color = this.annotation.color;
}

IriSP.Model.MashedAnnotation.prototype = new IriSP.Model.Element(null);

IriSP.Model.MashedAnnotation.prototype.getMedia = function() {
    return this.annotation.getReference("media");
}

IriSP.Model.MashedAnnotation.prototype.getAnnotationType = function() {
    return this.annotation.getReference("annotationType");
}

IriSP.Model.MashedAnnotation.prototype.getTags = function() {
    return this.annotation.getReference("tag");
}

IriSP.Model.MashedAnnotation.prototype.getTagTexts = function() {
    return this.annotation.getTags().getTitles();
}

IriSP.Model.MashedAnnotation.prototype.getDuration = function() {
    return this.annotation.getDuration();
}

/* */

IriSP.Model.Mashup = function(_id, _source) {
    IriSP.Model.Element.call(this, _id, _source);
    this.elementType = 'mashup';
    this.duration = new IriSP.Model.Time();
    this.segments = new IriSP.Model.List(_source.directory);
    this.medias = new IriSP.Model.List(_source.directory);
}

IriSP.Model.Mashup.prototype = new IriSP.Model.Element();

IriSP.Model.Mashup.prototype.addSegment = function(_annotation) {
    var _mashedAnnotation = new IriSP.Model.MashedAnnotation(this, _annotation);
    this.duration.setMilliseconds(_mashedAnnotation.end);
    this.segments.push(_mashedAnnotation);
    this.medias.push(_annotation.getMedia());
}

IriSP.Model.Mashup.prototype.addSegmentById = function(_elId) {
    var _annotation = this.source.getElement(_elId);
    if (typeof _annotation !== "undefined") {
        this.addSegment(_annotation);
    }
}

IriSP.Model.Mashup.prototype.getAnnotations = function() {
    return this.segments;
}

IriSP.Model.Mashup.prototype.getMedias = function() {
    return this.medias;
}

IriSP.Model.Mashup.prototype.getAnnotationsByTypeTitle = function(_title) {
    var _annTypes = this.source.getAnnotationTypes().searchByTitle(_title).pluck("id");
    if (_annTypes.length) {
        return this.getAnnotations().filter(function(_annotation) {
            return IriSP._(_annTypes).indexOf(_annotation.getAnnotationType().id) !== -1;
        });
    } else {
        return new IriSP.Model.List(this.source.directory)
    }
}

IriSP.Model.Mashup.prototype.getAnnotationAtTime = function(_time) {
    var _list = this.segments.filter(function(_annotation) {
        return _annotation.begin <= _time && _annotation.end > _time;
    });
    if (_list.length) {
        return _list[0];
    } else {
        return undefined;
    }
}

IriSP.Model.Mashup.prototype.getMediaAtTime = function(_time) {
    var _annotation = this.getAnnotationAtTime(_time);
    if (typeof _annotation !== "undefined") {
        return _annotation.getMedia();
    } else {
        return undefined;
    }
}

/* */

IriSP.Model.Source = function(_config) {
    this.status = IriSP.Model._SOURCE_STATUS_EMPTY;
    if (typeof _config !== "undefined") {
        var _this = this;
        IriSP._(_config).forEach(function(_v, _k) {
            _this[_k] = _v;
        })
        this.callbackQueue = [];
        this.contents = {};
        this.get();
    }
}

IriSP.Model.Source.prototype.addList = function(_listId, _contents) {
    if (typeof this.contents[_listId] === "undefined") {
        this.contents[_listId] = new IriSP.Model.List(this.directory);
    }
    this.contents[_listId].addElements(_contents);
}

IriSP.Model.Source.prototype.getList = function(_listId, _global) {
    _global = (typeof _global !== "undefined" && _global);
    if (_global || typeof this.contents[_listId] === "undefined") {
        return this.directory.getGlobalList().filter(function(_e) {
            return (_e.elementType === _listId);
        });
    } else {
        return this.contents[_listId];
    }
}

IriSP.Model.Source.prototype.forEach = function(_callback) {
    var _this = this;
    IriSP._(this.contents).forEach(function(_value, _key) {
        _callback.call(_this, _value, _key);
    })
}

IriSP.Model.Source.prototype.getElement = function(_elId) {
    return this.directory.getElement(_elId);
}

IriSP.Model.Source.prototype.get = function() {
    this.status = IriSP.Model._SOURCE_STATUS_WAITING;
    this.handleCallbacks();
}

/* We defer the callbacks calls so they execute after the queue is cleared */
IriSP.Model.Source.prototype.deferCallback = function(_callback) {
    var _this = this;
    IriSP._.defer(function() {
        _callback.call(_this);
    });
}

IriSP.Model.Source.prototype.handleCallbacks = function() {
    this.status = IriSP.Model._SOURCE_STATUS_READY;
    while (this.callbackQueue.length) {
        this.deferCallback(this.callbackQueue.splice(0,1)[0]);
    }
}
IriSP.Model.Source.prototype.onLoad = function(_callback) {
    if (this.status === IriSP.Model._SOURCE_STATUS_READY) {
        this.deferCallback(_callback);
    } else {
        this.callbackQueue.push(_callback);
    }
}

IriSP.Model.Source.prototype.serialize = function() {
    return this.serializer.serialize(this);
}

IriSP.Model.Source.prototype.deSerialize = function(_data) {
    this.serializer.deSerialize(_data, this);
}

IriSP.Model.Source.prototype.getAnnotations = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("annotation", _global);
}

IriSP.Model.Source.prototype.getMedias = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("media", _global);
}

IriSP.Model.Source.prototype.getTags = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("tag", _global);
}

IriSP.Model.Source.prototype.getMashups = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("mashup", _global);
}

IriSP.Model.Source.prototype.getAnnotationTypes = function(_global) {
    _global = (typeof _global !== "undefined" && _global);
    return this.getList("annotationType", _global);
}

IriSP.Model.Source.prototype.getAnnotationsByTypeTitle = function(_title, _global) {
    _global = (typeof _global !== "undefined" && _global);
    var _res = new IriSP.Model.List(this.directory),
        _annTypes = this.getAnnotationTypes(_global).searchByTitle(_title);
    _annTypes.forEach(function(_annType) {
        _res.addElements(_annType.getAnnotations(_global));
    })
    return _res;
}

IriSP.Model.Source.prototype.getDuration = function() {
    var _m = this.currentMedia;
    if (typeof _m !== "undefined") {
        return this.currentMedia.duration;
    }
}

IriSP.Model.Source.prototype.merge = function(_source) {
    var _this = this;
    _source.forEach(function(_value, _key) {
        _this.getList(_key).addElements(_value);
    });
}

/* */

IriSP.Model.RemoteSource = function(_config) {
    IriSP.Model.Source.call(this, _config);
}

IriSP.Model.RemoteSource.prototype = new IriSP.Model.Source();

IriSP.Model.RemoteSource.prototype.get = function() {
    this.status = IriSP.Model._SOURCE_STATUS_WAITING;
    var _this = this;
    this.serializer.loadData(this.url, function(_result) {
        _this.deSerialize(_result);
        _this.handleCallbacks();
    });
}

/* */

IriSP.Model.Directory = function() {
    this.remoteSources = {};
    this.elements = {};
}

IriSP.Model.Directory.prototype.remoteSource = function(_properties) {
    if (typeof _properties !== "object" || typeof _properties.url === "undefined") {
        throw "Error : IriSP.Model.Directory.remoteSource(configuration): configuration.url is undefined";
    }
    var _config = IriSP._({ directory: this }).extend(_properties);
    if (typeof this.remoteSources[_properties.url] === "undefined") {
        this.remoteSources[_properties.url] = new IriSP.Model.RemoteSource(_config);
    }
    return this.remoteSources[_properties.url];
}

IriSP.Model.Directory.prototype.newLocalSource = function(_properties) {
    var _config = IriSP._({ directory: this }).extend(_properties),
        _res = new IriSP.Model.Source(_config);
    return _res;
}

IriSP.Model.Directory.prototype.getElement = function(_id) {
    return this.elements[_id];
}

IriSP.Model.Directory.prototype.addElement = function(_element) {
    this.elements[_element.id] = _element;
}

IriSP.Model.Directory.prototype.getGlobalList = function() {
    var _res = new IriSP.Model.List(this);
    _res.addIds(IriSP._(this.elements).keys());
    return _res;
}

/* */