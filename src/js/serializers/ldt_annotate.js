/* ldt_annotate serializer: Used when Putting annotations on the platform */

if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {};
}

IriSP.serializers.ldt_annotate = {
    serializeAnnotation : function(_data, _source) {
        var _annType = _data.getAnnotationType();
        return {
            id: _data.id,
            begin: _data.begin.milliseconds,
            end: _data.end.milliseconds,
            content: {
                data: (_data.content ? _data.content.data || {} : {}),
                description: _data.description,
                title: _data.title,
                audio: _data.audio
            },
            id: _data.id ? _data.id : "", // If annotation is new, id will be undefined
            tags: _data.getTagTexts(),
            media: _data.getMedia().id,
            project: _data.project_id,
            type_title: _annType.title,
            sharing: _data.sharing || "private",
            type: (typeof _annType.dont_send_id !== "undefined" && _annType.dont_send_id ? "" : _annType.id),
            meta: {
                created: _data.created,
                creator: _data.creator,
                modified: _data.modified,
                contributor: _data.contributor
            }
        };
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
        _ann.meta = _anndata.meta;
        _ann.setAnnotationType(_anntype.id);
        var _tagIds = IriSP._(_anndata.tags).map(function(_title) {
            var _tags = _source.getTags(true).searchByTitle(_title, true);
            if (_tags.length) {
                var _tag = _tags[0];
            } else {
                _tag = new IriSP.Model.Tag(_title.replace(/\W/g, '_'), _source);
                _tag.title = _title;
                _source.getTags().push(_tag);
            }
            return _tag.id;
        });
        _ann.setTags(_tagIds);
        _ann.setBeginEnd(_anndata.begin, _anndata.end);
        if (typeof _anndata.content.audio !== "undefined" && _anndata.content.audio.href) {
            _ann.audio = _anndata.content.audio;
        };
        if (_anndata.content.data) {
            _ann.content = { data: _anndata.content.data };
        };
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
};

/* End ldt_annotate serializer */
