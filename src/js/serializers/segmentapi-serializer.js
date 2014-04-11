/* START segmentapi-serializer.js */

if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {};
}

IriSP.serializers.segmentapi = {
    deSerialize : function(_data, _source) {
        var _annotationlist = new IriSP.Model.List(_source.directory),
            _medialist = new IriSP.Model.List(_source.directory);
        _source.addList("media", _medialist);
        
        function deserializeObject(_s) {
            var _ann = new IriSP.Model.Annotation(_s.element_id, _source),
                _media = _source.getElement(_s.iri_id);
            if (!_media) {
                _media = new IriSP.Model.Media(_s.iri_id, _source);
                _source.getMedias().push(_media);
            }
            _ann.setMedia(_s.iri_id);
            _ann.title = _s.title;
            _ann.description = _s.abstract;
            _ann.begin = new IriSP.Model.Time(_s.start_ts);
            _ann.end = new IriSP.Model.Time(_s.start_ts + _s.duration);
            _ann.keywords = (_s.tags ? _s.tags.split(",") : []);
            _ann.project_id = _s.project_id;
            _annotationlist.push(_ann);
        }
        
        if (typeof _data.objects !== "undefined") {
            IriSP._(_data.objects).each(deserializeObject);
        } else {
            deserializeObject(_data);
        }
        _source.addList("annotation", _annotationlist);
    }
};

/* END segmentapi-serializer.js */
