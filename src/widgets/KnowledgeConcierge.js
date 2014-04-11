IriSP.Widgets.KnowledgeConcierge = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.KnowledgeConcierge.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.KnowledgeConcierge.prototype.defaults = {
    width: 600,
    height: 500,
    sketch_path: "tmgraph",
    sketch_files: [ "tmgraph.pde", "physics.pde", "model.pde", "javascript.pde", "menu.pde", "event.pde", "constants.pde", "initialdata.pde"],
    kc_api_root: "/kn-concierge/",
    related_api_endpoint: "",
    use_word_boundaries: false,
    related_data_type: 'json', // SET TO "jsonp" FOR CROSS-DOMAIN OPERATION
    related_count: 8,
};

IriSP.Widgets.KnowledgeConcierge.prototype.messages = {
    "fr": {
        related_videos: "Vidéos liées",
        duration_: "Durée\u00a0:",
        for_keywords_: "pour le(s) mots-clé(s)\u00a0:",
        no_matching_videos: "Pas de vidéos correspondantes"
    },
    "en": {
        related_videos: "Related Videos",
        duration_: "Duration:",
        for_keywords_: "for keyword(s):",
        no_matching_videos: "No matching videos"
    }
};

IriSP.Widgets.KnowledgeConcierge.prototype.template =
    '<div class="Ldt-Kc-Slider"></div><canvas class="Ldt-Kc-Canvas" />'
    + '<div class="Ldt-Kc-Related"><h2>{{ l10n.related_videos }}</h2>'
    + '<h3 class="Ldt-Kc-For-Keywords">{{l10n.for_keywords_}} <span class="Ldt-Kc-Keywords"></span></h3>'
    + '<div class="Ldt-Kc-Waiting"></div>'
    + '<div class="Ldt-Kc-Related-List"></div></div>';

