/* 
 *  Copyright 2012 Institut de recherche et d'innovation 
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

if (typeof Rkns !== "object") {
    Rkns = {}
}

Rkns.$ = jQuery;

Rkns._ = _;

Rkns.i18n = {
    en: {
        zoom_in: "Zoom In",
        zoom_out: "Zoom Out",
        see_in_project: 'See also <b>"{node}"</b> in <b>"{project}"</b>'
    }
}

Rkns.Utils = {
    inherit : function(_baseClass) {
        var _class = function() {
            _baseClass.apply(this, Array.prototype.slice.call(arguments, 0));
            if (typeof this._init == "function") {
                this._init.apply(this, Array.prototype.slice.call(arguments, 0));
            }
        }
        _class.prototype = new _baseClass();
        return _class;
    }
}

Rkns.Models = {};

Rkns.Models.getUID = function(obj) {
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return obj.type + "-" + guid; 
};

Rkns.Models.RenkanModel = Backbone.RelationalModel.extend({
    idAttribute : "_id",
    constructor: function(options) {

        if (typeof options !== "undefined") {
            options._id = options._id || options.id || Rkns.Models.getUID(this);
            options.title = options.title || "(untitled " + this.type + ")";
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
Rkns.Models.User = Rkns.Models.RenkanModel.extend({
    type: "user",
    prepare: function(options) {
        options.color = options.color || "#666666";
        return options;
    },
    toJSON: function() {
        return {
            id: this.get("_id"),
            title: this.get("title"),
            uri: this.get("uri"),
            description: this.get("description"),
            color: this.get("color"),
        }
    },
});

// NODE
Rkns.Models.Node = Rkns.Models.RenkanModel.extend({
    type: "node",
    relations: [{
        type: Backbone.HasOne,
        key: "created_by",
        relatedModel: Rkns.Models.User
    }],
    prepare: function(options) {
        project = options.project;
        this.addReference(options, "created_by", project.get("users"), options.created_by, project.current_user);
        options.description = options.description || "";
        return options;
    },
    toJSON: function() {
        return {
            id: this.get("_id"),
            title: this.get("title"),
            uri: this.get("uri"),
            description: this.get("description"),
            position: this.get("position"),
            image: this.get("image"),
            created_by: this.get("created_by").get("_id")
        }
    },
});

// EDGE
Rkns.Models.Edge = Rkns.Models.RenkanModel.extend({
    type: "edge",
    relations: [
      {
        type: Backbone.HasOne,
        key: "created_by",
        relatedModel: Rkns.Models.User
      },
      {
        type: Backbone.HasOne,
        key: "from",
        relatedModel: Rkns.Models.Node
      },
      {
        type: Backbone.HasOne,
        key: "to",
        relatedModel: Rkns.Models.Node
      },
    ],
    prepare: function(options) {
        project = options.project;
        this.addReference(options, "created_by", project.get("users"), options.created_by, project.current_user);
        this.addReference(options, "from", project.get("nodes"), options.from);
        this.addReference(options, "to", project.get("nodes"), options.to);
        return options;
    },
    toJSON: function() {
        return {
            id: this.get("_id"),
            title: this.get("title"),
            uri: this.get("uri"),
            description: this.get("description"),
            from: this.get("from").get("_id"),
            to: this.get("to").get("_id"),
            created_by: this.get("created_by").get("_id"),
        }
    },
});
    
// PROJECT
Rkns.Models.Project = Rkns.Models.RenkanModel.extend({
    type: "project",
    relations: [
      {
        type: Backbone.HasMany,
        key: "users",
        relatedModel: Rkns.Models.User,
        reverseRelation: {
            key: 'project',
            includeInJSON: '_id'
        },
      },
      {
        type: Backbone.HasMany,
        key: "nodes",
        relatedModel: Rkns.Models.Node,
        reverseRelation: {
            key: 'project',
            includeInJSON: '_id'
        },
      },
      {
        type: Backbone.HasMany,
        key: "edges",
        relatedModel: Rkns.Models.Edge,
        reverseRelation: {
            key: 'project',
            includeInJSON: '_id'
        },
      }
    ],
    addUser: function(_props) {
        _props.project = this;
        var _user = new Rkns.Models.User(_props);
        this.get("users").push(_user);
        return _user;
    },
    addNode: function(_props) {
        _props.project = this;
        var _node = new Rkns.Models.Node(_props);
        this.get("nodes").push(_node);
        return _node;
    },
    addEdge: function(_props) {
        _props.project = this;
        var _edge = new Rkns.Models.Edge(_props);
        this.get("edges").push(_edge);
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
        Rkns._(options.users).each(function(_item) {
            _item.project = _project;
        });
        Rkns._(options.nodes).each(function(_item) {
            _item.project = _project;
        });
        Rkns._(options.edges).each(function(_item) {
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

/* Point of entry */

