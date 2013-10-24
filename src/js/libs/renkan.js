/* 
 *    _____            _               
 *   |  __ \          | |              
 *   | |__) |___ _ __ | | ____ _ _ __  
 *   |  _  // _ \ '_ \| |/ / _` | '_ \ 
 *   | | \ \  __/ | | |   < (_| | | | |
 *   |_|  \_\___|_| |_|_|\_\__,_|_| |_|
 *
 *  Copyright 2012-2013 Institut de recherche et d'innovation 
 *  contributor(s) : Yves-Marie Haussonne, Raphael Velt, Samuel Huron
 *   
 *  contact@iri.centrepompidou.fr
 *  http://www.iri.centrepompidou.fr 
 *   
 *  This software is a computer program whose purpose is to show and add annotations on a video .
 *  This software is governed by the CeCILL-C license under French law and
 *  abiding by the rules of distribution of free software. You can  use, 
 *  modify and/ or redistribute the software under the terms of the CeCILL-C
 *  license as circulated by CEA, CNRS and INRIA at the following URL
 *  "http://www.cecill.info". 
 *  
 *  The fact that you are presently reading this means that you have had
 *  knowledge of the CeCILL-C license and that you accept its terms.
*/
/* Declaring the Renkan Namespace Rkns and Default values */

(function(root) {

"use strict";

if (typeof root.Rkns !== "object") {
    root.Rkns = {};
}

var Rkns = root.Rkns;
var $ = Rkns.$ = root.jQuery;
var _ = Rkns._ = root._;

Rkns.VERSION = '0.2.2';

Rkns.pickerColors = ["#8f1919", "#a80000", "#d82626", "#ff0000", "#e87c7c", "#ff6565", "#f7d3d3", "#fecccc",
    "#8f5419", "#a85400", "#d87f26", "#ff7f00", "#e8b27c", "#ffb265", "#f7e5d3", "#fee5cc",
    "#8f8f19", "#a8a800", "#d8d826", "#feff00", "#e8e87c", "#feff65", "#f7f7d3", "#fefecc",
    "#198f19", "#00a800", "#26d826", "#00ff00", "#7ce87c", "#65ff65", "#d3f7d3", "#ccfecc",
    "#198f8f", "#00a8a8", "#26d8d8", "#00feff", "#7ce8e8", "#65feff", "#d3f7f7", "#ccfefe",
    "#19198f", "#0000a8", "#2626d8", "#0000ff", "#7c7ce8", "#6565ff", "#d3d3f7", "#ccccfe",
    "#8f198f", "#a800a8", "#d826d8", "#ff00fe", "#e87ce8", "#ff65fe", "#f7d3f7", "#feccfe",
    "#000000", "#242424", "#484848", "#6d6d6d", "#919191", "#b6b6b6", "#dadada", "#ffffff"];

Rkns.__renkans = [];

var _BaseBin = Rkns._BaseBin = function(_renkan, _opts) {
    if (typeof _renkan !== "undefined") {
        this.renkan = _renkan;
        this.renkan.$.find(".Rk-Bin-Main").hide();
        this.$ = Rkns.$('<li>')
            .addClass("Rk-Bin")
            .appendTo(_renkan.$.find(".Rk-Bin-List"));
        this.title_icon_$ = Rkns.$('<span>')
            .addClass("Rk-Bin-Title-Icon")
            .appendTo(this.$);
            
        var _this = this;
        
        Rkns.$('<a>')
            .attr({
                href: "#",
                title: _renkan.translate("Close bin")
            })
            .addClass("Rk-Bin-Close")
            .html('&times;')
            .appendTo(this.$)
            .click(function() {
                _this.destroy();
                if (!_renkan.$.find(".Rk-Bin-Main:visible").length) {
                    _renkan.$.find(".Rk-Bin-Main:last").slideDown();
                }
                _renkan.resizeBins();
                return false;
            });
        Rkns.$('<a>')
            .attr({
                href: "#",
                title: _renkan.translate("Refresh bin")
            })
            .addClass("Rk-Bin-Refresh")
            .appendTo(this.$)
            .click(function() {
                _this.refresh();
                return false;
            });
        this.count_$ = Rkns.$('<div>')
            .addClass("Rk-Bin-Count")
            .appendTo(this.$);
        this.title_$ = Rkns.$('<h2>')
            .addClass("Rk-Bin-Title")
            .appendTo(this.$);
        this.main_$ = Rkns.$('<div>')
            .addClass("Rk-Bin-Main")
            .appendTo(this.$)
            .html('<h4 class="Rk-Bin-Loading">' + _renkan.translate("Loading, please wait") + '</h4>');
        this.title_$.html(_opts.title || '(new bin)');
        this.renkan.resizeBins();
        
        if (_opts.auto_refresh) {
            window.setInterval(function() {
                _this.refresh();
            },_opts.auto_refresh);
        }
    }
};

_BaseBin.prototype.destroy = function() {
    this.$.detach();
    this.renkan.resizeBins();
};

/* Point of entry */

var Renkan = Rkns.Renkan = function(_opts) {
    var _this = this;
    
    Rkns.__renkans.push(this);
    
    this.options = _.defaults(_opts, Rkns.defaults);
        
    _(this.options.property_files).each(function(f) {
        Rkns.$.getJSON(f, function(data) {
            _this.options.properties = _this.options.properties.concat(data);
        });
    });
    
    this.read_only = this.options.read_only || !this.options.editor_mode;

    this.project = new Rkns.Models.Project();
    
    if (typeof this.options.user_id !== "undefined") {
        this.current_user = this.options.user_id;
    }
    this.$ = Rkns.$("#" + this.options.container);
    this.$
        .addClass("Rk-Main")
        .html(this.template(this));
    
    this.tabs = [];
    this.search_engines = [];

    this.current_user_list = new Rkns.Models.UsersList();
    
    this.current_user_list.on("add remove", function() {
        if (this.renderer) {
            this.renderer.redrawUsers();
        }
    });
    
    this.colorPicker = (function() {
        var _tmpl = _.template('<li data-color="<%=c%>" style="background: <%=c%>"></li>');
        return '<ul class="Rk-Edit-ColorPicker">' + Rkns.pickerColors.map(function(c) { return _tmpl({c:c})}).join("") + '</ul>'
    })();
    
    if (this.options.show_editor) {
        this.renderer = new Rkns.Renderer.Scene(this);
    }
    
    if (!this.options.search.length) {
        this.$.find(".Rk-Web-Search-Form").detach();
    } else {
        var _tmpl = _.template('<li class="<%= className %>" data-key="<%= key %>"><%= title %></li>'),
            _select = this.$.find(".Rk-Search-List"),
            _input = this.$.find(".Rk-Web-Search-Input"),
            _form = this.$.find(".Rk-Web-Search-Form");
        _(this.options.search).each(function(_search, _key) {
            if (Rkns[_search.type] && Rkns[_search.type].Search) {
                _this.search_engines.push(new Rkns[_search.type].Search(_this, _search));
            }
        });
        _select.html(
            _(this.search_engines).map(function(_search, _key) {
                return _tmpl({
                    key: _key,
                    title: _search.getSearchTitle(),
                    className: _search.getBgClass()
                });
            }).join("")
        );
        _select.find("li").click(function() {
            var _el = Rkns.$(this);
            _this.setSearchEngine(_el.attr("data-key"));
            _form.submit();
        });
        _form.submit(function() {
            if (_input.val()) {
                var _search = _this.search_engine;
                _search.search(_input.val());
            }
            return false;
        });
        this.$.find(".Rk-Search-Current").mouseenter(
            function() { _select.slideDown(); }
        );
        this.$.find(".Rk-Search-Select").mouseleave(
            function() { _select.hide(); }
        );
        this.setSearchEngine(0);
    }
    _(this.options.bins).each(function(_bin) {
        if (Rkns[_bin.type] && Rkns[_bin.type].Bin) {
            _this.tabs.push(new Rkns[_bin.type].Bin(_this, _bin));
        }
    });
    
    var elementDropped = false;
    
    this.$.find(".Rk-Bins")
        .on("click",".Rk-Bin-Title,.Rk-Bin-Title-Icon", function() {
            var _mainDiv = Rkns.$(this).siblings(".Rk-Bin-Main");
            if (_mainDiv.is(":hidden")) {
                _this.$.find(".Rk-Bin-Main").slideUp();
                _mainDiv.slideDown();
            }
        });
    
    if (this.options.show_editor) {
        
        this.$.find(".Rk-Bins").on("mouseover", ".Rk-Bin-Item", function(_e) {
            var _t = Rkns.$(this);
            if (_t && $(_t).attr("data-uri")) {
                var _models = _this.project.get("nodes").where({
                    uri: $(_t).attr("data-uri")
                });
                _(_models).each(function(_model) {
                    _this.renderer.highlightModel(_model);
                });
            }
        }).mouseout(function() {
            _this.renderer.unhighlightAll();
        }).on("mousemove", ".Rk-Bin-Item", function(e) {
            try {
                this.dragDrop();
            }
            catch(err) {}
        }).on("touchstart", ".Rk-Bin-Item", function(e) {
            elementDropped = false;
        }).on("touchmove", ".Rk-Bin-Item", function(e) {
            e.preventDefault();
            var touch = e.originalEvent.changedTouches[0],
                off = _this.renderer.canvas_$.offset(),
                w = _this.renderer.canvas_$.width(),
                h = _this.renderer.canvas_$.height();
            if (touch.pageX >= off.left && touch.pageX < (off.left + w) && touch.pageY >= off.top && touch.pageY < (off.top + h)) {
                if (elementDropped) {
                    _this.renderer.onMouseMove(touch, true);
                } else {
                    elementDropped = true;
                    var div = document.createElement('div');
                    div.appendChild(this.cloneNode(true));
                    _this.renderer.dropData({"text/html": div.innerHTML}, touch);
                    _this.renderer.onMouseDown(touch, true);
                }
            }
        }).on("touchend", ".Rk-Bin-Item", function(e) {
            if (elementDropped) {
                _this.renderer.onMouseUp(e.originalEvent.changedTouches[0], true);
            }
            elementDropped = false;
        }).on("dragstart", ".Rk-Bin-Item", function(e) {
            var div = document.createElement('div');
            div.appendChild(this.cloneNode(true));
            try {
                e.originalEvent.dataTransfer.setData("text/html",div.innerHTML);
            }
            catch(err) {
                e.originalEvent.dataTransfer.setData("text",div.innerHTML);
            }
        });
        
    }
    
    Rkns.$(window).resize(function() {
        _this.resizeBins();
    });
    
    var lastsearch = false, lastval = '';
    
    this.$.find(".Rk-Bins-Search-Input").on("change keyup paste input", function() {
        var val = Rkns.$(this).val();
        if (val === lastval) {
            return;
        }
        var search = Rkns.Utils.regexpFromTextOrArray(val.length > 1 ? val: null);
        if (search.source === lastsearch) {
            return;
        }
        lastsearch = search.source;
        _(_this.tabs).each(function(tab) {
            tab.render(search);
        });
        
    });
    this.$.find(".Rk-Bins-Search-Form").submit(function() {
        return false;
    });
    
};

Renkan.prototype.template = _.template(
    '<% if (options.show_bins) { %><div class="Rk-Bins"><div class="Rk-Bins-Head"><h2 class="Rk-Bins-Title"><%- translate("Select contents:")%></h2>'
    + '<form class="Rk-Web-Search-Form Rk-Search-Form"><input class="Rk-Web-Search-Input Rk-Search-Input" type="search" placeholder="<%- translate("Search the Web") %>" />'
    + '<div class="Rk-Search-Select"><div class="Rk-Search-Current"></div><ul class="Rk-Search-List"></ul></div>'
    + '<input type="submit" value="" class="Rk-Web-Search-Submit Rk-Search-Submit" title="<%- translate("Search the Web") %>" /></form>'
    + '<form class="Rk-Bins-Search-Form Rk-Search-Form"><input class="Rk-Bins-Search-Input Rk-Search-Input" type="search" placeholder="<%- translate("Search in Bins") %>" />'
    + '<input type="submit" value="" class="Rk-Bins-Search-Submit Rk-Search-Submit" title="<%- translate("Search in Bins") %>" /></form></div>'
    + '<ul class="Rk-Bin-List"></ul></div><% } %>'
    + '<% if (options.show_editor) { %><div class="Rk-Render Rk-Render-<% if (options.show_bins) { %>Panel<% } else { %>Full<% } %>"></div><% } %>'
);

Renkan.prototype.translate = function(_text) {
    if (Rkns.i18n[this.options.language] && Rkns.i18n[this.options.language][_text]) {
        return Rkns.i18n[this.options.language][_text];
    }
    if (this.options.language.length > 2 && Rkns.i18n[this.options.language.substr(0,2)] && Rkns.i18n[this.options.language.substr(0,2)][_text]) {
        return Rkns.i18n[this.options.language.substr(0,2)][_text];
    }
    return _text;
};

Renkan.prototype.onStatusChange = function() {
    this.renderer.onStatusChange();
};

Renkan.prototype.setSearchEngine = function(_key) {
    this.search_engine = this.search_engines[_key];
    this.$.find(".Rk-Search-Current").attr("class","Rk-Search-Current " + this.search_engine.getBgClass());
};

Renkan.prototype.resizeBins = function() {
    var _d = + this.$.find(".Rk-Bins-Head").outerHeight();
    this.$.find(".Rk-Bin-Title:visible").each(function() {
        _d += Rkns.$(this).outerHeight();
    });
    this.$.find(".Rk-Bin-Main").css({
        height: this.$.find(".Rk-Bins").height() - _d
    });
};

/* Utility functions */

Rkns.Utils = {
    getUID : (function() {
        function pad(n){
            return n<10 ? '0'+n : n;
        }
        function fillrand(n) {
            var _res = '';
            for (var i=0; i<n; i++) {
                _res += Math.floor(16*Math.random()).toString(16);
            }
            return _res;
        }
        var _d = new Date(),
            ID_AUTO_INCREMENT = 0,
            ID_BASE = _d.getUTCFullYear() + '-'  
            + pad(_d.getUTCMonth()+1) + '-'  
            + pad(_d.getUTCDate()) + '-'
            + fillrand(16);
        return function(_base) {
            var _n = (++ID_AUTO_INCREMENT).toString(16),
                _base = (typeof _base === "undefined" ? "" : _base + "-" );
            while (_n.length < 4) { _n = '0' + _n; }
            return _base + this._ID_BASE + '-' + _n;
        }
    })(),
    getFullURL : function(url) {
        
        if(typeof(url) == 'undefined' || url == null ) {
            return "";
        }
        if(/https?:\/\//.test(url)) {
            return url;
        }
        var img = new Image();
        img.src = url;
        var res = img.src;
        img.src = null;
        return res;
        
    },
    inherit : function(_baseClass, _callbefore) {
        
        var _class = function(_arg) {
            if (typeof _callbefore === "function") {
                _callbefore.apply(this, Array.prototype.slice.call(arguments, 0));
            }
            _baseClass.apply(this, Array.prototype.slice.call(arguments, 0));
            if (typeof this._init == "function" && !this._initialized) {
                this._init.apply(this, Array.prototype.slice.call(arguments, 0));
                this._initialized = true;
            }
        };
        _(_class.prototype).extend(_baseClass.prototype);
        return _class;
        
    },
    regexpFromTextOrArray: (function() {
        var charsub = [
                '[aáàâä]',
                '[cç]',
                '[eéèêë]',
                '[iíìîï]',
                '[oóòôö]',
                '[uùûü]'
            ],
            removeChars = [
                String.fromCharCode(768), String.fromCharCode(769), String.fromCharCode(770), String.fromCharCode(771), String.fromCharCode(807),
                "｛", "｝", "（", "）", "［", "］", "【", "】", "、", "・", "‥", "。", "「", "」", "『", "』", "〜", "：", "！", "？", "　",
                ",", " ", ";", "(", ")", ".", "*", "+", "\\", "?", "|", "{", "}", "[", "]", "^", "#", "/"
            ],
            remsrc = "[\\" + removeChars.join("\\") + "]",
            remrx = new RegExp(remsrc, "gm"),
            charsrx = _(charsub).map(function(c) {
                return new RegExp(c);
            });
        
        function replaceText(_text) {
            var txt = _text.toLowerCase().replace(remrx,""), src = "";
            for (var j = 0; j < txt.length; j++) {
                if (j) {
                    src += remsrc + "*";
                }
                var l = txt[j];
                _(charsub).each(function(v, k) {
                    l = l.replace(charsrx[k], v);
                });
                src += l;
            }
            return src;
        }
        
        function getSource(inp) {
            switch (typeof inp) {
                case "string":
                    return replaceText(inp);
                case "object":
                    var src = '';
                    _(inp).each(function(v) {
                        var res = getSource(v);
                        if (res) {
                            if (src) {
                                src += '|';
                            }
                            src += res;
                        }
                    });
                    return src;
            }
            return '';
        }
        
        return function(_textOrArray) {
            var source = getSource(_textOrArray);
            if (source) {
                var testrx = new RegExp( source, "im"),
                    replacerx = new RegExp( '(' + source + ')', "igm")
                return {
                    isempty: false,
                    source: source,
                    test: function(_t) { return testrx.test(_t) },
                    replace: function(_text, _replace) { return _text.replace(replacerx, _replace); }
                }
            } else {
                return {
                    isempty: true,
                    source: '',
                    test: function() { return true },
                    replace: function(_text) { return text }
                }
            }
        }
    })()
};
})(window);

