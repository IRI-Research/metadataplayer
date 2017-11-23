/* Start ldt-serializer.js */

if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {};
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
                _res.meta = _data.meta;
                if (typeof _data.meta.img !== "undefined" && _data.meta.img.src !== "undefined") {
                    _res.thumbnail = _data.meta.img.src;
                }
                return _res;
            },
            serializer : function(_data, _source, _dest) {
                var _res = {
                    id : _data.id,
                    url : _data.video,
                    meta : {
                        "dc:title": _data.title || "",
                        "dc:description": _data.description || "",
                        "dc:created" : IriSP.Model.dateToIso(_data.created || _source.created),
                        "dc:modified" : IriSP.Model.dateToIso(_data.modified || _source.modified),
                        "dc:creator" : _data.creator || _source.creator,
                        "dc:contributor" : _data.contributor || _source.contributor || _data.creator || _source.creator,
                        "dc:duration" : _data.duration.milliseconds
                    }
                };
                IriSP._.defaults(_res.meta, _data.meta);
                _dest.medias.push(_res);
                var _list = {
                    id: IriSP.Model.getUID(),
                    meta : {
                        "dc:title": _data.title || "",
                        "dc:description": _data.description || "",
                        "dc:created" : IriSP.Model.dateToIso(_data.created || _source.created),
                        "dc:modified" : IriSP.Model.dateToIso(_data.modified || _source.modified),
                        "dc:creator" : _data.creator || _source.creator,
                        "dc:contributor" : _data.contributor || _source.contributor || _data.creator || _source.creator,
                        "id-ref": _data.id
                    },
                    items: _source.getAnnotationTypes().filter(function(_at) {
                        switch (typeof _at.media) {
                            case "object":
                                return (_at.media === _data);
                            case "string":
                                return (_at.media === _data.id);
                            default:
                                var _ann = _at.getAnnotations();
                                if (_ann) {
                                    for (var i = 0; i < _ann.length; i++) {
                                        if (_ann[i].getMedia() === _data) {
                                            return true;
                                        }
                                    }
                                }
                        }
                        return false;
                    }).map(function(_at) {
                        return {
                            "id-ref": _at.id
                        };
                    })
                };
                _dest.lists.push(_list);
                _dest.views[0].contents.push(_data.id);
            }
        },
        tag : {
            serialized_name : "tags",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.Tag(_data.id, _source);
                _res.title = _data.meta["dc:title"];
                return _res;        
            },
            serializer : function(_data, _source, _dest) {
                if (_source.regenerateTags && !_data.regenerated) {
                    return;
                }
                var _res = {
                    id : _data.id,
                    meta : {
                        "dc:title": _data.title || "",
                        "dc:description": _data.description || "",
                        "dc:created" : IriSP.Model.dateToIso(_data.created || _source.created),
                        "dc:modified" : IriSP.Model.dateToIso(_data.modified || _source.modified),
                        "dc:creator" : _data.creator || _source.creator,
                        "dc:contributor" : _data.contributor || _source.contributor || _data.creator || _source.creator
                    }
                };
                _dest.tags.push(_res);
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
            serializer : function(_data, _source, _dest) {
                var _res = {
                    id : _data.id,
                    "dc:title": _data.title || "",
                    "dc:description": _data.description || "",
                    "dc:created" : IriSP.Model.dateToIso(_data.created || _source.created),
                    "dc:modified" : IriSP.Model.dateToIso(_data.modified || _source.modified),
                    "dc:creator" : _data.creator || _source.creator,
                    "dc:contributor" : _data.contributor || _source.contributor || _data.creator || _source.creator
                };
                _dest["annotation-types"].push(_res);
                _dest.views[0].annotation_types.push(_data.id);
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
                _res.created = IriSP.Model.isoToDate(_data.created ? _data.created : _data.meta? _data.meta["dc:created"] : "");
                if (typeof _data.color !== "undefined") {
                    var _c = parseInt(_data.color).toString(16);
                    while (_c.length < 6) {
                        _c = '0' + _c;
                    }
                    _res.color = '#' + _c;
                }
                _res.content = _data.content;
                _res.setMedia(_data.media);
                _res.setAnnotationType(_data.meta["id-ref"]);
                _res.setTags(IriSP._(_data.tags).pluck("id-ref"));
                _res.keywords = _res.getTagTexts();
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
                _res.meta = _data.meta;
                return _res;
            },
            serializer : function(_data, _source, _dest) {
                var _color = parseInt(_data.color.replace(/^#/,''),16).toString();
                var _res = {
                    id : _data.id,
                    begin : _data.begin.milliseconds,
                    end : _data.end.milliseconds,
                    content : IriSP._.defaults(
                        {},
                        {
                            title : _data.title,
                            description : _data.description,
                        audio : _data.audio,
                        img: {
                            src: _data.thumbnail
                        }
                    },
                        _data.content,
                        {
                            title: "",
                            description: ""
                        }
                    ),
                    color: _color,
                    media : _data.media.id,
                    meta : {
                        "id-ref" : _data.getAnnotationType().id,
                        "dc:created" : IriSP.Model.dateToIso(_data.created || _source.created),
                        "dc:modified" : IriSP.Model.dateToIso(_data.modified || _source.modified),
                        "dc:creator" : _data.creator || _source.creator,
                        "dc:contributor" : _data.contributor || _source.contributor || _data.creator || _source.creator
//                        project : _source.projectId
                    }
                };
                if (_source.regenerateTags) {
                    _res.tags = IriSP._(_data.keywords).map(function(_kw) {
                        return {
                            "id-ref": _source.__keywords[_kw.toLowerCase()].id
                        };
                    });
                } else {
                    _res.tags = IriSP._(_data.tag.id).map(function(_id) {
                        return {
                           "id-ref" : _id
                       };
                    });
                }
                _res.content.title = _data.title || _res.content.title || "";
                IriSP._.defaults(_res.meta, _data.meta);
                _dest.annotations.push(_res);
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
                _res.creator = _data.meta["dc:creator"];
                _res.setAnnotationsById(_data.items);
                return _res;        
            },
            serializer : function(_data, _source, _dest) {
                var _res = {
                    meta : {
                        "dc:title": _data.title || "",
                        "dc:description": _data.description || "",
                        "dc:created" : IriSP.Model.dateToIso(_data.created || _source.created),
                        "dc:modified" : IriSP.Model.dateToIso(_data.modified || _source.modified),
                        "dc:creator" : _data.creator || _source.creator,
                        "dc:contributor" : _data.contributor || _source.contributor || _data.creator || _source.creator,
                        listtype: "mashup"
                    },
                    items: _data.segments.map(function(_annotation) {
                        return _annotation.annotation.id;
                    }),
                    id: _data.id
                };
                _dest.lists.push(_res);
            }
        }
    },
    serialize : function(_source) {
        var _res = {
                meta: {
                    "dc:creator": _source.creator,
                    "dc:contributor" : _source.contributor || _source.creator,
                    "dc:created": IriSP.Model.dateToIso(_source.created),
                    "dc:modified" : IriSP.Model.dateToIso(_source.modified),
                    "dc:title": _source.title || "",
                    "dc:description": _source.description || "",
                    id: _source.projectId || _source.id
                },
                views: [
                    {
                        id: IriSP.Model.getUID(),
                        contents: [],
                        annotation_types: []
                    }
                ],
                lists: [],
                "annotation-types": [],
                medias: [],
                tags: [],
                annotations: []
            },
            _this = this;
        if (_source.regenerateTags) {
            _source.__keywords = {};
            _source.getAnnotations().forEach(function(a) {
                IriSP._(a.keywords).each(function(kw) {
                    var lkw = kw.toLowerCase();
                    if (typeof _source.__keywords[lkw] === "undefined") {
                        _source.__keywords[lkw] = {
                            id: IriSP.Model.getUID(),
                            title: kw,
                            regenerated: true
                        };
                    }
                });
            });
            IriSP._(_source.__keywords).each(function(kw) {
                _this.types.tag.serializer(kw, _source, _res);
            });
        }
        _source.forEach(function(_list, _typename) {
            if (typeof _this.types[_typename] !== "undefined") {
                _list.forEach(function(_el) {
                    _this.types[_typename].serializer(_el, _source, _res);
                });
            }
        });
        return JSON.stringify(_res);
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
            _source.title = _data.meta["dc:title"] || _data.meta.title || "";
            _source.description = _data.meta["dc:description"] || _data.meta.description || "";
            _source.creator = _data.meta["dc:creator"] || _data.meta.creator || "";
            _source.contributor = _data.meta["dc:contributor"] || _data.meta.contributor || _source.creator;
            _source.created = IriSP.Model.isoToDate(_data.meta["dc:created"] || _data.meta.created);
        }
        
        if (typeof _data.meta !== "undefined" && typeof _data.meta.main_media !== "undefined" && typeof _data.meta.main_media["id-ref"] !== "undefined") {
            _source.currentMedia = _source.getElement(_data.meta.main_media["id-ref"]);
        }
    }
};

/* End of LDT Platform Serializer */