Rkns.Renkan = function(_opts) {
    if (typeof _opts.language !== "string" || typeof Rkns.i18n[_opts.language] == "undefined") {
        _opts.language = "en";
    }
    if (typeof _opts.container !== "string") {
        _opts.container = "renkan";
    }
    if (typeof _opts.search !== "object" || !_opts.search) {
        _opts.search = [];
    }
    this.projects = [];
    this.l10n = Rkns.i18n[_opts.language];
    this.$ = Rkns.$("#" + _opts.container);
    this.$.html(this.template());
    this.uris = {};
    this.active_project = null;
    this.renderer = null;
}

Rkns.Renkan.prototype.template = Rkns._.template(
    '<div class="Rk-Render"></div><ul class="Rk-Project-List"></ul>'
);

Rkns.Renkan.prototype.addProject = function(_opts) {
    var _proj = new Rkns.Models.Project(),
        _li = Rkns.$("<li>").addClass("Rk-Project").text("Untitled #" + (1+this.projects.length));
    this.$.find(".Rk-Project-List").append(_li);
    Rkns.loadJson(_proj, _opts);
    var _this = this;
    _li.click(function() {
        _this.renderProject(_proj);
    });
    _proj.on("change:title", function() {
        _li.html(_proj.get("title"));
    });
    _proj.on("select", function() {
        _this.$.find(".Rk-Project").removeClass("active");
        _li.addClass("active");
    });
    _proj.on("add:nodes", function(_node) {
        var _uri = _node.get("uri");
        if (_uri) {
            if (typeof _this.uris[_uri] === "undefined") {
                _this.uris[_uri] = [];
            }
            _this.uris[_uri].push(_node);
        }
    });
    this.projects.push(_proj);
    return _proj;
}

Rkns.Renkan.prototype.renderProject = function(_project) {
    if (_project) {
        if (this.renderer) {
            this.renderer.destroy();
        }
        this.active_project = _project;
        this.renderer = new Rkns.Renderer.Scene(this, _project);
        this.renderer.autoScale();
        _project.trigger("select");
    }
}

Rkns.Renkan.prototype.renderProjectAt = function(_index) {
    this.renderProject(this.projects[_index]);
}

Rkns.loadJson = function(_proj, _opts) {
    if (typeof _opts.http_method == "undefined") {
        _opts.http_method = 'PUT';
    }
    var _load = function() {
        Rkns.$.getJSON(_opts.url, function(_data) {
            _proj.set(_data);
            if (typeof _opts.callback === "function") {
                _opts.callback(_proj);
            }
        });
    }
    _load();
}

Rkns.Renderer = {
    _MARGIN_X: 80,
    _MARGIN_Y: 50,
    _MIN_DRAG_DISTANCE: 2,
    _NODE_RADIUS: 20,
    _NODE_FONT_SIZE: 10,
    _EDGE_FONT_SIZE: 9,
    _NODE_MAX_CHAR: 30,
    _EDGE_MAX_CHAR: 20,
    _ARROW_LENGTH: 16,
    _ARROW_WIDTH: 8,
    _TOOLTIP_ARROW_LENGTH : 15,
    _TOOLTIP_ARROW_WIDTH : 26,
    _TOOLTIP_MARGIN : 10,
    _TOOLTIP_PADDING : 8,
    _TOOLTIP_GRADIENT : new paper.Gradient(['#f0f0f0', '#d0d0d0'])
}