/* END main.js */
(function() {
    "use strict";
    var root = this;
        
    var Backbone = root.Backbone;
    
    var Models = root.Rkns.Models = {};
    
    
    Models.getUID = function(obj) {
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        return obj.type + "-" + guid; 
    };
    
    
    var RenkanModel = Backbone.RelationalModel.extend({
        idAttribute : "_id",
        constructor: function(options) {
            
            if (typeof options !== "undefined") {
                options._id = options._id || options.id || Models.getUID(this);
                options.title = options.title || "";
                options.description = options.description || "";
                options.uri = options.uri || "";
                
                if(typeof this.prepare === "function") {
                    options = this.prepare(options);
                }
            }
            Backbone.RelationalModel.prototype.constructor.call(this, options);
        },
        validate: function() {
            if(!this.type) {
                return "object has no type";
            }
        },
        addReference : function(_options, _propName, _list, _id, _default) {
            var _element = _list.get(_id);
            if (typeof _element === "undefined" && typeof _default !== "undefined") {
                _options[_propName ] = _default;
            }
            else {
                _options[_propName ] = _element;
            }
        }
    });
        
    // USER
    var User = Models.User = RenkanModel.extend({
        type: "user",
        prepare: function(options) {
            options.color = options.color || "#666666";
            return options;
        },
        toJSON: function() {
            return {
                _id: this.get("_id"),
                title: this.get("title"),
                uri: this.get("uri"),
                description: this.get("description"),
                color: this.get("color")
            };
        }
    });
    
    // NODE
    var Node = Models.Node = RenkanModel.extend({
        type: "node",
        relations: [{
            type: Backbone.HasOne,
            key: "created_by",
            relatedModel: User
        }],
        prepare: function(options) {
            var project = options.project;
            this.addReference(options, "created_by", project.get("users"), options.created_by, project.current_user);
            options.description = options.description || "";
            return options;
        },
        toJSON: function() {
            return {
                _id: this.get("_id"),
                title: this.get("title"),
                uri: this.get("uri"),
                description: this.get("description"),
                position: this.get("position"),
                image: this.get("image"),
                color: this.get("color"),
                created_by: this.get("created_by") ? this.get("created_by").get("_id") : null,
                size: this.get("size"),
                "clip-path": this.get("clip-path")
            };
        }
    });
    
    // EDGE
    var Edge = Models.Edge = RenkanModel.extend({
        type: "edge",
        relations: [
          {
            type: Backbone.HasOne,
            key: "created_by",
            relatedModel: User
          },
          {
            type: Backbone.HasOne,
            key: "from",
            relatedModel: Node
          },
          {
            type: Backbone.HasOne,
            key: "to",
            relatedModel: Node
          }
        ],
        prepare: function(options) {
            var project = options.project;
            this.addReference(options, "created_by", project.get("users"), options.created_by, project.current_user);
            this.addReference(options, "from", project.get("nodes"), options.from);
            this.addReference(options, "to", project.get("nodes"), options.to);
            return options;
        },
        toJSON: function() {
            return {
                _id: this.get("_id"),
                title: this.get("title"),
                uri: this.get("uri"),
                description: this.get("description"),
                from: this.get("from") ? this.get("from").get("_id") : null,
                to: this.get("to") ? this.get("to").get("_id") : null,
                color: this.get("color"),
                created_by: this.get("created_by") ? this.get("created_by").get("_id") : null
            };
        }
    });
        
    // PROJECT
    var Project = Models.Project = RenkanModel.extend({
        type: "project",
        relations: [
          {
            type: Backbone.HasMany,
            key: "users",
            relatedModel: User,
            reverseRelation: {
                key: 'project',
                includeInJSON: '_id'
            }
          },
          {
            type: Backbone.HasMany,
            key: "nodes",
            relatedModel: Node,
            reverseRelation: {
                key: 'project',
                includeInJSON: '_id'
            }
          },
          {
            type: Backbone.HasMany,
            key: "edges",
            relatedModel: Edge,
            reverseRelation: {
                key: 'project',
                includeInJSON: '_id'
            }
          }
        ],
        addUser: function(_props, _options) {
            _props.project = this;
            var _user = User.findOrCreate(_props);
            this.get("users").push(_user, _options);
            return _user;
        },
        addNode: function(_props, _options) {
            _props.project = this;            
            var _node = Node.findOrCreate(_props);
            this.get("nodes").push(_node, _options);
            return _node;
        },
        addEdge: function(_props, _options) {
            _props.project = this;
            var _edge = Edge.findOrCreate(_props);
            this.get("edges").push(_edge, _options);
            return _edge;
        },
        removeNode: function(_model) {
            this.get("nodes").remove(_model);
        },
        removeEdge: function(_model) {
            this.get("edges").remove(_model);
        },
        validate: function(options) {
            var _project = this;
            _(options.users).each(function(_item) {
                _item.project = _project;
            });
            _(options.nodes).each(function(_item) {
                _item.project = _project;
            });
            _(options.edges).each(function(_item) {
                _item.project = _project;
            });
        },
        // Add event handler to remove edges when a node is removed
        initialize: function() {
            var _this = this;
            this.on("remove:nodes", function(_node) {
                _this.get("edges").remove(
                    _this.get("edges").filter(function(_edge) {
                        return _edge.get("from") == _node || _edge.get("to") == _node;
                    })
                );
            });
        }
    });
    
    var RosterUser = Models.RosterUser = Backbone.Model.extend({
        type: "roster_user",               
        idAttribute : "_id",
        
        constructor: function(options) {
            
            if (typeof options !== "undefined") {
                options._id = options._id || options.id || Models.getUID(this);
                options.title = options.title || "(untitled " + this.type + ")";
                options.description = options.description || "";
                options.uri = options.uri || "";
                options.project = options.project || null;
                options.site_id = options.site_id || 0;
                
                if(typeof this.prepare === "function") {
                    options = this.prepare(options);
                }
            }
            Backbone.Model.prototype.constructor.call(this, options);
        },
        
        validate: function() {
            if(!this.type) {
                return "object has no type";
            }
        },
        
        prepare: function(options) {
            options.color = options.color || "#666666";
            return options;
        },
        
        toJSON: function() {
            return {
                _id: this.get("_id"),
                title: this.get("title"),
                uri: this.get("uri"),
                description: this.get("description"),
                color: this.get("color"),
                project: (this.get("project") != null)?this.get("project").get("id"):null,
                site_id: this.get("site_id")
            };
        }
    });
    
    var UsersList = Models.UsersList = Backbone.Collection.extend({
        model: RosterUser
    });
    

}).call(window);

Rkns.defaults = {
    
    language: (navigator.language || navigator.userLanguage || "en"),
        /* GUI Language */
    container: "renkan",
        /* GUI Container DOM element ID */
    search: [],
        /* List of Search Engines */
    bins: [],
           /* List of Bins */
    static_url: "",
        /* URL for static resources */
    show_bins: true,
        /* Show bins in left column */
    properties: [],
        /* Semantic properties for edges */
    show_editor: true,
        /* Show the graph editor... Setting this to "false" only shows the bins part ! */
    read_only: false,
        /* Allows editing of renkan without changing the rest of the GUI. Can be switched on/off on the fly to block/enable editing */
    editor_mode: true,
        /* Switch for Publish/Edit GUI. If editor_mode is false, read_only will be true.  */
    snapshot_mode: false,
        /* In snapshot mode, clicking on the floppy will save a snapshot. Otherwise, it will show the connection status */
    show_top_bar: true,
        /* Show the top bar, (title, buttons, users) */
    default_user_color: "#303030",
    size_bug_fix: true,
        /* Resize the canvas after load (fixes a bug on iPad and FF Mac) */
    force_resize: false,
    allow_double_click: true,
        /* Allows Double Click to create a node on an empty background */
    zoom_on_scroll: true,
        /* Allows to use the scrollwheel to zoom */
    element_delete_delay: 0,
        /* Delay between clicking on the bin on an element and really deleting it
           Set to 0 for delete confirm */
    autoscale_padding: 50,
    
    /* TOP BAR BUTTONS */
    show_search_field: true,
    show_user_list: true,
    user_name_editable: true,
    user_color_editable: true,
    show_save_button: true,
    show_open_button: false,
    show_addnode_button: true,
    show_addedge_button: true,
    show_bookmarklet: true,
    show_fullscreen_button: true,
    home_button_url: false,
    home_button_title: "Home",
    
    /* MINI-MAP OPTIONS */
    
    show_minimap: true,
        /* Show a small map at the bottom right */
    minimap_width: 160,
    minimap_height: 120,
    minimap_padding: 20,
    minimap_background_color: "#ffffff",
    minimap_border_color: "#cccccc",
    minimap_highlight_color: "#ffff00",
    minimap_highlight_weight: 5,
    
    /* EDGE/NODE COMMON OPTIONS */
       
    buttons_background: "#202020",
    buttons_label_color: "#c000c0",
    buttons_label_font_size: 9,
    
    /* NODE DISPLAY OPTIONS */
    
    show_node_circles: true,
        /* Show circles for nodes */
    clip_node_images: true,
        /* Constraint node images to circles */
    node_images_fill_mode: false,
        /* Set to false for "letterboxing" (height/width of node adapted to show full image)
           Set to true for "crop" (adapted to fill circle) */
    node_size_base: 25,
    node_stroke_width: 2,
    selected_node_stroke_width: 4,
    node_fill_color: "#ffffff",
    highlighted_node_fill_color: "#ffff00",
    node_label_distance: 5,
        /* Vertical distance between node and label */
    node_label_max_length: 60,
        /* Maximum displayed text length */
    label_untitled_nodes: "(untitled)",
        /* Label to display on untitled nodes */
    
    /* EDGE DISPLAY OPTIONS */
    
    edge_stroke_width: 2,
    selected_edge_stroke_width: 4,
    edge_label_distance: 0,
    edge_label_max_length: 20,
    edge_arrow_length: 18,
    edge_arrow_width: 12,
    edge_gap_in_bundles: 12,
    label_untitled_edges: "",
    
    /* CONTEXTUAL DISPLAY (TOOLTIP OR EDITOR) OPTIONS */
   
    tooltip_width: 275,
    tooltip_padding: 10,
    tooltip_margin: 15,
    tooltip_arrow_length : 20,
    tooltip_arrow_width : 40,
    tooltip_top_color: "#f0f0f0",
    tooltip_bottom_color: "#d0d0d0",
    tooltip_border_color: "#808080",
    tooltip_border_width: 1,
    
    /* NODE EDITOR OPTIONS */
    
    show_node_editor_uri: true,
    show_node_editor_description: true,
    show_node_editor_size: true,
    show_node_editor_color: true,
    show_node_editor_image: true,
    show_node_editor_creator: true,
    uploaded_image_max_kb: 500,
    
    /* NODE TOOLTIP OPTIONS */
    
    show_node_tooltip_uri: true,
    show_node_tooltip_description: true,
    show_node_tooltip_color: true,
    show_node_tooltip_image: true,
    show_node_tooltip_creator: true,
    
    /* EDGE EDITOR OPTIONS */
    
    show_edge_editor_uri: true,
    show_edge_editor_color: true,
    show_edge_editor_direction: true,
    show_edge_editor_nodes: true,
    show_edge_editor_creator: true,
    
    /* EDGE TOOLTIP OPTIONS */
    
    show_edge_tooltip_uri: true,
    show_edge_tooltip_color: true,
    show_edge_tooltip_nodes: true,
    show_edge_tooltip_creator: true
    
    /* */
    
};
Rkns.i18n = {
    fr: {
        "Edit Node": "Édition d’un nœud",
        "Edit Edge": "Édition d’un lien",
        "Title:": "Titre :",
        "URI:": "URI :",
        "Description:": "Description :",
        "From:": "De :",
        "To:": "Vers :",
        "Image": "Image",
        "Image URL:": "URL d'Image",
        "Choose Image File:": "Choisir un fichier image",
        "Full Screen": "Mode plein écran",
        "Add Node": "Ajouter un nœud",
        "Add Edge": "Ajouter un lien",
        "Save Project": "Enregistrer le projet",
        "Open Project": "Ouvrir un projet",
        "Auto-save enabled": "Enregistrement automatique activé",
        "Connection lost": "Connexion perdue",
        "Created by:": "Créé par :",
        "Zoom In": "Agrandir l’échelle",
        "Zoom Out": "Rapetisser l’échelle",
        "Edit": "Éditer",
        "Remove": "Supprimer",
        "Cancel deletion": "Annuler la suppression",
        "Link to another node": "Créer un lien",
        "Enlarge": "Agrandir",
        "Shrink": "Rétrécir",
        "Click on the background canvas to add a node": "Cliquer sur le fond du graphe pour rajouter un nœud",
        "Click on a first node to start the edge": "Cliquer sur un premier nœud pour commencer le lien",
        "Click on a second node to complete the edge": "Cliquer sur un second nœud pour terminer le lien",
        "Wikipedia": "Wikipédia",
        "Wikipedia in ": "Wikipédia en ",
        "French": "Français",
        "English": "Anglais",
        "Japanese": "Japonais",
        "Untitled project": "Projet sans titre",
        "Lignes de Temps": "Lignes de Temps",
        "Loading, please wait": "Chargement en cours, merci de patienter",
        "Edge color:": "Couleur :",
        "Node color:": "Couleur :",
        "Choose color": "Choisir une couleur",
        "Change edge direction": "Changer le sens du lien",
        "Do you really wish to remove node ": "Voulez-vous réellement supprimer le nœud ",
        "Do you really wish to remove edge ": "Voulez-vous réellement supprimer le lien ",
        "This file is not an image": "Ce fichier n'est pas une image",
        "Image size must be under ": "L'image doit peser moins de ",
        "Size:": "Taille :",
        "KB": "ko",
        "Choose from vocabulary:": "Choisir dans un vocabulaire :",
        "SKOS Documentation properties": "SKOS: Propriétés documentaires",
        "has note": "a pour note",
        "has example": "a pour exemple",
        "has definition": "a pour définition",
        "SKOS Semantic relations": "SKOS: Relations sémantiques",
        "has broader": "a pour concept plus large",
        "has narrower": "a pour concept plus étroit",
        "has related": "a pour concept apparenté",
        "Dublin Core Metadata": "Métadonnées Dublin Core",
        "has contributor": "a pour contributeur",
        "covers": "couvre",
        "created by": "créé par",
        "has date": "a pour date",
        "published by": "édité par",
        "has source": "a pour source",
        "has subject": "a pour sujet",
        "Dragged resource": "Ressource glisée-déposée",
        "Search the Web": "Rechercher en ligne",
        "Search in Bins": "Rechercher dans les chutiers",
        "Close bin": "Fermer le chutier",
        "Refresh bin": "Rafraîchir le chutier",
        "(untitled)": "(sans titre)",
        "Select contents:": "Sélectionner des contenus :",
        "Drag items from this website, drop them in Renkan": "Glissez des éléments de ce site web vers Renkan",
        "Drag this button to your bookmark bar. When on a third-party website, click it to enable drag-and-drop from the website to Renkan.": "Glissez ce bouton vers votre barre de favoris. Ensuite, depuis un site tiers, cliquez dessus pour activer 'Drag-to-Add' puis glissez des éléments de ce site vers Renkan"
    }
};
/* paper-renderer.js */