IriSP.Widgets.KnowledgeConcierge.prototype.draw = function() {
    this.renderTemplate();
    var _canvasHeight = this.height - 16,
        _canvasWidth = this.width - 2,
        _canvas = this.$.find(".Ldt-Kc-Canvas"),
        _tmpId = IriSP._.uniqueId("Processing-"),
        _slider = this.$.find(".Ldt-Kc-Slider"),
        radius = .375 * Math.min(_canvasHeight, _canvasWidth);
    _canvas.attr({
        width: _canvasWidth,
        height: _canvasHeight,
        id: _tmpId
    }).css({
        width: _canvasWidth,
        height: _canvasHeight
    });
    var _this = this,
        _pjsfiles = IriSP._(this.sketch_files).map(function(_f) { return _this.sketch_path + "/" + _f; }),
        _selectedText = "",
        currentNodesList = "",
        relatedCache = {},
        relatedRequests = {},
        relatedTemplate = '<div class="Ldt-Kc-Related-Item"><a href="{{ widget.video_url_base }}{{ media.iri_id }}#keyword={{ escaped_keyword }}"><img src="{{ media.image }}"></a>'
            + '<h3><a href="{{ widget.video_url_base }}{{ media.iri_id }}#keyword={{ escaped_keyword }}">{{ media.title }}</a></h3><p>{{ description }}</p>'
            + '<p>{{ widget.l10n.duration_ }} <span class="Ldt-Kc-Item-Duration">{{ duration }}</span></p>'
            + '</a><div class="Ldt-Kc-Clearer"></div></div>';
            
    Processing.loadSketchFromSources(_canvas[0],_pjsfiles);
    
    function renderRelated() {
        var keywords = currentNodesList;
        _this.$.find(".Ldt-Kc-Related").show();
        if (typeof relatedCache[keywords] === "undefined") {
            return;
        }
        _this.$.find(".Ldt-Kc-Waiting").hide();
        if (relatedCache[keywords].length) {
            var _html = '<div class="Ldt-Kc-Row">';
            IriSP._(relatedCache[keywords]).each(function(media, i) {
                var _tmpldata = {
                    widget: _this,
                    media: media,
                    description: media.description.replace(/(\n|\r|\r\n)/mg,' ').replace(/(^.{120,140})[\s].+$/m,'$1&hellip;'),
                    duration: new IriSP.Model.Time(media.duration).toString(),
                    escaped_keyword: encodeURIComponent(keywords.split(",")[0])
                };
                _html += Mustache.to_html(relatedTemplate, _tmpldata);
                if (i % 2) {
                    _html += '</div><div class="Ldt-Kc-Row">';
                }
            });
            _html += '</div>';
            _this.$.find(".Ldt-Kc-Related-List").html(_html);
        } else {
            _this.$.find(".Ldt-Kc-Related-List").html("<p class='Ldt-Kc-Related-Empty'>" + _this.l10n.no_matching_videos + "</p>");
        }
    }    

    function triggerSearch(text) {
        if (_selectedText !== text) {
            _selectedText = text;
            _this.source.getAnnotations().search(text);
        }
    }
    
    function searchNodes(tags) {
        var _tlist = (_this.use_word_boundaries ? IriSP._(tags).map(function(t) { return "\\\\y" + t + "\\\\y" }) : tags),
            _q = "(?i)(" + _tlist.join("|") + ")";
        jQuery.getJSON(
            _this.kc_api_root + "topics.jsp",
            {
                proj: _this.project_id,
                q: _q
            },
            function(data) {
                if (data && data.items && data.items.length) {
                    for (var i=0, l=data.items.length; i<l; i++) {
                        var node = data.items[i];
                        if (i == 0) {
                            _pjs.initNode(node.id, node.name, node.grp, node.uid, node.proj);
                            var node = _pjs.findNode(node.id, node.proj);
                        } else {
                            var node = _pjs.newNode(node.id, node.name, node.grp, node.uid, node.proj);
                            node.root = true;
                            node.fix();
                        }
                        _fns.countassoc(node.id, node.proj);
                        if (l > 1) {
                            node.position(Math.floor(radius*Math.sin(2 * Math.PI * i / l)),Math.floor(radius*Math.cos(2 * Math.PI * i / l)));
                        }
                    }
                }
            }
        );
    }
    
    function showRelated(nodetexts) {
        currentNodesList = nodetexts;
        _this.$.find(".Ldt-Kc-Related-List").html("");
        _this.$.find(".Ldt-Kc-Keywords").html(nodetexts.replace(/\,/g,", "));
        if (typeof relatedCache[nodetexts] === "undefined") {
            _this.$.find(".Ldt-Kc-Waiting").show();
            if (relatedRequests[nodetexts]) {
                return;
            }
            relatedRequests[nodetexts] = true;
            IriSP.jQuery.ajax({
                url: _this.related_api_endpoint,
                data: {
                    format: _this.related_data_type,
                    keywords: nodetexts
                },
                dataType: _this.related_data_type,
                success: function(data) {
                    relatedCache[nodetexts] = IriSP._(data.objects)
                        .chain()
                        .filter(function(o) {
                            return o.iri_id !== _this.media.id;
                        })
                        .sortBy(function(o) {
                            return - o.score;
                        })
                        .first(_this.related_count)
                        .value();
                    renderRelated();
                }
            });
        } else {
            renderRelated();
        }
    }
    
    function rootNode(id, proj) {
        jQuery.getJSON(
            _this.kc_api_root + "topic.jsp",
            {
                id: id,
                proj: proj
            },
            function(response) {
                if (response != null && response.items.length > 0){
                    item = response.items[0];
                    _pjs.initNode(item.id, item.name, item.grp, item.uid, item.proj);
                    _fns.countassoc(item.id, item.proj);
                }
            }
        );
    }
    
    function bindJavascript() {
        _pjs = Processing.getInstanceById(_tmpId);
        if (_pjs && typeof _pjs.bindJavascript === "function") {
            setTimeout(function() {
                _pjs.bindJavascript(_fns);
                _pjs.setSize(_canvasWidth,_canvasHeight);
                var _edit = false,
                    _teamMode = true;
                _pjs.saveMode("en",false,_teamMode,false,"both",_edit);
                rootNode(_this.topic_id, _this.project_id);
                _slider.slider({
                    min: -20,
                    max: 20,
                    value: 0,
                    range: "min",
                    slide: function(event, ui) {
                        _pjs.zoom(Math.exp(ui.value / 10));
                    }
                });
            }, 1000);
        } else {
            setTimeout(bindJavascript, 1000); 
        }
    }
    var currentSelection = null;
    var _fns = {
        adjacentnodes: function(id, proj, adj, both) {
            jQuery.ajax({
                url: _this.kc_api_root + "associations-bd.jsp",
                cache: false,
                data: {
                    id: id,
                    proj: proj,
                    both: both,
                    adj: adj
                },
                success: function(response) {
                    if (response.items.length > 0){
                        for(i = 0, end = response.items.length; i < end; i++) {
                            item = response.items[i];
                            _pjs.addEdge(item.asc_id, item.id, item.from_proj, item.to_id, item.to_proj,
                                        item.r_name, item.r_from,  item.r_to, item.uid, item.proj);
                            _pjs.setNodeName( item.id,   item.from_proj,item.name);
                            _pjs.setNodeValue(item.id,   item.from_proj,item.name,   item.grp,   item.abst,   item.from_uid);
                            if (item.from_assoc!=null) {
                                _pjs.setNodeAssoc(item.id, item.from_proj, item.from_assoc);
                            }
                            _pjs.setNodeName( item.to_id,item.to_proj,  item.to_name);
                            _pjs.setNodeValue(item.to_id,item.to_proj,  item.to_name,item.to_grp,item.to_abst,item.to_uid);
                            if (item.to_assoc!=null) {
                                _pjs.setNodeAssoc(item.to_id, item.to_proj, item.to_assoc);
                            }
                        }
                        return response;
                    } else {
                        //.debug('No such topic.');
                        return null;
                    }
                }
            });
        },
        setscale: function(scl){
            _slider.slider("value", 10*Math.log(scl));
        },
        countassoc: function(id, proj) {
            jQuery.ajax({
                url: _this.kc_api_root + "count-assoc.jsp",
                data: {
                    id: id,
                    proj: proj
                },
                success: function(response) {
                    if (response.items.length > 0){
                        for(i = 0, end = response.items.length; i < end; i++) {
                            item = response.items[i];
                            _pjs.setNodeValue(item.id, item.proj, item.name, item.grp, item.abst);
                            if (item.assoc!=null) _pjs.setNodeAssoc(item.id, item.proj, item.assoc);
                            if (item.mass!=null) _pjs.setNodeMass( item.id, item.proj, item.mass);
                        }
                    }
                }
            });
        },
        username: function() {
            var nodes = _pjs.getNodes().values().toArray(),
                nodetexts = IriSP._(nodes).chain().pluck("name").sortBy().value().join(",");
            showRelated(nodetexts);
        },
        mousemove: function(selection) {
            if (selection !== currentSelection) {
                if (selection) {
                    triggerSearch(selection.name);
                }
                currentSelection = selection;
            }
        },
        click: function(selection) {
            if (selection) {
                triggerSearch(selection.name);
                showRelated(selection.name);
            } else {
                triggerSearch();
            }
        }
    };
    var uselessfuncts = [
        "selectnode", "selectedge", "topicnode","group_shapes",
        "allbackup", "allretrieve", "new_topic", "pedia", "set_mode",
        "new_relation", "startexpand", "endexpand", "new_select" //, "mouseover" //, "username"
    ];
    
    IriSP._(uselessfuncts).each(function(funcname) {
        _fns[funcname] = function() {
//            console.log("Function", funcname, "called with arguments", arguments);
        }
    });
    
    this.getWidgetAnnotations().forEach(function(annotation) {
        annotation.on("click", function() {
            var _tags = annotation.getTagTexts();
            if (_tags.length) {
                searchNodes(_tags);
            }
        });
    });
    
    this.source.getTags().forEach(function(tag) {
        tag.on("click", function() {
            if (tag.title) {
                searchNodes([tag.title]);
            }
        });
    });
    
    var keywmatch = document.location.hash.match(/keyword=([^#?&]+)/);
    if (keywmatch) {
        this.player.on("widgets-loaded", function() {
            triggerSearch(decodeURIComponent(keywmatch[1]));
        });
    }
    
    bindJavascript();
    
};