Rkns.Renderer.Utils = {
    shortenText : function(_text,_length) {
        var _rgxp = new RegExp('^(.{' + _length + '}).+$');
        return _text.replace(/(\n|\r|\r\n)/mg,' ').replace(_rgxp,'$1…');
    },
    drawTooltip : function(_coords, _path, _width, _xmargin, _selector) {
        _selector.css({
            width: (_width - 2* Rkns.Renderer._TOOLTIP_PADDING),
        });
        var _height = _selector.outerHeight() + 2* Rkns.Renderer._TOOLTIP_PADDING,
            _isLeft = (_coords.x < paper.view.center.x ? 1 : -1),
            _left = _coords.x + _isLeft * ( _xmargin + Rkns.Renderer._TOOLTIP_ARROW_LENGTH ),
            _right = _coords.x + _isLeft * ( _xmargin + Rkns.Renderer._TOOLTIP_ARROW_LENGTH + _width ),
            _top = _coords.y - _height / 2;
        if (_top < Rkns.Renderer._TOOLTIP_MARGIN) {
            _top = Math.min( Rkns.Renderer._TOOLTIP_MARGIN, _coords.y - Rkns.Renderer._TOOLTIP_ARROW_WIDTH / 2 );
        }
        var _bottom = _top + _height;
        if (_bottom > (paper.view.size.height - Rkns.Renderer._TOOLTIP_MARGIN)) {
            _bottom = Math.max( paper.view.size.height - Rkns.Renderer._TOOLTIP_MARGIN, _coords.y + Rkns.Renderer._TOOLTIP_ARROW_WIDTH / 2 );
            _top = _bottom - _height;
        }
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
        _path.segments[1].point.y = _coords.y - Rkns.Renderer._TOOLTIP_ARROW_WIDTH / 2;
        _path.segments[6].point.y = _coords.y + Rkns.Renderer._TOOLTIP_ARROW_WIDTH / 2;
        _path.closed = true;
        _path.fillColor = new paper.GradientColor(Rkns.Renderer._TOOLTIP_GRADIENT, [0,_top], [0, _bottom]);
        _selector.css({
            left: (Rkns.Renderer._TOOLTIP_PADDING + Math.min(_left, _right)),
            top: (Rkns.Renderer._TOOLTIP_PADDING + _top)
        });
    }
}

Rkns.Renderer._BaseRepresentation = function(_renderer, _model) {
    if (typeof _renderer !== "undefined") {
        this.renderer = _renderer;
        this.project = _renderer.project;
        this.model = _model;
        if (this.model) {
            var _this = this;
            this._selectBinding = function() {
                _this.select();
            };
            this._unselectBinding = function() {
                _this.unselect();
            }
            this._changeBinding = function() {
                _this.redraw();
            }
            this._removeBinding = function() {
                _renderer.removeRepresentation(_this);
                _renderer.redraw();
            }
            this.model.on("change", this._changeBinding );
            this.model.on("remove", this._removeBinding );
            this.model.on("select", this._selectBinding );
            this.model.on("unselect", this._unselectBinding );
        }
    }
}

Rkns.Renderer._BaseRepresentation.prototype.super = function(_func) {
    Rkns.Renderer._BaseRepresentation.prototype[_func].apply(this, Array.prototype.slice.call(arguments, 1));
}

Rkns.Renderer._BaseRepresentation.prototype.select = function() {}

Rkns.Renderer._BaseRepresentation.prototype.unselect = function() {}

Rkns.Renderer._BaseRepresentation.prototype.mouseup = function() {}

Rkns.Renderer._BaseRepresentation.prototype.destroy = function() {
    if (this.model) {
        this.model.off("change", this._changeBinding );
        this.model.off("remove", this._removeBinding );
        this.model.off("select", this._selectBinding);
        this.model.off("unselect", this._unselectBinding);
    }
}

Rkns.Renderer.Node = Rkns.Utils.inherit(Rkns.Renderer._BaseRepresentation);

Rkns.Renderer.Node.prototype._init = function() {
    this.renderer.node_layer.activate();
    this.type = "Node";
    this.circle = new paper.Path.Circle([0, 0], Rkns.Renderer._NODE_RADIUS);
    this.circle.fillColor = '#ffffff';
    this.circle.__representation = this;
    this.title = new paper.PointText([0,0]);
    this.title.characterStyle = {
        fontSize: Rkns.Renderer._NODE_FONT_SIZE,
        fillColor: 'black'
    };
    this.title.paragraphStyle.justification = 'center';
    this.title.__representation = this;
    this.model_coords = new paper.Point(this.model.get("position"));
}