(function(root) {

"use strict";

var Rkns = root.Rkns,
    _ = Rkns._,
    $ = Rkns.$;

/* Rkns.Renderer Object */

/* This object contains constants, utility functions and classes for Renkan's Graph Manipulation GUI */

var Renderer = Rkns.Renderer = {},
        /* The minimum distance (in pixels) the mouse has to move to consider an element was dragged */
    _MIN_DRAG_DISTANCE = 2,
        /* Distance between the inner and outer radius of buttons that appear when hovering on a node */
    _NODE_BUTTON_WIDTH = 40,
    _EDGE_BUTTON_INNER = 2,
    _EDGE_BUTTON_OUTER = 40,
        /* Constants used to know if a specific action is to be performed when clicking on the canvas */
    _CLICKMODE_ADDNODE = 1,
    _CLICKMODE_STARTEDGE = 2,
    _CLICKMODE_ENDEDGE = 3,
        /* Node size step: Used to calculate the size change when clicking the +/- buttons */
    _NODE_SIZE_STEP = Math.LN2/4,
    _MIN_SCALE = 1/20,
    _MAX_SCALE = 20,
    _MOUSEMOVE_RATE = 80,
    _DOUBLETAP_DELAY = 800,
        /* Maximum distance in pixels (squared, to reduce calculations)
         * between two taps when double-tapping on a touch terminal */
    _DOUBLETAP_DISTANCE = 20*20,
        /* A placeholder so a default colour is displayed when a node has a null value for its user property */
    _USER_PLACEHOLDER = function(_renkan) {
        return {
            color: _renkan.options.default_user_color,
            title: _renkan.translate("(unknown user)"),
            get: function(attr) {
                return this[attr] || false;
            }
        };
    },
        /* The code for the "Drag and Add Bookmarklet", slightly minified and with whitespaces removed, though
         * it doesn't seem that it's still a requirement in newer browsers (i.e. the ones compatibles with canvas drawing)
         */
    _BOOKMARKLET_CODE = function(_renkan) {
        return "(function(a,b,c,d,e,f,h,i,j,k,l,m,n,o,p,q,r){a=document;b=a.body;c=a.location.href;j='draggable';m='text/x-iri-';d=a.createElement('div');d.innerHTML='<p_style=\"position:fixed;top:0;right:0;font:bold_18px_sans-serif;color:#fff;background:#909;padding:10px;z-index:100000;\">"
        + _renkan.translate("Drag items from this website, drop them in Renkan").replace(/ /g,"_")
        + "</p>'.replace(/_/g,String.fromCharCode(32));b.appendChild(d);e=[{r:/https?:\\/\\/[^\\/]*twitter\\.com\\//,s:'.tweet',n:'twitter'},{r:/https?:\\/\\/[^\\/]*google\\.[^\\/]+\\//,s:'.g',n:'google'},{r:/https?:\\/\\/[^\\/]*lemonde\\.fr\\//,s:'[data-vr-contentbox]',n:'lemonde'}];f=false;e.forEach(function(g){if(g.r.test(c)){f=g;}});if(f){h=function(){Array.prototype.forEach.call(a.querySelectorAll(f.s),function(i){i[j]=true;k=i.style;k.borderWidth='2px';k.borderColor='#909';k.borderStyle='solid';k.backgroundColor='rgba(200,0,180,.1)';})};window.setInterval(h,500);h();};a.addEventListener('dragstart',function(k){l=k.dataTransfer;l.setData(m+'source-uri',c);l.setData(m+'source-title',a.title);n=k.target;if(f){o=n;while(!o.attributes[j]){o=o.parentNode;if(o==b){break;}}}if(f&&o.attributes[j]){p=o.cloneNode(true);l.setData(m+'specific-site',f.n)}else{q=a.getSelection();if(q.type==='Range'||!q.type){p=q.getRangeAt(0).cloneContents();}else{p=n.cloneNode();}}r=a.createElement('div');r.appendChild(p);l.setData('text/x-iri-selected-text',r.textContent.trim());l.setData('text/x-iri-selected-html',r.innerHTML);},false);})();";
    },
        /* Shortens text to the required length then adds ellipsis */
    shortenText = function(_text, _maxlength) {
        return (_text.length > _maxlength ? (_text.substr(0,_maxlength) + '…') : _text);
    },
        /* Drawing an edit box with an arrow and positioning the edit box according to the position of the node/edge being edited
         * Called by Rkns.Renderer.NodeEditor and Rkns.Renderer.EdgeEditor */
    drawEditBox = function(_options, _coords, _path, _xmargin, _selector) {
        _selector.css({
            width: ( _options.tooltip_width - 2* _options.tooltip_padding )
        });
        var _height = _selector.outerHeight() + 2* _options.tooltip_padding,
            _isLeft = (_coords.x < paper.view.center.x ? 1 : -1),
            _left = _coords.x + _isLeft * ( _xmargin + _options.tooltip_arrow_length ),
            _right = _coords.x + _isLeft * ( _xmargin + _options.tooltip_arrow_length + _options.tooltip_width ),
            _top = _coords.y - _height / 2;
        if (_top + _height > (paper.view.size.height - _options.tooltip_margin)) {
            _top = Math.max( paper.view.size.height - _options.tooltip_margin, _coords.y + _options.tooltip_arrow_width / 2 ) - _height;
        }
        if (_top < _options.tooltip_margin) {
            _top = Math.min( _options.tooltip_margin, _coords.y - _options.tooltip_arrow_width / 2 );
        }
        var _bottom = _top + _height;
        _path.segments[0].point
            = _path.segments[7].point
            = _coords.add([_isLeft * _xmargin, 0]);
        _path.segments[1].point.x
            = _path.segments[2].point.x
            = _path.segments[5].point.x
            = _path.segments[6].point.x
            = _left;
        _path.segments[3].point.x
            = _path.segments[4].point.x
            = _right;
        _path.segments[2].point.y
            = _path.segments[3].point.y
            = _top;
        _path.segments[4].point.y
            = _path.segments[5].point.y
            = _bottom;
        _path.segments[1].point.y = _coords.y - _options.tooltip_arrow_width / 2;
        _path.segments[6].point.y = _coords.y + _options.tooltip_arrow_width / 2;
        _path.closed = true;
        _path.fillColor = new paper.GradientColor(new paper.Gradient([_options.tooltip_top_color, _options.tooltip_bottom_color]), [0,_top], [0, _bottom]);
        _selector.css({
            left: (_options.tooltip_padding + Math.min(_left, _right)),
            top: (_options.tooltip_padding + _top)
        });
        return _path;
    };

/* Rkns.Renderer._BaseRepresentation Class */

/* In Renkan, a "Representation" is a sort of ViewModel (in the MVVM paradigm) and bridges the gap between
 * models (written with Backbone.js) and the view (written with Paper.js)
 * Renkan's representations all inherit from Rkns.Renderer._BaseRepresentation '*/

var _BaseRepresentation = Renderer._BaseRepresentation = function(_renderer, _model) {
    if (typeof _renderer !== "undefined") {
        this.renderer = _renderer;
        this.renkan = _renderer.renkan;
        this.project = _renderer.renkan.project;
        this.options = _renderer.renkan.options;
        this.model = _model;
        if (this.model) {
            var _this = this;
            this._changeBinding = function() {
                _this.redraw();
            };
            this._removeBinding = function() {
                _renderer.removeRepresentation(_this);
                _(function() {
                    _renderer.redraw();
                }).defer();
            };
            this._selectBinding = function() {
                _this.select();
            };
            this._unselectBinding = function() {
                _this.unselect();
            };
            this.model.on("change", this._changeBinding );
            this.model.on("remove", this._removeBinding );
            this.model.on("select", this._selectBinding );
            this.model.on("unselect", this._unselectBinding );
        }
    }
};

/* Rkns.Renderer._BaseRepresentation Methods */

_(_BaseRepresentation.prototype).extend({
    _super: function(_func) {
        return _BaseRepresentation.prototype[_func].apply(this, Array.prototype.slice.call(arguments, 1));
    },
    redraw: function() {},
    moveTo: function() {},
    show: function() {},
    hide: function() {},
    select: function() {
        if (this.model) {
            this.model.trigger("selected");
        }
    },
    unselect: function() {
        if (this.model) {
            this.model.trigger("unselected");
        }
    },
    highlight: function() {},
    unhighlight: function() {},
    mousedown: function() {},
    mouseup: function() {
        if (this.model) {
            this.model.trigger("clicked");
        }
    },
    destroy: function() {
        if (this.model) {
            this.model.off("change", this._changeBinding );
            this.model.off("remove", this._removeBinding );
            this.model.off("select", this._selectBinding );
            this.model.off("unselect", this._unselectBinding );
        }
    }
});

/* End of Rkns.Renderer._BaseRepresentation Class */

/* Rkns.Renderer._BaseButton Class */

/* BaseButton is extended by contextual buttons that appear when hovering on nodes and edges */

var _BaseButton = Renderer._BaseButton = Rkns.Utils.inherit(_BaseRepresentation);

_(_BaseButton.prototype).extend({
moveTo: function(_pos) {
    this.sector.moveTo(_pos);
},
show: function() {
    this.sector.show();
},
hide: function() {
    this.sector.hide();
},
select: function() {
    this.sector.select();
},
unselect: function(_newTarget) {
    this.sector.unselect();
    if (!_newTarget || (_newTarget !== this.source_representation && _newTarget.source_representation !== this.source_representation)) {
        this.source_representation.unselect();
    }
},
destroy: function() {
    this.sector.destroy();
}
});

/* End of Rkns.Renderer._BaseButton Class */

/* Rkns.Renderer.Node Class */

/* The representation for the node : A circle, with an image inside and a text label underneath.
 * The circle and the image are drawn on canvas and managed by Paper.js.
 * The text label is an HTML node, managed by jQuery. */

var NodeRepr = Renderer.Node = Rkns.Utils.inherit(_BaseRepresentation);

_(NodeRepr.prototype).extend({
_init: function() {
    this.renderer.node_layer.activate();
    this.type = "Node";
    this.circle = new paper.Path.Circle([0, 0], 1);
    this.circle.__representation = this;
    if (this.options.show_node_circles) {
        this.circle.strokeWidth = this.options.node_stroke_width;
        this.h_ratio = 1;
    } else {
        this.h_ratio = 0;
    }
    this.title = $('<div class="Rk-Label">').appendTo(this.renderer.labels_$);
    if (this.options.editor_mode) {
        this.normal_buttons = [
            new NodeEditButton(this.renderer, null),
            new NodeRemoveButton(this.renderer, null),
            new NodeLinkButton(this.renderer, null),
            new NodeEnlargeButton(this.renderer, null),
            new NodeShrinkButton(this.renderer, null)
        ];
        this.pending_delete_buttons = [
            new NodeRevertButton(this.renderer, null)
        ];
        this.all_buttons = this.normal_buttons.concat(this.pending_delete_buttons);
        for (var i = 0; i < this.all_buttons.length; i++) {
            this.all_buttons[i].source_representation = this;
        }
        this.active_buttons = [];
    } else {
        this.active_buttons = this.all_buttons = [];
    }
    this.last_circle_radius = 1;
    
    if (this.renderer.minimap) {
        this.renderer.minimap.node_layer.activate();
        this.minimap_circle = new paper.Path.Circle([0, 0], 1);
        this.minimap_circle.__representation = this.renderer.minimap.miniframe.__representation;
        this.renderer.minimap.node_group.addChild(this.minimap_circle);
    }
},
redraw: function(_dontRedrawEdges) {
    var _model_coords = new paper.Point(this.model.get("position")),
        _baseRadius = this.options.node_size_base * Math.exp((this.model.get("size") || 0) * _NODE_SIZE_STEP);
    if (!this.is_dragging || !this.paper_coords) {
        this.paper_coords = this.renderer.toPaperCoords(_model_coords);
    }
    this.circle_radius = _baseRadius * this.renderer.scale;
    if (this.last_circle_radius !== this.circle_radius) {
        this.all_buttons.forEach(function(b) {
            b.setSectorSize();
        });
        var square = new paper.Size(this.circle_radius, this.circle_radius),
            topleft = this.paper_coords.subtract(square),
            bounds = new paper.Rectangle(topleft, square.multiply(2));
        this.circle.scale(this.circle_radius / this.last_circle_radius);
        if (this.node_image) {
            this.node_image.scale(this.circle_radius / this.last_circle_radius);
        }
    }
    this.circle.position = this.paper_coords;
    if (this.node_image) {
        this.node_image.position = this.paper_coords.subtract(this.image_delta.multiply(this.circle_radius));
    }
    this.last_circle_radius = this.circle_radius;
    
    var old_act_btn = this.active_buttons;
    
    if (this.model.get("delete_scheduled")) {
        var opacity = .5;
        this.active_buttons = this.pending_delete_buttons;
        this.circle.dashArray = [2,2];
    } else {
        var opacity = 1;
        this.active_buttons = this.normal_buttons;
        this.circle.dashArray = null;
    }
    
    if (this.selected && this.renderer.isEditable()) {
        if (old_act_btn !== this.active_buttons) {
            old_act_btn.forEach(function(b) {
                b.hide();
            });
        }
        this.active_buttons.forEach(function(b) {
            b.show();
        });
    }
    
    if (this.node_image) {
        this.node_image.opacity = this.highlighted ? opacity * .5 : (opacity - .01);
    }
    
    this.circle.fillColor = this.highlighted ? this.options.highlighted_node_fill_color : this.options.node_fill_color;
    
    this.circle.opacity = this.options.show_node_circles ? opacity : .01;
    
    var _text = this.model.get("title") || this.renkan.translate(this.options.label_untitled_nodes) || "";
    _text = shortenText(_text, this.options.node_label_max_length);
    
    if (typeof this.highlighted === "object") {
        this.title.html(this.highlighted.replace(_(_text).escape(),'<span class="Rk-Highlighted">$1</span>'));
    } else {
        this.title.text(_text);
    }
    
    this.title.css({
        left: this.paper_coords.x,
        top: this.paper_coords.y + this.circle_radius * this.h_ratio + this.options.node_label_distance,
        opacity: opacity
    });
    var _color = this.model.get("color") || (this.model.get("created_by") || _USER_PLACEHOLDER(this.renkan)).get("color");
    this.circle.strokeColor = _color;
    var _pc = this.paper_coords;
    this.all_buttons.forEach(function(b) {
        b.moveTo(_pc);
    });
    var lastImage = this.img;
    this.img = this.model.get("image");
    if (this.img && this.img !== lastImage) {
        this.showImage();
    }
    if (this.node_image && !this.img) {
        this.node_image.remove();
        delete this.node_image;
    }
    
    if (this.renderer.minimap) {
        this.minimap_circle.fillColor = _color;
        var minipos = this.renderer.toMinimapCoords(_model_coords),
            miniradius = this.renderer.minimap.scale * _baseRadius,
            minisize = new paper.Size([miniradius, miniradius]);
        this.minimap_circle.fitBounds(minipos.subtract(minisize), minisize.multiply(2));
    }
    
    if (!_dontRedrawEdges) {
        var _this = this;
        _.each(
            this.project.get("edges").filter(
                function (ed) {
                    return ((ed.get("to") === _this.model) || (ed.get("from") === _this.model));
                }
            ),
            function(edge, index, list) {
                var repr = _this.renderer.getRepresentationByModel(edge);
                if (repr && typeof repr.from_representation !== "undefined" && typeof repr.from_representation.paper_coords !== "undefined" && typeof repr.to_representation !== "undefined" && typeof repr.to_representation.paper_coords !== "undefined") {
                    repr.redraw();
                }
            }
        );
    }

},
showImage: function() {
    if (typeof this.renderer.image_cache[this.img] === "undefined") {
        var _image = new Image();
        this.renderer.image_cache[this.img] = _image;
        _image.src = this.img;
    } else {
        var _image = this.renderer.image_cache[this.img];
    }
    if (_image.width) {
        if (this.node_image) {
            this.node_image.remove();
        }
        this.renderer.node_layer.activate();
        var width = _image.width,
            height = _image.height,
            clipPath = this.model.get("clip-path"),
            hasClipPath = (typeof clipPath !== "undefined" && clipPath);
        if (hasClipPath) {
            var _clip = new paper.Path(),
                instructions = clipPath.match(/[a-z][^a-z]+/gi) || [],
                lastCoords = [0,0],
                minX = Infinity,
                minY = Infinity,
                maxX = -Infinity,
                maxY = -Infinity;
                
            var transformCoords = function(tabc, relative) {
                var newCoords = tabc.slice(1).map(function(v, k) {
                    var res = parseFloat(v),
                        isY = k % 2;
                    if (isY) {
                        res = ( res - .5 ) * height;
                    } else {
                        res = ( res - .5 ) * width;
                    }
                    if (relative) {
                        res += lastCoords[isY];
                    }
                    if (isY) {
                        minY = Math.min(minY, res);
                        maxY = Math.max(maxY, res);
                    } else {
                        minX = Math.min(minX, res);
                        maxX = Math.max(maxX, res);
                    }
                    return res;
                });
                lastCoords = newCoords.slice(-2);
                return newCoords;
            };
            
            instructions.forEach(function(instr) {
                var coords = instr.match(/([a-z]|[0-9.-]+)/ig) || [""];
                switch(coords[0]) {
                    case "M":
                        _clip.moveTo(transformCoords(coords));
                    break;
                    case "m":
                        _clip.moveTo(transformCoords(coords, true));
                    break;
                    case "L":
                        _clip.lineTo(transformCoords(coords));
                    break;
                    case "l":
                        _clip.lineTo(transformCoords(coords, true));
                    break;
                    case "C":
                        _clip.cubicCurveTo(transformCoords(coords));
                    break;
                    case "c":
                        _clip.cubicCurveTo(transformCoords(coords, true));
                    break;
                    case "Q":
                        _clip.quadraticCurveTo(transformCoords(coords));
                    break;
                    case "q":
                        _clip.quadraticCurveTo(transformCoords(coords, true));
                    break;
                }
            });
            
            var baseRadius = Math[this.options.node_images_fill_mode ? "min" : "max"](maxX - minX, maxY - minY) / 2,
                centerPoint = new paper.Point((maxX + minX) / 2, (maxY + minY) / 2);
            if (!this.options.show_node_circles) {
                this.h_ratio = (maxY - minY) / (2 * baseRadius);
            }
        } else {
            var baseRadius = Math[this.options.node_images_fill_mode ? "min" : "max"](width, height) / 2,
                centerPoint = new paper.Point(0,0);
            if (!this.options.show_node_circles) {
                this.h_ratio = height / (2 * baseRadius);
            }
        }
        var _raster = new paper.Raster(_image);
        if (hasClipPath) {
            _raster = new paper.Group(_clip, _raster);
            _raster.opacity = .99;
            /* This is a workaround to allow clipping at group level
             * If opacity was set to 1, paper.js would merge all clipping groups in one (known bug).
            */
            _raster.clipped = true;
            _clip.__representation = this;
        }
        if (this.options.clip_node_images) {
            var _circleClip = new paper.Path.Circle(centerPoint, baseRadius);
            _raster = new paper.Group(_circleClip, _raster);
            _raster.opacity = .99;
            _raster.clipped = true;
            _circleClip.__representation = this;
        }
        this.image_delta = centerPoint.divide(baseRadius);
        this.node_image = _raster;
        this.node_image.__representation = _this;
        this.node_image.scale(this.circle_radius / baseRadius);
        this.node_image.position = this.paper_coords.subtract(this.image_delta.multiply(this.circle_radius));
        this.redraw();
        this.renderer.throttledPaperDraw();
    } else {
        var _this = this;
        $(_image).on("load", function() {
            _this.showImage();
        });
    }
},
paperShift: function(_delta) {
    if (this.options.editor_mode) {
        if (!this.renkan.read_only) {
            this.is_dragging = true;
            this.paper_coords = this.paper_coords.add(_delta);
            this.redraw();
        }
    } else {
        this.renderer.paperShift(_delta);
    }
},
openEditor: function() {
    this.renderer.removeRepresentationsOfType("editor");
    var _editor = this.renderer.addRepresentation("NodeEditor",null);
    _editor.source_representation = this;
    _editor.draw();
},
select: function() {
    this.selected = true;
    this.circle.strokeWidth = this.options.selected_node_stroke_width;
    if (this.renderer.isEditable()) {
        this.active_buttons.forEach(function(b) {
            b.show();
        });
    }
    var _uri = this.model.get("uri");
    if (_uri) {
        $('.Rk-Bin-Item').each(function() {
            var _el = $(this);
            if (_el.attr("data-uri") == _uri) {
                _el.addClass("selected");
            }
        });
    }
    if (!this.options.editor_mode) {
        this.openEditor();
    }
    
    if (this.renderer.minimap) {
        this.minimap_circle.strokeWidth = this.options.minimap_highlight_weight;
        this.minimap_circle.strokeColor = this.options.minimap_highlight_color;
    }
    this._super("select");
},
unselect: function(_newTarget) {
    if (!_newTarget || _newTarget.source_representation !== this) {
        this.selected = false;
        this.all_buttons.forEach(function(b) {
            b.hide();
        });
        this.circle.strokeWidth = this.options.node_stroke_width;
        $('.Rk-Bin-Item').removeClass("selected");
        if (this.renderer.minimap) {
            this.minimap_circle.strokeColor = undefined;
        }
        this._super("unselect");
    }
},
highlight: function(textToReplace) {
    var hlvalue = textToReplace || true;
    if (this.highlighted === hlvalue) {
        return;
    }
    this.highlighted = hlvalue;
    this.redraw();
    this.renderer.throttledPaperDraw();
},
unhighlight: function() {
    if (!this.highlighted) {
        return;
    }
    this.highlighted = false;
    this.redraw();
    this.renderer.throttledPaperDraw();
},
saveCoords: function() {
    var _coords = this.renderer.toModelCoords(this.paper_coords),
        _data = {
            position: {
                x: _coords.x,
                y: _coords.y
            }
        };
    if (this.renderer.isEditable()) {
        this.model.set(_data);
    }
},
mousedown: function(_event, _isTouch) {
    if (_isTouch) {
        this.renderer.unselectAll();
        this.select();
    }
},
mouseup: function(_event, _isTouch) {
    if (this.renderer.is_dragging && this.renderer.isEditable()) {
        this.saveCoords();
    } else {
        if (!_isTouch && !this.model.get("delete_scheduled")) {
            this.openEditor();
        }
        this.model.trigger("clicked");
    }
    this.renderer.click_target = null;
    this.renderer.is_dragging = false;
    this.is_dragging = false;
},
destroy: function(_event) {
    this._super("destroy");
    this.all_buttons.forEach(function(b) {
        b.destroy();
    });
    this.circle.remove();
    this.title.remove();
    if (this.renderer.minimap) {
        this.minimap_circle.remove();
    }
    if (this.node_image) {
        this.node_image.remove();
    }
}
});

/* */

var Edge = Renderer.Edge = Rkns.Utils.inherit(_BaseRepresentation);

_(Edge.prototype).extend({
_init: function() {
    this.renderer.edge_layer.activate();
    this.type = "Edge";
    this.from_representation = this.renderer.getRepresentationByModel(this.model.get("from"));
    this.to_representation = this.renderer.getRepresentationByModel(this.model.get("to"));
    this.bundle = this.renderer.addToBundles(this);
    this.line = new paper.Path();
    this.line.add([0,0],[0,0],[0,0]);
    this.line.__representation = this;
    this.line.strokeWidth = this.options.edge_stroke_width;
    this.arrow = new paper.Path();
    this.arrow.add(
        [ 0, 0 ],
        [ this.options.edge_arrow_length, this.options.edge_arrow_width / 2 ],
        [ 0, this.options.edge_arrow_width ]
    );
    this.arrow.__representation = this;
    this.text = $('<div class="Rk-Label Rk-Edge-Label">').appendTo(this.renderer.labels_$);
    this.arrow_angle = 0;
    if (this.options.editor_mode) {
        this.normal_buttons = [
            new EdgeEditButton(this.renderer, null),
            new EdgeRemoveButton(this.renderer, null)
        ];
        this.pending_delete_buttons = [
            new EdgeRevertButton(this.renderer, null)
        ];
        this.all_buttons = this.normal_buttons.concat(this.pending_delete_buttons);
        for (var i = 0; i < this.all_buttons.length; i++) {
            this.all_buttons[i].source_representation = this;
        }
        this.active_buttons = [];
    } else {
        this.active_buttons = this.all_buttons = [];
    }
    
    if (this.renderer.minimap) {
        this.renderer.minimap.edge_layer.activate();
        this.minimap_line = new paper.Path();
        this.minimap_line.add([0,0],[0,0]);
        this.minimap_line.__representation = this.renderer.minimap.miniframe.__representation;
        this.minimap_line.strokeWidth = 1;
    }
},
redraw: function() {
    var from = this.model.get("from"),
        to = this.model.get("to");
    if (!from || !to) {
        return;
    }
    this.from_representation = this.renderer.getRepresentationByModel(from);
    this.to_representation = this.renderer.getRepresentationByModel(to);
    if (typeof this.from_representation === "undefined" || typeof this.to_representation === "undefined") {
        return;
    }
    var _p0a = this.from_representation.paper_coords,
        _p1a = this.to_representation.paper_coords,
        _v = _p1a.subtract(_p0a),
        _r = _v.length,
        _u = _v.divide(_r),
        _ortho = new paper.Point([- _u.y, _u.x]),
        _group_pos = this.bundle.getPosition(this),
        _delta = _ortho.multiply( this.options.edge_gap_in_bundles * _group_pos ),
        _p0b = _p0a.add(_delta), /* Adding a 4 px difference */
        _p1b = _p1a.add(_delta), /* to differentiate bundled links */
        _a = _v.angle,
        _textdelta = _ortho.multiply(this.options.edge_label_distance),
        _handle = _v.divide(3),
        _color = this.model.get("color") || this.model.get("color") || (this.model.get("created_by") || _USER_PLACEHOLDER(this.renkan)).get("color");
    
    if (this.model.get("delete_scheduled") || this.from_representation.model.get("delete_scheduled") || this.to_representation.model.get("delete_scheduled")) {
        var opacity = .5;
        this.line.dashArray = [2, 2];
    } else {
        var opacity = 1;
        this.line.dashArray = null;
    }
    
    var old_act_btn = this.active_buttons;
    
    this.active_buttons = this.model.get("delete_scheduled") ? this.pending_delete_buttons : this.normal_buttons;
    
    if (this.selected && this.renderer.isEditable() && old_act_btn !== this.active_buttons) {
        old_act_btn.forEach(function(b) {
            b.hide();
        });
        this.active_buttons.forEach(function(b) {
            b.show();
        });
    }
    
    this.paper_coords = _p0b.add(_p1b).divide(2);
    this.line.strokeColor = _color;
    this.line.opacity = opacity;
    this.line.segments[0].point = _p0a;
    this.line.segments[1].point = this.paper_coords;
    this.line.segments[1].handleIn = _handle.multiply(-1);
    this.line.segments[1].handleOut = _handle;
    this.line.segments[2].point = _p1a;
    this.arrow.rotate(_a - this.arrow_angle);
    this.arrow.fillColor = _color;
    this.arrow.opacity = opacity;
    this.arrow.position = this.paper_coords;
    this.arrow_angle = _a;
    if (_a > 90) {
        _a -= 180;
        _textdelta = _textdelta.multiply(-1);
    }
    if (_a < -90) {
        _a += 180;
        _textdelta = _textdelta.multiply(-1);
    }
    var _text = this.model.get("title") || this.renkan.translate(this.options.label_untitled_edges) || "";
    _text = shortenText(_text, this.options.node_label_max_length);
    this.text.text(_text);
    var _textpos = this.paper_coords.add(_textdelta);
    this.text.css({
        left: _textpos.x,
        top: _textpos.y,
        transform: "rotate(" + _a + "deg)",
        "-moz-transform": "rotate(" + _a + "deg)",
        "-webkit-transform": "rotate(" + _a + "deg)",
        opacity: opacity
    });
    this.text_angle = _a;
    
    var _pc = this.paper_coords;
    this.all_buttons.forEach(function(b) {
        b.moveTo(_pc);
    });
    
    if (this.renderer.minimap) {
        this.minimap_line.strokeColor = _color;
        this.minimap_line.segments[0].point = this.renderer.toMinimapCoords(new paper.Point(this.from_representation.model.get("position")));
         this.minimap_line.segments[1].point = this.renderer.toMinimapCoords(new paper.Point(this.to_representation.model.get("position")));
    }
},
openEditor: function() {
    this.renderer.removeRepresentationsOfType("editor");
    var _editor = this.renderer.addRepresentation("EdgeEditor",null);
    _editor.source_representation = this;
    _editor.draw();
},
select: function() {
    this.selected = true;
    this.line.strokeWidth = this.options.selected_edge_stroke_width;
    if (this.renderer.isEditable()) {
        this.active_buttons.forEach(function(b) {
            b.show();
        });
    }
    if (!this.options.editor_mode) {
        this.openEditor();
    }
    this._super("select");
},
unselect: function(_newTarget) {
    if (!_newTarget || _newTarget.source_representation !== this) {
        this.selected = false;
        if (this.options.editor_mode) {
            this.all_buttons.forEach(function(b) {
                b.hide();
            });
        }
        this.line.strokeWidth = this.options.edge_stroke_width;
        this._super("unselect");
    }
},
mousedown: function(_event, _isTouch) {
    if (_isTouch) {
        this.renderer.unselectAll();
        this.select();
    }
},
mouseup: function(_event, _isTouch) {
    if (!this.renkan.read_only && this.renderer.is_dragging) {
        this.from_representation.saveCoords();
        this.to_representation.saveCoords();
        this.from_representation.is_dragging = false;
        this.to_representation.is_dragging = false;
    } else {
        if (!_isTouch) {
            this.openEditor();
        }
        this.model.trigger("clicked");
    }
    this.renderer.click_target = null;
    this.renderer.is_dragging = false;
},
paperShift: function(_delta) {
    if (this.options.editor_mode) {
        if (!this.options.read_only) {
            this.from_representation.paperShift(_delta);
            this.to_representation.paperShift(_delta);
        }
    } else {
        this.renderer.paperShift(_delta);
    }
},
destroy: function() {
    this._super("destroy");
    this.line.remove();
    this.arrow.remove();
    this.text.remove();
    if (this.renderer.minimap) {
        this.minimap_line.remove();
    }
    this.all_buttons.forEach(function(b) {
        b.destroy();
    });
    var _this = this;
    this.bundle.edges = _(this.bundle.edges).reject(function(_edge) {
        return _edge === _this;
    });
}
});

/* */

var TempEdge = Renderer.TempEdge = Rkns.Utils.inherit(_BaseRepresentation);

_(TempEdge.prototype).extend({
_init: function() {
    this.renderer.edge_layer.activate();
    this.type = "Temp-edge";
    
    var _color = (this.project.get("users").get(this.renkan.current_user) || _USER_PLACEHOLDER(this.renkan)).get("color");
    this.line = new paper.Path();
    this.line.strokeColor = _color;
    this.line.dashArray = [4, 2];
    this.line.strokeWidth = this.options.selected_edge_stroke_width;
    this.line.add([0,0],[0,0]);
    this.line.__representation = this;
    this.arrow = new paper.Path();
    this.arrow.fillColor = _color;
    this.arrow.add(
        [ 0, 0 ],
        [ this.options.edge_arrow_length, this.options.edge_arrow_width / 2 ],
        [ 0, this.options.edge_arrow_width ]
    );
    this.arrow.__representation = this;
    this.arrow_angle = 0;
},
redraw: function() {
    var _p0 = this.from_representation.paper_coords,
        _p1 = this.end_pos,
        _a = _p1.subtract(_p0).angle,
        _c = _p0.add(_p1).divide(2);
    this.line.segments[0].point = _p0;
    this.line.segments[1].point = _p1;
    this.arrow.rotate(_a - this.arrow_angle);
    this.arrow.position = _c;
    this.arrow_angle = _a;
},
paperShift: function(_delta) {
    if (!this.renderer.isEditable()) {
        this.renderer.removeRepresentation(_this);
        paper.view.draw();
        return;
    }
    this.end_pos = this.end_pos.add(_delta);
    var _hitResult = paper.project.hitTest(this.end_pos);
    this.renderer.findTarget(_hitResult);
    this.redraw();
},
mouseup: function(_event, _isTouch) {
    var _hitResult = paper.project.hitTest(_event.point),
        _model = this.from_representation.model,
        _endDrag = true;
    if (_hitResult && typeof _hitResult.item.__representation !== "undefined") {
        var _target = _hitResult.item.__representation;
        if (_target.type.substr(0,4) === "Node") {
            var _destmodel = _target.model || _target.source_representation.model;
            if (_model !== _destmodel) {
                var _data = {
                    id: Rkns.Utils.getUID('edge'),
                    created_by: this.renkan.current_user,
                    from: _model,
                    to: _destmodel
                };
                if (this.renderer.isEditable()) {
                    this.project.addEdge(_data);
                }
            }
        }
        
        if (_model === _target.model || (_target.source_representation && _target.source_representation.model === _model)) {
            _endDrag = false;
            this.renderer.is_dragging = true;
        }
    }
    if (_endDrag) {
        this.renderer.click_target = null;
        this.renderer.is_dragging = false;
        this.renderer.removeRepresentation(this);
        paper.view.draw();
    }
},
destroy: function() {
    this.arrow.remove();
    this.line.remove();
}
});

/* */

var _BaseEditor = Renderer._BaseEditor = Rkns.Utils.inherit(_BaseRepresentation);

_(_BaseEditor.prototype).extend({
_init: function() {
    this.renderer.buttons_layer.activate();
    this.type = "editor";
    this.editor_block = new paper.Path();
    var _pts = _(_.range(8)).map(function() {return [0,0];});
    this.editor_block.add.apply(this.editor_block, _pts);
    this.editor_block.strokeWidth = this.options.tooltip_border_width;
    this.editor_block.strokeColor = this.options.tooltip_border_color;
    this.editor_block.opacity = .8;
    this.editor_$ = $('<div>')
        .appendTo(this.renderer.editor_$)
        .css({
            position: "absolute",
            opacity: .8
        })
        .hide();
},
destroy: function() {
    this.editor_block.remove();
    this.editor_$.remove();
}
});

/* */

var NodeEditor = Renderer.NodeEditor = Rkns.Utils.inherit(_BaseEditor);

_(NodeEditor.prototype).extend({
template: _.template(
    '<h2><span class="Rk-CloseX">&times;</span><%-renkan.translate("Edit Node")%></span></h2>'
    + '<p><label><%-renkan.translate("Title:")%></label><input class="Rk-Edit-Title" type="text" value="<%-node.title%>"/></p>'
    + '<% if (options.show_node_editor_uri) { %><p><label><%-renkan.translate("URI:")%></label><input class="Rk-Edit-URI" type="text" value="<%-node.uri%>"/><a class="Rk-Edit-Goto" href="<%-node.uri%>" target="_blank"></a></p><% } %>'
    + '<% if (options.show_node_editor_description) { %><p><label><%-renkan.translate("Description:")%></label><textarea class="Rk-Edit-Description"><%-node.description%></textarea></p><% } %>'
    + '<% if (options.show_node_editor_size) { %><p><span class="Rk-Editor-Label"><%-renkan.translate("Size:")%></span><a href="#" class="Rk-Edit-Size-Down">-</a><span class="Rk-Edit-Size-Value"><%-node.size%></span><a href="#" class="Rk-Edit-Size-Up">+</a></p><% } %>'
    + '<% if (options.show_node_editor_color) { %><div class="Rk-Editor-p"><span class="Rk-Editor-Label"><%-renkan.translate("Node color:")%></span><div class="Rk-Edit-ColorPicker-Wrapper"><span class="Rk-Edit-Color" style="background:<%-node.color%>;"><span class="Rk-Edit-ColorTip"></span></span>'
    + '<%= renkan.colorPicker %><span class="Rk-Edit-ColorPicker-Text"><%- renkan.translate("Choose color") %></span></div></div><% } %>'
    + '<% if (options.show_node_editor_image) { %><div class="Rk-Edit-ImgWrap"><div class="Rk-Edit-ImgPreview"><img src="<%-node.image || node.image_placeholder%>" />'
    + '<% if (node.clip_path) { %><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewbox="0 0 1 1" preserveAspectRatio="none"><path style="stroke-width: .02; stroke:red; fill-opacity:.3; fill:red;" d="<%- node.clip_path %>"/></svg><% }%>'
    + '</div></div><p><label><%-renkan.translate("Image URL:")%></label><input class="Rk-Edit-Image" type="text" value="<%-node.image%>"/></p>'
    + '<p><label><%-renkan.translate("Choose Image File:")%></label><input class="Rk-Edit-Image-File" type="file" accept="image/*"/></p><% } %>'    
    + '<% if (options.show_node_editor_creator && node.has_creator) { %><p><span class="Rk-Editor-Label"><%-renkan.translate("Created by:")%></span> <span class="Rk-UserColor" style="background:<%-node.created_by_color%>;"></span><%- shortenText(node.created_by_title, 25) %></p><% } %>'
),
readOnlyTemplate: _.template(
    '<h2><span class="Rk-CloseX">&times;</span><% if (options.show_node_tooltip_color) { %><span class="Rk-UserColor" style="background:<%-node.color%>;"></span><% } %>'
    + '<span class="Rk-Display-Title"><% if (node.uri) { %><a href="<%-node.uri%>" target="_blank"><% } %><%-node.title%><% if (node.uri) { %></a><% } %></span></h2>'
    + '<% if (node.uri && options.show_node_tooltip_uri) { %><p class="Rk-Display-URI"><a href="<%-node.uri%>" target="_blank"><%-node.short_uri%></a></p><% } %>'
    + '<% if (options.show_node_tooltip_description) { %><p class="Rk-Display-Description"><%-node.description%></p><% } %>'
    + '<% if (node.image && options.show_node_tooltip_image) { %><img class="Rk-Display-ImgPreview" src="<%-node.image%>" /><% } %>'
    + '<% if (node.has_creator && options.show_node_tooltip_creator) { %><p><span class="Rk-Editor-Label"><%-renkan.translate("Created by:")%></span><span class="Rk-UserColor" style="background:<%-node.created_by_color%>;"></span><%- shortenText(node.created_by_title, 25) %></p><% } %>'
),
draw: function() {
    var _model = this.source_representation.model,
        _created_by = _model.get("created_by") || _USER_PLACEHOLDER(this.renkan),
        _template = (this.renderer.isEditable() ? this.template : this.readOnlyTemplate ),
        _image_placeholder = this.options.static_url + "img/image-placeholder.png",
        _size = (_model.get("size") || 0);
    this.editor_$
        .html(_template({
            node: {
                has_creator: !!_model.get("created_by"),
                title: _model.get("title"),
                uri: _model.get("uri"),
                short_uri:  shortenText((_model.get("uri") || "").replace(/^(https?:\/\/)?(www\.)?/,'').replace(/\/$/,''),40),
                description: _model.get("description"),
                image: _model.get("image") || "",
                image_placeholder: _image_placeholder,
                color: _model.get("color") || _created_by.get("color"),
                clip_path: _model.get("clip-path") || false,
                created_by_color: _created_by.get("color"),
                created_by_title: _created_by.get("title"),
                size: (_size > 0 ? "+" : "") + _size
            },
            renkan: this.renkan,
            options: this.options,
            shortenText: shortenText
        }));
    this.redraw();
    var _this = this,
        closeEditor = function() {
            _this.renderer.removeRepresentation(_this);
            paper.view.draw();
        };
        
    this.editor_$.find(".Rk-CloseX").click(closeEditor);
    
    this.editor_$.find(".Rk-Edit-Goto").click(function() {
        if (!_model.get("uri")) {
            return false;
        }
    });
    
    if (this.renderer.isEditable()) {
        
        var onFieldChange = _(function() {
            _(function() {
                if (_this.renderer.isEditable()) {
                    var _data = {
                        title: _this.editor_$.find(".Rk-Edit-Title").val()
                    };
                    if (_this.options.show_node_editor_uri) {
                        _data.uri = _this.editor_$.find(".Rk-Edit-URI").val();
                        _this.editor_$.find(".Rk-Edit-Goto").attr("href",_data.uri || "#");
                    }
                    if (_this.options.show_node_editor_image) {
                        _data.image = _this.editor_$.find(".Rk-Edit-Image").val();
                        _this.editor_$.find(".Rk-Edit-ImgPreview").attr("src", _data.image || _image_placeholder);
                    }
                    if (_this.options.show_node_editor_description) {
                        _data.description = _this.editor_$.find(".Rk-Edit-Description").val();
                    }
                    _model.set(_data);
                    _this.redraw();
                } else {
                    closeEditor();
                }
                
            }).defer();
        }).throttle(500);
        
        this.editor_$.on("keyup", function(_e) {
            if (_e.keyCode === 27) {
                closeEditor();
            }
        });
        
        this.editor_$.find("input, textarea").on("change keyup paste", onFieldChange);
        
        this.editor_$.find(".Rk-Edit-Image-File").change(function() {
            if (this.files.length) {
                var f = this.files[0],
                    fr = new FileReader();
                if (f.type.substr(0,5) !== "image") {
                    alert(_this.renkan.translate("This file is not an image"));
                    return;
                }
                if (f.size > (_this.options.uploaded_image_max_kb * 1024)) {
                    alert(_this.renkan.translate("Image size must be under ") + _this.options.uploaded_image_max_kb + _this.renkan.translate("KB"));
                    return;
                }
                fr.onload = function(e) {
                    _this.editor_$.find(".Rk-Edit-Image").val(e.target.result);
                    onFieldChange();
                };
                fr.readAsDataURL(f);
            }
        });
        this.editor_$.find(".Rk-Edit-Title")[0].focus();
        
        var _picker = _this.editor_$.find(".Rk-Edit-ColorPicker");
        
        this.editor_$.find(".Rk-Edit-ColorPicker-Wrapper").hover(
            function(_e) {
                _e.preventDefault();
                _picker.show();
            },
            function(_e) {
                _e.preventDefault();
                _picker.hide();
            }
        );
        
        _picker.find("li").hover(
            function(_e) {
                _e.preventDefault();
                _this.editor_$.find(".Rk-Edit-Color").css("background", $(this).attr("data-color"));
            },
            function(_e) {
                _e.preventDefault();
                _this.editor_$.find(".Rk-Edit-Color").css("background", _model.get("color") || (_model.get("created_by") || _USER_PLACEHOLDER(_this.renkan)).get("color"));
            }
        ).click(function(_e) {
            _e.preventDefault();
            if (_this.renderer.isEditable()) {
                _model.set("color", $(this).attr("data-color"));
                _picker.hide();
                paper.view.draw();
            } else {
                closeEditor();
            }
        });
        
        var shiftSize = function(n) {
            if (_this.renderer.isEditable()) {
                var _newsize = n+(_model.get("size") || 0);
                _this.editor_$.find(".Rk-Edit-Size-Value").text((_newsize > 0 ? "+" : "") + _newsize);
                _model.set("size", _newsize);
                paper.view.draw();
            } else {
                closeEditor();
            }
        };
        
        this.editor_$.find(".Rk-Edit-Size-Down").click(function() {
            shiftSize(-1);
            return false;
        });
        this.editor_$.find(".Rk-Edit-Size-Up").click(function() {
            shiftSize(1);
            return false;
        });
    } else {
        if (typeof this.source_representation.highlighted === "object") {
            var titlehtml = this.source_representation.highlighted.replace(_(_model.get("title")).escape(),'<span class="Rk-Highlighted">$1</span>');
            this.editor_$.find(".Rk-Display-Title" + (_model.get("uri") ? " a" : "")).html(titlehtml);
            if (this.options.show_node_tooltip_description) {
                this.editor_$.find(".Rk-Display-Description").html(this.source_representation.highlighted.replace(_(_model.get("description")).escape(),'<span class="Rk-Highlighted">$1</span>'));
            }
        }
    }
    this.editor_$.find("img").load(function() {
        _this.redraw();
    });
},
redraw: function() {
    var _coords = this.source_representation.paper_coords;
    drawEditBox(this.options, _coords, this.editor_block, this.source_representation.circle_radius * .75, this.editor_$);
    this.editor_$.show();
    paper.view.draw();
}
});

/* */

var EdgeEditor = Renderer.EdgeEditor = Rkns.Utils.inherit(_BaseEditor);

_(EdgeEditor.prototype).extend({
template: _.template(
    '<h2><span class="Rk-CloseX">&times;</span><%-renkan.translate("Edit Edge")%></span></h2>'
    + '<p><label><%-renkan.translate("Title:")%></label><input class="Rk-Edit-Title" type="text" value="<%-edge.title%>"/></p>'
    + '<% if (options.show_edge_editor_uri) { %><p><label><%-renkan.translate("URI:")%></label><input class="Rk-Edit-URI" type="text" value="<%-edge.uri%>"/><a class="Rk-Edit-Goto" href="<%-edge.uri%>" target="_blank"></a></p>'
    + '<% if (options.properties.length) { %><p><label><%-renkan.translate("Choose from vocabulary:")%></label><select class="Rk-Edit-Vocabulary">'
    + '<% _(options.properties).each(function(ontology) { %><option class="Rk-Edit-Vocabulary-Class" value=""><%- renkan.translate(ontology.label) %></option>'
    + '<% _(ontology.properties).each(function(property) { var uri = ontology["base-uri"] + property.uri; %><option class="Rk-Edit-Vocabulary-Property" value="<%- uri %>'
    + '"<% if (uri === edge.uri) { %> selected<% } %>><%- renkan.translate(property.label) %></option>'
    + '<% }) %><% }) %></select></p><% } } %>'
    + '<% if (options.show_edge_editor_color) { %><div class="Rk-Editor-p"><span class="Rk-Editor-Label"><%-renkan.translate("Edge color:")%></span><div class="Rk-Edit-ColorPicker-Wrapper"><span class="Rk-Edit-Color" style="background:<%-edge.color%>;"><span class="Rk-Edit-ColorTip"></span></span>'
    + '<%= renkan.colorPicker %><span class="Rk-Edit-ColorPicker-Text"><%- renkan.translate("Choose color") %></span></div></div><% } %>'
    + '<% if (options.show_edge_editor_direction) { %><p><span class="Rk-Edit-Direction"><%- renkan.translate("Change edge direction") %></span></p><% } %>'
    + '<% if (options.show_edge_editor_nodes) { %><p><span class="Rk-Editor-Label"><%-renkan.translate("From:")%></span><span class="Rk-UserColor" style="background:<%-edge.from_color%>;"></span><%- shortenText(edge.from_title, 25) %></p>'
    + '<p><span class="Rk-Editor-Label"><%-renkan.translate("To:")%></span><span class="Rk-UserColor" style="background:<%-edge.to_color%>;"></span><%- shortenText(edge.to_title, 25) %></p><% } %>'
    + '<% if (options.show_edge_editor_creator && edge.has_creator) { %><p><span class="Rk-Editor-Label"><%-renkan.translate("Created by:")%></span><span class="Rk-UserColor" style="background:<%-edge.created_by_color%>;"></span><%- shortenText(edge.created_by_title, 25) %></p><% } %>'
),
readOnlyTemplate: _.template(
    '<h2><span class="Rk-CloseX">&times;</span><% if (options.show_edge_tooltip_color) { %><span class="Rk-UserColor" style="background:<%-edge.color%>;"></span><% } %>'
    + '<span class="Rk-Display-Title"><% if (edge.uri) { %><a href="<%-edge.uri%>" target="_blank"><% } %><%-edge.title%><% if (edge.uri) { %></a><% } %></span></h2>'
    + '<% if (options.show_edge_tooltip_uri && edge.uri) { %><p class="Rk-Display-URI"><a href="<%-edge.uri%>" target="_blank"><%-edge.short_uri%></a></p><% } %>'
    + '<p><%-edge.description%></p>'
    + '<% if (options.show_edge_tooltip_nodes) { %><p><span class="Rk-Editor-Label"><%-renkan.translate("From:")%></span><span class="Rk-UserColor" style="background:<%-edge.from_color%>;"></span><%- shortenText(edge.from_title, 25) %></p>'
    + '<p><span class="Rk-Editor-Label"><%-renkan.translate("To:")%></span><span class="Rk-UserColor" style="background:<%-edge.to_color%>;"></span><%- shortenText(edge.to_title, 25) %></p><% } %>'
    + '<% if (options.show_edge_tooltip_creator && edge.has_creator) { %><p><span class="Rk-Editor-Label"><%-renkan.translate("Created by:")%></span><span class="Rk-UserColor" style="background:<%-edge.created_by_color%>;"></span><%- shortenText(edge.created_by_title, 25) %></p><% } %>'
),
draw: function() {
    var _model = this.source_representation.model,
        _from_model = _model.get("from"),
        _to_model = _model.get("to"),
        _created_by = _model.get("created_by") || _USER_PLACEHOLDER(this.renkan),
        _template = (this.renderer.isEditable() ? this.template : this.readOnlyTemplate);
    this.editor_$
        .html(_template({
            edge: {
                has_creator: !!_model.get("created_by"),
                title: _model.get("title"),
                uri: _model.get("uri"),
                short_uri:  shortenText((_model.get("uri") || "").replace(/^(https?:\/\/)?(www\.)?/,'').replace(/\/$/,''),40),
                description: _model.get("description"),
                color: _model.get("color") || _created_by.get("color"),
                from_title: _from_model.get("title"),
                to_title: _to_model.get("title"),
                from_color: _from_model.get("color") || (_from_model.get("created_by") || _USER_PLACEHOLDER(this.renkan)).get("color"),
                to_color: _to_model.get("color") || (_to_model.get("created_by") || _USER_PLACEHOLDER(this.renkan)).get("color"),
                created_by_color: _created_by.get("color"),
                created_by_title: _created_by.get("title")
            },
            renkan: this.renkan,
            shortenText: shortenText,
            options: this.options
        }));
    this.redraw();
    var _this = this,
        closeEditor = function() {
            _this.renderer.removeRepresentation(_this);
            paper.view.draw();
        };
    this.editor_$.find(".Rk-CloseX").click(closeEditor);
    this.editor_$.find(".Rk-Edit-Goto").click(function() {
        if (!_model.get("uri")) {
            return false;
        }
    });
    
    if (this.renderer.isEditable()) {
        
        var onFieldChange = _(function() {
            _(function() {
                if (_this.renderer.isEditable()) {
                    var _data = {
                        title: _this.editor_$.find(".Rk-Edit-Title").val()
                    };
                    if (_this.options.show_edge_editor_uri) {
                        _data.uri = _this.editor_$.find(".Rk-Edit-URI").val();
                    }
                    _this.editor_$.find(".Rk-Edit-Goto").attr("href",_data.uri || "#");
                    _model.set(_data);
                    paper.view.draw();
                } else {
                    closeEditor();
                }
            }).defer();
        }).throttle(500);
        
        this.editor_$.on("keyup", function(_e) {
            if (_e.keyCode === 27) {
                closeEditor();
            }
        });
        
        this.editor_$.find("input").on("keyup change paste", onFieldChange);
        
        this.editor_$.find(".Rk-Edit-Vocabulary").change(function() {
            var e = $(this),
                v = e.val();
            if (v) {
                _this.editor_$.find(".Rk-Edit-Title").val(e.find(":selected").text());
                _this.editor_$.find(".Rk-Edit-URI").val(v);
                onFieldChange();
            }
        });
        this.editor_$.find(".Rk-Edit-Direction").click(function() {
            if (_this.renderer.isEditable()) {
                _model.set({
                    from: _model.get("to"),
                    to: _model.get("from")
                });
                _this.draw();
            } else {
                closeEditor();
            }
        });
        
        var _picker = _this.editor_$.find(".Rk-Edit-ColorPicker");
        
        this.editor_$.find(".Rk-Edit-ColorPicker-Wrapper").hover(
            function(_e) {
                _e.preventDefault();
                _picker.show();
            },
            function(_e) {
                _e.preventDefault();
                _picker.hide();
            }
        );
        
        _picker.find("li").hover(
            function(_e) {
                _e.preventDefault();
                _this.editor_$.find(".Rk-Edit-Color").css("background", $(this).attr("data-color"));
            },
            function(_e) {
                _e.preventDefault();
                _this.editor_$.find(".Rk-Edit-Color").css("background", _model.get("color") || (_model.get("created_by") || _USER_PLACEHOLDER(_this.renkan)).get("color"));
            }
        ).click(function(_e) {
            _e.preventDefault();
            if (_this.renderer.isEditable()) {
                _model.set("color", $(this).attr("data-color"));
                _picker.hide();
                paper.view.draw();
            } else {
                closeEditor();
            }
        });
    }
},
redraw: function() {
    var _coords = this.source_representation.paper_coords;
    drawEditBox(this.options, _coords, this.editor_block, 5, this.editor_$);
    this.editor_$.show();
    paper.view.draw();
}
});

/* */

var _NodeButton = Renderer._NodeButton = Rkns.Utils.inherit(_BaseButton);

_(_NodeButton.prototype).extend({
setSectorSize: function() {
    var sectorInner = this.source_representation.circle_radius;
    if (sectorInner !== this.lastSectorInner) {
        if (this.sector) {
            this.sector.destroy();
        }
        this.sector = this.renderer.drawSector(
            this, 1 + sectorInner,
            _NODE_BUTTON_WIDTH + sectorInner,
            this.startAngle,
            this.endAngle,
            1,
            this.imageName,
            this.renkan.translate(this.text)
        );
        this.lastSectorInner = sectorInner;
    }
}
});

/* */

var NodeEditButton = Renderer.NodeEditButton = Rkns.Utils.inherit(_NodeButton);

_(NodeEditButton.prototype).extend({
_init: function() {
    this.type = "Node-edit-button";
    this.lastSectorInner = 0;
    this.startAngle = -135;
    this.endAngle = -45;
    this.imageName = "edit";
    this.text = "Edit";
},
mouseup: function() {
    if (!this.renderer.is_dragging) {
        this.source_representation.openEditor();
    }
}
});

/* */

var NodeRemoveButton = Renderer.NodeRemoveButton = Rkns.Utils.inherit(_NodeButton);

_(NodeRemoveButton.prototype).extend({
_init: function() {
    this.type = "Node-remove-button";
    this.lastSectorInner = 0;
    this.startAngle = 0;
    this.endAngle = 90;
    this.imageName = "remove";
    this.text = "Remove";
},
mouseup: function() {
    this.renderer.click_target = null;
    this.renderer.is_dragging = false;
    this.renderer.removeRepresentationsOfType("editor");
    if (this.renderer.isEditable()) {
        if (this.options.element_delete_delay) {
            var delid = Rkns.Utils.getUID("delete");
            this.renderer.delete_list.push({
                id: delid,
                time: new Date().valueOf() + this.options.element_delete_delay
            });
            this.source_representation.model.set("delete_scheduled", delid);
        } else {
            if (confirm(this.renkan.translate('Do you really wish to remove node ') + '"' + this.source_representation.model.get("title") + '"?')) {
                this.project.removeNode(this.source_representation.model);
            }
        }
    }
}
});

/* */

var NodeRevertButton = Renderer.NodeRevertButton = Rkns.Utils.inherit(_NodeButton);

_(NodeRevertButton.prototype).extend({
_init: function() {
    this.type = "Node-revert-button";
    this.lastSectorInner = 0;
    this.startAngle = -135;
    this.endAngle = 135;
    this.imageName = "revert";
    this.text = "Cancel deletion";
},
mouseup: function() {
    this.renderer.click_target = null;
    this.renderer.is_dragging = false;
    if (this.renderer.isEditable()) {
        this.source_representation.model.unset("delete_scheduled");
    }
}
});

/* */

var NodeLinkButton = Renderer.NodeLinkButton = Rkns.Utils.inherit(_NodeButton);

_(NodeLinkButton.prototype).extend({
_init: function() {
    this.type = "Node-link-button";
    this.lastSectorInner = 0;
    this.startAngle = 90;
    this.endAngle = 180;
    this.imageName = "link";
    this.text = "Link to another node";
},
mousedown: function(_event, _isTouch) {
    if (this.renderer.isEditable()) {
        var _off = this.renderer.canvas_$.offset(),
            _point = new paper.Point([
                _event.pageX - _off.left,
                _event.pageY - _off.top
            ]);
        this.renderer.click_target = null;
        this.renderer.removeRepresentationsOfType("editor");
        this.renderer.addTempEdge(this.source_representation, _point);
    }
}
});

/* */

var NodeEnlargeButton = Renderer.NodeEnlargeButton = Rkns.Utils.inherit(_NodeButton);

_(NodeEnlargeButton.prototype).extend({
_init: function() {
    this.type = "Node-enlarge-button";
    this.lastSectorInner = 0;
    this.startAngle = -45;
    this.endAngle = 0;
    this.imageName = "enlarge";
    this.text = "Enlarge";
},
mouseup: function() {
    var _newsize = 1 + (this.source_representation.model.get("size") || 0);
    this.source_representation.model.set("size", _newsize);
    this.source_representation.select();
    this.select();
    paper.view.draw();
}
});

/* */

var NodeShrinkButton = Renderer.NodeShrinkButton = Rkns.Utils.inherit(_NodeButton);

_(NodeShrinkButton.prototype).extend({
_init: function() {
    this.type = "Node-shrink-button";
    this.lastSectorInner = 0;
    this.startAngle = -180;
    this.endAngle = -135;
    this.imageName = "shrink";
    this.text = "Shrink";
},
mouseup: function() {
    var _newsize = -1 + (this.source_representation.model.get("size") || 0);
    this.source_representation.model.set("size", _newsize);
    this.source_representation.select();
    this.select();
    paper.view.draw();
}
});

/* */

var EdgeEditButton = Renderer.EdgeEditButton = Rkns.Utils.inherit(_BaseButton);

_(EdgeEditButton.prototype).extend({
_init: function() {
    this.type = "Edge-edit-button";
    this.sector = this.renderer.drawSector(this, _EDGE_BUTTON_INNER, _EDGE_BUTTON_OUTER, -270, -90, 1, "edit", this.renkan.translate("Edit"));
},
mouseup: function() {
    if (!this.renderer.is_dragging) {
        this.source_representation.openEditor();
    }
}
});

/* */

var EdgeRemoveButton = Renderer.EdgeRemoveButton = Rkns.Utils.inherit(_BaseButton);

_(EdgeRemoveButton.prototype).extend({
_init: function() {
    this.type = "Edge-remove-button";
    this.sector = this.renderer.drawSector(this, _EDGE_BUTTON_INNER, _EDGE_BUTTON_OUTER, -90, 90, 1, "remove", this.renkan.translate("Remove"));
},
mouseup: function() {
    this.renderer.click_target = null;
    this.renderer.is_dragging = false;
    this.renderer.removeRepresentationsOfType("editor");
    if (this.renderer.isEditable()) {
        if (this.options.element_delete_delay) {
            var delid = Rkns.Utils.getUID("delete");
            this.renderer.delete_list.push({
                id: delid,
                time: new Date().valueOf() + this.options.element_delete_delay
            });
            this.source_representation.model.set("delete_scheduled", delid);
        } else {
            if (confirm(this.renkan.translate('Do you really wish to remove edge ') + '"' + this.source_representation.model.get("title") + '"?')) {
                this.project.removeEdge(this.source_representation.model);
            }
        }
    }
}
});

/* */

var EdgeRevertButton = Renderer.EdgeRevertButton = Rkns.Utils.inherit(_BaseButton);

_(EdgeRevertButton.prototype).extend({
_init: function() {
    this.type = "Edge-revert-button";
    this.sector = this.renderer.drawSector(this, _EDGE_BUTTON_INNER, _EDGE_BUTTON_OUTER, -135, 135, 1, "revert", this.renkan.translate("Cancel deletion"));
},
mouseup: function() {
    this.renderer.click_target = null;
    this.renderer.is_dragging = false;
    if (this.renderer.isEditable()) {
        this.source_representation.model.unset("delete_scheduled");
    }
}
});

/* */

var MiniFrame = Renderer.MiniFrame = Rkns.Utils.inherit(_BaseRepresentation);

_(MiniFrame.prototype).extend({
paperShift: function(_delta) {
    this.renderer.offset = this.renderer.offset.subtract(_delta.divide(this.renderer.minimap.scale).multiply(this.renderer.scale));
    this.renderer.redraw();
},
mouseup: function(_delta) {
    this.renderer.click_target = null;
    this.renderer.is_dragging = false;
}
});

/* */

var Scene = Renderer.Scene = function(_renkan) {
    this.renkan = _renkan;
    this.$ = $(".Rk-Render");
    this.representations = [];
    this.$.html(this.template(_renkan));
    this.onStatusChange();
    this.canvas_$ = this.$.find(".Rk-Canvas");
    this.labels_$ = this.$.find(".Rk-Labels");
    this.editor_$ = this.$.find(".Rk-Editor");
    this.notif_$ = this.$.find(".Rk-Notifications");
    paper.setup(this.canvas_$[0]);
    this.scale = 1;
    this.initialScale = 1;
    this.offset = paper.view.center;
    this.totalScroll = 0;
    this.mouse_down = false;
    this.click_target = null;
    this.selected_target = null;
    this.edge_layer = new paper.Layer();
    this.node_layer = new paper.Layer();
    this.buttons_layer = new paper.Layer();
    this.delete_list = [];
    
    if (_renkan.options.show_minimap) {
        this.minimap = {
            background_layer: new paper.Layer(),
            edge_layer: new paper.Layer(),
            node_layer: new paper.Layer(),
            node_group: new paper.Group(),
            size: new paper.Size( _renkan.options.minimap_width, _renkan.options.minimap_height )
        };
        
        this.minimap.background_layer.activate();
        this.minimap.topleft = paper.view.bounds.bottomRight.subtract(this.minimap.size);
        this.minimap.rectangle = new paper.Path.Rectangle(this.minimap.topleft.subtract([2,2]), this.minimap.size.add([4,4]));
        this.minimap.rectangle.fillColor = _renkan.options.minimap_background_color;
        this.minimap.rectangle.strokeColor = _renkan.options.minimap_border_color;
        this.minimap.rectangle.strokeWidth = 4;
        this.minimap.offset = new paper.Point(this.minimap.size.divide(2));
        this.minimap.scale = .1;
        
        this.minimap.node_layer.activate();
        this.minimap.cliprectangle = new paper.Path.Rectangle(this.minimap.topleft, this.minimap.size);
        this.minimap.node_group.addChild(this.minimap.cliprectangle);
        this.minimap.node_group.clipped = true;
        this.minimap.miniframe = new paper.Path.Rectangle(this.minimap.topleft, this.minimap.size);
        this.minimap.node_group.addChild(this.minimap.miniframe);
        this.minimap.miniframe.fillColor = '#c0c0ff';
        this.minimap.miniframe.opacity = .3;
        this.minimap.miniframe.strokeColor = '#000080';
        this.minimap.miniframe.strokeWidth = 3;
        this.minimap.miniframe.__representation = new MiniFrame(this, null);
    }
    
    this.throttledPaperDraw = _(function() {
        paper.view.draw();
    }).throttle(100);
    
    this.bundles = [];
    this.click_mode = false;
    
    var _this = this,
        _allowScroll = true,
        _originalScale,
        _zooming = false,
        _lastTapDate,
        _lastTapX,
        _lastTapY;
    
    this.image_cache = {};
    this.icon_cache = {};
    
    ['edit', 'remove', 'link', 'enlarge', 'shrink', 'revert' ].forEach(function(imgname) {
        var img = new Image();
        img.src = _renkan.options.static_url + 'img/' + imgname + '.png';
        _this.icon_cache[imgname] = img;
    });
    
    var throttledMouseMove = _.throttle(function(_event, _isTouch) {
        _this.onMouseMove(_event, _isTouch);
    }, _MOUSEMOVE_RATE);
        
    this.canvas_$.on({
        mousedown: function(_event) {
            _event.preventDefault();
            _this.onMouseDown(_event, false);
        },
        mousemove: function(_event) {
            _event.preventDefault();
            throttledMouseMove(_event, false);
        },
        mouseup: function(_event) {
            _event.preventDefault();
            _this.onMouseUp(_event, false);
        },
        mousewheel: function(_event, _delta) {
            if(_renkan.options.zoom_on_scroll) {
                _event.preventDefault();
                if (_allowScroll) {
                    _this.onScroll(_event, _delta);
                }
            }
        },
        touchstart: function(_event) {
            _event.preventDefault();
            var _touches = _event.originalEvent.touches[0];
            if (
                _renkan.options.allow_double_click
                && new Date() - _lastTap < _DOUBLETAP_DELAY
                && ( Math.pow(_lastTapX - _touches.pageX, 2) + Math.pow(_lastTapY - _touches.pageY, 2) < _DOUBLETAP_DISTANCE )
            ) {
                _lastTap = 0;
                _this.onDoubleClick(_touches);
            } else {
                _lastTap = new Date();
                _lastTapX = _touches.pageX;
                _lastTapY = _touches.pageY;
                _originalScale = _this.scale;
                _zooming = false;
                _this.onMouseDown(_touches, true);
            }
        },
        touchmove: function(_event) {
            _event.preventDefault();
            _lastTap = 0;
            if (_event.originalEvent.touches.length == 1) {
                _this.onMouseMove(_event.originalEvent.touches[0], true);
            } else {
                if (!_zooming) {
                    _this.onMouseUp(_event.originalEvent.touches[0], true);
                    _this.click_target = null;
                    _this.is_dragging = false;
                    _zooming = true;
                }
                if (_event.originalEvent.scale === "undefined") {
                    return;
                }
                var _newScale = _event.originalEvent.scale * _originalScale,
                    _scaleRatio = _newScale / _this.scale,
                    _newOffset = new paper.Point([
                        _this.canvas_$.width(),
                        _this.canvas_$.height()
                    ]).multiply( .5 * ( 1 - _scaleRatio ) ).add(_this.offset.multiply( _scaleRatio ));
                _this.setScale(_newScale, _this.offset);
            }
        },
        touchend: function(_event) {
            _event.preventDefault();
            _this.onMouseUp(_event.originalEvent.changedTouches[0], true);
        },
        dblclick: function(_event) {
            _event.preventDefault();
            if (_renkan.options.allow_double_click) {
                _this.onDoubleClick(_event);
            }
        },
        mouseleave: function(_event) {
            _event.preventDefault();
            _this.onMouseUp(_event, false);
            _this.click_target = null;
            _this.is_dragging = false;
        },
        dragover: function(_event) {
            _event.preventDefault();
        },
        dragenter: function(_event) {
            _event.preventDefault();
            _allowScroll = false;
        },
        dragleave: function(_event) {
            _event.preventDefault();
            _allowScroll = true;
        },
        drop: function(_event) {
            _event.preventDefault();
            _allowScroll = true;
            var res = {};
            _(_event.originalEvent.dataTransfer.types).each(function(t) {
                try {
                    res[t] = _event.originalEvent.dataTransfer.getData(t);
                } catch(e) {}
            });
            var text = _event.originalEvent.dataTransfer.getData("Text");
            if (typeof text === "string") {
                switch(text[0]) {
                    case "{":
                    case "[":
                        try {
                            var data = JSON.parse(text);
                            _(res).extend(data);
                        }
                        catch(e) {
                            if (!res["text/plain"]) {
                                res["text/plain"] = text;
                            }
                        }
                    break;
                    case "<":
                        if (!res["text/html"]) {
                            res["text/html"] = text;
                        }
                    break;
                    default:
                        if (!res["text/plain"]) {
                            res["text/plain"] = text;
                        }
                }
            }
            var url = _event.originalEvent.dataTransfer.getData("URL");
            if (url && !res["text/uri-list"]) {
                res["text/uri-list"] = url;
            }
            _this.dropData(res, _event.originalEvent);
        }
    });
    
    var bindClick = function(selector, fname) {
        _this.$.find(selector).click(function(evt) {
            _this[fname](evt);
            return false;
        });
    };
    
    bindClick(".Rk-ZoomOut", "zoomOut");
    bindClick(".Rk-ZoomIn", "zoomIn");
    this.$.find(".Rk-CurrentUser").mouseenter(
        function() { _this.$.find(".Rk-UserList").slideDown(); }
    );
    this.$.find(".Rk-Users").mouseleave(
        function() { _this.$.find(".Rk-UserList").slideUp(); }
    );
    bindClick(".Rk-FullScreen-Button", "fullScreen");
    bindClick(".Rk-AddNode-Button", "addNodeBtn");
    bindClick(".Rk-AddEdge-Button", "addEdgeBtn");
    bindClick(".Rk-Save-Button", "save");
    bindClick(".Rk-Open-Button", "open");
    this.$.find(".Rk-Bookmarklet-Button")
        .attr("href","javascript:" + _BOOKMARKLET_CODE(_renkan))
        .click(function(){
            _this.notif_$
                .text(_renkan.translate("Drag this button to your bookmark bar. When on a third-party website, click it to enable drag-and-drop from the website to Renkan."))
                .fadeIn()
                .delay(5000)
                .fadeOut();
            return false;
        });
    this.$.find(".Rk-TopBar-Button").mouseover(function() {
        $(this).find(".Rk-TopBar-Tooltip").show();
    }).mouseout(function() {
        $(this).find(".Rk-TopBar-Tooltip").hide();
    });
    bindClick(".Rk-Fold-Bins", "foldBins");
    
    paper.view.onResize = function(_event) {
        _this.offset = _this.offset.add(_event.delta.divide(2));
        if (_this.minimap) {
            _this.minimap.topleft = paper.view.bounds.bottomRight.subtract(_this.minimap.size);
            _this.minimap.rectangle.fitBounds(_this.minimap.topleft.subtract([2,2]), _this.minimap.size.add([4,4]));
            _this.minimap.cliprectangle.fitBounds(_this.minimap.topleft, _this.minimap.size);
        }
        _this.redraw();
    };
    
    var _thRedraw = _.throttle(function() {
        _this.redraw();
    },50);
    
    this.addRepresentations("Node", this.renkan.project.get("nodes"));
    this.addRepresentations("Edge", this.renkan.project.get("edges"));
    this.renkan.project.on("change:title", function() {
        _this.$.find(".Rk-PadTitle").val(_renkan.project.get("title"));
    });
    
    this.$.find(".Rk-PadTitle").on("keyup input paste", function() {
        _renkan.project.set({"title": $(this).val()});
    });
    
    var _thRedrawUsers = _.throttle(function() {
        _this.redrawUsers();
    }, 100);
    
    _thRedrawUsers();
    
    this.renkan.project.on("add:users remove:users", _thRedrawUsers);
    
    this.renkan.project.on("add:nodes", function(_node) {
        _this.addRepresentation("Node", _node);
        _thRedraw();
    });
    this.renkan.project.on("add:edges", function(_edge) {
        _this.addRepresentation("Edge", _edge);
        _thRedraw();
    });
    this.renkan.project.on("change:title", function(_model, _title) {
        var el = _this.$.find(".Rk-PadTitle");
        if (el.is("input")) {
            if (el.val() !== _title) {
                el.val(_title);
            }
        } else {
            el.text(_title);
        }
    });
    
    if (_renkan.options.size_bug_fix) {
        var _delay = (
            typeof _renkan.options.size_bug_fix === "number"
            ? _renkan.options.size_bug_fix
            : 500
        );
        window.setTimeout(
            function() {
                _this.fixSize(true);
            },
            _delay
        );
    }
    
    if (_renkan.options.force_resize) {
        $(window).resize(function() {
            _this.fixSize(false);
        });
    }
    
    if (_renkan.options.show_user_list && _renkan.options.user_color_editable) {
        var $cpwrapper = this.$.find(".Rk-Users .Rk-Edit-ColorPicker-Wrapper"),
            $cplist = this.$.find(".Rk-Users .Rk-Edit-ColorPicker");
        
        $cpwrapper.hover(
            function(_e) {
                if (_this.isEditable()) {
                    _e.preventDefault();
                    $cplist.show();
                }
            },
            function(_e) {
                _e.preventDefault();
                $cplist.hide();
            }
        );
        
        $cplist.find("li").mouseenter(
            function(_e) {
                if (_this.isEditable()) {
                    _e.preventDefault();
                    _this.$.find(".Rk-CurrentUser-Color").css("background", $(this).attr("data-color"));
                }
            }
        );
    }
    
    if (_renkan.options.show_search_field) {
        
        var lastval = '';
        
        this.$.find(".Rk-GraphSearch-Field").on("keyup change paste input", function() {
            var $this = $(this),
                val = $this.val();
            if (val === lastval) {
                return;
            }
            lastval = val;
            if (val.length < 2) {
                _renkan.project.get("nodes").each(function(n) {
                    _this.getRepresentationByModel(n).unhighlight();
                });
            } else {
                var rxs = Rkns.Utils.regexpFromTextOrArray(val);
                _renkan.project.get("nodes").each(function(n) {
                    if (rxs.test(n.get("title")) || rxs.test(n.get("description"))) {
                        _this.getRepresentationByModel(n).highlight(rxs);
                    } else {
                        _this.getRepresentationByModel(n).unhighlight(); 
                    }
                });
            }
        });
    }
    
    this.redraw();
    
    window.setInterval(function() {
        var _now = new Date().valueOf();
        _this.delete_list.forEach(function(d) {
            if (_now >= d.time) {
                var el = _renkan.project.get("nodes").findWhere({"delete_scheduled":d.id});
                if (el) {
                    project.removeNode(el);
                }
                el = _renkan.project.get("edges").findWhere({"delete_scheduled":d.id});
                if (el) {
                    project.removeEdge(el);
                }
            }
        });
        _this.delete_list = _this.delete_list.filter(function(d) {
            return _renkan.project.get("nodes").findWhere({"delete_scheduled":d.id}) || _renkan.project.get("edges").findWhere({"delete_scheduled":d.id});
        });
    }, 500);
    
    if (this.minimap) {
        window.setInterval(function() {
            _this.rescaleMinimap();
        }, 2000);
    }

};

_(Scene.prototype).extend({
template: _.template(
    '<% if (options.show_top_bar) { %><div class="Rk-TopBar"><% if (!options.editor_mode) { %><h2 class="Rk-PadTitle"><%- project.get("title") || translate("Untitled project")%></h2>'
    + '<% } else { %><input type="text" class="Rk-PadTitle" value="<%- project.get("title") || "" %>" placeholder="<%-translate("Untitled project")%>" /><% } %>'
    + '<% if (options.show_user_list) { %><div class="Rk-Users"><div class="Rk-CurrentUser"><div class="Rk-Edit-ColorPicker-Wrapper"><span class="Rk-CurrentUser-Color"><% if (options.user_color_editable) { %><span class="Rk-Edit-ColorTip"></span><% } %></span>'
    + '<% if (options.user_color_editable) { print(colorPicker) } %></div><span class="Rk-CurrentUser-Name">&lt;unknown user&gt;</span></div><ul class="Rk-UserList"></ul></div><% } %>'
    + '<% if (options.home_button_url) {%><div class="Rk-TopBar-Separator"></div><a class="Rk-TopBar-Button Rk-Home-Button" href="<%- options.home_button_url %>"><div class="Rk-TopBar-Tooltip"><div class="Rk-TopBar-Tooltip-Contents">'
    + '<%- translate(options.home_button_title) %></div></div></a><% } %>'
    + '<% if (options.show_fullscreen_button) { %><div class="Rk-TopBar-Separator"></div><div class="Rk-TopBar-Button Rk-FullScreen-Button"><div class="Rk-TopBar-Tooltip"><div class="Rk-TopBar-Tooltip-Contents"><%-translate("Full Screen")%></div></div></div><% } %>'
    + '<% if (options.editor_mode) { %>'
    + '<% if (options.show_addnode_button) { %><div class="Rk-TopBar-Separator"></div><div class="Rk-TopBar-Button Rk-AddNode-Button"><div class="Rk-TopBar-Tooltip">'
    + '<div class="Rk-TopBar-Tooltip-Contents"><%-translate("Add Node")%></div></div></div><% } %>'
    + '<% if (options.show_addedge_button) { %><div class="Rk-TopBar-Separator"></div><div class="Rk-TopBar-Button Rk-AddEdge-Button"><div class="Rk-TopBar-Tooltip">'
    + '<div class="Rk-TopBar-Tooltip-Contents"><%-translate("Add Edge")%></div></div></div><% } %>'
    + '<% if (options.show_save_button) { %><div class="Rk-TopBar-Separator"></div><div class="Rk-TopBar-Button Rk-Save-Button"><div class="Rk-TopBar-Tooltip"><div class="Rk-TopBar-Tooltip-Contents"> </div></div></div><% } %>'
    + '<% if (options.show_open_button) { %><div class="Rk-TopBar-Separator"></div><div class="Rk-TopBar-Button Rk-Open-Button"><div class="Rk-TopBar-Tooltip"><div class="Rk-TopBar-Tooltip-Contents"><%-translate("Open Project")%></div></div></div><% } %>'
    + '<% if (options.show_bookmarklet) { %><div class="Rk-TopBar-Separator"></div><a class="Rk-TopBar-Button Rk-Bookmarklet-Button" href="#"><div class="Rk-TopBar-Tooltip"><div class="Rk-TopBar-Tooltip-Contents">'
    + '<%-translate("Renkan \'Drag-to-Add\' bookmarklet")%></div></div></a><% } %>'
    + '<div class="Rk-TopBar-Separator"></div><% }; if (options.show_search_field) { %>'
    + '<form action="#" class="Rk-GraphSearch-Form"><input type="search" class="Rk-GraphSearch-Field" placeholder="<%- translate("Search in graph") %>" /></form><div class="Rk-TopBar-Separator"></div><% } %></div><% } %>'
    + '<div class="Rk-Editing-Space<% if (!options.show_top_bar) { %> Rk-Editing-Space-Full<% } %>">'
    + '<div class="Rk-Labels"></div><canvas class="Rk-Canvas" resize></canvas><div class="Rk-Notifications"></div><div class="Rk-Editor">'
    + '<% if (options.show_bins) { %><div class="Rk-Fold-Bins">&laquo;</div><% } %>'
    + '<div class="Rk-ZoomButtons"><div class="Rk-ZoomIn" title="<%-translate("Zoom In")%>"></div><div class="Rk-ZoomOut" title="<%-translate("Zoom Out")%>"></div></div>'
    + '</div></div>'
),
fixSize: function(_autoscale) {
    var w = this.$.width(),
        h = this.$.height();
    if (this.renkan.options.show_top_bar) {
        h -= this.$.find(".Rk-TopBar").height();
    }
    this.canvas_$.attr({
        width: w,
        height: h
    });
    
    paper.view.viewSize = new paper.Size([w, h]);
    
    if (_autoscale) {
        this.autoScale();
    }
},
drawSector: function(_repr, _inR, _outR, _startAngle, _endAngle, _padding, _imgname, _caption) {
    var _options = this.renkan.options,
        _startRads = _startAngle * Math.PI / 180,
        _endRads = _endAngle * Math.PI / 180,
        _img = this.icon_cache[_imgname],
        _span = _endRads - _startRads,
        _startdx = - Math.sin(_startRads),
        _startdy = Math.cos(_startRads),
        _startXIn = Math.cos(_startRads) * _inR + _padding * _startdx,
        _startYIn = Math.sin(_startRads) * _inR + _padding * _startdy,
        _startXOut = Math.cos(_startRads) * _outR + _padding * _startdx,
        _startYOut = Math.sin(_startRads) * _outR + _padding * _startdy,
        _enddx = - Math.sin(_endRads),
        _enddy = Math.cos(_endRads),
        _endXIn = Math.cos(_endRads) * _inR - _padding * _enddx,
        _endYIn = Math.sin(_endRads) * _inR - _padding * _enddy,
        _endXOut = Math.cos(_endRads) * _outR - _padding * _enddx,
        _endYOut = Math.sin(_endRads) * _outR - _padding * _enddy,
        _centerR = (_inR + _outR)/2,
        _centerRads = (_startRads + _endRads) / 2,
        _centerX = Math.cos(_centerRads) * _centerR,
        _centerY = Math.sin(_centerRads) * _centerR,
        _centerXIn = Math.cos(_centerRads) * _inR,
        _centerXOut = Math.cos(_centerRads) * _outR,
        _centerYIn = Math.sin(_centerRads) * _inR,
        _centerYOut = Math.sin(_centerRads) * _outR,
        _textX = Math.cos(_centerRads) * (_outR + 3),
        _textY = Math.sin(_centerRads) * (_outR + _options.buttons_label_font_size) + _options.buttons_label_font_size / 2,
        _segments = [];
    this.buttons_layer.activate();
    var _path = new paper.Path();
    _path.add([_startXIn, _startYIn]);
    _path.arcTo([_centerXIn, _centerYIn], [_endXIn, _endYIn]);
    _path.lineTo([_endXOut,  _endYOut]);
    _path.arcTo([_centerXOut, _centerYOut], [_startXOut, _startYOut]);
    _path.fillColor = _options.buttons_background;
    _path.opacity = .5;
    _path.closed = true;
    _path.__representation = _repr;
    var _text = new paper.PointText(_textX,_textY);
    _text.characterStyle = {
        fontSize: _options.buttons_label_font_size,
        fillColor: _options.buttons_label_color
    };
    if (_textX > 2) {
        _text.paragraphStyle.justification = 'left';
    } else if (_textX < -2) {
        _text.paragraphStyle.justification = 'right';
    } else {
        _text.paragraphStyle.justification = 'center';
    }
    _text.visible = false;
    var _visible = false,
        _restPos = new paper.Point(-200, -200),
        _grp = new paper.Group([_path, _text]),
        _delta = _grp.position,
        _imgdelta = new paper.Point([_centerX, _centerY]),
        _currentPos = new paper.Point(0,0);
    _text.content = _caption;
    _grp.visible = false;
    _grp.position = _restPos;
    var _res = {
        show: function() {
            _visible = true;
            _grp.position = _currentPos.add(_delta);
            _grp.visible = true;
        },
        moveTo: function(_point) {
            _currentPos = _point;
            if (_visible) {
                _grp.position = _point.add(_delta);
            }
        },
        hide: function() {
            _visible = false;
            _grp.visible = false;
            _grp.position = _restPos;
        },
        select: function() {
            _path.opacity = .8;
            _text.visible = true;
        },
        unselect: function() {
            _path.opacity = .5;
            _text.visible = false;
        },
        destroy: function() {
            _grp.remove();
        }
    };
    function showImage() {
        var _raster = new paper.Raster(_img);
        _raster.position = _imgdelta.add(_grp.position).subtract(_delta);
        _grp.addChild(_raster);
    }
    if (_img.width) {
        showImage();
    } else {
        $(_img).on("load",showImage);
    }
    
    return _res;
},
addToBundles: function(_edgeRepr) {
    var _bundle = _(this.bundles).find(function(_bundle) {
        return ( 
            ( _bundle.from === _edgeRepr.from_representation && _bundle.to === _edgeRepr.to_representation )
            || ( _bundle.from === _edgeRepr.to_representation && _bundle.to === _edgeRepr.from_representation )
        );
    });
    if (typeof _bundle !== "undefined") {
        _bundle.edges.push(_edgeRepr);
    } else {
        _bundle = {
            from: _edgeRepr.from_representation,
            to: _edgeRepr.to_representation,
            edges: [ _edgeRepr ],
            getPosition: function(_er) {
                var _dir = (_er.from_representation === this.from) ? 1 : -1;
                return _dir * ( _(this.edges).indexOf(_er) - (this.edges.length - 1) / 2 );
            }
        };
        this.bundles.push(_bundle);
    }
    return _bundle;
},
isEditable: function() {
    return (this.renkan.options.editor_mode && !this.renkan.read_only);
},
onStatusChange: function() {
    var savebtn = this.$.find(".Rk-Save-Button"),
        tip = savebtn.find(".Rk-TopBar-Tooltip-Contents");
    if (this.renkan.read_only) {
        savebtn.removeClass("disabled Rk-Save-Online").addClass("Rk-Save-ReadOnly");
        tip.text(this.renkan.translate("Connection lost"));
    } else {
        if (this.renkan.options.snapshot_mode) {
            savebtn.removeClass("Rk-Save-ReadOnly Rk-Save-Online");
            tip.text(this.renkan.translate("Save Project"));
        } else {
            savebtn.removeClass("disabled Rk-Save-ReadOnly").addClass("Rk-Save-Online");
            tip.text(this.renkan.translate("Auto-save enabled"));
        }
    }
    this.redrawUsers();
},
setScale: function(_newScale, _offset) {
    if ((_newScale/this.initialScale) > _MIN_SCALE && (_newScale/this.initialScale) < _MAX_SCALE) {
        this.scale = _newScale;
        if (_offset) {
            this.offset = _offset;
        }
        this.redraw();
    }
},
autoScale: function() {
    var nodes = this.renkan.project.get("nodes");
    if (nodes.length > 1) {
        var _xx = nodes.map(function(_node) { return _node.get("position").x; }),
            _yy = nodes.map(function(_node) { return _node.get("position").y; }),
            _minx = Math.min.apply(Math, _xx),
            _miny = Math.min.apply(Math, _yy),
            _maxx = Math.max.apply(Math, _xx),
            _maxy = Math.max.apply(Math, _yy);
        var _scale = Math.min( (paper.view.size.width - 2 * this.renkan.options.autoscale_padding) / (_maxx - _minx), (paper.view.size.height - 2 * this.renkan.options.autoscale_padding) / (_maxy - _miny));
        this.initialScale = _scale;
        this.setScale(_scale, paper.view.center.subtract(new paper.Point([(_maxx + _minx) / 2, (_maxy + _miny) / 2]).multiply(_scale)));
    }
    if (nodes.length === 1) {
        this.setScale(1, paper.view.center.subtract(new paper.Point([nodes.at(0).get("position").x, nodes.at(0).get("position").y])));
    }
},
redrawMiniframe: function() {
    var topleft = this.toMinimapCoords(this.toModelCoords(new paper.Point([0,0]))),
        bottomright = this.toMinimapCoords(this.toModelCoords(paper.view.bounds.bottomRight));
    this.minimap.miniframe.fitBounds(topleft, bottomright);
},
rescaleMinimap: function() {
    var nodes = this.renkan.project.get("nodes");
    if (nodes.length > 1) {
        var _xx = nodes.map(function(_node) { return _node.get("position").x; }),
            _yy = nodes.map(function(_node) { return _node.get("position").y; }),
            _minx = Math.min.apply(Math, _xx),
            _miny = Math.min.apply(Math, _yy),
            _maxx = Math.max.apply(Math, _xx),
            _maxy = Math.max.apply(Math, _yy);
        var _scale = Math.min(
            this.scale * .8 * this.renkan.options.minimap_width / paper.view.bounds.width,
            this.scale * .8 * this.renkan.options.minimap_height / paper.view.bounds.height,
            ( this.renkan.options.minimap_width - 2 * this.renkan.options.minimap_padding ) / (_maxx - _minx),
            ( this.renkan.options.minimap_height - 2 * this.renkan.options.minimap_padding ) / (_maxy - _miny)
        );
        this.minimap.offset = this.minimap.size.divide(2).subtract(new paper.Point([(_maxx + _minx) / 2, (_maxy + _miny) / 2]).multiply(_scale));
        this.minimap.scale = _scale;
    }
    if (nodes.length === 1) {
        this.minimap.scale = .1;
        this.minimap.offset = this.minimap.size.divide(2).subtract(new paper.Point([nodes.at(0).get("position").x, nodes.at(0).get("position").y]).multiply(this.minimap.scale));
    }
    this.redraw();
},
toPaperCoords: function(_point) {
    return _point.multiply(this.scale).add(this.offset);
},
toMinimapCoords: function(_point) {
    return _point.multiply(this.minimap.scale).add(this.minimap.offset).add(this.minimap.topleft);
},
toModelCoords: function(_point) {
    return _point.subtract(this.offset).divide(this.scale);
},
addRepresentation: function(_type, _model) {
    var _repr = new Renderer[_type](this, _model);
    this.representations.push(_repr);
    return _repr;
},
addRepresentations: function(_type, _collection) {
    var _this = this;
    _collection.forEach(function(_model) {
        _this.addRepresentation(_type, _model);
    });
},
userTemplate: _.template(
    '<li class="Rk-User"><span class="Rk-UserColor" style="background:<%=background%>;"></span><%=name%></li>'
),
redrawUsers: function() {
    if (!this.renkan.options.show_user_list) {
        return;
    }
    var allUsers = [].concat((this.renkan.project.current_user_list || {}).models || [], (this.renkan.project.get("users") || {}).models || []),
        ulistHtml = '',
        $userpanel = this.$.find(".Rk-Users"),
        $name = $userpanel.find(".Rk-CurrentUser-Name"),
        $cpwrapper = $userpanel.find(".Rk-Edit-ColorPicker-Wrapper"),
        $cpitems = $userpanel.find(".Rk-Edit-ColorPicker li"),
        $colorsquare = $userpanel.find(".Rk-CurrentUser-Color"),
        _this = this;
    $name.off("click").text(this.renkan.translate("<unknown user>"));
    $cpitems.off("mouseleave click");
    allUsers.forEach(function(_user) {
        if (_user.get("_id") === _this.renkan.current_user) {
            $name.text(_user.get("title"));
            $colorsquare.css("background", _user.get("color"));
            if (_this.isEditable()) {
                
                if (_this.renkan.options.user_name_editable) {
                    $name.click(function() {
                        var $this = $(this),
                            $input = $('<input>').val(_user.get("title")).blur(function() {
                                _user.set("title", $(this).val());
                                _this.redrawUsers();
                                _this.redraw();
                            });
                        $this.empty().html($input);
                        $input.select();
                    });
                }
                
                if (_this.renkan.options.user_color_editable) {
                    $cpitems.click(
                        function(_e) {
                            _e.preventDefault();
                            if (_this.isEditable()) {
                                _user.set("color", $(this).attr("data-color"));
                            }
                            $(this).parent().hide();
                        }
                    ).mouseleave(function() {
                        $colorsquare.css("background", _user.get("color"));
                    });
                }
            }
            
        } else {
            ulistHtml += _this.userTemplate({
                name: _user.get("title"),
                background: _user.get("color")
            });
        }
    });
    $userpanel.find(".Rk-UserList").html(ulistHtml);
},
removeRepresentation: function(_representation) {
    _representation.destroy();
    this.representations = _(this.representations).reject(
        function(_repr) {
            return _repr == _representation;
        }
    );
},
getRepresentationByModel: function(_model) {
    if (!_model) {
        return undefined;
    }
    return _(this.representations).find(function(_repr) {
        return _repr.model === _model;
    });
},
removeRepresentationsOfType: function(_type) {
    var _representations = _(this.representations).filter(function(_repr) {
            return _repr.type == _type;
        }),
        _this = this;
    _(_representations).each(function(_repr) {
        _this.removeRepresentation(_repr);
    });
},
highlightModel: function(_model) {
    var _repr = this.getRepresentationByModel(_model);
    if (_repr) {
        _repr.highlight();
    }
},
unhighlightAll: function(_model) {
    _(this.representations).each(function(_repr) {
        _repr.unhighlight();
    });
},
unselectAll: function(_model) {
    _(this.representations).each(function(_repr) {
        _repr.unselect();
    });
},
redraw: function() {
    _(this.representations).each(function(_representation) {
        _representation.redraw(true);
    });
    if (this.minimap) {
        this.redrawMiniframe();
    }
    paper.view.draw();
},
addTempEdge: function(_from, _point) {
    var _tmpEdge = this.addRepresentation("TempEdge",null);
    _tmpEdge.end_pos = _point;
    _tmpEdge.from_representation = _from;
    _tmpEdge.redraw();
    this.click_target = _tmpEdge;
},
findTarget: function(_hitResult) {
    if (_hitResult && typeof _hitResult.item.__representation !== "undefined") {
        var _newTarget = _hitResult.item.__representation;
        if (this.selected_target !== _hitResult.item.__representation) {
            if (this.selected_target) {
                this.selected_target.unselect(_newTarget);
            }
            _newTarget.select(this.selected_target);
            this.selected_target = _newTarget;
        }
    } else {
        if (this.selected_target) {
            this.selected_target.unselect();
        }
        this.selected_target = null;
    }
},
paperShift: function(_delta) {
    this.offset = this.offset.add(_delta);
    this.redraw();
},
onMouseMove: function(_event) {
    var _off = this.canvas_$.offset(),
        _point = new paper.Point([
            _event.pageX - _off.left,
            _event.pageY - _off.top
        ]),
        _delta = _point.subtract(this.last_point);
    this.last_point = _point;
    if (!this.is_dragging && this.mouse_down && _delta.length > _MIN_DRAG_DISTANCE) {
        this.is_dragging = true;
    }
    var _hitResult = paper.project.hitTest(_point);
    if (this.is_dragging) {
        if (this.click_target && typeof this.click_target.paperShift === "function") {
            this.click_target.paperShift(_delta);
        } else {
            this.paperShift(_delta);
        }
    } else {
        this.findTarget(_hitResult);
    }
    paper.view.draw();
},
onMouseDown: function(_event, _isTouch) {
    var _off = this.canvas_$.offset(),
        _point = new paper.Point([
            _event.pageX - _off.left,
            _event.pageY - _off.top
        ]);
    this.last_point = _point;
    this.mouse_down = true;
    if (!this.click_target || this.click_target.type !== "Temp-edge") {
        this.removeRepresentationsOfType("editor");
        this.is_dragging = false;
        var _hitResult = paper.project.hitTest(_point);
        if (_hitResult && typeof _hitResult.item.__representation !== "undefined") {
            this.click_target = _hitResult.item.__representation;
            this.click_target.mousedown(_event, _isTouch);
        } else {
            this.click_target = null;
            if (this.isEditable() && this.click_mode === _CLICKMODE_ADDNODE) {
                var _coords = this.toModelCoords(_point),
                    _data = {
                        id: Rkns.Utils.getUID('node'),
                        created_by: this.renkan.current_user,
                        position: {
                            x: _coords.x,
                            y: _coords.y
                        }
                    };
                    _node = this.renkan.project.addNode(_data);
                this.getRepresentationByModel(_node).openEditor();
            }
        }
    }
    if (this.click_mode) {
        if (this.isEditable() && this.click_mode === _CLICKMODE_STARTEDGE && this.click_target && this.click_target.type === "Node") {
            this.removeRepresentationsOfType("editor");
            this.addTempEdge(this.click_target, _point);
            this.click_mode = _CLICKMODE_ENDEDGE;
            this.notif_$.fadeOut(function() {
                $(this).html(_renkan.translate("Click on a second node to complete the edge")).fadeIn();
            });
        } else {
            this.notif_$.hide();
            this.click_mode = false;
        }
    }
    paper.view.draw();
},
onMouseUp: function(_event, _isTouch) {
    this.mouse_down = false;
    if (this.click_target) {
        var _off = this.canvas_$.offset();
        this.click_target.mouseup(
            {
                point: new paper.Point([
                    _event.pageX - _off.left,
                    _event.pageY - _off.top
                ])
            },
            _isTouch
        );
    } else {
        this.click_target = null;
        this.is_dragging = false;
        if (_isTouch) {
            this.unselectAll();
        }
    }
    paper.view.draw();
},
onScroll: function(_event, _scrolldelta) {
    this.totalScroll += _scrolldelta;
    if (Math.abs(this.totalScroll) >= 1) {
        var _off = this.canvas_$.offset(),
            _delta = new paper.Point([
                _event.pageX - _off.left,
                _event.pageY - _off.top
            ]).subtract(this.offset).multiply( Math.SQRT2 - 1 );
        if (this.totalScroll > 0) {
            this.setScale( this.scale * Math.SQRT2, this.offset.subtract(_delta) );
        } else {
            this.setScale( this.scale * Math.SQRT1_2, this.offset.add(_delta.divide(Math.SQRT2)));
        }
        this.totalScroll = 0;
    }
},
onDoubleClick: function(_event) {
    if (!this.isEditable()) {
        return;
    }
    var _off = this.canvas_$.offset(),
        _point = new paper.Point([
            _event.pageX - _off.left,
            _event.pageY - _off.top
        ]);
    var _hitResult = paper.project.hitTest(_point);
    if (this.isEditable() && (!_hitResult || typeof _hitResult.item.__representation === "undefined")) {
        var _coords = this.toModelCoords(_point),
            _data = {
                id: Rkns.Utils.getUID('node'),
                created_by: this.renkan.current_user,
                position: {
                    x: _coords.x,
                    y: _coords.y
                }
            },
            _node = this.renkan.project.addNode(_data);
        this.getRepresentationByModel(_node).openEditor();
    }
    paper.view.draw();
},
dropData: function(_data, _event) {
    if (!this.isEditable()) {
        return;
    }
    if (_data["text/json"] || _data["application/json"]) {
        try {
            var jsondata = JSON.parse(_data["text/json"] || _data["application/json"]);
            _(_data).extend(jsondata);
        }
        catch(e) {}
    }
    var newNode = {};
    switch(_data["text/x-iri-specific-site"]) {
        case "twitter":
            var snippet = $('<div>').html(_data["text/x-iri-selected-html"]),
                tweetdiv = snippet.find(".tweet");
            newNode.title = _renkan.translate("Tweet by ") + tweetdiv.attr("data-name");
            newNode.uri = "http://twitter.com/" + tweetdiv.attr("data-screen-name") + "/status/" + tweetdiv.attr("data-tweet-id");
            newNode.image = tweetdiv.find(".avatar").attr("src");
            newNode.description = tweetdiv.find(".js-tweet-text:first").text();
        break;
        case "google":
            var snippet = $('<div>').html(_data["text/x-iri-selected-html"]);
            newNode.title = snippet.find("h3:first").text().trim();
            newNode.uri = snippet.find("h3 a").attr("href");
            newNode.description = snippet.find(".st:first").text().trim();
        break;
        case undefined:
        default:
            if (_data["text/x-iri-source-uri"]) {
                newNode.uri = _data["text/x-iri-source-uri"];
            }
            if (_data["text/plain"] || _data["text/x-iri-selected-text"]) {
                newNode.description = (_data["text/plain"] || _data["text/x-iri-selected-text"]).replace(/[\s\n]+/gm,' ').trim();
            }
            if (_data["text/html"] || _data["text/x-iri-selected-html"]) {
                var snippet = $('<div>').html(_data["text/html"] || _data["text/x-iri-selected-html"]);
                var _svgimgs = snippet.find("image");
                if (_svgimgs.length) {
                    newNode.image = _svgimgs.attr("xlink:href");
                }
                var _svgpaths = snippet.find("path");
                if (_svgpaths.length) {
                    newNode.clipPath = _svgpaths.attr("d");
                }
                var _imgs = snippet.find("img");
                if (_imgs.length) {
                    newNode.image = _imgs[0].src;
                }
                var _as = snippet.find("a");
                if (_as.length) {
                    newNode.uri = _as[0].href;
                }
                newNode.title = snippet.find("[title]").attr("title") || newNode.title;
                newNode.description = snippet.text().replace(/[\s\n]+/gm,' ').trim();
            }
            if (_data["text/uri-list"]) {
                newNode.uri = _data["text/uri-list"];
            }
            if (_data["text/x-moz-url"] && !newNode.title) {
                newNode.title = (_data["text/x-moz-url"].split("\n")[1] || "").trim();
                if (newNode.title === newNode.uri) {
                    newNode.title = false;
                }
            }
            if (_data["text/x-iri-source-title"] && !newNode.title) {
                newNode.title = _data["text/x-iri-source-title"];
            }
            if (_data["text/html"] || _data["text/x-iri-selected-html"]) {
                newNode.image = snippet.find("[data-image]").attr("data-image") || newNode.image;
                newNode.uri = snippet.find("[data-uri]").attr("data-uri") || newNode.uri;
                newNode.title = snippet.find("[data-title]").attr("data-title") || newNode.title;
                newNode.description = snippet.find("[data-description]").attr("data-description") || newNode.description;
                newNode.description = snippet.find("[data-clip-path]").attr("data-clip-path") || newNode.description;
            }
    }
    if (!newNode.title) {
        newNode.title = this.renkan.translate("Dragged resource");
    }
    var fields = ["title", "description", "uri", "image"];
    for (var i = 0; i < fields.length; i++) {
        var f = fields[i];
        if (_data["text/x-iri-" + f] || _data[f]) {
            newNode[f] = _data["text/x-iri-" + f] || _data[f];
        }
        if (newNode[f] === "none" || newNode[f] === "null") {
            newNode[f] = undefined;
        }
    }
    var _off = this.canvas_$.offset(),
        _point = new paper.Point([
            _event.pageX - _off.left,
            _event.pageY - _off.top
        ]),
        _coords = this.toModelCoords(_point),
        _nodedata = {
            id: Rkns.Utils.getUID('node'),
            created_by: this.renkan.current_user,
            uri: newNode.uri || "",
            title: newNode.title || "",
            description: newNode.description || "",
            image: newNode.image || "",
            color: newNode.color || undefined,
            "clip-path": newNode.clipPath || undefined,
            position: {
                x: _coords.x,
                y: _coords.y
            }
        };
    var _node = this.renkan.project.addNode(_nodedata),
        _repr = this.getRepresentationByModel(_node);
    if (_event.type === "drop") {
        _repr.openEditor();
    }
},
fullScreen: function() {
    var _isFull = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen,
        _el = this.renkan.$[0],
        _requestMethods = ["requestFullScreen","mozRequestFullScreen","webkitRequestFullScreen"],
        _cancelMethods = ["cancelFullScreen","mozCancelFullScreen","webkitCancelFullScreen"];
    if (_isFull) {
        for (var i = 0; i < _cancelMethods.length; i++) {
            if (typeof document[_cancelMethods[i]] === "function") {
                document[_cancelMethods[i]]();
                break;
            }
        }
    } else {
        for (var i = 0; i < _requestMethods.length; i++) {
            if (typeof _el[_requestMethods[i]] === "function") {
                _el[_requestMethods[i]]();
                break;
            }
        }
    }
},
zoomOut: function() {
    var _newScale = this.scale * Math.SQRT1_2,
        _offset = new paper.Point([
            this.canvas_$.width(),
            this.canvas_$.height()
        ]).multiply( .5 * ( 1 - Math.SQRT1_2 ) ).add(this.offset.multiply( Math.SQRT1_2 ));
    this.setScale( _newScale, _offset );
},
zoomIn: function() {
    var _newScale = this.scale * Math.SQRT2,
        _offset = new paper.Point([
            this.canvas_$.width(),
            this.canvas_$.height()
        ]).multiply( .5 * ( 1 - Math.SQRT2 ) ).add(this.offset.multiply( Math.SQRT2 ));
    this.setScale( _newScale, _offset );
},
addNodeBtn: function() {
    if (this.click_mode === _CLICKMODE_ADDNODE) {
        this.click_mode = false;
        this.notif_$.hide();
    } else {
        this.click_mode = _CLICKMODE_ADDNODE;
        this.notif_$.text(this.renkan.translate("Click on the background canvas to add a node")).fadeIn();
    }
    return false;
},
addEdgeBtn: function() {
    if (this.click_mode === _CLICKMODE_STARTEDGE || this.click_mode === _CLICKMODE_ENDEDGE) {
        this.click_mode = false;
        this.notif_$.hide();
    } else {
        this.click_mode = _CLICKMODE_STARTEDGE;
        this.notif_$.text(this.renkan.translate("Click on a first node to start the edge")).fadeIn();
    }
    return false;
},
foldBins: function() {
    var foldBinsButton = this.$.find(".Rk-Fold-Bins"),
        bins = this.renkan.$.find(".Rk-Bins");
    if (bins.offset().left < 0) {
        bins.animate({left: 0},250);
        var _this = this;
        this.$.animate({left: 300},250,function() {
            var w = _this.$.width();
            paper.view.viewSize = new paper.Size([w, _this.canvas_$.height()]);
        });
        foldBinsButton.html("&laquo;");
    } else {
        bins.animate({left: -300},250);
        var _this = this;
        this.$.animate({left: 0},250,function() {
            var w = _this.$.width();
            paper.view.viewSize = new paper.Size([w, _this.canvas_$.height()]);
        });
        foldBinsButton.html("&raquo;");
    }
},
save: function() { },
open: function() { }
});
})(window);

