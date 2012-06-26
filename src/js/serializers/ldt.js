/* LDT Platform Serializer */

if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {}
}

IriSP.serializers.ldt = {
    types :  {
        media : {
            serialized_name : "medias",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.Media(_data.id, _source);
                _res.video = (
                    typeof _data.url !== "undefined"
                    ? _data.url
                    : (
                        typeof _data.href !== "undefined"
                        ? _data.href
                        : null
                    )
                );
                if (typeof _data.meta.item !== "undefined" && _data.meta.item.name === "streamer") {
                    _res.streamer = _data.meta.item.value;
                }
                _res.title = _data.meta["dc:title"];
                _res.description = _data.meta["dc:description"];
                _res.setDuration(_data.meta["dc:duration"]);
                _res.url = _data.meta.url;
                if (typeof _data.meta.img !== "undefined" && _data.meta.img.src !== "undefined") {
                    _res.thumbnail = _data.meta.img.src;
                }
                return _res;        
            },
            serializer : function(_data, _source) {
                return {
                    id : _data.id,
                    url : _data.video,
                    meta : {
                        "dc:title" : _data.title,
                        "dc:description" : _data.description,
                        "dc:duration" : _data.duration.milliseconds
                    }
                }
            }
        },
        tag : {
            serialized_name : "tags",
            model_name : "tag",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.Tag(_data.id, _source);
                _res.title = _data.meta["dc:title"];
                return _res;        
            },
            serializer : function(_data, _source) {
                return {
                    id : _data.id,
                    meta : {
                        "dc:title" : _data.title
                    }
                }
            }
        },
        annotationType : {
            serialized_name : "annotation-types",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.AnnotationType(_data.id, _source);
                _res.title = _data["dc:title"];
                _res.description = _data["dc:description"];
                return _res;        
            },
            serializer : function(_data, _source) {
                return {
                    id : _data.id,
                    "dc:title" : _data.title,
                    "dc:description" : _data.description
                }
            }
        },
        annotation : {
            serialized_name : "annotations",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.Annotation(_data.id, _source);
                _res.title = _data.content.title || "";
                _res.description = _data.content.description || "";
                if (typeof _data.content.img !== "undefined" && _data.content.img.src !== "undefined") {
                    _res.thumbnail = _data.content.img.src;
                }
                _res.created = IriSP.Model.isoToDate(_data.meta["dc:created"]);
                if (typeof _data.color !== "undefined") {
                    var _c = parseInt(_data.color).toString(16);
                    while (_c.length < 6) {
                        _c = '0' + _c;
                    }
                    _res.color = '#' + _c;
                }
                _res.setMedia(_data.media);
                _res.setAnnotationType(_data.meta["id-ref"]);
                _res.setTags(IriSP._(_data.tags).pluck("id-ref"));
                _res.setBegin(_data.begin);
                _res.setEnd(_data.end);
                _res.creator = _data.meta["dc:creator"] || "";
                _res.project = _data.meta.project || "";
                if (typeof _data.meta["dc:source"] !== "undefined" && typeof _data.meta["dc:source"].content !== "undefined") {
                    _res.source = JSON.parse(_data.meta["dc:source"].content);
                }
                if (typeof _data.content.audio !== "undefined" && _data.content.audio.href) {
                    _res.audio = _data.content.audio;
                }
                return _res;
            },
            serializer : function(_data, _source) {
                return {
                    id : _data.id,
                    begin : _data.begin.milliseconds,
                    end : _data.end.milliseconds,
                    content : {
                        title : _data.title,
                        description : _data.description,
                        audio : _data.audio
                    },
                    media : _data.media.id,
                    meta : {
                        "id-ref" : _data.annotationType.id,
                        "dc:created" : IriSP.Model.dateToIso(_data.created),
                        "dc:creator" : _data.creator,
                        project : _source.projectId
                    },
                    tags : IriSP._(_data.tag.id).map(function(_id) {
                       return {
                           "id-ref" : _id
                       } 
                    })
                }
            }
        },
        mashup : {
            serialized_name : "lists",
            deserializer : function(_data, _source) {
                if (typeof _data.meta !== "object" || typeof _data.meta.listtype !== "string" || _data.meta.listtype !== "mashup") {
                    return undefined;
                }
                var _res = new IriSP.Model.Mashup(_data.id, _source);
                _res.title = _data.meta["dc:title"];
                _res.description = _data.meta["dc:description"];
                for (var _i = 0; _i < _data.items.length; _i++) {
                    _res.addSegmentById(_data.items[_i]);
                }
                return _res;        
            },
            serializer : function(_data, _source) {
                return {
                    meta : {
                        "dc:title": _data.title,
                        "dc:description": _data.description,
                        listtype: "mashup"
                    },
                    items: _data.segments.map(function(_annotation) {
                        return _id;
                    }),
                    id: _data.id
                }
            }
        }
    },
    serialize : function(_source) {
        var _res = {},
            _this = this;
        _source.forEach(function(_list, _typename) {
            if (typeof _this.types[_typename] !== "undefined") {
                _res[_this.types[_typename].serialized_name] = _list.map(function(_el) {
                    return _this.types[_typename].serializer(_el, _source);
                });
            }
        });
        return JSON.stringify(_res);
    },
    loadData : function(_url, _callback) {
        IriSP.jQuery.getJSON(_url, _callback)
    },
    deSerialize : function(_data, _source) {
        if (typeof _data !== "object" || _data === null) {
            return;
        }
        IriSP._(this.types).forEach(function(_type, _typename) {
            var _listdata = _data[_type.serialized_name],
                _list = new IriSP.Model.List(_source.directory);
            if (typeof _listdata !== "undefined" && _listdata !== null) {
                if (_listdata.hasOwnProperty("length")) {
                    var _l = _listdata.length;
                    for (var _i = 0; _i < _l; _i++) {
                        var _element = _type.deserializer(_listdata[_i], _source);
                        if (typeof _element !== "undefined" && _element) {
                            _list.push(_element);
                        }
                    }
                } else {
                    var _element = _type.deserializer(_listdata, _source);
                    if (typeof _element !== "undefined" && _element) {
                        _list.push(_element);
                    }
                }
            }
            _source.addList(_typename, _list);
        });
        
        if (typeof _data.meta !== "undefined") {
            _source.projectId = _data.meta.id;
        }
        
        if (typeof _data.meta !== "undefined" && typeof _data.meta.main_media !== "undefined" && typeof _data.meta.main_media["id-ref"] !== "undefined") {
            _source.mainMedia = _data.meta.main_media["id-ref"];
        }
    }
}