Rkns.Renderer.Node.prototype.redraw = function() {
    this.paper_coords = this.renderer.toPaperCoords(this.model_coords);
    this.circle.position = this.paper_coords;
    this.title.content = Rkns.Renderer.Utils.shortenText(this.model.get("title"), Rkns.Renderer._NODE_MAX_CHAR);
    this.title.position = this.paper_coords.add([0, 2 * Rkns.Renderer._NODE_RADIUS]);
    this.circle.strokeColor = this.model.get("created_by").get("color");
    var _img = this.model.get("image");
    if (_img && _img !== this.img) {
        var _image = new Image(),
            _this = this;
        _image.onload = function() {
            if (_this.node_image) {
                _this.node_image.remove();
            }
            _this.renderer.node_layer.activate();
            var _ratio = Math.min(1, 2 * Rkns.Renderer._NODE_RADIUS / _image.width, 2 * Rkns.Renderer._NODE_RADIUS / _image.height );
            var _raster = new paper.Raster(_image);
            var _clip = new paper.Path.Circle([0, 0], Rkns.Renderer._NODE_RADIUS);
            _raster.scale(_ratio);
            _this.node_image = new paper.Group(_clip, _raster);
            _this.node_image.opacity = _this.selected ? .5 : .9;
            /* This is a workaround to allow clipping at group level */
            _this.node_image.clipped = true;
            _this.node_image.position = _this.paper_coords;
            _this.node_image.__representation = _this;
            paper.view.draw();
        }
        _image.src = _img;
    }
    this.img = _img;
    if (this.node_image) {
        if (!this.img) {
            this.node_image.remove();
            delete this.node_image;
        } else {
            this.node_image.position = this.paper_coords;
        }
    }
}

Rkns.Renderer.Node.prototype.paperShift = function(_delta) {
    this.paper_coords = this.paper_coords.add(_delta);
    this.model_coords = this.renderer.toModelCoords(this.paper_coords);
    this.renderer.redraw();
}

Rkns.Renderer.Node.prototype.openTooltip = function() {
    this.renderer.removeRepresentationsOfType("tooltip");
    var _tooltip = this.renderer.addRepresentation("NodeTooltip",null);
    _tooltip.node_representation = this;
    _tooltip.draw();
}

Rkns.Renderer.Node.prototype.select = function() {
    this.selected = true;
    this.circle.strokeWidth = 3;
    this.openTooltip();
    this.circle.fillColor = "#ffff80";
    if (this.node_image) {
        this.node_image.opacity = .5;
    }
    paper.view.draw();
}

Rkns.Renderer.Node.prototype.unselect = function() {
    this.selected = false;
    this.circle.strokeWidth = 1;
    this.circle.fillColor = "#ffffff";
    if (this.node_image) {
        this.node_image.opacity = .9;
    }
    paper.view.draw();
}

Rkns.Renderer.Node.prototype.mouseup = function(_event) {
}

Rkns.Renderer.Node.prototype.destroy = function(_event) {
    this.super("destroy");
    this.circle.remove();
    this.title.remove();
    if (this.node_image) {
        this.node_image.remove();
    }
}

/* */

Rkns.Renderer.Edge = Rkns.Utils.inherit(Rkns.Renderer._BaseRepresentation);

Rkns.Renderer.Edge.prototype._init = function() {
    this.renderer.edge_layer.activate();
    this.type = "Edge";
    this.from_representation = this.renderer.getRepresentationByModel(this.model.get("from"));
    this.to_representation = this.renderer.getRepresentationByModel(this.model.get("to"));
    this.bundle = this.renderer.addToBundles(this);
    this.line = new paper.Path();
    this.line.add([0,0],[0,0],[0,0]);
    this.line.__representation = this;
    this.arrow = new paper.Path();
    this.arrow.add([0,0],[Rkns.Renderer._ARROW_LENGTH,Rkns.Renderer._ARROW_WIDTH / 2],[0,Rkns.Renderer._ARROW_WIDTH]);
    this.arrow.__representation = this;
    this.text = new paper.PointText();
    this.text.characterStyle = {
        fontSize: Rkns.Renderer._EDGE_FONT_SIZE,
        fillColor: 'black'
    };
    this.text.paragraphStyle.justification = 'center';
    this.text.__representation = this;
    this.text_angle = 0;
    this.arrow_angle = 0;
}

Rkns.Renderer.Edge.prototype.redraw = function() {
    var _p0a = this.from_representation.paper_coords,
        _p1a = this.to_representation.paper_coords,
        _v = _p1a.subtract(_p0a),
        _r = _v.length,
        _u = _v.divide(_r),
        _group_pos = this.bundle.getPosition(this),
        _delta = new paper.Point([- _u.y, _u.x]).multiply( 12 * _group_pos ),
        _p0b = _p0a.add(_delta), /* Adding a 4 px difference */
        _p1b = _p1a.add(_delta), /* to differentiate inbound and outbound links */
        _a = _v.angle,
        _handle = _v.divide(3),
        _color = this.model.get("created_by").get("color");
    this.paper_coords = _p0b.add(_p1b).divide(2);
    this.line.strokeColor = _color;
    this.line.segments[0].point = _p0a;
    this.line.segments[1].point = this.paper_coords;
    this.line.segments[1].handleIn = _handle.multiply(-1);
    this.line.segments[1].handleOut = _handle;
    this.line.segments[2].point = _p1a;
    this.arrow.rotate(_a - this.arrow_angle);
    this.arrow.fillColor = _color;
    this.arrow.position = this.paper_coords.subtract(_u.multiply(4));
    this.arrow_angle = _a;
    if (_a > 90) {
        _a -= 180;
    }
    if (_a < -90) {
        _a += 180;
    }
    this.text.rotate(_a - this.text_angle);
    this.text.content = Rkns.Renderer.Utils.shortenText(this.model.get("title"), Rkns.Renderer._EDGE_MAX_CHAR);
    this.text.position = this.paper_coords;
    this.text_angle = _a;
}

