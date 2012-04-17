/* model.js is where data is stored in a standard form, whatever the serializer */

IriSP.Model = {
    _SOURCE_STATUS_EMPTY : 0,
    _SOURCE_STATUS_WAITING : 1,
    _SOURCE_STATUS_READY : 2,
    _ID_AUTO_INCREMENT : 0,
    getAI : function() {
        return "autoid-" + (++this._ID_AUTO_INCREMENT);
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
    if (typeof _directory == "undefined") {
        throw("Error : new IriSP.Model.List(directory): directory is undefined");
    }
}

IriSP.Model.List.prototype = new Array();

IriSP.Model.List.prototype.getElement = function(_id) {
    if (this.hasId(_id)) {
        return this;
    }
}

IriSP.Model.List.prototype.hasId = function(_id) {
    return (IriSP._(this.idIndex).indexOf(_id) !== -1);
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

/* Array has a sort function, but it's not as interesting as Underscore.js's sortBy
 * and won't return a new IriSP.Model.List
 */
IriSP.Model.List.prototype.sortBy = function(_callback) {
    var _this = this,
        _res = new IriSP.Model.List(this.directory);
    _res.contents = IriSP._(this).sortBy(function(_value, _key) {
        return _callback(_value, _key, _this);
    });
    return _res;
}

/* Title and Description are basic information for (almost) all element types,
 * here we can search by these criteria
 */
IriSP.Model.List.prototype.searchByTitle = function(_text) {
    var _rgxp = new RegExp('(' + _text.replace(/(\W)/gm,'\\$1') + ')','gim');
    return this.filter(function(_element) {
        return _rgxp.test(_element.title);
    });
}

IriSP.Model.List.prototype.searchByDescription = function(_text) {
    var _rgxp = new RegExp('(' + _text.replace(/(\W)/gm,'\\$1') + ')','gim');
    return this.filter(function(_element) {
        return _rgxp.test(_element.description);
    });
}

IriSP.Model.List.prototype.searchByTextFields = function(_text) {
    var _rgxp = new RegExp('(' + _text.replace(/(\W)/gm,'\\$1') + ')','gim');
    return this.filter(function(_element) {
        return _rgxp.test(_element.description) || _rgxp.test(_element.title);
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
    if (typeof this.directory.getElement(_el.id) === "undefined") {
        this.directory.addElement(_el);
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
    var _l = _array.length,
        _this = this;
    IriSP._(_array).forEach(function(_el) {
        _this.push(_el);
    });
}

/* A simple time management object, that helps converting millisecs to seconds and strings,
 * without the clumsiness of the original Date object.
 */

IriSP.Model.Time = function(_milliseconds) {
    this.milliseconds = parseInt(typeof _milliseconds !== "undefined" ? _milliseconds : 0);
}

IriSP.Model.Time.prototype.setSeconds = function(_seconds) {
    this.milliseconds = 1000 * _seconds;
}

IriSP.Model.Time.prototype.getSeconds = function() {
    return Math.floor(this.milliseconds / 1000);
}

IriSP.Model.Time.prototype.getHMS = function() {
    var _totalSeconds = Math.abs(this.getSeconds());
    return {
        hours : Math.floor(_totalSeconds / 3600),
        minutes : (Math.floor(_totalSeconds / 60) % 60),
        seconds : _totalSeconds % 60
    } 
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
    if (typeof _idRef === "object") {
        this.isList = true;
        this.contents = new IriSP.Model.List(this.source.directory);
        this.contents.addIds(IriSP._(_idRef).map(function(_id) {
            return _source.getNamespaced(_id).fullname;
        }));
    } else {
        this.isList = false;
        this.contents = this.source.directory.getElement(_source.getNamespaced(_idRef).fullname);
    }
}

/* */

IriSP.Model.Element = function(_id, _source) {
    this.elementType = 'element';
    if (typeof _source !== "undefined") {
        if (typeof _id === "undefined" || !_id) {
            _id = IriSP.Model.getAI();
        }
        this.source = _source;
        this.id = _source.getNamespaced(_id).fullname;
        this.title = "";
        this.description = "";
        this.source.directory.addElement(this);
    }
}

IriSP.Model.Element.prototype.toString = function() {
    return this.elementType + (this.elementType !== 'element' ? ', id=' + this.id + ', title="' + this.title + '"' : '');
}

IriSP.Model.Element.prototype.setReference = function(_elementType, _idRef) {
    this[_elementType] = new IriSP.Model.Reference(this.source, _idRef);
}

IriSP.Model.Element.prototype.getReference = function(_elementType) {
    if (typeof this[_elementType] !== "undefined") {
        return this[_elementType].contents;
    }
}

IriSP.Model.Element.prototype.getRelated = function(_elementType) {
    var _this = this;
    return this.source.getList(_elementType).filter(function(_el) {
        var _ref = _el[_this.elementType];
        if (_ref.isList) {
            return _ref.contents.hasId(_this.id);
        }
        else {
            return _ref.contents.id === _this.id;
        }
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
    this.duration.milliseconds = _durationMs;
}

IriSP.Model.Media.prototype.getAnnotations = function() {
    return this.getRelated("annotation");
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
    this.begin.milliseconds = _beginMs;
}

IriSP.Model.Annotation.prototype.setEnd = function(_beginMs) {
    this.end.milliseconds = _beginMs;
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
        if (typeof this.namespace === "undefined") {
            this.namespace = IriSP.Model.getAI();
        }
        if (typeof this.namespaceUrl === "undefined") {
            this.namespaceUrl = (typeof this.url !== "undefined" ? this.url : this.namespaceUrl);
        }
        this.directory.namespaces[this.namespace] = this.namespaceUrl;
        this.get();
    }
}

IriSP.Model.Source.prototype.getNamespaced = function(_id) {
    var _tab = _id.split(':');
    if (_tab.length > 1) {
        return {
            namespace : _tab[0],
            name : _tab[1],
            fullname : _id
        }
    } else {
        return {
            namespace : this.namespace,
            name : _id,
            fullname : this.namespace + ':' + _id
        }
    }
}
    
IriSP.Model.Source.prototype.unNamespace = function(_id) {
    return _id.replace(this.namespace + ':', '');
}

IriSP.Model.Source.prototype.addList = function(_listId, _contents) {
    if (typeof this.contents[_listId] === "undefined") {
        this.contents[_listId] = new IriSP.Model.List(this.directory);
    }
    this.contents[_listId].addElements(_contents);
}

IriSP.Model.Source.prototype.getList = function(_listId) {
    if (typeof this.contents[_listId] === "undefined") {
        return this.directory.getGlobalList().filter(function(_e) {
            return (_e.elType === _listId);
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

IriSP.Model.Source.prototype.setCurrentMediaId = function(_idRef) {
    if (typeof _idRef !== "undefined") {
        this.currentMedia = this.getMedias().getElement(this.getNamespaced(_idRef).fullname);
    }
}

IriSP.Model.Source.prototype.setDefaultCurrentMedia = function() {
    if (typeof this.currentMedia === "undefined" && this.getMedias().length) {
        this.currentMedia = this.getMedias()[0];
    }
}

IriSP.Model.Source.prototype.listNamespaces = function(_excludeSelf) {
    var _this = this,
        _nsls = [],
        _excludeSelf = (typeof _excludeSelf !== "undefined" && _excludeSelf);
    this.forEach(function(_list) {
        IriSP._(_list).forEach(function(_el) {
            var _ns = _el.id.replace(/:.*$/,'');
            if (IriSP._(_nsls).indexOf(_ns) === -1 && (!_excludeSelf || _ns !== _this.namespace)) {
                _nsls.push(_ns);
            }
        })
    });
    return _nsls;
}

IriSP.Model.Source.prototype.get = function() {
    this.status = IriSP.Model._SOURCE_STATUS_READY;
    var _this = this;
    if (_this.callbackQueue.length) {
        IriSP._(_this.callbackQueue).forEach(function(_callback) {
            _callback.call(_this);
        });
    }
    _this.callbackQueue = [];
}

IriSP.Model.Source.prototype.serialize = function() {
    return this.serializer.serialize(this);
}

IriSP.Model.Source.prototype.onLoad = function(_callback) {
    if (this.status === IriSP.Model._SOURCE_STATUS_READY) {
        console.log("Called on load, Ready");
        var _this = this;
        IriSP._.defer(function() {
            _callback.call(_this);
        });        
    } else {
        console.log("Called on load, not ready");
        this.callbackQueue.push(_callback);
    }
}

IriSP.Model.Source.prototype.getAnnotations = function() {
    return this.getList("annotation");
}

IriSP.Model.Source.prototype.getMedias = function() {
    return this.getList("media");
}

IriSP.Model.Source.prototype.getAnnotationTypes = function() {
    return this.getList("annotationType");
}

IriSP.Model.Source.prototype.getAnnotationTypeByTitle = function(_title) {
    var _res = this.getAnnotationTypes().searchByTitle(_title);
    if (_res.length) {
        return _res[0];
    }
}

IriSP.Model.Source.prototype.getDuration = function() {
    var _m = this.currentMedia;
    if (typeof _m !== "undefined") {
        return this.currentMedia.duration;
    }
}

/* */

IriSP.Model.RemoteSource = function(_config) {
    IriSP.Model.Source.call(this, _config);
}

IriSP.Model.RemoteSource.prototype = new IriSP.Model.Source();

IriSP.Model.RemoteSource.prototype.get = function() {
    this.status = IriSP.Model._SOURCE_STATUS_WAITING;
    var _this = this;
    IriSP.jQuery.getJSON(this.url, function(_result) {
        _this.serializer.deSerialize(_result, _this);
        console.log('Received data, we have '+_this.callbackQueue.length+' callbacks waiting');
        if (_this.callbackQueue.length) {
            IriSP._(_this.callbackQueue).forEach(function(_callback) {
                _callback.call(_this);
            });
        }
        _this.callbackQueue = [];
        _this.status = IriSP.Model._SOURCE_STATUS_READY;
    });
}

/* */

IriSP.Model.Directory = function() {
    this.remoteSources = {};
    this.elements = {};
    this.namespaces = {};
}

IriSP.Model.Directory.prototype.remoteSource = function(_properties) {
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
