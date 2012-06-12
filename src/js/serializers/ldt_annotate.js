/* Used when Putting annotations on the platform */

if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {}
}

IriSP.serializers.ldt_annotate = {
    types :  {
        annotation : {
            serialized_name : "annotations",
            serializer : function(_data, _source) {
                var _annType = _data.getAnnotationType();
                return {
                    begin: _data.begin.milliseconds,
                    end: _data.end.milliseconds,
                    content: {
                        data: _data.description,
                        audio: _data.audio
                    },
                    tags: _data.getTagTexts(),
                    media: _data.getMedia().id,
                    title: _data.title,
                    type_title: _annType.title,
                    type: ( typeof _annType.dont_send_id !== "undefined" && _annType.dont_send_id ? "" : _annType.id )
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
        _res.meta = {
            creator: _source.creator,
            created: _source.created
        }
        return JSON.stringify(_res);
    },
    deSerialize : function(_data, _source) {
        if (typeof _data == "string") {
            _data = JSON.parse(_data);
        }
        _source.addList('tag', new IriSP.Model.List(_source.directory));
        _source.addList('annotationType', new IriSP.Model.List(_source.directory));
        _source.addList('annotation', new IriSP.Model.List(_source.directory));
        if (typeof _data.annotations == "object" && _data.annotations && _data.annotations.length) {
            var _anndata = _data.annotations[0],
                _ann = new IriSP.Model.Annotation(_anndata.id, _source);
            _ann.title = _anndata.content.title || "";
            _ann.description = _anndata.content.data || "";
            _ann.created = new Date(_data.meta.created);
            _ann.setMedia(_anndata.media, _source);
            var _anntypes = _source.getAnnotationTypes(true).searchByTitle(_anndata.type_title);
            if (_anntypes.length) {
                var _anntype = _anntypes[0];
            } else {
                var _anntype = new IriSP.Model.AnnotationType(_anndata.type, _source);
                _anntype.title = _anndata.type_title;
                _source.getAnnotationTypes().push(_anntype);
            }
            _ann.setAnnotationType(_anntype.id);
            var _tagIds = IriSP._(_anndata.tags).map(function(_title) {
                var _tags = _source.getTags(true).searchByTitle(_title);
                if (_tags.length) {
                    var _tag = _tags[0];
                }
                else {
                    _tag = new IriSP.Model.Tag(_title.replace(/\W/g,'_'),_source);
                    _tag.title = _title;
                    _source.getTags().push(_tag);
                }
                return _tag.id;
            });
            _ann.setTags(_tagIds);
            _ann.setBegin(_anndata.begin);
            _ann.setEnd(_anndata.end);
            _ann.creator = _data.meta.creator;
            if (typeof _anndata.content.audio !== "undefined" && _anndata.content.audio.href) {
                _ann.audio = _anndata.content.audio;
            }
            _source.getAnnotations().push(_ann);
        }
    }
}