Rkns.Renderer.Edge.prototype.openTooltip = function() {
    this.renderer.removeRepresentationsOfType("tooltip");
    var _tooltip = this.renderer.addRepresentation("EdgeTooltip",null);
    _tooltip.edge_representation = this;
    _tooltip.draw();
}

Rkns.Renderer.Edge.prototype.select = function() {
    this.line.strokeWidth = 3;
    this.openTooltip();
    paper.view.draw();
}

Rkns.Renderer.Edge.prototype.unselect = function() {
    this.line.strokeWidth = 1;
    paper.view.draw();
}

Rkns.Renderer.Edge.prototype.mouseup = function(_event) {
}

Rkns.Renderer.Edge.prototype.paperShift = function(_delta) {
    this.from_representation.paperShift(_delta);
    this.to_representation.paperShift(_delta);
    this.renderer.redraw();
}

Rkns.Renderer.Edge.prototype.destroy = function() {
    this.super("destroy");
    this.line.remove();
    this.arrow.remove();
    this.text.remove();
    var _this = this;
    this.bundle.edges = Rkns._(this.bundle.edges).reject(function(_edge) {
        return _edge === _this;
    });
}

/* */

Rkns.Renderer.NodeTooltip = Rkns.Utils.inherit(Rkns.Renderer._BaseRepresentation);

Rkns.Renderer.NodeTooltip.prototype._init = function() {
    this.renderer.overlay_layer.activate();
    this.type = "tooltip";
    this.tooltip_block = new paper.Path();
    var _pts = Rkns._(Rkns._.range(8)).map(function() {return [0,0]});
    this.tooltip_block.add.apply(this.tooltip_block, _pts);
    this.tooltip_block.strokeWidth = 2;
    this.tooltip_block.strokeColor = "#999999";
    this.tooltip_block.fillColor = "#e0e0e0";
    this.tooltip_block.opacity = .8;
    this.tooltip_$ = Rkns.$('<div>')
        .appendTo(this.renderer.tooltip_$)
        .css({
            position: "absolute",
            opacity: .8
        })
        .hide();
}

Rkns.Renderer.NodeTooltip.prototype.template = Rkns._.template(
    '<h2><span class="Rk-CloseX">&times;</span><%=a%></h2>'
    + '<p><%-description%></p>'
    + '<ul class="Rk-Related-List"></ul>'
);

Rkns.Renderer.NodeTooltip.prototype.draw = function() {
    var _model = this.node_representation.model,
        _title = _model.get("title"),
        _uri = _model.get("uri");
    this.tooltip_$
        .html(this.template({
            a: (_uri ? '<a href="' + _uri + '" target="_blank">' : '' ) + _title + (_uri ? '</a>' : '' ),
            description: _model.get("description").replace(/(\n|\r|\r\n)/mg,' ').substr(0,180).replace(/(^.{150,179})[\s].+$/m,'$1&hellip;')
        }))
    var _this = this,
        _renkan = this.renderer.renkan,
        _uris = _renkan.uris[_uri];
    Rkns._(_uris).each(function(_othernode) {
        if (_othernode !== _model && _othernode.get("project") !== _this.project) {
            var _otherproj = _othernode.get("project"),
                _nodetitle = _othernode.get("title") || "Untitled node"
                _projtitle = _otherproj.get("title") || "Untitled node",
                _html = _renkan.l10n.see_in_project.replace('{node}',Rkns._.escape(_nodetitle)).replace('{project}',Rkns._.escape(_projtitle)),
                _li = Rkns.$("<li>").addClass("Rk-Related").html(_html);
            _li.click(function() {
                _renkan.renderProject(_otherproj);
                Rkns._.defer(function() {
                    _othernode.trigger("select");
                });
            });
            _this.tooltip_$.append(_li);
        }
    });
    this.tooltip_$.find(".Rk-CloseX").click(function() {
        _this.renderer.removeRepresentation(_this);
        paper.view.draw();
    });
    this.redraw();
}

