IriSP.Widgets.KnowledgeConcierge = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.KnowledgeConcierge.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.KnowledgeConcierge.prototype.defaults = {
    width: 600,
    height: 500,
    sketch_path: "tmgraph",
    sketch_files: [ "tmgraph.pde", "physics.pde", "model.pde", "javascript.pde", "menu.pde", "event.pde", "constants.pde", "initialdata.pde"],
    api_root: "/kn-concierge/",
    use_word_boundaries: false
}

IriSP.Widgets.KnowledgeConcierge.prototype.messages = {
    "fr": {
    },
    "en": {
    }
}

IriSP.Widgets.KnowledgeConcierge.prototype.template =
    '<div class="Ldt-Kc-Slider"></div><canvas class="Ldt-Kc-Canvas" />';

IriSP.Widgets.KnowledgeConcierge.prototype.draw = function() {
    this.renderTemplate();
    var _canvasHeight = this.height - 16,
        _canvasWidth = this.width - 2,
        _canvas = this.$.find(".Ldt-Kc-Canvas"),
        _tmpId = IriSP._.uniqueId("Processing-"),
        _slider = this.$.find(".Ldt-Kc-Slider");
    _canvas.attr({
        width: _canvasWidth,
        height: _canvasHeight,
        id: _tmpId
    }).css({
        width: _canvasWidth,
        height: _canvasHeight
    });
    var _this = this,
        _pjsfiles = IriSP._(this.sketch_files).map(function(_f) { return _this.sketch_path + "/" + _f }),
        _selectedText = "";
    Processing.loadSketchFromSources(_canvas[0],_pjsfiles);
    
    function triggerSearch(text) {
        if (_selectedText !== text) {
            //console.log("Trigger search for '" + text + "'");
            _selectedText = text;
            _this.player.trigger("search.triggeredSearch", text);
        }
    }
    
    function searchNodes(tags) {
        var _tlist = (_this.use_word_boundaries ? IriSP._(tags).map(function(t) { return "\\\\y" + t + "\\\\y" }) : tags),
            _q = "(?i)(" + _tlist.join("|") + ")";
        jQuery.getJSON(
            _this.api_root + "topics.jsp",
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
                            node.position(Math.floor(200*Math.sin(2 * Math.PI * i / l)),Math.floor(200*Math.cos(2 * Math.PI * i / l)));
                        }
                    }
                } else {
                    console.log("No match found");
                }
            }
        );
    }
    
    function rootNode(id, proj) {
        jQuery.getJSON(
            _this.api_root + "topic.jsp",
            {
                id: id,
                proj: proj
            },
            function(response) {
                if (response != null && response.items.length > 0){
                    item = response.items[0];
                    _pjs.initNode(item.id, item.name, item.grp, item.uid, item.proj);
                    _fns.countassoc(item.id, item.proj);
                } else {
                    console.debug('No such topic.');
                }
        });
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
                _canvas.click(function() {
                    triggerSearch("")
                });
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
    
    var _fns = {
        adjacentnodes: function(id, proj, adj, both) {
            //console.log("Function adjacentnodes called with", arguments);
            jQuery.ajax({
                url: _this.api_root + "associations-bd.jsp",
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
                        console.debug('No such topic.');
                        return null;
                    }
                }
            });
        },
        selectnode: function(id, proj) {
            //console.log("Function selectnode called with", arguments);
            /* Originally, open dialog with info from
             * /kn-concierge/topic.jsp?id={{id}}&proj={{proj}}
             * /kn-concierge/topicContent.jsp?id={{id}}&proj={{proj}}
             */
        },
        selectedge: function(asc_id) {
            //console.log("Function selectedge called with", arguments);
            /* /kn-concierge/association.jsp?asc_id={{asc_id}}&proj={{proj}}" */
        },
        topicnode: function(id){
            //console.log("Function topicnode called with", arguments);
        },
        setscale: function(scl){
            //console.log("Function setscale called with", arguments);
            _slider.slider("value", 10*Math.log(scl));
        },
        group_shapes: function(){
            //console.log("Function group_shapes");
        },
        allbackup: function(){
        },
        allretrieve: function(){
        },
        new_topic: function(){
        },
        pedia: function() {
        },
        set_mode: function(){
        },
        countassoc: function(id, proj) {
            //console.log("Fonction countassoc called with", arguments);
            jQuery.ajax({
                url: _this.api_root + "count-assoc.jsp",
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
                    } else {
                        console.debug('No such topic.');
                    }
                }
            });
        },
        new_relation: function() {
        },
        new_select: function(id, proj) {
            var node = _pjs.findNode(id, proj);
            triggerSearch(node.name);
            //console.log("Mouse over node named '" + node.name + "'");
        },
        startexpand: function() {
            //console.log("Function startexpand()");
        },
        endexpand: function() {
            //console.log("Function endexpand()");
        },
        username: function() {
            //console.log("Function username()");
        }
    }
    
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
    
    bindJavascript();
    
}