/* END paper-renderer.js */
/* Saves the Full JSON at each modification */

Rkns.jsonIO = function(_renkan, _opts) {
    var _proj = _renkan.project;
    if (typeof _opts.http_method == "undefined") {
        _opts.http_method = 'PUT';
    }
    var _load = function() {
        Rkns.$.getJSON(_opts.url, function(_data) {
            _proj.set(_data, {validate: true});
            _renkan.renderer.autoScale();
        });
    };
    var _save = function() {
        var _data = _proj.toJSON();
        if (!_renkan.read_only) {
            Rkns.$.ajax({
                type: _opts.http_method,
                url: _opts.url,
                contentType: "application/json",
                data: JSON.stringify(_data),
                success: function(data, textStatus, jqXHR) {
                }
            });
        }
        
    };
    var _thrSave = Rkns._.throttle(
        function() {
            setTimeout(_save, 100);
        }, 1000);
    _proj.on("add:nodes add:edges add:users", function(_model) {
        _model.on("change remove", function(_model) {
            _thrSave();
        });
        _thrSave();
    });
    _proj.on("change", function() {
        _thrSave();
    });
        
    _load();
};
(function(Rkns) {
"use strict";

var _ = Rkns._;

var Ldt = Rkns.Ldt = {};

var Bin = Ldt.Bin = function(_renkan, _opts) {
    if (_opts.ldt_type) {
        var resclass = Ldt[_opts.ldt_type+"Bin"];
        if (resclass) {
            return new resclass(_renkan, _opts);
        }
    }
    console.error("No such LDT Bin Type");
};

var ProjectBin = Ldt.ProjectBin = Rkns.Utils.inherit(Rkns._BaseBin);

ProjectBin.prototype.tagTemplate = _.template(
    '<li class="Rk-Bin-Item" draggable="true" data-image="<%- Rkns.Utils.getFullURL(static_url+\'img/ldt-tag.png\') %>" data-uri="<%=ldt_platform%>ldtplatform/ldt/front/search/?search=<%=encodedtitle%>&field=all" data-title="<%-title%>" data-description="Tag \'<%-title%>\'">'
    + '<img class="Rk-Ldt-Tag-Icon" src="<%-static_url%>img/ldt-tag.png" /><h4><%=htitle%></h4><div class="Rk-Clear"></div></li>'
);

ProjectBin.prototype.annotationTemplate = _.template(
    '<li class="Rk-Bin-Item" draggable="true" data-image="<%- Rkns.Utils.getFullURL(image) %>" data-uri="<%=ldt_platform%>ldtplatform/ldt/front/player/<%=mediaid%>/#id=<%=annotationid%>" data-title="<%-title%>" data-description="<%-description%>">'
    + '<img class="Rk-Ldt-Annotation-Icon" src="<%=image%>"/><h4><%=htitle%></h4><p><%=hdescription%></p><p>Start: <%=start%>, End: <%=end%>, Duration: <%=duration%></p><div class="Rk-Clear"></div></li>'
);

ProjectBin.prototype._init = function(_renkan, _opts) {
    this.renkan = _renkan;
    this.proj_id = _opts.project_id;
    this.ldt_platform = _opts.ldt_platform || "http://ldt.iri.centrepompidou.fr/";
    this.title_$.html(_opts.title);
    this.title_icon_$.addClass('Rk-Ldt-Title-Icon');
    this.refresh();
};

ProjectBin.prototype.render = function(searchbase) {
    var search = searchbase || Rkns.Utils.regexpFromTextOrArray();
    function highlight(_text) {
        var _e = _(_text).escape();
        return search.isempty ? _e : search.replace(_e, "<span class='searchmatch'>$1</span>");
    }
    function convertTC(_ms) {
        function pad(_n) {
            var _res = _n.toString();
            while (_res.length < 2) {
                _res = '0' + _res;
            }
            return _res;
        }
        var _totalSeconds = Math.abs(Math.floor(_ms/1000)),
            _hours = Math.floor(_totalSeconds / 3600),
            _minutes = (Math.floor(_totalSeconds / 60) % 60),
            _seconds = _totalSeconds % 60,
            _res = '';
        if (_hours) {
            _res += pad(_hours) + ':';
        }
        _res += pad(_minutes) + ':' + pad(_seconds);
        return _res;
    }
    
    var _html = '<li><h3>Tags</h3></li>',
        _projtitle = this.data.meta["dc:title"],
        _this = this,
        count = 0;
    _this.title_$.text('LDT Project: "' + _projtitle + '"');
    _(_this.data.tags).map(function(_tag) {
        var _title = _tag.meta["dc:title"];
        if (!search.isempty && !search.test(_title)) {
            return;
        }
        count++;
        _html += _this.tagTemplate({
            ldt_platform: _this.ldt_platform,
            title: _title,
            htitle: highlight(_title),
            encodedtitle : encodeURIComponent(_title),
            static_url: _this.renkan.options.static_url
        });
    });
    _html += '<li><h3>Annotations</h3></li>';
    _(_this.data.annotations).map(function(_annotation) {
        var _description = _annotation.content.description,
            _title = _annotation.content.title.replace(_description,"");
        if (!search.isempty && !search.test(_title) && !search.test(_description)) {
            return;
        }
        count++;
        var _duration = _annotation.end - _annotation.begin,
            _img = (
                (_annotation.content && _annotation.content.img && _annotation.content.img.src)
                ? _annotation.content.img.src
                : ( _duration ? _this.renkan.options.static_url+"img/ldt-segment.png" : _this.renkan.options.static_url+"img/ldt-point.png" )
            );
        _html += _this.annotationTemplate({
            ldt_platform: _this.ldt_platform,
            title: _title,
            htitle: highlight(_title),
            description: _description,
            hdescription: highlight(_description),
            start: convertTC(_annotation.begin),
            end: convertTC(_annotation.end),
            duration: convertTC(_duration),
            mediaid: _annotation.media,
            annotationid: _annotation.id,
            image: _img,
            static_url: _this.renkan.options.static_url
        });
    });
    
    this.main_$.html(_html);
    if (!search.isempty && count) {
        this.count_$.text(count).show();
    } else {
        this.count_$.hide();
    }
    if (!search.isempty && !count) {
        this.$.hide();
    } else {
        this.$.show();
    }
    this.renkan.resizeBins();
};

ProjectBin.prototype.refresh = function() {
    var _this = this;
    Rkns.$.ajax({
        url: this.ldt_platform + 'ldtplatform/ldt/cljson/id/' + this.proj_id,
        dataType: "jsonp",
        success: function(_data) {
            _this.data = _data;
            _this.render();
        }
    });
};

var Search = Ldt.Search = function(_renkan, _opts) {
    this.renkan = _renkan;
    this.lang = _opts.lang || "en";
};

Search.prototype.getBgClass = function() {
    return "Rk-Ldt-Icon";
};

Search.prototype.getSearchTitle = function() {
    return this.renkan.translate("Lignes de Temps");
};

Search.prototype.search = function(_q) {
    this.renkan.tabs.push(
        new ResultsBin(this.renkan, {
            search: _q
        })
    );
};

var ResultsBin = Ldt.ResultsBin = Rkns.Utils.inherit(Rkns._BaseBin);

ResultsBin.prototype.segmentTemplate = _.template(
    '<li class="Rk-Bin-Item" draggable="true" data-image="<%- Rkns.Utils.getFullURL(image) %>" data-uri="<%=ldt_platform%>ldtplatform/ldt/front/player/<%=mediaid%>/#id=<%=annotationid%>" data-title="<%-title%>" data-description="<%-description%>">'
    + '<img class="Rk-Ldt-Annotation-Icon" src="<%=image%>"/><h4><%=htitle%></h4><p><%=hdescription%></p><p>Start: <%=start%>, End: <%=end%>, Duration: <%=duration%></p><div class="Rk-Clear"></div></li>'
);

ResultsBin.prototype._init = function(_renkan, _opts) {
    this.renkan = _renkan;
    this.ldt_platform = _opts.ldt_platform || "http://ldt.iri.centrepompidou.fr/";
    this.max_results = _opts.max_results || 50;
    this.search = _opts.search;
    this.title_$.html('Lignes de Temps: "' + _opts.search + '"');
    this.title_icon_$.addClass('Rk-Ldt-Title-Icon');
    this.refresh();
};

ResultsBin.prototype.render = function(searchbase) {
    if (!this.data) {
        return;
    }
    var search = searchbase || Rkns.Utils.regexpFromTextOrArray();
    var highlightrx = (search.isempty ? Rkns.Utils.regexpFromTextOrArray(this.search) : search);
    function highlight(_text) {
        return highlightrx.replace(_(_text).escape(), "<span class='searchmatch'>$1</span>");
    }
    function convertTC(_ms) {
        function pad(_n) {
            var _res = _n.toString();
            while (_res.length < 2) {
                _res = '0' + _res;
            }
            return _res;
        }
        var _totalSeconds = Math.abs(Math.floor(_ms/1000)),
            _hours = Math.floor(_totalSeconds / 3600),
            _minutes = (Math.floor(_totalSeconds / 60) % 60),
            _seconds = _totalSeconds % 60,
            _res = '';
        if (_hours) {
            _res += pad(_hours) + ':';
        }
        _res += pad(_minutes) + ':' + pad(_seconds);
        return _res;
    }
    
    var _html = '',
        _this = this,
        count = 0;
    _(this.data.objects).each(function(_segment) {
        var _description = _segment['abstract'],
            _title = _segment.title;
        if (!search.isempty && !search.test(_title) && !search.test(_description)) {
            return;
        }
        count++;
        var _duration = _segment.duration,
            _begin = _segment.start_ts,
            _end = + _segment.duration + _begin,
            _img = (
                _duration
                ? _this.renkan.options.static_url + "img/ldt-segment.png"
                : _this.renkan.options.static_url + "img/ldt-point.png"
            );
        _html += _this.segmentTemplate({
            ldt_platform: _this.ldt_platform,
            title: _title,
            htitle: highlight(_title),
            description: _description,
            hdescription: highlight(_description),
            start: convertTC(_begin),
            end: convertTC(_end),
            duration: convertTC(_duration),
            mediaid: _segment.iri_id,
            //projectid: _segment.project_id,
            //cuttingid: _segment.cutting_id,
            annotationid: _segment.element_id,
            image: _img
        });
    });
    
    this.main_$.html(_html);
    if (!search.isempty && count) {
        this.count_$.text(count).show();
    } else {
        this.count_$.hide();
    }
    if (!search.isempty && !count) {
        this.$.hide();
    } else {
        this.$.show();
    }
    this.renkan.resizeBins();
};

ResultsBin.prototype.refresh = function() {
    var _this = this;
    Rkns.$.ajax({
        url: this.ldt_platform + 'ldtplatform/api/ldt/1.0/segments/search/',
        data: {
            format: "jsonp",
            q: this.search,
            limit: this.max_results
        },
        dataType: "jsonp",
        success: function(_data) {
            _this.data = _data;
            _this.render();
        }
    });
};

})(window.Rkns);
Rkns.ResourceList = {};