Rkns.Renderer.NodeTooltip.prototype.redraw = function() {
    var _coords = this.node_representation.paper_coords;
    Rkns.Renderer.Utils.drawTooltip(_coords, this.tooltip_block, 250, 15, this.tooltip_$);
    this.tooltip_$.show();
}

Rkns.Renderer.NodeTooltip.prototype.destroy = function() {
    this.tooltip_block.remove();
    this.tooltip_$.detach();
}

/* */

Rkns.Renderer.EdgeTooltip = Rkns.Utils.inherit(Rkns.Renderer._BaseRepresentation);

Rkns.Renderer.EdgeTooltip.prototype._init = function() {
    this.renderer.overlay_layer.activate();
    this.type = "tooltip";
    this.tooltip_block = new paper.Path();
    var _pts = Rkns._(Rkns._.range(8)).map(function() {return [0,0]});
    this.tooltip_block.add.apply(this.tooltip_block, _pts);
    this.tooltip_block.strokeWidth = 2;
    this.tooltip_block.strokeColor = "#999999";
    this.tooltip_block.fillColor = "#e0e0e0";
    this.tooltip_block.opacity = .8;
    this.tooltip_$ = Rkns.$('<div>')
        .appendTo(this.renderer.tooltip_$)
        .css({
            position: "absolute",
            opacity: .8
        })
        .hide();
}

Rkns.Renderer.EdgeTooltip.prototype.template = Rkns._.template(
    '<h2><span class="Rk-CloseX">&times;</span><%=a%></h2>'
    + '<p><%-description%></p>'
);

Rkns.Renderer.EdgeTooltip.prototype.draw = function() {
    var _model = this.edge_representation.model,
        _title = _model.get("title"),
        _uri = _model.get("uri");
    this.tooltip_$
        .html(this.template({
            a: (_uri ? '<a href="' + _uri + '" target="_blank">' : '' ) + _title + (_uri ? '</a>' : '' ),
            description: _model.get("description").replace(/(\n|\r|\r\n)/mg,' ').substr(0,180).replace(/(^.{150,179})[\s].+$/m,'$1&hellip;')
        }));
    this.redraw();
    var _this = this;
    this.tooltip_$.find(".Rk-CloseX").click(function() {
        _this.renderer.removeRepresentation(_this);
        paper.view.draw();
    });
}

Rkns.Renderer.EdgeTooltip.prototype.redraw = function() {
    var _coords = this.edge_representation.paper_coords;
    Rkns.Renderer.Utils.drawTooltip(_coords, this.tooltip_block, 250, 5, this.tooltip_$);
    this.tooltip_$.show();
    paper.view.draw();
}

Rkns.Renderer.EdgeTooltip.prototype.destroy = function() {
    this.tooltip_block.remove();
    this.tooltip_$.detach();
}

/* */

Rkns.Renderer.Scene = function(_renkan, _project) {
    this.renkan = _renkan;
    this.project = _project;
    this.$ = Rkns.$(".Rk-Render");
    this.representations = [];
    this.$.html(this.template({
        width: this.$.width(),
        height: this.$.height(),
        l10n: _renkan.l10n
    }))
    this.canvas_$ = this.$.find(".Rk-Canvas");
    this.tooltip_$ = this.$.find(".Rk-Editor");
    paper.setup(this.canvas_$[0]);
    this.scale = 1;
    this.offset = paper.view.center;
    this.totalScroll = 0;
    this.click_target = null;
    this.selected_target = null;
    this.edge_layer = new paper.Layer();
    this.node_layer = new paper.Layer();
    this.overlay_layer = new paper.Layer();
    this.bundles = [];
    var _tool = new paper.Tool(),
        _this = this;
    _tool.minDistance = Rkns.Renderer._MIN_DRAG_DISTANCE;
    _tool.onMouseMove = function(_event) {
        _this.onMouseMove(_event);
    }
    _tool.onMouseDown = function(_event) {
        _this.onMouseDown(_event);
    }
    _tool.onMouseDrag = function(_event) {
        _this.onMouseDrag(_event);
    }
    this.canvas_$.mouseup(function(_event) {
        _this.onMouseUp(_event);
    });
    this.canvas_$.mousewheel(function(_event, _delta) {
        _this.onScroll(_event, _delta);
    });
    this.tooltip_$.find(".Rk-ZoomOut").click(function() {
        _this.offset = new paper.Point([
            _this.canvas_$.width(),
            _this.canvas_$.height()
        ]).multiply( .5 * ( 1 - Math.SQRT1_2 ) ).add(_this.offset.multiply( Math.SQRT1_2 ));
        _this.scale *= Math.SQRT1_2;
        _this.redraw();
    });
    this.tooltip_$.find(".Rk-ZoomIn").click(function() {
        _this.offset = new paper.Point([
            _this.canvas_$.width(),
            _this.canvas_$.height()
        ]).multiply( .5 * ( 1 - Math.SQRT2 ) ).add(_this.offset.multiply( Math.SQRT2 ));
        _this.scale *= Math.SQRT2;
        _this.redraw();
    });
    paper.view.onResize = function(_event) {
        _this.offset = _this.offset.add(_event.delta.divide(2));
        _this.redraw();
    }
    
    var _thRedraw = Rkns._.throttle(function() {
        _this.redraw();
    },50);
    
    this.addRepresentations("Node", this.project.get("nodes"));
    this.addRepresentations("Edge", this.project.get("edges"));
    
    this._addNodesBinding = function(_node) {
        _this.addRepresentation("Node", _node);
        _thRedraw();
    }
    this._addEdgesBinding = function(_edge) {
        _this.addRepresentation("Edge", _edge);
        _thRedraw();
    }
    
    this.project.on("add:nodes", this._addNodesBinding );
    this.project.on("add:edges", this._addEdgesBinding );
    this.redraw();
}

