/* Used when Putting annotations on the platform */

if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {}
}

IriSP.serializers.ldt_annotate = {
    serializeAnnotation : function(_data, _source) {
        var _annType = _data.getAnnotationType();
        return {
            begin: _data.begin.milliseconds,
            end: _data.end.milliseconds,
            content: {
                description: _data.description,
                title: _data.title,
                audio: _data.audio
            },
            tags: _data.getTagTexts(),
            media: _data.getMedia().id,
            type_title: _annType.title,
            type: ( typeof _annType.dont_send_id !== "undefined" && _annType.dont_send_id ? "" : _annType.id ),
            meta: {
                created: _data.created,
                creator: _data.creator
            }
        }
    },
    deserializeAnnotation : function(_anndata, _source) {
        var _ann = new IriSP.Model.Annotation(_anndata.id, _source);
        _ann.description = _anndata.content.description || "";
        _ann.title = _anndata.content.title || "";
        _ann.creator = _anndata.meta.creator || "";
        _ann.created = new Date(_anndata.meta.created);
        _ann.setMedia(_anndata.media, _source);
        var _anntype = _source.getElement(_anndata.type);
        if (!_anntype) {
            _anntype = new IriSP.Model.AnnotationType(_anndata.type, _source);
            _anntype.title = _anndata.type_title;
            _source.getAnnotationTypes().push(_anntype);
        }
        _ann.setAnnotationType(_anntype.id);
        var _tagIds = IriSP._(_anndata.tags).map(function(_title) {
            var _tags = _source.getTags(true).searchByTitle(_title, true);
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
        if (typeof _anndata.content.audio !== "undefined" && _anndata.content.audio.href) {
            _ann.audio = _anndata.content.audio;
        }
        _source.getAnnotations().push(_ann);
    },
    serialize : function(_source) {
        return JSON.stringify(this.serializeAnnotation(_source.getAnnotations()[0], _source));
    },
    deSerialize : function(_data, _source) {
        if (typeof _data == "string") {
            _data = JSON.parse(_data);
        }
        
        _source.addList('tag', new IriSP.Model.List(_source.directory));
        _source.addList('annotationType', new IriSP.Model.List(_source.directory));
        _source.addList('annotation', new IriSP.Model.List(_source.directory));
        this.deserializeAnnotation(_data, _source);
    }
}