Rkns.ResourceList.Bin = Rkns.Utils.inherit(Rkns._BaseBin);

Rkns.ResourceList.Bin.prototype.resultTemplate = Rkns._.template(
    '<li class="Rk-Bin-Item Rk-ResourceList-Item" draggable="true" data-uri="<%-url%>" '
    + 'data-title="<%-title%>" data-description="<%-description%>" '
    + '<% if (image) { %>data-image="<%- Rkns.Utils.getFullURL(image) %>"<% } else { %>data-image=""<% } %> >'
    + '<% if (image) { %><img class="Rk-ResourceList-Image" src="<%-image%>"/><% } %><h4 class="Rk-ResourceList-Title">'
    + '<% if (url) { %><a href="<%-url%>" target="_blank"><% } %><%=htitle%><% if (url) { %></a><% } %></h4>'
    + '<% if (description) { %><p class="Rk-ResourceList-Description"><%=hdescription%></p><% } %><% if (image) { %><div style="clear: both;"></div><% } %></li>'
);

Rkns.ResourceList.Bin.prototype._init = function(_renkan, _opts) {
    this.renkan = _renkan;
    this.title_$.html(_opts.title);
    if (_opts.list) {
        this.data = _opts.list;
    }
    this.refresh();
};

Rkns.ResourceList.Bin.prototype.render = function(searchbase) {
    var search = searchbase || Rkns.Utils.regexpFromTextOrArray();
    function highlight(_text) {
        var _e = _(_text).escape();
        return search.isempty ? _e : search.replace(_e, "<span class='searchmatch'>$1</span>");
    }
    var _html = "",
        _this = this,
        count = 0;
    Rkns._(this.data).each(function(_item) {
        if (typeof _item === "string") {
            if (/^(https?:\/\/|www)/.test(_item)) {
                var _element = { url: _item };
            } else {
                var _element = { title: _item.replace(/[:,]?\s?(https?:\/\/|www)[\d\w\/.&?=#%-_]+\s?/,'').trim() },
                    _match = _item.match(/(https?:\/\/|www)[\d\w\/.&?=#%-_]+/);
                if (_match) {
                    _element.url = _match[0];
                }
                if (_element.title.length > 80) {
                    _element.description = _element.title;
                    _element.title = _element.title.replace(/^(.{30,60})\s.+$/,'$1…');
                }
            }
        } else {
            var _element = _item;
        }
        var title = _element.title || (_element.url || "").replace(/^https?:\/\/(www\.)?/,'').replace(/^(.{40}).+$/,'$1…'),
            url = _element.url || "",
            description = _element.description || "",
            image = _element.image || "";
        if (url && !/^https?:\/\//.test(url)) {
            url = 'http://' + url;
        }
        if (!search.isempty && !search.test(title) && !search.test(description)) {
            return;
        }
        count++;
        _html += _this.resultTemplate({
            url: url,
            title: title,
            htitle: highlight(title),
            image: image,
            description: description,
            hdescription: highlight(description),
            static_url: _this.renkan.options.static_url
        });
    });
    _this.main_$.html(_html);
    if (!search.isempty && count) {
        this.count_$.text(count).show();
    } else {
        this.count_$.hide();
    }
    if (!search.isempty && !count) {
        this.$.hide();
    } else {
        this.$.show();
    }
    this.renkan.resizeBins();
};
    
Rkns.ResourceList.Bin.prototype.refresh = function() {
    if (this.data) {
        this.render();
    }
};Rkns.Wikipedia = {
};

Rkns.Wikipedia.Search = function(_renkan, _opts) {
    this.renkan = _renkan;
    this.lang = _opts.lang || "en";
};

Rkns.Wikipedia.Search.prototype.getBgClass = function() {
    return "Rk-Wikipedia-Search-Icon Rk-Wikipedia-Lang-" + this.lang;
};

Rkns.Wikipedia.Search.prototype.getSearchTitle = function() {
    var langs = {
        "fr": "French",
        "en": "English",
        "ja": "Japanese"
    };
    if (langs[this.lang]) {
        return this.renkan.translate("Wikipedia in ") + this.renkan.translate(langs[this.lang]);
    } else {
        return this.renkan.translate("Wikipedia") + " [" + this.lang + "]";
    }
};

Rkns.Wikipedia.Search.prototype.search = function(_q) {
    this.renkan.tabs.push(
        new Rkns.Wikipedia.Bin(this.renkan, {
            lang: this.lang,
            search: _q
        })
    );
};

Rkns.Wikipedia.Bin = Rkns.Utils.inherit(Rkns._BaseBin);

Rkns.Wikipedia.Bin.prototype.resultTemplate = Rkns._.template(
    '<li class="Rk-Wikipedia-Result Rk-Bin-Item" draggable="true" data-uri="<%-url%>" '
    + 'data-title="Wikipedia: <%-title%>" data-description="<%-description%>" data-image="<%- Rkns.Utils.getFullURL( static_url + \'img/wikipedia.png\' ) %>">'
    + '<img class="Rk-Wikipedia-Icon" src="<%-static_url%>img/wikipedia.png"></div><h4 class="Rk-Wikipedia-Title"><a href="<%-url%>" target="_blank"><%=htitle%></a></h4>'
    + '<p class="Rk-Wikipedia-Snippet"><%=hdescription%></p></li>'
);

Rkns.Wikipedia.Bin.prototype._init = function(_renkan, _opts) {
    this.renkan = _renkan;
    this.search = _opts.search;
    this.lang = _opts.lang || "en";
    this.title_icon_$.addClass('Rk-Wikipedia-Title-Icon Rk-Wikipedia-Lang-' + this.lang);
    this.title_$.html(this.search).addClass("Rk-Wikipedia-Title");
    this.refresh();
};

Rkns.Wikipedia.Bin.prototype.render = function(searchbase) {
    var search = searchbase || Rkns.Utils.regexpFromTextOrArray();
    var highlightrx = (search.isempty ? Rkns.Utils.regexpFromTextOrArray(this.search) : search);
    function highlight(_text) {
        return highlightrx.replace(_(_text).escape(), "<span class='searchmatch'>$1</span>");
    }
    var _html = "",
        _this = this,
        count = 0;
    Rkns._(this.data.query.search).each(function(_result) {
        var title = _result.title,
            url = "http://" + _this.lang + ".wikipedia.org/wiki/" + encodeURI(title.replace(/ /g,"_")),
            description = Rkns.$('<div>').html(_result.snippet).text();
        if (!search.isempty && !search.test(title) && !search.test(description)) {
            return;
        }
        count++;
        _html += _this.resultTemplate({
            url: url,
            title: title,
            htitle: highlight(title),
            description: description,
            hdescription: highlight(description),
            static_url: _this.renkan.options.static_url
        });
    });
    _this.main_$.html(_html);
    if (!search.isempty && count) {
        this.count_$.text(count).show();
    } else {
        this.count_$.hide();
    }
    if (!search.isempty && !count) {
        this.$.hide();
    } else {
        this.$.show();
    }
    this.renkan.resizeBins();
};
    
Rkns.Wikipedia.Bin.prototype.refresh = function() {
    var _this = this;
    Rkns.$.ajax({
        url: "http://" + _this.lang + ".wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(this.search) + "&format=json",
        dataType: "jsonp",
        success: function(_data) {
            _this.data = _data;
            _this.render();
        }
    });
};