Rkns.Renderer.Scene.prototype.template = Rkns._.template(
    '<canvas class="Rk-Canvas" width="<%-width%>" height="<%-height%>"></canvas><div class="Rk-Editor">'
    + '<div class="Rk-ZoomButtons"><div class="Rk-ZoomIn" title="<%-l10n.zoom_in%>"></div><div class="Rk-ZoomOut" title="<%-l10n.zoom_out%>"></div></div>'
    + '</div>'
);

Rkns.Renderer.Scene.prototype.addToBundles = function(_edgeRepr) {
    var _bundle = Rkns._(this.bundles).find(function(_bundle) {
        return ( 
            ( _bundle.from === _edgeRepr.from_representation && _bundle.to === _edgeRepr.to_representation )
            || ( _bundle.from === _edgeRepr.to_representation && _bundle.to === _edgeRepr.from_representation )
        );
    });
    if (typeof _bundle !== "undefined") {
        _bundle.edges.push(_edgeRepr)
    } else {
        _bundle = {
            from: _edgeRepr.from_representation,
            to: _edgeRepr.to_representation,
            edges: [ _edgeRepr ],
            getPosition: function(_er) {
                var _dir = (_er.from_representation === this.from) ? 1 : -1;
                return _dir * ( Rkns._(this.edges).indexOf(_er) - (this.edges.length - 1) / 2 );
            }
        }
        this.bundles.push(_bundle);
    }
    return _bundle;
}

Rkns.Renderer.Scene.prototype.autoScale = function() {
    if (this.project.get("nodes").length) {
        var _xx = this.project.get("nodes").map(function(_node) { return _node.get("position").x }),
            _yy = this.project.get("nodes").map(function(_node) { return _node.get("position").y }),
            _minx = Math.min.apply(Math, _xx),
            _miny = Math.min.apply(Math, _yy),
            _maxx = Math.max.apply(Math, _xx),
            _maxy = Math.max.apply(Math, _yy);
        this.scale = Math.min((paper.view.size.width - 2 * Rkns.Renderer._MARGIN_X) / (_maxx - _minx), (paper.view.size.height - 2 * Rkns.Renderer._MARGIN_Y) / (_maxy - _miny));
        this.offset = paper.view.center.subtract(new paper.Point([(_maxx + _minx) / 2, (_maxy + _miny) / 2]).multiply(this.scale));
        this.redraw();
    }
}

Rkns.Renderer.Scene.prototype.toPaperCoords = function(_point) {
    return _point.multiply(this.scale).add(this.offset);
}


Rkns.Renderer.Scene.prototype.toModelCoords = function(_point) {
    return _point.subtract(this.offset).divide(this.scale);
}

Rkns.Renderer.Scene.prototype.addRepresentation = function(_type, _model) {
    var _repr = new Rkns.Renderer[_type](this, _model);
    this.representations.push(_repr);
    return _repr;
}

Rkns.Renderer.Scene.prototype.addRepresentations = function(_type, _collection) {
    var _this = this;
    _collection.forEach(function(_model) {
        _this.addRepresentation(_type, _model);
    });
}

Rkns.Renderer.Scene.prototype.removeRepresentation = function(_representation) {
    _representation.destroy();
    this.representations = Rkns._(this.representations).reject(
        function(_repr) {
            return _repr == _representation
        }
    );
}

Rkns.Renderer.Scene.prototype.getRepresentationByModel = function(_model) {
    return Rkns._(this.representations).find(function(_repr) {
        return _repr.model === _model;
    });
}

Rkns.Renderer.Scene.prototype.removeRepresentationsOfType = function(_type) {
    var _representations = Rkns._(this.representations).filter(function(_repr) {
            return _repr.type == _type;
        }),
        _this = this;
    Rkns._(_representations).each(function(_repr) {
        _this.removeRepresentation(_repr);
    });
}

Rkns.Renderer.Scene.prototype.unselectAll = function() {
    Rkns._(this.representations).each(function(_repr) {
        _repr.model.trigger("unselect");
    });
}

Rkns.Renderer.Scene.prototype.redraw = function() {
    Rkns._(this.representations).each(function(_representation) {
        _representation.redraw();
    });
    paper.view.draw();
}

Rkns.Renderer.Scene.prototype.addTempEdge = function(_from, _point) {
    var _tmpEdge = this.addRepresentation("TempEdge",null);
    _tmpEdge.end_pos = _point;
    _tmpEdge.from_representation = _from;
    _tmpEdge.redraw();
    this.click_target = _tmpEdge;
}

Rkns.Renderer.Scene.prototype.findTarget = function(_hitResult) {
    if (_hitResult && typeof _hitResult.item.__representation !== "undefined") {
        var _newTarget = _hitResult.item.__representation;
        if (this.selected_target !== _newTarget && _newTarget.model) {
            if (this.selected_target) {
                this.selected_target.model.trigger("unselect");
            }
            _newTarget.model.trigger("select");
            this.selected_target = _newTarget;
        }
    } else {
        if (!_hitResult) {
            this.removeRepresentationsOfType("tooltip");
        }
        if (this.selected_target) {
            this.selected_target.model.trigger("unselect");
        }
        this.selected_target = null;
    }
}

Rkns.Renderer.Scene.prototype.onMouseMove = function(_event) {
    var _hitResult = paper.project.hitTest(_event.point);
    if (this.is_dragging) {
        if (this.click_target && typeof this.click_target.paperShift === "function") {
            this.click_target.paperShift(_event.delta);
        } else {
            this.offset = this.offset.add(_event.delta);
            this.redraw();
        }
    } else {
        this.findTarget(_hitResult);
    }
}

Rkns.Renderer.Scene.prototype.onMouseDown = function(_event) {
    this.is_dragging = false;
    var _hitResult = paper.project.hitTest(_event.point);
    if (_hitResult && typeof _hitResult.item.__representation !== "undefined") {
        this.click_target = _hitResult.item.__representation;
    } else {
        this.click_target = null;
    }
}

Rkns.Renderer.Scene.prototype.onMouseDrag = function(_event) {
    this.is_dragging = true;
    this.onMouseMove(_event);
}

Rkns.Renderer.Scene.prototype.onMouseUp = function(_event) {
    if (this.click_target) {
        var _off = this.canvas_$.offset();
        if (this.click_target.model) {
            this.click_target.model.trigger("click");
        }
    }
    this.is_dragging = false;
    this.click_target = null;
}

Rkns.Renderer.Scene.prototype.onScroll = function(_event, _scrolldelta) {
    this.totalScroll += _scrolldelta;
    if (Math.abs(this.totalScroll) >= 1) {
        var _off = this.canvas_$.offset(),
            _delta = new paper.Point([
                _event.pageX - _off.left,
                _event.pageY - _off.top
            ]).subtract(this.offset).multiply( Math.SQRT2 - 1 );
        if (this.totalScroll > 0) {
            this.offset = this.offset.subtract(_delta);
            this.scale *= Math.SQRT2;
        } else {
            this.offset = this.offset.add(_delta.divide( Math.SQRT2 ));
            this.scale *= Math.SQRT1_2;
        }
        this.totalScroll = 0;
        this.redraw();
    }
}

Rkns.Renderer.Scene.prototype.destroy = function() {
    this.project.off("add:nodes", this._addNodesBinding );
    this.project.off("add:edges", this._addEdgesBinding );
    Rkns._(this.representations).each(function(_repr) {
        _repr.destroy();
    });
    this.$.html("");
    paper.remove();
}

