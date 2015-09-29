/*!
 *    _____            _
 *   |  __ \          | |
 *   | |__) |___ _ __ | | ____ _ _ __
 *   |  _  // _ \ '_ \| |/ / _` | '_ \
 *   | | \ \  __/ | | |   < (_| | | | |
 *   |_|  \_\___|_| |_|_|\_\__,_|_| |_|
 *
 *  Copyright 2012-2015 Institut de recherche et d'innovation
 *  contributor(s) : Yves-Marie Haussonne, Raphael Velt, Samuel Huron,
 *      Thibaut Cavalié, Julien Rougeron.
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

/*! renkan - v0.12.4 - Copyright © IRI 2015 */

this["renkanJST"] = this["renkanJST"] || {};

this["renkanJST"]["templates/colorpicker.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li data-color="' +
((__t = (c)) == null ? '' : __t) +
'" style="background: ' +
((__t = (c)) == null ? '' : __t) +
'"></li>';

}
return __p
};

this["renkanJST"]["templates/edgeeditor.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>\n    <span class="Rk-CloseX">&times;</span>' +
__e(renkan.translate("Edit Edge")) +
'</span>\n</h2>\n<p>\n    <label>' +
__e(renkan.translate("Title:")) +
'</label>\n    <input class="Rk-Edit-Title" type="text" value="' +
__e(edge.title) +
'" />\n</p>\n';
 if (options.show_edge_editor_uri) { ;
__p += '\n    <p>\n        <label>' +
__e(renkan.translate("URI:")) +
'</label>\n        <input class="Rk-Edit-URI" type="text" value="' +
__e(edge.uri) +
'" />\n        <a class="Rk-Edit-Goto" href="' +
__e(edge.uri) +
'" target="_blank"></a>\n    </p>\n    ';
 if (options.properties.length) { ;
__p += '\n        <p>\n            <label>' +
__e(renkan.translate("Choose from vocabulary:")) +
'</label>\n            <select class="Rk-Edit-Vocabulary">\n                ';
 _.each(options.properties, function(ontology) { ;
__p += '\n                    <option class="Rk-Edit-Vocabulary-Class" value="">\n                        ' +
__e( renkan.translate(ontology.label) ) +
'\n                    </option>\n                    ';
 _.each(ontology.properties, function(property) { var uri = ontology["base-uri"] + property.uri; ;
__p += '\n                        <option class="Rk-Edit-Vocabulary-Property" value="' +
__e( uri ) +
'"\n                            ';
 if (uri === edge.uri) { ;
__p += ' selected';
 } ;
__p += '>\n                            ' +
__e( renkan.translate(property.label) ) +
'\n                        </option>\n                    ';
 }) ;
__p += '\n                ';
 }) ;
__p += '\n            </select>\n        </p>\n';
 } } ;
__p += '\n';
 if (options.show_edge_editor_style) { ;
__p += '\n    <div class="Rk-Editor-p">\n      ';
 if (options.show_edge_editor_style_color) { ;
__p += '\n      <div id="Rk-Editor-p-color">\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("Edge color:")) +
'</span>\n        <div class="Rk-Edit-ColorPicker-Wrapper">\n            <span class="Rk-Edit-Color" style="background: &lt;%-edge.color%>;">\n                <span class="Rk-Edit-ColorTip"></span>\n            </span>\n            ' +
((__t = ( renkan.colorPicker )) == null ? '' : __t) +
'\n            <span class="Rk-Edit-ColorPicker-Text">' +
__e( renkan.translate("Choose color") ) +
'</span>\n        </div>\n      </div>\n      ';
 } ;
__p += '\n      ';
 if (options.show_edge_editor_style_dash) { ;
__p += '\n      <div id="Rk-Editor-p-dash">\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("Dash:")) +
'</span>\n        <input type="checkbox" name="Rk-Edit-Dash" class="Rk-Edit-Dash" ' +
__e( edge.dash ) +
' />\n      </div>\n      ';
 } ;
__p += '\n      ';
 if (options.show_edge_editor_style_thickness) { ;
__p += '\n      <div id="Rk-Editor-p-thickness">\n          <span class="Rk-Editor-Label">' +
__e(renkan.translate("Thickness:")) +
'</span>\n          <a href="#" class="Rk-Edit-Size-Btn" id="Rk-Edit-Thickness-Down">-</a>\n          <span class="Rk-Edit-Size-Disp" id="Rk-Edit-Thickness-Value">' +
__e( edge.thickness ) +
'</span>\n          <a href="#" class="Rk-Edit-Size-Btn" id="Rk-Edit-Thickness-Up">+</a>\n      </div>\n      ';
 } ;
__p += '\n      ';
 if (options.show_edge_editor_style_arrow) { ;
__p += '\n      <div id="Rk-Editor-p-arrow">\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("Arrow:")) +
'</span>\n        <input type="checkbox" name="Rk-Edit-Arrow" class="Rk-Edit-Arrow" ' +
__e( edge.arrow ) +
' />\n      </div>\n      ';
 } ;
__p += '\n    </div>\n';
 } ;
__p += '\n';
 if (options.show_edge_editor_direction) { ;
__p += '\n    <p>\n        <span class="Rk-Edit-Direction">' +
__e( renkan.translate("Change edge direction") ) +
'</span>\n    </p>\n';
 } ;
__p += '\n';
 if (options.show_edge_editor_nodes) { ;
__p += '\n    <p>\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("From:")) +
'</span>\n        <span class="Rk-UserColor" style="background: ' +
__e(edge.from_color) +
';"></span>\n        ' +
__e( shortenText(edge.from_title, 25) ) +
'\n    </p>\n    <p>\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("To:")) +
'</span>\n        <span class="Rk-UserColor" style="background: >%-edge.to_color%>;"></span>\n        ' +
__e( shortenText(edge.to_title, 25) ) +
'\n    </p>\n';
 } ;
__p += '\n';
 if (options.show_edge_editor_creator && edge.has_creator) { ;
__p += '\n    <p>\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("Created by:")) +
'</span>\n        <span class="Rk-UserColor" style="background: &lt;%-edge.created_by_color%>;"></span>\n        ' +
__e( shortenText(edge.created_by_title, 25) ) +
'\n    </p>\n';
 } ;
__p += '\n';

}
return __p
};

this["renkanJST"]["templates/edgeeditor_readonly.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>\n    <span class="Rk-CloseX">&times;</span>\n    ';
 if (options.show_edge_tooltip_color) { ;
__p += '\n        <span class="Rk-UserColor" style="background: ' +
__e( edge.color ) +
';"></span>\n    ';
 } ;
__p += '\n    <span class="Rk-Display-Title">\n        ';
 if (edge.uri) { ;
__p += '\n            <a href="' +
__e(edge.uri) +
'" target="_blank">\n        ';
 } ;
__p += '\n        ' +
__e(edge.title) +
'\n        ';
 if (edge.uri) { ;
__p += ' </a> ';
 } ;
__p += '\n    </span>\n</h2>\n';
 if (options.show_edge_tooltip_uri && edge.uri) { ;
__p += '\n    <p class="Rk-Display-URI">\n        <a href="' +
__e(edge.uri) +
'" target="_blank">' +
__e( edge.short_uri ) +
'</a>\n    </p>\n';
 } ;
__p += '\n<p>' +
((__t = (edge.description)) == null ? '' : __t) +
'</p>\n';
 if (options.show_edge_tooltip_nodes) { ;
__p += '\n    <p>\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("From:")) +
'</span>\n        <span class="Rk-UserColor" style="background: ' +
__e( edge.from_color ) +
';"></span>\n        ' +
__e( shortenText(edge.from_title, 25) ) +
'\n    </p>\n    <p>\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("To:")) +
'</span>\n        <span class="Rk-UserColor" style="background: ' +
__e( edge.to_color ) +
';"></span>\n        ' +
__e( shortenText(edge.to_title, 25) ) +
'\n    </p>\n';
 } ;
__p += '\n';
 if (options.show_edge_tooltip_creator && edge.has_creator) { ;
__p += '\n    <p>\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("Created by:")) +
'</span>\n        <span class="Rk-UserColor" style="background: ' +
__e( edge.created_by_color ) +
';"></span>\n        ' +
__e( shortenText(edge.created_by_title, 25) ) +
'\n    </p>\n';
 } ;
__p += '\n';

}
return __p
};

this["renkanJST"]["templates/ldtjson-bin/annotationtemplate.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="Rk-Bin-Item" draggable="true"\n    data-image="' +
__e( Rkns.Utils.getFullURL(image) ) +
'"\n    data-uri="' +
((__t = (ldt_platform)) == null ? '' : __t) +
'ldtplatform/ldt/front/player/' +
((__t = (mediaid)) == null ? '' : __t) +
'/#id=' +
((__t = (annotationid)) == null ? '' : __t) +
'"\n    data-title="' +
__e(title) +
'" data-description="' +
__e(description) +
'">\n\n    <img class="Rk-Ldt-Annotation-Icon" src="' +
((__t = (image)) == null ? '' : __t) +
'" />\n    <h4>' +
((__t = (htitle)) == null ? '' : __t) +
'</h4>\n    <p>' +
((__t = (hdescription)) == null ? '' : __t) +
'</p>\n    <p>Start: ' +
((__t = (start)) == null ? '' : __t) +
', End: ' +
((__t = (end)) == null ? '' : __t) +
', Duration: ' +
((__t = (duration)) == null ? '' : __t) +
'</p>\n    <div class="Rk-Clear"></div>\n</li>\n';

}
return __p
};

this["renkanJST"]["templates/ldtjson-bin/segmenttemplate.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="Rk-Bin-Item" draggable="true"\n    data-image="' +
__e( Rkns.Utils.getFullURL(image) ) +
'"\n    data-uri="' +
((__t = (ldt_platform)) == null ? '' : __t) +
'ldtplatform/ldt/front/player/' +
((__t = (mediaid)) == null ? '' : __t) +
'/#id=' +
((__t = (annotationid)) == null ? '' : __t) +
'"\n    data-title="' +
__e(title) +
'" data-description="' +
__e(description) +
'">\n\n    <img class="Rk-Ldt-Annotation-Icon" src="' +
((__t = (image)) == null ? '' : __t) +
'" />\n    <h4>' +
((__t = (htitle)) == null ? '' : __t) +
'</h4>\n    <p>' +
((__t = (hdescription)) == null ? '' : __t) +
'</p>\n    <p>Start: ' +
((__t = (start)) == null ? '' : __t) +
', End: ' +
((__t = (end)) == null ? '' : __t) +
', Duration: ' +
((__t = (duration)) == null ? '' : __t) +
'</p>\n    <div class="Rk-Clear"></div>\n</li>\n';

}
return __p
};

this["renkanJST"]["templates/ldtjson-bin/tagtemplate.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="Rk-Bin-Item" draggable="true"\n    data-image="' +
__e( Rkns.Utils.getFullURL(static_url+'img/ldt-tag.png') ) +
'"\n    data-uri="' +
((__t = (ldt_platform)) == null ? '' : __t) +
'ldtplatform/ldt/front/search/?search=' +
((__t = (encodedtitle)) == null ? '' : __t) +
'&field=all"\n    data-title="' +
__e(title) +
'" data-description="Tag \'' +
__e(title) +
'\'">\n\n    <img class="Rk-Ldt-Tag-Icon" src="' +
__e(static_url) +
'img/ldt-tag.png" />\n    <h4>' +
((__t = (htitle)) == null ? '' : __t) +
'</h4>\n    <div class="Rk-Clear"></div>\n</li>\n';

}
return __p
};

this["renkanJST"]["templates/list-bin.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<li class="Rk-Bin-Item Rk-ResourceList-Item" draggable="true"\n    data-uri="' +
__e(url) +
'" data-title="' +
__e(title) +
'"\n    data-description="' +
__e(description) +
'"\n    ';
 if (image) { ;
__p += '\n        data-image="' +
__e( Rkns.Utils.getFullURL(image) ) +
'"\n    ';
 } else { ;
__p += '\n        data-image=""\n    ';
 } ;
__p += '\n>';
 if (image) { ;
__p += '\n    <img class="Rk-ResourceList-Image" src="' +
__e(image) +
'" />\n';
 } ;
__p += '\n<h4 class="Rk-ResourceList-Title">\n    ';
 if (url) { ;
__p += '\n        <a href="' +
__e(url) +
'" target="_blank">\n    ';
 } ;
__p += '\n    ' +
((__t = (htitle)) == null ? '' : __t) +
'\n    ';
 if (url) { ;
__p += '</a>';
 } ;
__p += '\n    </h4>\n    ';
 if (description) { ;
__p += '\n        <p class="Rk-ResourceList-Description">' +
((__t = (hdescription)) == null ? '' : __t) +
'</p>\n    ';
 } ;
__p += '\n    ';
 if (image) { ;
__p += '\n        <div style="clear: both;"></div>\n    ';
 } ;
__p += '\n</li>\n';

}
return __p
};

this["renkanJST"]["templates/main.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (options.show_bins) { ;
__p += '\n    <div class="Rk-Bins">\n        <div class="Rk-Bins-Head">\n            <h2 class="Rk-Bins-Title">' +
__e( translate("Select contents:")) +
'</h2>\n            <form class="Rk-Web-Search-Form Rk-Search-Form">\n                <input class="Rk-Web-Search-Input Rk-Search-Input" type="search"\n                    placeholder="' +
__e( translate('Search the Web') ) +
'" />\n                <div class="Rk-Search-Select">\n                    <div class="Rk-Search-Current"></div>\n                    <ul class="Rk-Search-List"></ul>\n                </div>\n                <input type="submit" value=""\n                    class="Rk-Web-Search-Submit Rk-Search-Submit" title="' +
__e( translate('Search the Web') ) +
'" />\n            </form>\n            <form class="Rk-Bins-Search-Form Rk-Search-Form">\n                <input class="Rk-Bins-Search-Input Rk-Search-Input" type="search"\n                    placeholder="' +
__e( translate('Search in Bins') ) +
'" /> <input\n                    type="submit" value=""\n                    class="Rk-Bins-Search-Submit Rk-Search-Submit"\n                    title="' +
__e( translate('Search in Bins') ) +
'" />\n            </form>\n        </div>\n        <ul class="Rk-Bin-List"></ul>\n    </div>\n';
 } ;
__p += ' ';
 if (options.show_editor) { ;
__p += '\n    <div class="Rk-Render Rk-Render-';
 if (options.show_bins) { ;
__p += 'Panel';
 } else { ;
__p += 'Full';
 } ;
__p += '"></div>\n';
 } ;
__p += '\n';

}
return __p
};

this["renkanJST"]["templates/nodeeditor.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 //TODO: change class to id ;
__p += '\n<h2>\n    <span class="Rk-CloseX">&times;</span>' +
__e(renkan.translate("Edit Node")) +
'</span>\n</h2>\n<p>\n    <label>' +
__e(renkan.translate("Title:")) +
'</label>\n    <input class="Rk-Edit-Title" type="text" value="' +
__e(node.title) +
'" />\n</p>\n';
 if (options.show_node_editor_uri) { ;
__p += '\n    <p>\n        <label>' +
__e(renkan.translate("URI:")) +
'</label>\n        <input class="Rk-Edit-URI" type="text" value="' +
__e(node.uri) +
'" />\n        <a class="Rk-Edit-Goto" href="' +
__e(node.uri) +
'" target="_blank"></a>\n    </p>\n';
 } ;
__p += ' ';
 if (options.change_types) { ;
__p += '\n    <p>\n        <label>' +
__e(renkan.translate("Types available")) +
':</label>\n        <select class="Rk-Edit-Type">\n          ';
 _.each(types, function(type) { ;
__p += '\n            <option class="Rk-Edit-Vocabulary-Property" value="' +
__e( type ) +
'"';
 if (node.type === type) { ;
__p += ' selected';
 } ;
__p += '>\n                ' +
__e( renkan.translate(type.charAt(0).toUpperCase() + type.substring(1)) ) +
'\n            </option>\n          ';
 }); ;
__p += '\n        </select>\n    </p>\n';
 } ;
__p += ' ';
 if (options.show_node_editor_description) { ;
__p += '\n    <p>\n        <label>' +
__e(renkan.translate("Description:")) +
'</label>\n        ';
 if (options.show_node_editor_description_richtext) { ;
__p += '\n            <div class="Rk-Edit-Description" contenteditable="true">' +
((__t = (node.description)) == null ? '' : __t) +
'</div>\n        ';
 } else { ;
__p += '\n            <textarea class="Rk-Edit-Description">' +
((__t = (node.description)) == null ? '' : __t) +
'</textarea>\n        ';
 } ;
__p += '\n    </p>\n';
 } ;
__p += ' ';
 if (options.show_node_editor_size) { ;
__p += '\n    <p>\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("Size:")) +
'</span>\n        <a href="#" class="Rk-Edit-Size-Btn" id="Rk-Edit-Size-Down">-</a>\n        <span class="Rk-Edit-Size-Disp" id="Rk-Edit-Size-Value">' +
__e(node.size) +
'</span>\n        <a href="#" class="Rk-Edit-Size-Btn" id="Rk-Edit-Size-Up">+</a>\n    </p>\n';
 } ;
__p += ' ';
 if (options.show_node_editor_style) { ;
__p += '\n    <div class="Rk-Editor-p">\n      ';
 if (options.show_node_editor_style_color) { ;
__p += '\n      <div id="Rk-Editor-p-color">\n        <span class="Rk-Editor-Label">\n        ' +
__e(renkan.translate("Node color:")) +
'</span>\n        <div class="Rk-Edit-ColorPicker-Wrapper">\n            <span class="Rk-Edit-Color" style="background: ' +
__e(node.color) +
';">\n                <span class="Rk-Edit-ColorTip"></span>\n            </span>\n            ' +
((__t = ( renkan.colorPicker )) == null ? '' : __t) +
'\n            <span class="Rk-Edit-ColorPicker-Text">' +
__e( renkan.translate("Choose color") ) +
'</span>\n        </div>\n      </div>\n      ';
 } ;
__p += '\n      ';
 if (options.show_node_editor_style_dash) { ;
__p += '\n      <div id="Rk-Editor-p-dash">\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("Dash:")) +
'</span>\n        <input type="checkbox" name="Rk-Edit-Dash" class="Rk-Edit-Dash" ' +
__e( node.dash ) +
' />\n      </div>\n      ';
 } ;
__p += '\n      ';
 if (options.show_node_editor_style_thickness) { ;
__p += '\n      <div id="Rk-Editor-p-thickness">\n          <span class="Rk-Editor-Label">' +
__e(renkan.translate("Thickness:")) +
'</span>\n          <a href="#" class="Rk-Edit-Size-Btn" id="Rk-Edit-Thickness-Down">-</a>\n          <span class="Rk-Edit-Size-Disp" id="Rk-Edit-Thickness-Value">' +
__e(node.thickness) +
'</span>\n          <a href="#" class="Rk-Edit-Size-Btn" id="Rk-Edit-Thickness-Up">+</a>\n      </div>\n      ';
 } ;
__p += '\n    </div>\n';
 } ;
__p += ' ';
 if (options.show_node_editor_image) { ;
__p += '\n    <div class="Rk-Edit-ImgWrap">\n        <div class="Rk-Edit-ImgPreview">\n            <img src="' +
__e(node.image || node.image_placeholder) +
'" />\n            ';
 if (node.clip_path) { ;
__p += '\n                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewbox="0 0 1 1" preserveAspectRatio="none">\n                    <path style="stroke-width: .02; stroke:red; fill-opacity:.3; fill:red;" d="' +
__e( node.clip_path ) +
'" />\n                </svg>\n            ';
 };
__p += '\n        </div>\n    </div>\n    <p>\n        <label>' +
__e(renkan.translate("Image URL:")) +
'</label>\n        <div>\n            <a class="Rk-Edit-Image-Del" href="#"></a>\n            <input class="Rk-Edit-Image" type="text" value=\'' +
__e(node.image) +
'\' />\n        </div>\n    </p>\n';
 if (options.allow_image_upload) { ;
__p += '\n    <p>\n        <label>' +
__e(renkan.translate("Choose Image File:")) +
'</label>\n        <input class="Rk-Edit-Image-File" type="file" accept="image/*" />\n    </p>\n';
 };

 } ;
__p += ' ';
 if (options.show_node_editor_creator && node.has_creator) { ;
__p += '\n    <p>\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("Created by:")) +
'</span>\n        <span class="Rk-UserColor" style="background: ' +
__e(node.created_by_color) +
';"></span>\n        ' +
__e( shortenText(node.created_by_title, 25) ) +
'\n    </p>\n';
 } ;
__p += ' ';
 if (options.change_shapes) { ;
__p += '\n    <p>\n        <label>' +
__e(renkan.translate("Shapes available")) +
':</label>\n        <select class="Rk-Edit-Shape">\n          ';
 _.each(shapes, function(shape) { ;
__p += '\n            <option class="Rk-Edit-Vocabulary-Property" value="' +
__e( shape ) +
'"';
 if (node.shape === shape) { ;
__p += ' selected';
 } ;
__p += '>\n                ' +
__e( renkan.translate(shape.charAt(0).toUpperCase() + shape.substring(1)) ) +
'\n            </option>\n          ';
 }); ;
__p += '\n        </select>\n    </p>\n';
 } ;
__p += '\n';

}
return __p
};

this["renkanJST"]["templates/nodeeditor_readonly.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>\n    <span class="Rk-CloseX">&times;</span>\n    ';
 if (options.show_node_tooltip_color) { ;
__p += '\n        <span class="Rk-UserColor" style="background: ' +
__e(node.color) +
';"></span>\n    ';
 } ;
__p += '\n    <span class="Rk-Display-Title">\n        ';
 if (node.uri) { ;
__p += '\n            <a href="' +
__e(node.uri) +
'" target="_blank">\n        ';
 } ;
__p += '\n        ' +
__e(node.title) +
'\n        ';
 if (node.uri) { ;
__p += '</a>';
 } ;
__p += '\n    </span>\n</h2>\n';
 if (node.uri && options.show_node_tooltip_uri) { ;
__p += '\n    <p class="Rk-Display-URI">\n        <a href="' +
__e(node.uri) +
'" target="_blank">' +
__e(node.short_uri) +
'</a>\n    </p>\n';
 } ;
__p += ' ';
 if (options.show_node_tooltip_description) { ;
__p += '\n    <p class="Rk-Display-Description">' +
((__t = (node.description)) == null ? '' : __t) +
'</p>\n';
 } ;
__p += ' ';
 if (node.image && options.show_node_tooltip_image) { ;
__p += '\n    <img class="Rk-Display-ImgPreview" src="' +
__e(node.image) +
'" />\n';
 } ;
__p += ' ';
 if (node.has_creator && options.show_node_tooltip_creator) { ;
__p += '\n    <p>\n        <span class="Rk-Editor-Label">' +
__e(renkan.translate("Created by:")) +
'</span>\n        <span class="Rk-UserColor" style="background: ' +
__e(node.created_by_color) +
';"></span>\n        ' +
__e( shortenText(node.created_by_title, 25) ) +
'\n    </p>\n';
 } ;
__p += '\n    <a href="#?idNode=' +
__e(node._id) +
'">' +
__e(renkan.translate("Link to the node")) +
'</a>\n';

}
return __p
};

this["renkanJST"]["templates/nodeeditor_video.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>\n    <span class="Rk-CloseX">&times;</span>\n    ';
 if (options.show_node_tooltip_color) { ;
__p += '\n        <span class="Rk-UserColor" style="background: ' +
__e(node.color) +
';"></span>\n    ';
 } ;
__p += '\n    <span class="Rk-Display-Title">\n        ';
 if (node.uri) { ;
__p += '\n            <a href="' +
__e(node.uri) +
'" target="_blank">\n        ';
 } ;
__p += '\n        ' +
__e(node.title) +
'\n        ';
 if (node.uri) { ;
__p += '</a>';
 } ;
__p += '\n    </span>\n</h2>\n';
 if (node.uri && options.show_node_tooltip_uri) { ;
__p += '\n     <video width="320" height="240" controls>\n        <source src="' +
__e(node.uri) +
'" type="video/mp4">\n     </video> \n';
 } ;
__p += '\n    <a href="#?idnode=' +
__e(node._id) +
'">' +
__e(renkan.translate("Link to the node")) +
'</a>\n';

}
return __p
};

this["renkanJST"]["templates/scene.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (options.show_top_bar) { ;
__p += '\n    <div class="Rk-TopBar">\n        <div class="loader"></div>\n        ';
 if (!options.editor_mode) { ;
__p += '\n            <h2 class="Rk-PadTitle">\n                ' +
__e( project.get("title") || translate("Untitled project")) +
'\n            </h2>\n        ';
 } else { ;
__p += '\n            <input type="text" class="Rk-PadTitle" value="' +
__e( project.get('title') || '' ) +
'" placeholder="' +
__e(translate('Untitled project')) +
'" />\n        ';
 } ;
__p += '\n        ';
 if (options.show_user_list) { ;
__p += '\n            <div class="Rk-Users">\n                <div class="Rk-CurrentUser">\n                    ';
 if (options.show_user_color) { ;
__p += '\n                        <div class="Rk-Edit-ColorPicker-Wrapper">\n                            <span class="Rk-CurrentUser-Color">\n                            ';
 if (options.user_color_editable) { ;
__p += '\n                                <span class="Rk-Edit-ColorTip"></span>\n                            ';
 } ;
__p += '\n                            </span>\n                            ';
 if (options.user_color_editable) { print(colorPicker) } ;
__p += '\n                        </div>\n                    ';
 } ;
__p += '\n                    <span class="Rk-CurrentUser-Name">&lt;unknown user&gt;</span>\n                </div>\n                <ul class="Rk-UserList"></ul>\n            </div>\n        ';
 } ;
__p += '\n        ';
 if (options.home_button_url) {;
__p += '\n            <div class="Rk-TopBar-Separator"></div>\n            <a class="Rk-TopBar-Button Rk-Home-Button" href="' +
__e( options.home_button_url ) +
'">\n                <div class="Rk-TopBar-Tooltip">\n                    <div class="Rk-TopBar-Tooltip-Contents">\n                        ' +
__e( translate(options.home_button_title) ) +
'\n                    </div>\n                </div>\n            </a>\n        ';
 } ;
__p += '\n        ';
 if (options.show_fullscreen_button) { ;
__p += '\n            <div class="Rk-TopBar-Separator"></div>\n            <div class="Rk-TopBar-Button Rk-FullScreen-Button">\n                <div class="Rk-TopBar-Tooltip">\n                    <div class="Rk-TopBar-Tooltip-Contents">\n                        ' +
__e(translate("Full Screen")) +
'\n                    </div>\n                </div>\n            </div>\n        ';
 } ;
__p += '\n        ';
 if (options.editor_mode) { ;
__p += '\n            ';
 if (options.show_addnode_button) { ;
__p += '\n                <div class="Rk-TopBar-Separator"></div>\n                <div class="Rk-TopBar-Button Rk-AddNode-Button">\n                    <div class="Rk-TopBar-Tooltip">\n                        <div class="Rk-TopBar-Tooltip-Contents">\n                            ' +
__e(translate("Add Node")) +
'\n                        </div>\n                    </div>\n                </div>\n            ';
 } ;
__p += '\n            ';
 if (options.show_addedge_button) { ;
__p += '\n                <div class="Rk-TopBar-Separator"></div>\n                <div class="Rk-TopBar-Button Rk-AddEdge-Button">\n                    <div class="Rk-TopBar-Tooltip">\n                        <div class="Rk-TopBar-Tooltip-Contents">\n                            ' +
__e(translate("Add Edge")) +
'\n                        </div>\n                    </div>\n                </div>\n            ';
 } ;
__p += '\n            ';
 if (options.show_export_button) { ;
__p += '\n                <div class="Rk-TopBar-Separator"></div>\n                <div class="Rk-TopBar-Button Rk-Export-Button">\n                    <div class="Rk-TopBar-Tooltip">\n                        <div class="Rk-TopBar-Tooltip-Contents">\n                            ' +
__e(translate("Download Project")) +
'\n                        </div>\n                    </div>\n                </div>\n            ';
 } ;
__p += '\n            ';
 if (options.show_save_button) { ;
__p += '\n                <div class="Rk-TopBar-Separator"></div>\n                <div class="Rk-TopBar-Button Rk-Save-Button">\n                    <div class="Rk-TopBar-Tooltip">\n                        <div class="Rk-TopBar-Tooltip-Contents"></div>\n                    </div>\n                </div>\n            ';
 } ;
__p += '\n            ';
 if (options.show_open_button) { ;
__p += '\n                <div class="Rk-TopBar-Separator"></div>\n                <div class="Rk-TopBar-Button Rk-Open-Button">\n                    <div class="Rk-TopBar-Tooltip">\n                        <div class="Rk-TopBar-Tooltip-Contents">\n                            ' +
__e(translate("Open Project")) +
'\n                        </div>\n                    </div>\n                </div>\n            ';
 } ;
__p += '\n            ';
 if (options.show_bookmarklet) { ;
__p += '\n                <div class="Rk-TopBar-Separator"></div>\n                <a class="Rk-TopBar-Button Rk-Bookmarklet-Button" href="#">\n                    <div class="Rk-TopBar-Tooltip">\n                        <div class="Rk-TopBar-Tooltip-Contents">\n                            ' +
__e(translate("Renkan \'Drag-to-Add\' bookmarklet")) +
'\n                        </div>\n                    </div>\n                </a>\n                <div class="Rk-TopBar-Separator"></div>\n            ';
 } ;
__p += '\n        ';
 } else { ;
__p += '\n            ';
 if (options.show_export_button) { ;
__p += '\n                <div class="Rk-TopBar-Separator"></div>\n                <div class="Rk-TopBar-Button Rk-Export-Button">\n                    <div class="Rk-TopBar-Tooltip">\n                        <div class="Rk-TopBar-Tooltip-Contents">\n                            ' +
__e(translate("Download Project")) +
'\n                        </div>\n                    </div>\n                </div>\n                <div class="Rk-TopBar-Separator"></div>\n            ';
 } ;
__p += '\n        ';
 }; ;
__p += '\n        ';
 if (options.show_search_field) { ;
__p += '\n            <form action="#" class="Rk-GraphSearch-Form">\n                <input type="search" class="Rk-GraphSearch-Field" placeholder="' +
__e( translate('Search in graph') ) +
'" />\n            </form>\n            <div class="Rk-TopBar-Separator"></div>\n        ';
 } ;
__p += '\n    </div>\n';
 } ;
__p += '\n<div class="Rk-Editing-Space';
 if (!options.show_top_bar) { ;
__p += ' Rk-Editing-Space-Full';
 } ;
__p += '">\n    <div class="Rk-Labels"></div>\n    <canvas class="Rk-Canvas" ';
 if (options.resize) { ;
__p += ' resize="" ';
 } ;
__p += ' ></canvas>\n    <div class="Rk-Notifications"></div>\n    <div class="Rk-Editor">\n        ';
 if (options.show_bins) { ;
__p += '\n            <div class="Rk-Fold-Bins">&laquo;</div>\n        ';
 } ;
__p += '\n        ';
 if (options.show_zoom) { ;
__p += '\n            <div class="Rk-ZoomButtons">\n                <div class="Rk-ZoomIn" title="' +
__e(translate('Zoom In')) +
'"></div>\n                <div class="Rk-ZoomFit" title="' +
__e(translate('Zoom Fit')) +
'"></div>\n                <div class="Rk-ZoomOut" title="' +
__e(translate('Zoom Out')) +
'"></div>\n                ';
 if (options.editor_mode && options.save_view) { ;
__p += '\n                    <div class="Rk-ZoomSave" title="' +
__e(translate('Save view')) +
'"></div>\n                ';
 } ;
__p += '\n                ';
 if (options.save_view) { ;
__p += '\n                    <div class="Rk-ZoomSetSaved" title="' +
__e(translate('View saved view')) +
'"></div>\n                    ';
 if (options.hide_nodes) { ;
__p += '\n                \t   <div class="Rk-ShowHiddenNodes" title="' +
__e(translate('Show hidden nodes')) +
'"></div>\n                    ';
 } ;
__p += '       \n                ';
 } ;
__p += '\n            </div>\n        ';
 } ;
__p += '\n    </div>\n</div>\n';

}
return __p
};

this["renkanJST"]["templates/search.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="' +
((__t = ( className )) == null ? '' : __t) +
'" data-key="' +
((__t = ( key )) == null ? '' : __t) +
'">' +
((__t = ( title )) == null ? '' : __t) +
'</li>';

}
return __p
};

this["renkanJST"]["templates/wikipedia-bin/resulttemplate.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="Rk-Wikipedia-Result Rk-Bin-Item" draggable="true"\n    data-uri="' +
__e(url) +
'" data-title="Wikipedia: ' +
__e(title) +
'"\n    data-description="' +
__e(description) +
'"\n    data-image="' +
__e( Rkns.Utils.getFullURL( static_url + 'img/wikipedia.png' ) ) +
'">\n\n    <img class="Rk-Wikipedia-Icon" src="' +
__e(static_url) +
'img/wikipedia.png">\n    <h4 class="Rk-Wikipedia-Title">\n        <a href="' +
__e(url) +
'" target="_blank">' +
((__t = (htitle)) == null ? '' : __t) +
'</a>\n    </h4>\n    <p class="Rk-Wikipedia-Snippet">' +
((__t = (hdescription)) == null ? '' : __t) +
'</p>\n</li>\n';

}
return __p
};
/* Declaring the Renkan Namespace Rkns and Default values */

(function(root) {

    "use strict";

    if (typeof root.Rkns !== "object") {
        root.Rkns = {};
    }

    var Rkns = root.Rkns;
    var $ = Rkns.$ = root.jQuery;
    var _ = Rkns._ = root._;

    Rkns.pickerColors = ["#8f1919", "#a80000", "#d82626", "#ff0000", "#e87c7c", "#ff6565", "#f7d3d3", "#fecccc",
        "#8f5419", "#a85400", "#d87f26", "#ff7f00", "#e8b27c", "#ffb265", "#f7e5d3", "#fee5cc",
        "#8f8f19", "#a8a800", "#d8d826", "#feff00", "#e8e87c", "#feff65", "#f7f7d3", "#fefecc",
        "#198f19", "#00a800", "#26d826", "#00ff00", "#7ce87c", "#65ff65", "#d3f7d3", "#ccfecc",
        "#198f8f", "#00a8a8", "#26d8d8", "#00feff", "#7ce8e8", "#65feff", "#d3f7f7", "#ccfefe",
        "#19198f", "#0000a8", "#2626d8", "#0000ff", "#7c7ce8", "#6565ff", "#d3d3f7", "#ccccfe",
        "#8f198f", "#a800a8", "#d826d8", "#ff00fe", "#e87ce8", "#ff65fe", "#f7d3f7", "#feccfe",
        "#000000", "#242424", "#484848", "#6d6d6d", "#919191", "#b6b6b6", "#dadada", "#ffffff"
    ];

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
                }, _opts.auto_refresh);
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

        this.options = _.defaults(_opts, Rkns.defaults, {
            templates: _.defaults(_opts.templates, renkanJST) || renkanJST,
            node_editor_templates: _.defaults(_opts.node_editor_templates, Rkns.defaults.node_editor_templates)
        });
        this.template = renkanJST['templates/main.html'];

        var types_templates = {};
        _.each(this.options.node_editor_templates, function(value, key) {
            types_templates[key] = _this.options.templates[value];
            delete _this.options.templates[value];
        });
        this.options.node_editor_templates = types_templates;

        _.each(this.options.property_files, function(f) {
            Rkns.$.getJSON(f, function(data) {
                _this.options.properties = _this.options.properties.concat(data);
            });
        });

        this.read_only = this.options.read_only || !this.options.editor_mode;

        this.router = new Rkns.Router();

        this.project = new Rkns.Models.Project();
        this.dataloader = new Rkns.DataLoader.Loader(this.project, this.options);

        this.setCurrentUser = function(user_id, user_name) {
            this.project.addUser({
                _id: user_id,
                title: user_name
            });
            this.current_user = user_id;
            this.renderer.redrawUsers();
        };

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
            var _tmpl = renkanJST['templates/colorpicker.html'];
            return '<ul class="Rk-Edit-ColorPicker">' + Rkns.pickerColors.map(function(c) {
                return _tmpl({
                    c: c
                });
            }).join("") + '</ul>';
        })();

        if (this.options.show_editor) {
            this.renderer = new Rkns.Renderer.Scene(this);
        }

        if (!this.options.search.length) {
            this.$.find(".Rk-Web-Search-Form").detach();
        } else {
            var _tmpl = renkanJST['templates/search.html'],
                _select = this.$.find(".Rk-Search-List"),
                _input = this.$.find(".Rk-Web-Search-Input"),
                _form = this.$.find(".Rk-Web-Search-Form");
            _.each(this.options.search, function(_search, _key) {
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
                function() {
                    _select.slideDown();
                }
            );
            this.$.find(".Rk-Search-Select").mouseleave(
                function() {
                    _select.hide();
                }
            );
            this.setSearchEngine(0);
        }
        _.each(this.options.bins, function(_bin) {
            if (Rkns[_bin.type] && Rkns[_bin.type].Bin) {
                _this.tabs.push(new Rkns[_bin.type].Bin(_this, _bin));
            }
        });

        var elementDropped = false;

        this.$.find(".Rk-Bins")
            .on("click", ".Rk-Bin-Title,.Rk-Bin-Title-Icon", function() {
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
                    _.each(_models, function(_model) {
                        _this.renderer.highlightModel(_model);
                    });
                }
            }).mouseout(function() {
                _this.renderer.unhighlightAll();
            }).on("mousemove", ".Rk-Bin-Item", function(e) {
                try {
                    this.dragDrop();
                } catch (err) {}
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
                        _this.renderer.dropData({
                            "text/html": div.innerHTML
                        }, touch);
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
                    e.originalEvent.dataTransfer.setData("text/html", div.innerHTML);
                } catch (err) {
                    e.originalEvent.dataTransfer.setData("text", div.innerHTML);
                }
            });

        }

        Rkns.$(window).resize(function() {
            _this.resizeBins();
        });

        var lastsearch = false,
            lastval = '';

        this.$.find(".Rk-Bins-Search-Input").on("change keyup paste input", function() {
            var val = Rkns.$(this).val();
            if (val === lastval) {
                return;
            }
            var search = Rkns.Utils.regexpFromTextOrArray(val.length > 1 ? val : null);
            if (search.source === lastsearch) {
                return;
            }
            lastsearch = search.source;
            _.each(_this.tabs, function(tab) {
                tab.render(search);
            });

        });
        this.$.find(".Rk-Bins-Search-Form").submit(function() {
            return false;
        });
    };

    Renkan.prototype.translate = function(_text) {
        if (Rkns.i18n[this.options.language] && Rkns.i18n[this.options.language][_text]) {
            return Rkns.i18n[this.options.language][_text];
        }
        if (this.options.language.length > 2 && Rkns.i18n[this.options.language.substr(0, 2)] && Rkns.i18n[this.options.language.substr(0, 2)][_text]) {
            return Rkns.i18n[this.options.language.substr(0, 2)][_text];
        }
        return _text;
    };

    Renkan.prototype.onStatusChange = function() {
        this.renderer.onStatusChange();
    };

    Renkan.prototype.setSearchEngine = function(_key) {
        this.search_engine = this.search_engines[_key];
        this.$.find(".Rk-Search-Current").attr("class", "Rk-Search-Current " + this.search_engine.getBgClass());
        var listClasses = this.search_engine.getBgClass().split(" ");
        var classes = "";
        for (var i = 0; i < listClasses.length; i++) {
            classes += "." + listClasses[i];
        }
        this.$.find(".Rk-Web-Search-Input.Rk-Search-Input").attr("placeholder", this.translate("Search in ") + this.$.find(".Rk-Search-List " + classes).html());
    };

    Renkan.prototype.resizeBins = function() {
        var _d = +this.$.find(".Rk-Bins-Head").outerHeight();
        this.$.find(".Rk-Bin-Title:visible").each(function() {
            _d += Rkns.$(this).outerHeight();
        });
        this.$.find(".Rk-Bin-Main").css({
            height: this.$.find(".Rk-Bins").height() - _d
        });
    };

    /* Utility functions */
    var getUUID4 = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    Rkns.Utils = {
        getUUID4: getUUID4,
        getUID: (function() {
            function pad(n) {
                return n < 10 ? '0' + n : n;
            }
            var _d = new Date(),
                ID_AUTO_INCREMENT = 0,
                ID_BASE = _d.getUTCFullYear() + '-' +
                pad(_d.getUTCMonth() + 1) + '-' +
                pad(_d.getUTCDate()) + '-' +
                getUUID4();
            return function(_base) {
                var _n = (++ID_AUTO_INCREMENT).toString(16),
                    _uidbase = (typeof _base === "undefined" ? "" : _base + "-");
                while (_n.length < 4) {
                    _n = '0' + _n;
                }
                return _uidbase + ID_BASE + '-' + _n;
            };
        })(),
        getFullURL: function(url) {

            if (typeof(url) === 'undefined' || url == null) {
                return "";
            }
            if (/https?:\/\//.test(url)) {
                return url;
            }
            var img = new Image();
            img.src = url;
            var res = img.src;
            img.src = null;
            return res;

        },
        inherit: function(_baseClass, _callbefore) {

            var _class = function(_arg) {
                if (typeof _callbefore === "function") {
                    _callbefore.apply(this, Array.prototype.slice.call(arguments, 0));
                }
                _baseClass.apply(this, Array.prototype.slice.call(arguments, 0));
                if (typeof this._init === "function" && !this._initialized) {
                    this._init.apply(this, Array.prototype.slice.call(arguments, 0));
                    this._initialized = true;
                }
            };
            _.extend(_class.prototype, _baseClass.prototype);

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
                charsrx = _.map(charsub, function(c) {
                    return new RegExp(c);
                });

            function replaceText(_text) {
                var txt = _text.toLowerCase().replace(remrx, ""),
                    src = "";

                function makeReplaceFunc(l) {
                    return function(k, v) {
                        l = l.replace(charsrx[k], v);
                    };
                }
                for (var j = 0; j < txt.length; j++) {
                    if (j) {
                        src += remsrc + "*";
                    }
                    var l = txt[j];
                    _.each(charsub, makeReplaceFunc(l));
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
                        _.each(inp, function(v) {
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
                    var testrx = new RegExp(source, "im"),
                        replacerx = new RegExp('(' + source + ')', "igm");
                    return {
                        isempty: false,
                        source: source,
                        test: function(_t) {
                            return testrx.test(_t);
                        },
                        replace: function(_text, _replace) {
                            return _text.replace(replacerx, _replace);
                        }
                    };
                } else {
                    return {
                        isempty: true,
                        source: '',
                        test: function() {
                            return true;
                        },
                        replace: function(_text) {
                            return text;
                        }
                    };
                }
            };
        })(),
        /* The minimum distance (in pixels) the mouse has to move to consider an element was dragged */
        _MIN_DRAG_DISTANCE: 2,
        /* Distance between the inner and outer radius of buttons that appear when hovering on a node */
        _NODE_BUTTON_WIDTH: 40,

        _EDGE_BUTTON_INNER: 2,
        _EDGE_BUTTON_OUTER: 40,
        /* Constants used to know if a specific action is to be performed when clicking on the canvas */
        _CLICKMODE_ADDNODE: 1,
        _CLICKMODE_STARTEDGE: 2,
        _CLICKMODE_ENDEDGE: 3,
        /* Node size step: Used to calculate the size change when clicking the +/- buttons */
        _NODE_SIZE_STEP: Math.LN2 / 4,
        _MIN_SCALE: 1 / 20,
        _MAX_SCALE: 20,
        _MOUSEMOVE_RATE: 80,
        _DOUBLETAP_DELAY: 800,
        /* Maximum distance in pixels (squared, to reduce calculations)
         * between two taps when double-tapping on a touch terminal */
        _DOUBLETAP_DISTANCE: 20 * 20,
        /* A placeholder so a default colour is displayed when a node has a null value for its user property */
        _USER_PLACEHOLDER: function(_renkan) {
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
        _BOOKMARKLET_CODE: function(_renkan) {
            return "(function(a,b,c,d,e,f,h,i,j,k,l,m,n,o,p,q,r){a=document;b=a.body;c=a.location.href;j='draggable';m='text/x-iri-';d=a.createElement('div');d.innerHTML='<p_style=\"position:fixed;top:0;right:0;font:bold_18px_sans-serif;color:#fff;background:#909;padding:10px;z-index:100000;\">" +
                _renkan.translate("Drag items from this website, drop them in Renkan").replace(/ /g, "_") +
                "</p>'.replace(/_/g,String.fromCharCode(32));b.appendChild(d);e=[{r:/https?:\\/\\/[^\\/]*twitter\\.com\\//,s:'.tweet',n:'twitter'},{r:/https?:\\/\\/[^\\/]*google\\.[^\\/]+\\//,s:'.g',n:'google'},{r:/https?:\\/\\/[^\\/]*lemonde\\.fr\\//,s:'[data-vr-contentbox]',n:'lemonde'}];f=false;e.forEach(function(g){if(g.r.test(c)){f=g;}});if(f){h=function(){Array.prototype.forEach.call(a.querySelectorAll(f.s),function(i){i[j]=true;k=i.style;k.borderWidth='2px';k.borderColor='#909';k.borderStyle='solid';k.backgroundColor='rgba(200,0,180,.1)';})};window.setInterval(h,500);h();};a.addEventListener('dragstart',function(k){l=k.dataTransfer;l.setData(m+'source-uri',c);l.setData(m+'source-title',a.title);n=k.target;if(f){o=n;while(!o.attributes[j]){o=o.parentNode;if(o==b){break;}}}if(f&&o.attributes[j]){p=o.cloneNode(true);l.setData(m+'specific-site',f.n)}else{q=a.getSelection();if(q.type==='Range'||!q.type){p=q.getRangeAt(0).cloneContents();}else{p=n.cloneNode();}}r=a.createElement('div');r.appendChild(p);l.setData('text/x-iri-selected-text',r.textContent.trim());l.setData('text/x-iri-selected-html',r.innerHTML);},false);})();";
        },
        /* Shortens text to the required length then adds ellipsis */
        shortenText: function(_text, _maxlength) {
            return (_text.length > _maxlength ? (_text.substr(0, _maxlength) + '…') : _text);
        },
        /* Drawing an edit box with an arrow and positioning the edit box according to the position of the node/edge being edited
         * Called by Rkns.Renderer.NodeEditor and Rkns.Renderer.EdgeEditor */
        drawEditBox: function(_options, _coords, _path, _xmargin, _selector) {
            _selector.css({
                width: (_options.tooltip_width - 2 * _options.tooltip_padding)
            });
            var _height = _selector.outerHeight() + 2 * _options.tooltip_padding,
                _isLeft = (_coords.x < paper.view.center.x ? 1 : -1),
                _left = _coords.x + _isLeft * (_xmargin + _options.tooltip_arrow_length),
                _right = _coords.x + _isLeft * (_xmargin + _options.tooltip_arrow_length + _options.tooltip_width),
                _top = _coords.y - _height / 2;
            if (_top + _height > (paper.view.size.height - _options.tooltip_margin)) {
                _top = Math.max(paper.view.size.height - _options.tooltip_margin, _coords.y + _options.tooltip_arrow_width / 2) - _height;
            }
            if (_top < _options.tooltip_margin) {
                _top = Math.min(_options.tooltip_margin, _coords.y - _options.tooltip_arrow_width / 2);
            }
            var _bottom = _top + _height;
            /* jshint laxbreak:true */
            _path.segments[0].point = _path.segments[7].point = _coords.add([_isLeft * _xmargin, 0]);
            _path.segments[1].point.x = _path.segments[2].point.x = _path.segments[5].point.x = _path.segments[6].point.x = _left;
            _path.segments[3].point.x = _path.segments[4].point.x = _right;
            _path.segments[2].point.y = _path.segments[3].point.y = _top;
            _path.segments[4].point.y = _path.segments[5].point.y = _bottom;
            _path.segments[1].point.y = _coords.y - _options.tooltip_arrow_width / 2;
            _path.segments[6].point.y = _coords.y + _options.tooltip_arrow_width / 2;
            _path.fillColor = new paper.Color(new paper.Gradient([_options.tooltip_top_color, _options.tooltip_bottom_color]), [0, _top], [0, _bottom]);
            _selector.css({
                left: (_options.tooltip_padding + Math.min(_left, _right)),
                top: (_options.tooltip_padding + _top)
            });
            return _path;
        },
        // from http://stackoverflow.com/a/6444043
        increaseBrightness: function (hex, percent){
            // strip the leading # if it's there
            hex = hex.replace(/^\s*#|\s*$/g, '');

            // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
            if(hex.length === 3){
                hex = hex.replace(/(.)/g, '$1$1');
            }

            var r = parseInt(hex.substr(0, 2), 16),
                g = parseInt(hex.substr(2, 2), 16),
                b = parseInt(hex.substr(4, 2), 16);

            return '#' +
               ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
               ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
               ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
        }
    };
})(window);

/* END main.js */

(function(root) {
    "use strict";
    
    var Backbone = root.Backbone;
    
    var Router = root.Rkns.Router = Backbone.Router.extend({
        routes: {
            '': 'index'
        },
        
        index: function (parameters) {
            
            var result = {};
            if (parameters !== null){
                parameters.split("&").forEach(function(part) {
                    var item = part.split("=");
                    result[item[0]] = decodeURIComponent(item[1]);
                });
            }
            this.trigger('router', result);        
        }  
    });

})(window);
(function(root) {

    "use strict";

    var DataLoader = root.Rkns.DataLoader = {
        converters: {
            from1to2: function(data) {

                var i, len;
                if(typeof data.nodes !== 'undefined') {
                    for(i=0, len=data.nodes.length; i<len; i++) {
                        var node = data.nodes[i];
                        if(node.color) {
                            node.style = {
                                color: node.color,
                            };
                        }
                        else {
                            node.style = {};
                        }
                    }
                }
                if(typeof data.edges !== 'undefined') {
                    for(i=0, len=data.edges.length; i<len; i++) {
                        var edge = data.edges[i];
                        if(edge.color) {
                            edge.style = {
                                color: edge.color,
                            };
                        }
                        else {
                            edge.style = {};
                        }
                    }
                }

                data.schema_version = "2";

                return data;
            },
        }
    };


    DataLoader.Loader = function(project, options) {
        this.project = project;
        this.dataConverters = _.defaults(options.converters || {}, DataLoader.converters);
    };


    DataLoader.Loader.prototype.convert = function(data) {
        var schemaVersionFrom = this.project.getSchemaVersion(data);
        var schemaVersionTo = this.project.getSchemaVersion();

        if (schemaVersionFrom !== schemaVersionTo) {
            var converterName = "from" + schemaVersionFrom + "to" + schemaVersionTo;
            if (typeof this.dataConverters[converterName] === 'function') {
                data = this.dataConverters[converterName](data);
            }
        }
        return data;
    };

    DataLoader.Loader.prototype.load = function(data) {
        this.project.set(this.convert(data), {
            validate: true
        });
    };

})(window);

(function(root) {
    "use strict";

    var Backbone = root.Backbone;

    var Models = root.Rkns.Models = {};

    Models.getUID = function(obj) {
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function(c) {
                    var r = Math.random() * 16 | 0, v = c === 'x' ? r
                            : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
        if (typeof obj !== 'undefined') {
            return obj.type + "-" + guid;
        }
        else {
            return guid;
        }
    };

    var RenkanModel = Backbone.RelationalModel.extend({
        idAttribute : "_id",
        constructor : function(options) {

            if (typeof options !== "undefined") {
                options._id = options._id || options.id || Models.getUID(this);
                options.title = options.title || "";
                options.description = options.description || "";
                options.uri = options.uri || "";

                if (typeof this.prepare === "function") {
                    options = this.prepare(options);
                }
            }
            Backbone.RelationalModel.prototype.constructor.call(this, options);
        },
        validate : function() {
            if (!this.type) {
                return "object has no type";
            }
        },
        addReference : function(_options, _propName, _list, _id, _default) {
            var _element = _list.get(_id);
            if (typeof _element === "undefined" &&
                typeof _default !== "undefined") {
                _options[_propName] = _default;
            }
            else {
                _options[_propName] = _element;
            }
        }
    });

    // USER
    var User = Models.User = RenkanModel.extend({
        type : "user",
        prepare : function(options) {
            options.color = options.color || "#666666";
            return options;
        },
        toJSON : function() {
            return {
                _id : this.get("_id"),
                title : this.get("title"),
                uri : this.get("uri"),
                description : this.get("description"),
                color : this.get("color")
            };
        }
    });

    // NODE
    var Node = Models.Node = RenkanModel.extend({
        type : "node",
        relations : [ {
            type : Backbone.HasOne,
            key : "created_by",
            relatedModel : User
        } ],
        prepare : function(options) {
            var project = options.project;
            this.addReference(options, "created_by", project.get("users"),
                    options.created_by, project.current_user);
            options.description = options.description || "";
            return options;
        },
        toJSON : function() {
            return {
                _id : this.get("_id"),
                title : this.get("title"),
                uri : this.get("uri"),
                description : this.get("description"),
                position : this.get("position"),
                image : this.get("image"),
                style : this.get("style"),
                created_by : this.get("created_by") ? this.get("created_by")
                        .get("_id") : null,
                size : this.get("size"),
                clip_path : this.get("clip_path"),
                shape : this.get("shape"),  
                type : this.get("type")
            };
        }
    });

    // EDGE
    var Edge = Models.Edge = RenkanModel.extend({
        type : "edge",
        relations : [ {
            type : Backbone.HasOne,
            key : "created_by",
            relatedModel : User
        }, {
            type : Backbone.HasOne,
            key : "from",
            relatedModel : Node
        }, {
            type : Backbone.HasOne,
            key : "to",
            relatedModel : Node
        } ],
        prepare : function(options) {
            var project = options.project;
            this.addReference(options, "created_by", project.get("users"),
                    options.created_by, project.current_user);
            this.addReference(options, "from", project.get("nodes"),
                    options.from);
            this.addReference(options, "to", project.get("nodes"), options.to);
            return options;
        },
        toJSON : function() {
            return {
                _id : this.get("_id"),
                title : this.get("title"),
                uri : this.get("uri"),
                description : this.get("description"),
                from : this.get("from") ? this.get("from").get("_id") : null,
                to : this.get("to") ? this.get("to").get("_id") : null,
                style : this.get("style"),
                created_by : this.get("created_by") ? this.get("created_by")
                        .get("_id") : null
            };
        }
    });

    // View
    var View = Models.View = RenkanModel.extend({
        type : "view",
        relations : [ {
            type : Backbone.HasOne,
            key : "created_by",
            relatedModel : User
        } ],
        prepare : function(options) {
            var project = options.project;
            this.addReference(options, "created_by", project.get("users"),
                    options.created_by, project.current_user);
            options.description = options.description || "";
            if (typeof options.offset !== "undefined") {
                var offset = {};
                if (Array.isArray(options.offset)) {
                    offset.x = options.offset[0];
                    offset.y = options.offset.length > 1 ? options.offset[1]
                            : options.offset[0];
                }
                else if (options.offset.x != null) {
                    offset.x = options.offset.x;
                    offset.y = options.offset.y;
                }
                options.offset = offset;
            }
            return options;
        },
        toJSON : function() {
            return {
                _id : this.get("_id"),
                zoom_level : this.get("zoom_level"),
                offset : this.get("offset"),
                title : this.get("title"),
                description : this.get("description"),
                created_by : this.get("created_by") ? this.get("created_by")
                        .get("_id") : null,
                hidden_nodes: this.get("hidden_nodes")
            // Don't need project id
            };
        }
    });

    // PROJECT
    var Project = Models.Project = RenkanModel.extend({
        schema_version : "2",
        type : "project",
        blacklist : [ 'saveStatus', 'loadingStatus'],
        relations : [ {
            type : Backbone.HasMany,
            key : "users",
            relatedModel : User,
            reverseRelation : {
                key : 'project',
                includeInJSON : '_id'
            }
        }, {
            type : Backbone.HasMany,
            key : "nodes",
            relatedModel : Node,
            reverseRelation : {
                key : 'project',
                includeInJSON : '_id'
            }
        }, {
            type : Backbone.HasMany,
            key : "edges",
            relatedModel : Edge,
            reverseRelation : {
                key : 'project',
                includeInJSON : '_id'
            }
        }, {
            type : Backbone.HasMany,
            key : "views",
            relatedModel : View,
            reverseRelation : {
                key : 'project',
                includeInJSON : '_id'
            }
        } ],
        addUser : function(_props, _options) {
            _props.project = this;
            var _user = User.findOrCreate(_props);
            this.get("users").push(_user, _options);
            return _user;
        },
        addNode : function(_props, _options) {
            _props.project = this;
            var _node = Node.findOrCreate(_props);
            this.get("nodes").push(_node, _options);
            return _node;
        },
        addEdge : function(_props, _options) {
            _props.project = this;
            var _edge = Edge.findOrCreate(_props);
            this.get("edges").push(_edge, _options);
            return _edge;
        },
        addView : function(_props, _options) {
            _props.project = this;
            // TODO: check if need to replace with create only
            var _view = View.findOrCreate(_props);
            // TODO: Should we remember only one view?
            this.get("views").push(_view, _options);
            return _view;
        },
        removeNode : function(_model) {
            this.get("nodes").remove(_model);
        },
        removeEdge : function(_model) {
            this.get("edges").remove(_model);
        },
        validate : function(options) {
            var _project = this;
            _.each(
              [].concat(options.users, options.nodes, options.edges,options.views),
              function(_item) {
                if (_item) {
                    _item.project = _project;
                }
              }
            );
        },
        getSchemaVersion : function(data) {
          var t = data;
          if(typeof(t) === "undefined") {
            t = this;
          }
          var version = t.schema_version;
          if(!version) {
            return 1;
          }
          else {
            return version;
          }
        },
        // Add event handler to remove edges when a node is removed
        initialize : function() {
            var _this = this;
            this.on("remove:nodes", function(_node) {
                _this.get("edges").remove(
                        _this.get("edges").filter(
                                function(_edge) {
                                    return _edge.get("from") === _node ||
                                           _edge.get("to") === _node;
                                }));
            });
        },
        toJSON : function() {
            var json = _.clone(this.attributes);
            for ( var attr in json) {
                if ((json[attr] instanceof Backbone.Model) ||
                        (json[attr] instanceof Backbone.Collection) ||
                        (json[attr] instanceof RenkanModel)) {
                    json[attr] = json[attr].toJSON();
                }
            }
            return _.omit(json, this.blacklist);
        }
    });

    var RosterUser = Models.RosterUser = Backbone.Model
            .extend({
                type : "roster_user",
                idAttribute : "_id",

                constructor : function(options) {

                    if (typeof options !== "undefined") {
                        options._id = options._id ||
                            options.id ||
                            Models.getUID(this);
                        options.title = options.title || "(untitled " + this.type + ")";
                        options.description = options.description || "";
                        options.uri = options.uri || "";
                        options.project = options.project || null;
                        options.site_id = options.site_id || 0;

                        if (typeof this.prepare === "function") {
                            options = this.prepare(options);
                        }
                    }
                    Backbone.Model.prototype.constructor.call(this, options);
                },

                validate : function() {
                    if (!this.type) {
                        return "object has no type";
                    }
                },

                prepare : function(options) {
                    options.color = options.color || "#666666";
                    return options;
                },

                toJSON : function() {
                    return {
                        _id : this.get("_id"),
                        title : this.get("title"),
                        uri : this.get("uri"),
                        description : this.get("description"),
                        color : this.get("color"),
                        project : (this.get("project") != null) ? this.get(
                                "project").get("id") : null,
                        site_id : this.get("site_id")
                    };
                }
            });

    var UsersList = Models.UsersList = Backbone.Collection.extend({
        model : RosterUser
    });

})(window);

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
    popup_editor: true,
        /* show the node editor as a popup inside the renkan view */
    editor_panel: 'editor-panel',
        /* GUI continer DOM element ID of the editor panel */
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
    manual_save: false,
        /* In snapshot mode, clicking on the floppy will save a snapshot. Otherwise, it will show the connection status */
    show_top_bar: true,
        /* Show the top bar, (title, buttons, users) */
    default_user_color: "#303030",
    size_bug_fix: false,
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
    resize: true,

    /* zoom options */
    show_zoom: true,
        /* show zoom buttons */
    save_view: true,
        /* show buttons to save view */
    default_view: false,
        /* Allows to load default view (zoom+offset) at start on read_only mode, instead of autoScale. the default_view will be the last */
    default_index_view: -1,
    
    /* URL parsing */
    update_url:true,
        /* update the url each time the paper shift or on zoom in/out, with the serialized view (offset and scale) */
    

    /* TOP BAR BUTTONS */
    show_search_field: true,
    show_user_list: true,
    user_name_editable: true,
    user_color_editable: true,
    show_user_color: true,
    show_save_button: true,
    show_export_button: true,
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

    ghost_opacity : 0.3,
        /* opacity when the hidden element is revealed */
    default_dash_array : [4, 5],
        /* dash line genometry */

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
    node_stroke_max_width: 12,
    selected_node_stroke_width: 4,
    selected_node_stroke_max_width: 24,
    node_stroke_witdh_scale: 5,
    node_fill_color: "#ffffff",
    highlighted_node_fill_color: "#ffff00",
    node_label_distance: 5,
        /* Vertical distance between node and label */
    node_label_max_length: 60,
        /* Maximum displayed text length */
    label_untitled_nodes: "(untitled)",
        /* Label to display on untitled nodes */
    hide_nodes: true,
        /* allow hide/show nodes */
    change_shapes: true,
        /* Change shapes enabled */
    change_types: true,
    /* Change type enabled */

    /* NODE EDITOR TEMPLATE*/

    node_editor_templates: {
        "default": "templates/nodeeditor_readonly.html",
        "video": "templates/nodeeditor_video.html"
    },

    /* EDGE DISPLAY OPTIONS */

    edge_stroke_width: 2,
    edge_stroke_max_width: 12,
    selected_edge_stroke_width: 4,
    selected_edge_stroke_max_width: 24,
    edge_stroke_witdh_scale: 5,

    edge_label_distance: 0,
    edge_label_max_length: 20,
    edge_arrow_length: 18,
    edge_arrow_width: 12,
    edge_arrow_max_width: 32,
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
    tooltip_opacity: 0.8,

    richtext_editor_config: {
        toolbarGroups: [
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
            '/',
	        { name: 'styles'},
        ],
        removePlugins : 'colorbutton,find,flash,font,forms,iframe,image,newpage,smiley,specialchar,stylescombo,templates',
    },

    /* NODE EDITOR OPTIONS */

    show_node_editor_uri: true,
    show_node_editor_description: true,
    show_node_editor_description_richtext: true,
    show_node_editor_size: true,
    show_node_editor_style: true,
    show_node_editor_style_color: true,
    show_node_editor_style_dash: true,
    show_node_editor_style_thickness: true,
    show_node_editor_image: true,
    show_node_editor_creator: true,
    allow_image_upload: true,
    uploaded_image_max_kb: 500,


    /* NODE TOOLTIP OPTIONS */

    show_node_tooltip_uri: true,
    show_node_tooltip_description: true,
    show_node_tooltip_color: true,
    show_node_tooltip_image: true,
    show_node_tooltip_creator: true,

    /* EDGE EDITOR OPTIONS */

    show_edge_editor_uri: true,
    show_edge_editor_style: true,
    show_edge_editor_style_color: true,
    show_edge_editor_style_dash: true,
    show_edge_editor_style_thickness: true,
    show_edge_editor_style_arrow: true,
    show_edge_editor_direction: true,
    show_edge_editor_nodes: true,
    show_edge_editor_creator: true,

    /* EDGE TOOLTIP OPTIONS */

    show_edge_tooltip_uri: true,
    show_edge_tooltip_color: true,
    show_edge_tooltip_nodes: true,
    show_edge_tooltip_creator: true,

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
        "Dash:": "Point. :",
        "Thickness:": "Epaisseur :",
        "Arrow:": "Flèche :",
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
        "Drag this button to your bookmark bar. When on a third-party website, click it to enable drag-and-drop from the website to Renkan.": "Glissez ce bouton vers votre barre de favoris. Ensuite, depuis un site tiers, cliquez dessus pour activer 'Drag-to-Add' puis glissez des éléments de ce site vers Renkan",
        "Shapes available": "Formes disponibles",
        "Circle": "Cercle",
        "Square": "Carré",
        "Diamond": "Losange",
        "Hexagone": "Hexagone",
        "Ellipse": "Ellipse",
        "Star": "Étoile",
        "Cloud": "Nuage",
        "Triangle": "Triangle",
        "Zoom Fit": "Ajuster le Zoom",
        "Download Project": "Télécharger le projet",
        "Save view": "Sauver la vue",
        "View saved view": "Restaurer la Vue",
        "Renkan \'Drag-to-Add\' bookmarklet": "Renkan \'Deplacer-Pour-Ajouter\' Signet",
        "(unknown user)":"(non authentifié)",
        "<unknown user>":"<non authentifié>",
        "Search in graph":"Rechercher dans carte",
        "Search in " : "Chercher dans "
    }
};

/* Saves the Full JSON at each modification */

Rkns.jsonIO = function(_renkan, _opts) {
    var _proj = _renkan.project;
    if (typeof _opts.http_method === "undefined") {
        _opts.http_method = 'PUT';
    }
    var _load = function() {
        _renkan.renderer.redrawActive = false;
        _proj.set({
            loadingStatus : true
        });
        Rkns.$.getJSON(_opts.url, function(_data) {
            _renkan.dataloader.load(_data);
            _proj.set({
                loadingStatus : false
            });
            _proj.set({
                saveStatus : 0
            });
            _renkan.renderer.redrawActive = true;
        });
    };
    var _save = function() {
        _proj.set({
            saveStatus : 2
        });
        var _data = _proj.toJSON();
        if (!_renkan.read_only) {
            Rkns.$.ajax({
                type : _opts.http_method,
                url : _opts.url,
                contentType : "application/json",
                data : JSON.stringify(_data),
                success : function(data, textStatus, jqXHR) {
                    _proj.set({
                        saveStatus : 0
                    });
                }
            });
        }

    };
    var _thrSave = Rkns._.throttle(function() {
        setTimeout(_save, 100);
    }, 1000);
    
    //TODO: Rearrange to avoid the 2 firts PUT due to a change in the project model
    // Take car of setting up the listener correctly to listen the save action on the view
    _proj.on("add:nodes add:edges add:users add:views", function(_model) {
        _model.on("change remove", function(_model) {
            _thrSave();
        });
        _thrSave();
    });
    _proj.on("change", function() {
        if (!(_proj.changedAttributes.length === 1 && _proj
                .hasChanged('saveStatus'))) {
            _thrSave();
        }
    });

    _load();
};

/* Saves the Full JSON once */

Rkns.jsonIOSaveOnClick = function(_renkan, _opts) {
    var _proj = _renkan.project,
        _saveWarn = false,
        _onLeave = function() {
            return "Project not saved";
        };
    if (typeof _opts.http_method === "undefined") {
        _opts.http_method = 'POST';
    }
    var _load = function() {
        var getdata = {},
            rx = /id=([^&#?=]+)/,
            matches = document.location.hash.match(rx);
        if (matches) {
            getdata.id = matches[1];
        }
        Rkns.$.ajax({
            url: _opts.url,
            data: getdata,
            beforeSend: function(){
                _renkan.renderer.redrawActive = false;
            	_proj.set({loadingStatus:true});
            },
            success: function(_data) {
                _renkan.dataloader.load(_data);
                _proj.set({loadingStatus:false});
                _proj.set({saveStatus:0});
                _renkan.renderer.redrawActive = true;
            }
        });
    };
    var _save = function() {
        _proj.set("saved_at", new Date());
        var _data = _proj.toJSON();
        Rkns.$.ajax({
            type: _opts.http_method,
            url: _opts.url,
            contentType: "application/json",
            data: JSON.stringify(_data),
            beforeSend: function(){
            	_proj.set({saveStatus:2});
            },
            success: function(data, textStatus, jqXHR) {
                $(window).off("beforeunload", _onLeave);
                _saveWarn = false;
                _proj.set({saveStatus:0});
                //document.location.hash = "#id=" + data.id;
                //$(".Rk-Notifications").text("Saved as "+document.location.href).fadeIn().delay(2000).fadeOut();
            }
        });
    };
    var _checkLeave = function() {
    	_proj.set({saveStatus:1});

        var title = _proj.get("title");
        if (title && _proj.get("nodes").length) {
            $(".Rk-Save-Button").removeClass("disabled");
        } else {
            $(".Rk-Save-Button").addClass("disabled");
        }
        if (title) {
            $(".Rk-PadTitle").css("border-color","#333333");
        }
        if (!_saveWarn) {
            _saveWarn = true;
            $(window).on("beforeunload", _onLeave);
        }
    };
    _load();
    _proj.on("add:nodes add:edges add:users change", function(_model) {
	    _model.on("change remove", function(_model) {
	    	if(!(_model.changedAttributes.length === 1 && _model.hasChanged('saveStatus'))) {
	    		_checkLeave();
	    	}
	    });
		if(!(_proj.changedAttributes.length === 1 && _proj.hasChanged('saveStatus'))) {
		    _checkLeave();
    	}
    });
    _renkan.renderer.save = function() {
        if ($(".Rk-Save-Button").hasClass("disabled")) {
            if (!_proj.get("title")) {
                $(".Rk-PadTitle").css("border-color","#ff0000");
            }
        } else {
            _save();
        }
    };
};

(function(Rkns) {
"use strict";

var _ = Rkns._;

var Ldt = Rkns.Ldt = {};

var Bin = Ldt.Bin = function(_renkan, _opts) {
    if (_opts.ldt_type) {
        var Resclass = Ldt[_opts.ldt_type+"Bin"];
        if (Resclass) {
            return new Resclass(_renkan, _opts);
        }
    }
    console.error("No such LDT Bin Type");
};

var ProjectBin = Ldt.ProjectBin = Rkns.Utils.inherit(Rkns._BaseBin);

ProjectBin.prototype.tagTemplate = renkanJST['templates/ldtjson-bin/tagtemplate.html'];

ProjectBin.prototype.annotationTemplate = renkanJST['templates/ldtjson-bin/annotationtemplate.html'];

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
    _.map(_this.data.tags,function(_tag) {
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
    _.map(_this.data.annotations,function(_annotation) {
        var _description = _annotation.content.description,
            _title = _annotation.content.title.replace(_description,"");
        if (!search.isempty && !search.test(_title) && !search.test(_description)) {
            return;
        }
        count++;
        var _duration = _annotation.end - _annotation.begin,
            _img = (
                (_annotation.content && _annotation.content.img && _annotation.content.img.src) ?
                  _annotation.content.img.src :
                  ( _duration ? _this.renkan.options.static_url+"img/ldt-segment.png" : _this.renkan.options.static_url+"img/ldt-point.png" )
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

ResultsBin.prototype.segmentTemplate = renkanJST['templates/ldtjson-bin/segmenttemplate.html'];

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
    _.each(this.data.objects,function(_segment) {
        var _description = _segment.abstract,
            _title = _segment.title;
        if (!search.isempty && !search.test(_title) && !search.test(_description)) {
            return;
        }
        count++;
        var _duration = _segment.duration,
            _begin = _segment.start_ts,
            _end = + _segment.duration + _begin,
            _img = (
                _duration ?
                  _this.renkan.options.static_url + "img/ldt-segment.png" :
                  _this.renkan.options.static_url + "img/ldt-point.png"
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

Rkns.ResourceList.Bin.prototype.resultTemplate = renkanJST['templates/list-bin.html'];

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
    Rkns._.each(this.data,function(_item) {
        var _element;
        if (typeof _item === "string") {
            if (/^(https?:\/\/|www)/.test(_item)) {
                _element = { url: _item };
            } else {
                _element = { title: _item.replace(/[:,]?\s?(https?:\/\/|www)[\d\w\/.&?=#%-_]+\s?/,'').trim() };
                var _match = _item.match(/(https?:\/\/|www)[\d\w\/.&?=#%-_]+/);
                if (_match) {
                    _element.url = _match[0];
                }
                if (_element.title.length > 80) {
                    _element.description = _element.title;
                    _element.title = _element.title.replace(/^(.{30,60})\s.+$/,'$1…');
                }
            }
        } else {
            _element = _item;
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
};

Rkns.Wikipedia = {
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

Rkns.Wikipedia.Bin.prototype.resultTemplate = renkanJST['templates/wikipedia-bin/resulttemplate.html'];

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
    Rkns._.each(this.data.query.search, function(_result) {
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


define('renderer/baserepresentation',['jquery', 'underscore'], function ($, _) {
    'use strict';

    /* Rkns.Renderer._BaseRepresentation Class */

    /* In Renkan, a "Representation" is a sort of ViewModel (in the MVVM paradigm) and bridges the gap between
     * models (written with Backbone.js) and the view (written with Paper.js)
     * Renkan's representations all inherit from Rkns.Renderer._BaseRepresentation '*/

    var _BaseRepresentation = function(_renderer, _model) {
        if (typeof _renderer !== "undefined") {
            this.renderer = _renderer;
            this.renkan = _renderer.renkan;
            this.project = _renderer.renkan.project;
            this.options = _renderer.renkan.options;
            this.model = _model;
            if (this.model) {
                var _this = this;
                this._changeBinding = function() {
                    _this.redraw({change: true});
                };
                this._removeBinding = function() {
                    _renderer.removeRepresentation(_this);
                    _.defer(function() {
                        _renderer.redraw();
                    });
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
        show: function() { return "BaseRepresentation.show"; },
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
    }).value();

    /* End of Rkns.Renderer._BaseRepresentation Class */

    return _BaseRepresentation;

});

define('requtils',[], function ($, _) {
    'use strict';
    return {
        getUtils: function(){
            return window.Rkns.Utils;
        },
        getRenderer: function(){
            return window.Rkns.Renderer;
        }
    };

});


define('renderer/basebutton',['jquery', 'underscore', 'requtils', 'renderer/baserepresentation'], function ($, _, requtils, BaseRepresentation) {
    'use strict';

    var Utils = requtils.getUtils();

    /* Rkns.Renderer._BaseButton Class */

    /* BaseButton is extended by contextual buttons that appear when hovering on nodes and edges */

    var _BaseButton = Utils.inherit(BaseRepresentation);

    _(_BaseButton.prototype).extend({
        moveTo: function(_pos) {
            this.sector.moveTo(_pos);
        },
        show: function() {
            this.sector.show();
        },
        hide: function() {
            if (this.sector){
                this.sector.hide();                
            }
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
    }).value();

    return _BaseButton;

});


define('renderer/shapebuilder',[], function () {
    'use strict';

    var cloud_path = "M0,0c-0.1218516546,-0.0336420601 -0.2451649928,0.0048580836 -0.3302944641,0.0884969975c-0.0444763883,-0.0550844815 -0.1047003238,-0.0975985034 -0.1769360893,-0.1175406746c-0.1859066673,-0.0513257002 -0.3774236254,0.0626045858 -0.4272374613,0.2541588105c-0.0036603877,0.0140753132 -0.0046241235,0.028229722 -0.0065872453,0.042307536c-0.1674179627,-0.0179317735 -0.3276106855,0.0900599386 -0.3725537463,0.2628868425c-0.0445325077,0.1712456429 0.0395025693,0.3463497959 0.1905420475,0.4183458793c-0.0082101538,0.0183442886 -0.0158652506,0.0372432828 -0.0211098452,0.0574080693c-0.0498130336,0.1915540431 0.0608692569,0.3884647499 0.2467762814,0.4397904033c0.0910577256,0.0251434257 0.1830791813,0.0103792696 0.2594677475,-0.0334472349c0.042100113,0.0928009202 0.1205930075,0.1674914182 0.2240666796,0.1960572479c0.1476344161,0.0407610407 0.297446165,-0.0238077445 0.3783262342,-0.1475652419c0.0327623278,0.0238981846 0.0691792333,0.0436665447 0.1102008706,0.0549940004c0.1859065794,0.0513256592 0.3770116432,-0.0627203154 0.4268255671,-0.2542745401c0.0250490557,-0.0963230532 0.0095494076,-0.1938010889 -0.0356681889,-0.2736906101c0.0447507424,-0.0439678867 0.0797796014,-0.0996624318 0.0969425462,-0.1656617192c0.0498137481,-0.1915564561 -0.0608688118,-0.3884669813 -0.2467755669,-0.4397928163c-0.0195699622,-0.0054005426 -0.0391731675,-0.0084429542 -0.0586916488,-0.0102888295c0.0115683912,-0.1682147574 -0.0933564223,-0.3269222408 -0.2572937178,-0.3721841203z";
    /* ShapeBuilder Begin */

    var builders = {
        "circle":{
            getShape: function() {
                return new paper.Path.Circle([0, 0], 1);
            },
            getImageShape: function(center, radius) {
                return new paper.Path.Circle(center, radius);
            }
        },
        "rectangle":{
            getShape: function() {
                return new paper.Path.Rectangle([-2, -2], [2, 2]);
            },
            getImageShape: function(center, radius) {
                return new paper.Path.Rectangle([-radius, -radius], [radius*2, radius*2]);
            }
        },
        "ellipse":{
            getShape: function() {
                return new paper.Path.Ellipse(new paper.Rectangle([-2, -1], [2, 1]));
            },
            getImageShape: function(center, radius) {
                return new paper.Path.Ellipse(new paper.Rectangle([-radius, -radius/2], [radius*2, radius]));
            }
        },
        "polygon":{
            getShape: function() {
                return new paper.Path.RegularPolygon([0, 0], 6, 1);
            },
            getImageShape: function(center, radius) {
                return new paper.Path.RegularPolygon(center, 6, radius);
            }
        },
        "diamond":{
            getShape: function() {
                var d = new paper.Path.Rectangle([-Math.SQRT2, -Math.SQRT2], [Math.SQRT2, Math.SQRT2]);
                d.rotate(45);
                return d;
            },
            getImageShape: function(center, radius) {
                var d = new paper.Path.Rectangle([-radius*Math.SQRT2/2, -radius*Math.SQRT2/2], [radius*Math.SQRT2, radius*Math.SQRT2]);
                d.rotate(45);
                return d;
            }
        },
        "star":{
            getShape: function() {
                return new paper.Path.Star([0, 0], 8, 1, 0.7);
            },
            getImageShape: function(center, radius) {
                return new paper.Path.Star(center, 8, radius*1, radius*0.7);
            }
        },
        "cloud": {
            getShape: function() {
                var path = new paper.Path(cloud_path);
                return path;

            },
            getImageShape: function(center, radius) {
                var path = new paper.Path(cloud_path);
                path.scale(radius);
                path.translate(center);
                return path;
            }
        },
        "triangle": {
            getShape: function() {
                return new paper.Path.RegularPolygon([0,0], 3, 1);
            },
            getImageShape: function(center, radius) {
                var shape = new paper.Path.RegularPolygon([0,0], 3, 1);
                shape.scale(radius);
                shape.translate(center);
                return shape;
            }
        },
        "svg": function(path){
            return {
                getShape: function() {
                    return new paper.Path(path);
                },
                getImageShape: function(center, radius) {
                    // No calcul for the moment
                    return new paper.Path();
                }
            };
        }
    };

    var ShapeBuilder = function (shape){
        if(shape === null || typeof shape === "undefined"){
            shape = "circle";
        }
        if(shape.substr(0,4)==="svg:"){
            return builders.svg(shape.substr(4));
        }
        if(!(shape in builders)){
            shape = "circle";
        }
        return builders[shape];
    };

    ShapeBuilder.builders = builders;

    return ShapeBuilder;

});

define('renderer/noderepr',['jquery', 'underscore', 'requtils', 'renderer/baserepresentation', 'renderer/shapebuilder'], function ($, _, requtils, BaseRepresentation, ShapeBuilder) {
    'use strict';

    var Utils = requtils.getUtils();

    /* Rkns.Renderer.Node Class */

    /* The representation for the node : A circle, with an image inside and a text label underneath.
     * The circle and the image are drawn on canvas and managed by Paper.js.
     * The text label is an HTML node, managed by jQuery. */

    //var NodeRepr = Renderer.Node = Utils.inherit(Renderer._BaseRepresentation);
    var NodeRepr = Utils.inherit(BaseRepresentation);

    _(NodeRepr.prototype).extend({
        _init: function() {
            this.renderer.node_layer.activate();
            this.type = "Node";
            this.buildShape();
            this.hidden = false;
            this.ghost= false;
            if (this.options.show_node_circles) {
                this.circle.strokeWidth = this.options.node_stroke_width;
                this.h_ratio = 1;
            } else {
                this.h_ratio = 0;
            }
            this.title = $('<div class="Rk-Label">').appendTo(this.renderer.labels_$);

            if (this.options.editor_mode) {
                var Renderer = requtils.getRenderer();
                this.normal_buttons = [
                                       new Renderer.NodeEditButton(this.renderer, null),
                                       new Renderer.NodeRemoveButton(this.renderer, null),
                                       new Renderer.NodeLinkButton(this.renderer, null),
                                       new Renderer.NodeEnlargeButton(this.renderer, null),
                                       new Renderer.NodeShrinkButton(this.renderer, null)
                                       ];
                if (this.options.hide_nodes){
                    this.normal_buttons.push(
                            new Renderer.NodeHideButton(this.renderer, null),
                            new Renderer.NodeShowButton(this.renderer, null)
                            );
                }
                this.pending_delete_buttons = [
                                               new Renderer.NodeRevertButton(this.renderer, null)
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
        _getStrokeWidth: function() {
            var thickness = (this.model.has('style') && this.model.get('style').thickness) || 1;
            return this.options.node_stroke_width + (thickness-1) * (this.options.node_stroke_max_width - this.options.node_stroke_width) / (this.options.node_stroke_witdh_scale-1);
        },
        _getSelectedStrokeWidth: function() {
            var thickness = (this.model.has('style') && this.model.get('style').thickness) || 1;
            return this.options.selected_node_stroke_width + (thickness-1) * (this.options.selected_node_stroke_max_width - this.options.selected_node_stroke_width) / (this.options.node_stroke_witdh_scale-1);
        },
        buildShape: function(){
            if( 'shape' in this.model.changed ) {
                delete this.img;
            }
            if(this.circle){
                this.circle.remove();
                delete this.circle;
            }
            // "circle" "rectangle" "ellipse" "polygon" "star" "diamond"
            this.shapeBuilder = new ShapeBuilder(this.model.get("shape"));
            this.circle = this.shapeBuilder.getShape();
            this.circle.__representation = this;
            this.circle.sendToBack();
            this.last_circle_radius = 1;
        },
        redraw: function(options) {
            if( 'shape' in this.model.changed && 'change' in options && options.change ) {
            //if( 'shape' in this.model.changed ) {
                this.buildShape();
            }
            var _model_coords = new paper.Point(this.model.get("position")),
                _baseRadius = this.options.node_size_base * Math.exp((this.model.get("size") || 0) * Utils._NODE_SIZE_STEP);
            if (!this.is_dragging || !this.paper_coords) {
                this.paper_coords = this.renderer.toPaperCoords(_model_coords);
            }
            this.circle_radius = _baseRadius * this.renderer.view.scale;
            if (this.last_circle_radius !== this.circle_radius) {
                this.all_buttons.forEach(function(b) {
                    b.setSectorSize();
                });
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

            var opacity = 1;
            if (this.model.get("delete_scheduled")) {
                opacity = 0.5;
                this.active_buttons = this.pending_delete_buttons;
                this.circle.dashArray = [2,2];
            } else {
                opacity = 1;
                this.active_buttons = this.normal_buttons;
                this.circle.dashArray = null;
            }
            if (this.selected && this.renderer.isEditable() && !this.ghost) {
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
                this.node_image.opacity = this.highlighted ? opacity * 0.5 : (opacity - 0.01);
            }

            this.circle.fillColor = this.highlighted ? this.options.highlighted_node_fill_color : this.options.node_fill_color;

            this.circle.opacity = this.options.show_node_circles ? opacity : 0.01;

            var _text = this.model.get("title") || this.renkan.translate(this.options.label_untitled_nodes) || "";
            _text = Utils.shortenText(_text, this.options.node_label_max_length);

            if (typeof this.highlighted === "object") {
                this.title.html(this.highlighted.replace(_(_text).escape(),'<span class="Rk-Highlighted">$1</span>'));
            } else {
                this.title.text(_text);
            }

            var _strokeWidth = this._getStrokeWidth();
            this.title.css({
                left: this.paper_coords.x,
                top: this.paper_coords.y + this.circle_radius * this.h_ratio + this.options.node_label_distance + 0.5*_strokeWidth,
                opacity: opacity
            });
            var _color = (this.model.has("style") && this.model.get("style").color) || (this.model.get("created_by") || Utils._USER_PLACEHOLDER(this.renkan)).get("color"),
                _dash = (this.model.has("style") && this.model.get("style").dash) ? this.options.default_dash_array : null;
            this.circle.strokeWidth = _strokeWidth;
            this.circle.strokeColor = _color;
            this.circle.dashArray = _dash;
            var _pc = this.paper_coords;
            this.all_buttons.forEach(function(b) {
                b.moveTo(_pc);
            });
            var lastImage = this.img;
            this.img = this.model.get("image");
            if (this.img && this.img !== lastImage) {
                this.showImage();
                if(this.circle) {
                    this.circle.sendToBack();
                }
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

            if (typeof options === 'undefined' || !('dontRedrawEdges' in options) || !options.dontRedrawEdges) {
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
            if (this.ghost){
                this.show(true);
            } else {
                if (this.hidden) { this.hide(); }
            }
        },
        showImage: function() {
            var _image = null;
            if (typeof this.renderer.image_cache[this.img] === "undefined") {
                _image = new Image();
                this.renderer.image_cache[this.img] = _image;
                _image.src = this.img;
            } else {
                _image = this.renderer.image_cache[this.img];
            }
            if (_image.width) {
                if (this.node_image) {
                    this.node_image.remove();
                }
                this.renderer.node_layer.activate();
                var width = _image.width,
                    height = _image.height,
                    clipPath = this.model.get("clip_path"),
                    hasClipPath = (typeof clipPath !== "undefined" && clipPath),
                    _clip = null,
                    baseRadius = null,
                    centerPoint = null;

                if (hasClipPath) {
                    _clip = new paper.Path();
                    var instructions = clipPath.match(/[a-z][^a-z]+/gi) || [],
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
                                res = ( res - 0.5 ) * height;
                            } else {
                                res = ( res - 0.5 ) * width;
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

                    baseRadius = Math[this.options.node_images_fill_mode ? "min" : "max"](maxX - minX, maxY - minY) / 2;
                    centerPoint = new paper.Point((maxX + minX) / 2, (maxY + minY) / 2);
                    if (!this.options.show_node_circles) {
                        this.h_ratio = (maxY - minY) / (2 * baseRadius);
                    }
                } else {
                    baseRadius = Math[this.options.node_images_fill_mode ? "min" : "max"](width, height) / 2;
                    centerPoint = new paper.Point(0,0);
                    if (!this.options.show_node_circles) {
                        this.h_ratio = height / (2 * baseRadius);
                    }
                }
                var _raster = new paper.Raster(_image);
                _raster.locked = true; // Disable mouse events on icon
                if (hasClipPath) {
                    _raster = new paper.Group(_clip, _raster);
                    _raster.opacity = 0.99;
                    /* This is a workaround to allow clipping at group level
                     * If opacity was set to 1, paper.js would merge all clipping groups in one (known bug).
                     */
                    _raster.clipped = true;
                    _clip.__representation = this;
                }
                if (this.options.clip_node_images) {
                    var _circleClip = this.shapeBuilder.getImageShape(centerPoint, baseRadius);
                    _raster = new paper.Group(_circleClip, _raster);
                    _raster.opacity = 0.99;
                    _raster.clipped = true;
                    _circleClip.__representation = this;
                }
                this.image_delta = centerPoint.divide(baseRadius);
                this.node_image = _raster;
                this.node_image.__representation = _this;
                this.node_image.scale(this.circle_radius / baseRadius);
                this.node_image.position = this.paper_coords.subtract(this.image_delta.multiply(this.circle_radius));
                this.node_image.insertAbove(this.circle);
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
                this.renderer.view.paperShift(_delta);
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
            this.circle.strokeWidth = this._getSelectedStrokeWidth();
            if (this.renderer.isEditable() && !this.hidden) {
                this.active_buttons.forEach(function(b) {
                    b.show();
                });
            }
            var _uri = this.model.get("uri");
            if (_uri) {
                $('.Rk-Bin-Item').each(function() {
                    var _el = $(this);
                    if (_el.attr("data-uri") === _uri) {
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
            //if the node is hidden and the mouse hover it, it appears as a ghost
            if (this.hidden) {
                this.show(true);
            }
            else {
                this.showNeighbors(true);
            }
            this._super("select");
        },
        hideButtons: function() {
            this.all_buttons.forEach(function(b) {
                b.hide();
            });
            delete(this.buttonTimeout);
        },
        unselect: function(_newTarget) {
            if (!_newTarget || _newTarget.source_representation !== this) {
                this.selected = false;
                var _this = this;
                this.buttons_timeout = setTimeout(function() { _this.hideButtons(); }, 200);
                this.circle.strokeWidth = this._getStrokeWidth();
                $('.Rk-Bin-Item').removeClass("selected");
                if (this.renderer.minimap) {
                    this.minimap_circle.strokeColor = undefined;
                }
                //when the mouse don't hover the node anymore, we hide it
                if (this.hidden) {
                    this.hide();
                }
                else {
                    this.hideNeighbors();
                }
                this._super("unselect");
            }
        },
        hide: function(){
            var _this = this;
            this.ghost = false;
            this.hidden = true;
            if (typeof this.node_image !== 'undefined'){
                this.node_image.opacity = 0;
            }
            this.hideButtons();
            this.circle.opacity = 0;
            this.title.css('opacity', 0);
            this.minimap_circle.opacity = 0;


            _.each(
                    this.project.get("edges").filter(
                            function (ed) {
                                return ((ed.get("to") === _this.model) || (ed.get("from") === _this.model));
                            }
                    ),
                    function(edge, index, list) {
                        var repr = _this.renderer.getRepresentationByModel(edge);
                        if (repr && typeof repr.from_representation !== "undefined" && typeof repr.from_representation.paper_coords !== "undefined" && typeof repr.to_representation !== "undefined" && typeof repr.to_representation.paper_coords !== "undefined") {
                            repr.hide();
                        }
                    }
            );
            this.hideNeighbors();
        },
        show: function(ghost){
            var _this = this;
            this.ghost = ghost;
            if (this.ghost){
                if (typeof this.node_image !== 'undefined'){
                    this.node_image.opacity = this.options.ghost_opacity;
                }
                this.circle.opacity = this.options.ghost_opacity;
                this.title.css('opacity', this.options.ghost_opacity);
                this.minimap_circle.opacity = this.options.ghost_opacity;
            } else {
                this.minimap_circle.opacity = 1; 
                this.hidden = false;
                this.redraw();
            }

            _.each(
                    this.project.get("edges").filter(
                            function (ed) {
                                return ((ed.get("to") === _this.model) || (ed.get("from") === _this.model));
                            }
                    ),
                    function(edge, index, list) {
                        var repr = _this.renderer.getRepresentationByModel(edge);
                        if (repr && typeof repr.from_representation !== "undefined" && typeof repr.from_representation.paper_coords !== "undefined" && typeof repr.to_representation !== "undefined" && typeof repr.to_representation.paper_coords !== "undefined") {
                            repr.show(_this.ghost);
                        }
                    }
            );
        },
        hideNeighbors: function(){
            var _this = this;
            _.each(
                    this.project.get("edges").filter(
                            function (ed) {
                                return (ed.get("from") === _this.model);
                            }
                    ),
                    function(edge, index, list) {
                        var repr = _this.renderer.getRepresentationByModel(edge.get("to"));
                        if (repr && repr.ghost) {
                            repr.hide();
                        }
                    }
            );
        },
        showNeighbors: function(ghost){
            var _this = this;
            _.each(
                    this.project.get("edges").filter(
                            function (ed) {
                                return (ed.get("from") === _this.model);
                            }
                    ),
                    function(edge, index, list) {
                        var repr = _this.renderer.getRepresentationByModel(edge.get("to"));
                        if (repr && repr.hidden) {
                            repr.show(ghost);
                            if (!ghost){
                                var indexNode = _this.renderer.view.hiddenNodes.indexOf(repr.model.id);
                                if (indexNode !== -1){
                                    _this.renderer.view.hiddenNodes.splice(indexNode, 1);
                                }
                            }
                        }
                    }
            );
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
                if (this.hidden) {
                    var index = this.renderer.view.hiddenNodes.indexOf(this.model.id);
                    if (index !== -1){
                        this.renderer.view.hiddenNodes.splice(index, 1);
                    }
                    this.show(false);
                    this.select();
                } else {
                    if (!_isTouch && !this.model.get("delete_scheduled")) {
                        this.openEditor();
                    }
                    this.model.trigger("clicked");
                }
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
    }).value();

    return NodeRepr;

});


define('renderer/edge',['jquery', 'underscore', 'requtils', 'renderer/baserepresentation'], function ($, _, requtils, BaseRepresentation) {
    'use strict';

    var Utils = requtils.getUtils();

    /* Edge Class Begin */

    //var Edge = Renderer.Edge = Utils.inherit(Renderer._BaseRepresentation);
    var Edge = Utils.inherit(BaseRepresentation);

    _(Edge.prototype).extend({
        _init: function() {
            this.renderer.edge_layer.activate();
            this.type = "Edge";
            this.hidden = false;
            this.ghost = false;
            this.from_representation = this.renderer.getRepresentationByModel(this.model.get("from"));
            this.to_representation = this.renderer.getRepresentationByModel(this.model.get("to"));
            this.bundle = this.renderer.addToBundles(this);
            this.line = new paper.Path();
            this.line.add([0,0],[0,0],[0,0]);
            this.line.__representation = this;
            this.line.strokeWidth = this.options.edge_stroke_width;
            this.arrow_scale = 1;
            this.arrow = new paper.Path();
            this.arrow.add(
                    [ 0, 0 ],
                    [ this.options.edge_arrow_length, this.options.edge_arrow_width / 2 ],
                    [ 0, this.options.edge_arrow_width ]
            );
            this.arrow.pivot = new paper.Point([ this.options.edge_arrow_length / 2, this.options.edge_arrow_width / 2 ]);
            this.arrow.__representation = this;
            this.text = $('<div class="Rk-Label Rk-Edge-Label">').appendTo(this.renderer.labels_$);
            this.arrow_angle = 0;
            if (this.options.editor_mode) {
                var Renderer = requtils.getRenderer();
                this.normal_buttons = [
                                       new Renderer.EdgeEditButton(this.renderer, null),
                                       new Renderer.EdgeRemoveButton(this.renderer, null)
                                       ];
                this.pending_delete_buttons = [
                                               new Renderer.EdgeRevertButton(this.renderer, null)
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
        _getStrokeWidth: function() {
            var thickness = (this.model.has('style') && this.model.get('style').thickness) || 1;
            return this.options.edge_stroke_width + (thickness-1) * (this.options.edge_stroke_max_width - this.options.edge_stroke_width) / (this.options.edge_stroke_witdh_scale-1);
        },
        _getSelectedStrokeWidth: function() {
            var thickness = (this.model.has('style') && this.model.get('style').thickness) || 1;
            return this.options.selected_edge_stroke_width + (thickness-1) * (this.options.selected_edge_stroke_max_width - this.options.selected_edge_stroke_width) / (this.options.edge_stroke_witdh_scale-1);
        },
        _getArrowScale: function() {
            var thickness = (this.model.has('style') && this.model.get('style').thickness) || 1;
            return 1 + (thickness-1) * ((this.options.edge_arrow_max_width / this.options.edge_arrow_width) - 1) / (this.options.edge_stroke_witdh_scale-1);
        },
        redraw: function() {
            var from = this.model.get("from"),
            to = this.model.get("to");
            if (!from || !to || (this.hidden && !this.ghost)) {
                return;
            }
            this.from_representation = this.renderer.getRepresentationByModel(from);
            this.to_representation = this.renderer.getRepresentationByModel(to);
            if (typeof this.from_representation === "undefined" || typeof this.to_representation === "undefined" ||
                    (this.from_representation.hidden && !this.from_representation.ghost) ||
                    (this.to_representation.hidden && !this.to_representation.ghost)) {
                this.hide();
                return;
            }
            var _strokeWidth = this._getStrokeWidth(),
                _arrow_scale = this._getArrowScale(),
                _p0a = this.from_representation.paper_coords,
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
                _textdelta = _ortho.multiply(this.options.edge_label_distance + 0.5 * _arrow_scale * this.options.edge_arrow_width),
                _handle = _v.divide(3),
                _color = (this.model.has("style") && this.model.get("style").color) || (this.model.get("created_by") || Utils._USER_PLACEHOLDER(this.renkan)).get("color"),
                _dash = (this.model.has("style") && this.model.get("style").dash) ? this.options.default_dash_array : null,
                _opacity;

            if (this.model.get("delete_scheduled") || this.from_representation.model.get("delete_scheduled") || this.to_representation.model.get("delete_scheduled")) {
                _opacity = 0.5;
                this.line.dashArray = [2, 2];
            } else {
                _opacity = this.ghost ? this.options.ghost_opacity : 1;
                this.line.dashArray = null;
            }

            var old_act_btn = this.active_buttons;

            this.arrow.visible =
                (this.model.has("style") && this.model.get("style").arrow) ||
                !this.model.has("style") ||
                typeof this.model.get("style").arrow === 'undefined';

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
            this.line.strokeWidth = _strokeWidth;
            this.line.strokeColor = _color;
            this.line.dashArray = _dash;
            this.line.opacity = _opacity;
            this.line.segments[0].point = _p0a;
            this.line.segments[1].point = this.paper_coords;
            this.line.segments[1].handleIn = _handle.multiply(-1);
            this.line.segments[1].handleOut = _handle;
            this.line.segments[2].point = _p1a;
            this.arrow.scale(_arrow_scale / this.arrow_scale);
            this.arrow_scale = _arrow_scale;
            this.arrow.fillColor = _color;
            this.arrow.opacity = _opacity;
            this.arrow.rotate(_a - this.arrow_angle, this.arrow.bounds.center);
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
            _text = Utils.shortenText(_text, this.options.node_label_max_length);
            this.text.text(_text);
            var _textpos = this.paper_coords.add(_textdelta);
            this.text.css({
                left: _textpos.x,
                top: _textpos.y,
                transform: "rotate(" + _a + "deg)",
                "-moz-transform": "rotate(" + _a + "deg)",
                "-webkit-transform": "rotate(" + _a + "deg)",
                opacity: _opacity
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
        hide: function(){
            this.hidden = true;
            this.ghost = false;

            this.text.hide();
            this.line.visible = false;
            this.arrow.visible = false;
            this.minimap_line.visible = false;
        },
        show: function(ghost){
            this.ghost = ghost;
            if (this.ghost) {
                this.text.css('opacity', 0.3);
                this.line.opacity = 0.3;
                this.arrow.opacity = 0.3;
                this.minimap_line.opacity = 0.3;
            } else {
                this.hidden = false;

                this.text.css('opacity', 1);
                this.line.opacity = 1;
                this.arrow.opacity = 1;
                this.minimap_line.opacity = 1;
            }
            this.text.show();
            this.line.visible = true;
            this.arrow.visible = true;
            this.minimap_line.visible = true;
            this.redraw();
        },
        openEditor: function() {
            this.renderer.removeRepresentationsOfType("editor");
            var _editor = this.renderer.addRepresentation("EdgeEditor",null);
            _editor.source_representation = this;
            _editor.draw();
        },
        select: function() {
            this.selected = true;
            this.line.strokeWidth = this._getSelectedStrokeWidth();
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
                this.line.strokeWidth = this._getStrokeWidth();
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
            this.bundle.edges = _.reject(this.bundle.edges, function(_edge) {
                return _this === _edge;
            });
        }
    }).value();

    return Edge;

});



define('renderer/tempedge',['jquery', 'underscore', 'requtils', 'renderer/baserepresentation'], function ($, _, requtils, BaseRepresentation) {
    'use strict';

    var Utils = requtils.getUtils();

    /* TempEdge Class Begin */

    //var TempEdge = Renderer.TempEdge = Utils.inherit(Renderer._BaseRepresentation);
    var TempEdge = Utils.inherit(BaseRepresentation);

    _(TempEdge.prototype).extend({
        _init: function() {
            this.renderer.edge_layer.activate();
            this.type = "Temp-edge";

            var _color = (this.project.get("users").get(this.renkan.current_user) || Utils._USER_PLACEHOLDER(this.renkan)).get("color");
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
                                id: Utils.getUID('edge'),
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
    }).value();

    /* TempEdge Class End */

    return TempEdge;

});


define('renderer/baseeditor',['jquery', 'underscore', 'requtils', 'renderer/baserepresentation'], function ($, _, requtils, BaseRepresentation) {
    'use strict';

    var Utils = requtils.getUtils();

    /* _BaseEditor Begin */
    //var _BaseEditor = Renderer._BaseEditor = Utils.inherit(Renderer._BaseRepresentation);
    var _BaseEditor = Utils.inherit(BaseRepresentation);

    _(_BaseEditor.prototype).extend({
        _init: function() {
            this.renderer.buttons_layer.activate();
            this.type = "editor";
            this.editor_block = new paper.Path();
            var _pts = _.map(_.range(8), function() {return [0,0];});
            this.editor_block.add.apply(this.editor_block, _pts);
            this.editor_block.strokeWidth = this.options.tooltip_border_width;
            this.editor_block.strokeColor = this.options.tooltip_border_color;
            this.editor_block.opacity = this.options.tooltip_opacity;
            this.editor_$ = $('<div>')
                .appendTo(this.renderer.editor_$)
                .css({
                    position: "absolute",
                    opacity: this.options.tooltip_opacity
                })
                .hide();
        },
        destroy: function() {
            this.editor_block.remove();
            this.editor_$.remove();
        }
    }).value();

    /* _BaseEditor End */

    return _BaseEditor;

});


define('renderer/nodeeditor',['jquery', 'underscore', 'requtils', 'renderer/baseeditor', 'renderer/shapebuilder', 'ckeditor-jquery'], function ($, _, requtils, BaseEditor, ShapeBuilder) {
    'use strict';

    var Utils = requtils.getUtils();

    /* NodeEditor Begin */
    //var NodeEditor = Renderer.NodeEditor = Utils.inherit(Renderer._BaseEditor);
    var NodeEditor = Utils.inherit(BaseEditor);

    _(NodeEditor.prototype).extend({
        _init: function() {
            BaseEditor.prototype._init.apply(this);
            this.template = this.options.templates['templates/nodeeditor.html'];
            //this.templates['default']= this.options.templates['templates/nodeeditor.html'];
            //fusionner avec this.options.node_editor_templates
            this.readOnlyTemplate = this.options.node_editor_templates;
        },
        draw: function() {
            var _model = this.source_representation.model,
            _created_by = _model.get("created_by") || Utils._USER_PLACEHOLDER(this.renkan),
            _template = (this.renderer.isEditable() ? this.template : this.readOnlyTemplate[_model.get("type")] || this.readOnlyTemplate["default"]),
            _image_placeholder = this.options.static_url + "img/image-placeholder.png",
            _size = (_model.get("size") || 0);
            this.editor_$
            .html(_template({
                node: {
                    _id: _model.get("_id"),
                    has_creator: !!_model.get("created_by"),
                    title: _model.get("title"),
                    uri: _model.get("uri"),
                    type: _model.get("type") || "default",
                    short_uri:  Utils.shortenText((_model.get("uri") || "").replace(/^(https?:\/\/)?(www\.)?/,'').replace(/\/$/,''),40),
                    description: _model.get("description"),
                    image: _model.get("image") || "",
                    image_placeholder: _image_placeholder,
                    color: (_model.has("style") && _model.get("style").color) || _created_by.get("color"),
                    thickness: (_model.has("style") && _model.get("style").thickness) || 1,
                    dash: _model.has("style") && _model.get("style").dash ? "checked" : "",
                    clip_path: _model.get("clip_path") || false,
                    created_by_color: _created_by.get("color"),
                    created_by_title: _created_by.get("title"),
                    size: (_size > 0 ? "+" : "") + _size,
                    shape: _model.get("shape") || "circle"
                },
                renkan: this.renkan,
                options: this.options,
                shortenText: Utils.shortenText,
                shapes : _(ShapeBuilder.builders).omit('svg').keys().value(),
                types : _(this.options.node_editor_templates).keys().value(),
            }));
            this.redraw();
            var _this = this,
                editorInstance = _this.options.show_node_editor_description_richtext ?
                    $(".Rk-Edit-Description").ckeditor(_this.options.richtext_editor_config) :
                    false,
                closeEditor = function() {
                    _this.renderer.removeRepresentation(_this);
                    paper.view.draw();
                };

            _this.cleanEditor = function() {
                _this.editor_$.off("keyup");
                _this.editor_$.find("input, textarea, select").off("change keyup paste");
                _this.editor_$.find(".Rk-Edit-Image-File").off('change');
                _this.editor_$.find(".Rk-Edit-ColorPicker-Wrapper").off('hover');
                _this.editor_$.find(".Rk-Edit-Size-Btn").off('click');
                _this.editor_$.find(".Rk-Edit-Image-Del").off('click');
                _this.editor_$.find(".Rk-Edit-ColorPicker").find("li").off('hover click');
                _this.editor_$.find(".Rk-CloseX").off('click');
                _this.editor_$.find(".Rk-Edit-Goto").off('click');

                if(_this.options.show_node_editor_description_richtext) {
                    if(typeof editorInstance.editor !== 'undefined') {
                        var _editor = editorInstance.editor;
                        delete editorInstance.editor;
                        _editor.focusManager.blur(true);
                        _editor.destroy();
                    }
                }
            };

            this.editor_$.find(".Rk-CloseX").click(function (e) {
                e.preventDefault();
                closeEditor();
            });

            this.editor_$.find(".Rk-Edit-Goto").click(function() {
                if (!_model.get("uri")) {
                    return false;
                }
            });

            if (this.renderer.isEditable()) {

                var onFieldChange = _.throttle(function() {
                  _.defer(function() {
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
                            if(_this.options.show_node_editor_description_richtext) {
                                if(typeof editorInstance.editor !== 'undefined' &&
                                    editorInstance.editor.checkDirty()) {
                                    _data.description = editorInstance.editor.getData();
                                    editorInstance.editor.resetDirty();
                                }
                            }
                            else {
                                _data.description = _this.editor_$.find(".Rk-Edit-Description").val();
                            }
                        }
                        if (_this.options.show_node_editor_style) {
                            var dash = _this.editor_$.find(".Rk-Edit-Dash").is(':checked');
                            _data.style = _.assign( ((_model.has("style") && _.clone(_model.get("style"))) || {}), {dash: dash});
                        }
                        if (_this.options.change_shapes) {
                            if(_model.get("shape")!==_this.editor_$.find(".Rk-Edit-Shape").val()){
                                _data.shape = _this.editor_$.find(".Rk-Edit-Shape").val();
                            }
                        }
                        if (_this.options.change_types) {
                            if(_model.get("type")!==_this.editor_$.find(".Rk-Edit-Type").val()){
                                _data.type = _this.editor_$.find(".Rk-Edit-Type").val();
                            }
                        }
                        _model.set(_data);
                        _this.redraw();
                    } else {
                        closeEditor();
                    }
                  });
                }, 1000);

                this.editor_$.on("keyup", function(_e) {
                    if (_e.keyCode === 27) {
                        closeEditor();
                    }
                });

                this.editor_$.find("input, textarea, select").on("change keyup paste", onFieldChange);
                if( _this.options.show_node_editor_description &&
                    _this.options.show_node_editor_description_richtext &&
                    typeof editorInstance.editor !== 'undefined')
                {
                    editorInstance.editor.on("change", onFieldChange);
                    editorInstance.editor.on("blur", onFieldChange);
                }

                if(_this.options.allow_image_upload) {
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
                }
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
                            _this.editor_$.find(".Rk-Edit-Color").css("background", (_model.has("style") && _model.get("style").color) || (_model.get("created_by") || Utils._USER_PLACEHOLDER(_this.renkan)).get("color"));
                        }
                ).click(function(_e) {
                    _e.preventDefault();
                    if (_this.renderer.isEditable()) {
                        _model.set("style", _.assign( ((_model.has("style") && _.clone(_model.get("style"))) || {}), {color: $(this).attr("data-color")}));
                        _picker.hide();
                        paper.view.draw();
                    } else {
                        closeEditor();
                    }
                });

                var shiftSize = function(n) {
                    if (_this.renderer.isEditable()) {
                        var _newsize = n+(_model.get("size") || 0);
                        _this.editor_$.find("#Rk-Edit-Size-Value").text((_newsize > 0 ? "+" : "") + _newsize);
                        _model.set("size", _newsize);
                        paper.view.draw();
                    } else {
                        closeEditor();
                    }
                };

                this.editor_$.find("#Rk-Edit-Size-Down").click(function() {
                    shiftSize(-1);
                    return false;
                });
                this.editor_$.find("#Rk-Edit-Size-Up").click(function() {
                    shiftSize(1);
                    return false;
                });

                var shiftThickness = function(n) {
                    if (_this.renderer.isEditable()) {
                        var _oldThickness = ((_model.has('style') && _model.get('style').thickness) || 1),
                            _newThickness = n + _oldThickness;
                        if(_newThickness < 1 ) {
                            _newThickness = 1;
                        }
                        else if (_newThickness > _this.options.node_stroke_witdh_scale) {
                            _newThickness = _this.options.node_stroke_witdh_scale;
                        }
                        if (_newThickness !== _oldThickness) {
                            _this.editor_$.find("#Rk-Edit-Thickness-Value").text(_newThickness);
                            _model.set("style", _.assign( ((_model.has("style") && _.clone(_model.get("style"))) || {}), {thickness: _newThickness}));
                            paper.view.draw();
                        }
                    }
                    else {
                        closeEditor();
                    }
                };

                this.editor_$.find("#Rk-Edit-Thickness-Down").click(function() {
                    shiftThickness(-1);
                    return false;
                });
                this.editor_$.find("#Rk-Edit-Thickness-Up").click(function() {
                    shiftThickness(1);
                    return false;
                });

                this.editor_$.find(".Rk-Edit-Image-Del").click(function() {
                    _this.editor_$.find(".Rk-Edit-Image").val('');
                    onFieldChange();
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
            if (this.options.popup_editor){
                var _coords = this.source_representation.paper_coords;
                Utils.drawEditBox(this.options, _coords, this.editor_block, this.source_representation.circle_radius * 0.75, this.editor_$);
            }
            this.editor_$.show();
            paper.view.draw();
        },
        destroy: function() {
            if(typeof this.cleanEditor !== 'undefined') {
                this.cleanEditor();
            }
            this.editor_block.remove();
            this.editor_$.remove();
        }
    }).value();

    /* NodeEditor End */

    return NodeEditor;

});


define('renderer/edgeeditor',['jquery', 'underscore', 'requtils', 'renderer/baseeditor'], function ($, _, requtils, BaseEditor) {
    'use strict';

    var Utils = requtils.getUtils();

    /* EdgeEditor Begin */

    //var EdgeEditor = Renderer.EdgeEditor = Utils.inherit(Renderer._BaseEditor);
    var EdgeEditor = Utils.inherit(BaseEditor);

    _(EdgeEditor.prototype).extend({
        _init: function() {
          BaseEditor.prototype._init.apply(this);
          this.template = this.options.templates['templates/edgeeditor.html'];
          this.readOnlyTemplate = this.options.templates['templates/edgeeditor_readonly.html'];
        },
        draw: function() {
            var _model = this.source_representation.model,
            _from_model = _model.get("from"),
            _to_model = _model.get("to"),
            _created_by = _model.get("created_by") || Utils._USER_PLACEHOLDER(this.renkan),
            _template = (this.renderer.isEditable() ? this.template : this.readOnlyTemplate);
            this.editor_$
              .html(_template({
                edge: {
                    has_creator: !!_model.get("created_by"),
                    title: _model.get("title"),
                    uri: _model.get("uri"),
                    short_uri:  Utils.shortenText((_model.get("uri") || "").replace(/^(https?:\/\/)?(www\.)?/,'').replace(/\/$/,''),40),
                    description: _model.get("description"),
                    color: (_model.has("style") && _model.get("style").color) || _created_by.get("color"),
                    dash: _model.has("style") && _model.get("style").dash ? "checked" : "",
                    arrow: (_model.has("style") && _model.get("style").arrow) || !_model.has("style") || (typeof _model.get("style").arrow === 'undefined') ? "checked" : "",
                    thickness: (_model.has("style") && _model.get("style").thickness) || 1,
                    from_title: _from_model.get("title"),
                    to_title: _to_model.get("title"),
                    from_color: (_from_model.has("style") && _from_model.get("style").color) || (_from_model.get("created_by") || Utils._USER_PLACEHOLDER(this.renkan)).get("color"),
                    to_color: (_to_model.has("style") && _to_model.get("style").color) || (_to_model.get("created_by") || Utils._USER_PLACEHOLDER(this.renkan)).get("color"),
                    created_by_color: _created_by.get("color"),
                    created_by_title: _created_by.get("title")
                },
                renkan: this.renkan,
                shortenText: Utils.shortenText,
                options: this.options
            }));
            this.redraw();
            var _this = this,
            closeEditor = function() {
                _this.renderer.removeRepresentation(_this);
                _this.editor_$.find(".Rk-Edit-Size-Btn").off('click');
                paper.view.draw();
            };
            this.editor_$.find(".Rk-CloseX").click(closeEditor);
            this.editor_$.find(".Rk-Edit-Goto").click(function() {
                if (!_model.get("uri")) {
                    return false;
                }
            });

            if (this.renderer.isEditable()) {

                var onFieldChange = _.throttle(function() {
                    _.defer(function() {
                        if (_this.renderer.isEditable()) {
                            var _data = {
                                title: _this.editor_$.find(".Rk-Edit-Title").val()
                            };
                            if (_this.options.show_edge_editor_uri) {
                                _data.uri = _this.editor_$.find(".Rk-Edit-URI").val();
                            }
                            if (_this.options.show_node_editor_style) {
                                var dash = _this.editor_$.find(".Rk-Edit-Dash").is(':checked'),
                                    arrow = _this.editor_$.find(".Rk-Edit-Arrow").is(':checked');
                                _data.style = _.assign( ((_model.has("style") && _.clone(_model.get("style"))) || {}), {dash: dash, arrow: arrow});
                            }
                            _this.editor_$.find(".Rk-Edit-Goto").attr("href",_data.uri || "#");
                            _model.set(_data);
                            paper.view.draw();
                        } else {
                            closeEditor();
                        }
                    });
                },500);

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
                            _this.editor_$.find(".Rk-Edit-Color").css("background", (_model.has("style") && _model.get("style").color)|| (_model.get("created_by") || Utils._USER_PLACEHOLDER(_this.renkan)).get("color"));
                        }
                ).click(function(_e) {
                    _e.preventDefault();
                    if (_this.renderer.isEditable()) {
                        _model.set("style", _.assign( ((_model.has("style") && _.clone(_model.get("style"))) || {}), {color: $(this).attr("data-color")}));
                        _picker.hide();
                        paper.view.draw();
                    } else {
                        closeEditor();
                    }
                });
                var shiftThickness = function(n) {
                    if (_this.renderer.isEditable()) {
                        var _oldThickness = ((_model.has('style') && _model.get('style').thickness) || 1),
                            _newThickness = n + _oldThickness;
                        if(_newThickness < 1 ) {
                            _newThickness = 1;
                        }
                        else if (_newThickness > _this.options.node_stroke_witdh_scale) {
                            _newThickness = _this.options.node_stroke_witdh_scale;
                        }
                        if (_newThickness !== _oldThickness) {
                            _this.editor_$.find("#Rk-Edit-Thickness-Value").text(_newThickness);
                            _model.set("style", _.assign( ((_model.has("style") && _.clone(_model.get("style"))) || {}), {thickness: _newThickness}));
                            paper.view.draw();
                        }
                    }
                    else {
                        closeEditor();
                    }
                };

                this.editor_$.find("#Rk-Edit-Thickness-Down").click(function() {
                    shiftThickness(-1);
                    return false;
                });
                this.editor_$.find("#Rk-Edit-Thickness-Up").click(function() {
                    shiftThickness(1);
                    return false;
                });
            }
        },
        redraw: function() {
            if (this.options.popup_editor){
                var _coords = this.source_representation.paper_coords;
                Utils.drawEditBox(this.options, _coords, this.editor_block, 5, this.editor_$);
            }
            this.editor_$.show();
            paper.view.draw();
        }
    }).value();

    /* EdgeEditor End */

    return EdgeEditor;

});


define('renderer/nodebutton',['jquery', 'underscore', 'requtils', 'renderer/basebutton'], function ($, _, requtils, BaseButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* _NodeButton Begin */

    //var _NodeButton = Renderer._NodeButton = Utils.inherit(Renderer._BaseButton);
    var _NodeButton = Utils.inherit(BaseButton);

    _(_NodeButton.prototype).extend({
        setSectorSize: function() {
            var sectorInner = this.source_representation.circle_radius;
            if (sectorInner !== this.lastSectorInner) {
                if (this.sector) {
                    this.sector.destroy();
                }
                this.sector = this.renderer.drawSector(
                        this, 1 + sectorInner,
                        Utils._NODE_BUTTON_WIDTH + sectorInner,
                        this.startAngle,
                        this.endAngle,
                        1,
                        this.imageName,
                        this.renkan.translate(this.text)
                );
                this.lastSectorInner = sectorInner;
            }
        },
        unselect: function() {
            BaseButton.prototype.unselect.apply(this, Array.prototype.slice.call(arguments, 1));
            if(this.source_representation && this.source_representation.buttons_timeout) {
                clearTimeout(this.source_representation.buttons_timeout);
                this.source_representation.hideButtons();
            }
        },
        select: function() {
            if(this.source_representation && this.source_representation.buttons_timeout) {
                clearTimeout(this.source_representation.buttons_timeout);
            }
            this.sector.select();
        },
    }).value();


    /* _NodeButton End */

    return _NodeButton;

});


define('renderer/nodeeditbutton',['jquery', 'underscore', 'requtils', 'renderer/nodebutton'], function ($, _, requtils, NodeButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* NodeEditButton Begin */

    //var NodeEditButton = Renderer.NodeEditButton = Utils.inherit(Renderer._NodeButton);
    var NodeEditButton = Utils.inherit(NodeButton);

    _(NodeEditButton.prototype).extend({
        _init: function() {
            this.type = "Node-edit-button";
            this.lastSectorInner = 0;
            this.startAngle = this.options.hide_nodes ? -125 : -135;
            this.endAngle = this.options.hide_nodes ? -55 : -45;
            this.imageName = "edit";
            this.text = "Edit";
        },
        mouseup: function() {
            if (!this.renderer.is_dragging) {
                this.source_representation.openEditor();
            }
        }
    }).value();

    /* NodeEditButton End */

    return NodeEditButton;

});


define('renderer/noderemovebutton',['jquery', 'underscore', 'requtils', 'renderer/nodebutton'], function ($, _, requtils, NodeButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* NodeRemoveButton Begin */

    //var NodeRemoveButton = Renderer.NodeRemoveButton = Utils.inherit(Renderer._NodeButton);
    var NodeRemoveButton = Utils.inherit(NodeButton);

    _(NodeRemoveButton.prototype).extend({
        _init: function() {
            this.type = "Node-remove-button";
            this.lastSectorInner = 0;
            this.startAngle = this.options.hide_nodes ? -10 : 0;
            this.endAngle = this.options.hide_nodes ? 45 : 90;
            this.imageName = "remove";
            this.text = "Remove";
        },
        mouseup: function() {
            this.renderer.click_target = null;
            this.renderer.is_dragging = false;
            this.renderer.removeRepresentationsOfType("editor");
            if (this.renderer.isEditable()) {
                if (this.options.element_delete_delay) {
                    var delid = Utils.getUID("delete");
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
    }).value();

    /* NodeRemoveButton End */

    return NodeRemoveButton;

});


define('renderer/nodehidebutton',['jquery', 'underscore', 'requtils', 'renderer/nodebutton'], function ($, _, requtils, NodeButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* NodeRemoveButton Begin */

    //var NodeRemoveButton = Renderer.NodeRemoveButton = Utils.inherit(Renderer._NodeButton);
    var NodeHideButton = Utils.inherit(NodeButton);

    _(NodeHideButton.prototype).extend({
        _init: function() {
            this.type = "Node-hide-button";
            this.lastSectorInner = 0;
            this.startAngle = 45;
            this.endAngle = 90;
            this.imageName = "hide";
            this.text = "Hide";
        },
        mouseup: function() {
            this.renderer.click_target = null;
            this.renderer.is_dragging = false;
            this.renderer.removeRepresentationsOfType("editor");
            if (this.renderer.isEditable()) {
                this.renderer.view.addHiddenNode(this.source_representation.model);
            }
        }
    }).value();

    /* NodeRemoveButton End */

    return NodeHideButton;

});


define('renderer/nodeshowbutton',['jquery', 'underscore', 'requtils', 'renderer/nodebutton'], function ($, _, requtils, NodeButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* NodeRemoveButton Begin */

    //var NodeRemoveButton = Renderer.NodeRemoveButton = Utils.inherit(Renderer._NodeButton);
    var NodeShowButton = Utils.inherit(NodeButton);

    _(NodeShowButton.prototype).extend({
        _init: function() {
            this.type = "Node-show-button";
            this.lastSectorInner = 0;
            this.startAngle = 90;
            this.endAngle = 135;
            this.imageName = "show";
            this.text = "Show";
        },
        mouseup: function() {
            this.renderer.click_target = null;
            this.renderer.is_dragging = false;
            this.renderer.removeRepresentationsOfType("editor");
            if (this.renderer.isEditable()) {
                this.source_representation.showNeighbors(false);
            }
        }
    }).value();

    /* NodeShowButton End */

    return NodeShowButton;

});


define('renderer/noderevertbutton',['jquery', 'underscore', 'requtils', 'renderer/nodebutton'], function ($, _, requtils, NodeButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* NodeRevertButton Begin */

    //var NodeRevertButton = Renderer.NodeRevertButton = Utils.inherit(Renderer._NodeButton);
    var NodeRevertButton = Utils.inherit(NodeButton);

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
    }).value();

    /* NodeRevertButton End */

    return NodeRevertButton;

});


define('renderer/nodelinkbutton',['jquery', 'underscore', 'requtils', 'renderer/nodebutton'], function ($, _, requtils, NodeButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* NodeLinkButton Begin */

    //var NodeLinkButton = Renderer.NodeLinkButton = Utils.inherit(Renderer._NodeButton);
    var NodeLinkButton = Utils.inherit(NodeButton);

    _(NodeLinkButton.prototype).extend({
        _init: function() {
            this.type = "Node-link-button";
            this.lastSectorInner = 0;
            this.startAngle = this.options.hide_nodes ? 135 : 90;
            this.endAngle = this.options.hide_nodes ? 190 : 180;
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
    }).value();

    /* NodeLinkButton End */

    return NodeLinkButton;

});



define('renderer/nodeenlargebutton',['jquery', 'underscore', 'requtils', 'renderer/nodebutton'], function ($, _, requtils, NodeButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* NodeEnlargeButton Begin */

    //var NodeEnlargeButton = Renderer.NodeEnlargeButton = Utils.inherit(Renderer._NodeButton);
    var NodeEnlargeButton = Utils.inherit(NodeButton);

    _(NodeEnlargeButton.prototype).extend({
        _init: function() {
            this.type = "Node-enlarge-button";
            this.lastSectorInner = 0;
            this.startAngle = this.options.hide_nodes ? -55 : -45;
            this.endAngle = this.options.hide_nodes ? -10 : 0;
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
    }).value();

    /* NodeEnlargeButton End */

    return NodeEnlargeButton;

});


define('renderer/nodeshrinkbutton',['jquery', 'underscore', 'requtils', 'renderer/nodebutton'], function ($, _, requtils, NodeButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* NodeShrinkButton Begin */

    //var NodeShrinkButton = Renderer.NodeShrinkButton = Utils.inherit(Renderer._NodeButton);
    var NodeShrinkButton = Utils.inherit(NodeButton);

    _(NodeShrinkButton.prototype).extend({
        _init: function() {
            this.type = "Node-shrink-button";
            this.lastSectorInner = 0;
            this.startAngle = this.options.hide_nodes ? -170 : -180;
            this.endAngle = this.options.hide_nodes ? -125 : -135;
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
    }).value();

    /* NodeShrinkButton End */

    return NodeShrinkButton;

});


define('renderer/edgeeditbutton',['jquery', 'underscore', 'requtils', 'renderer/basebutton'], function ($, _, requtils, BaseButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* EdgeEditButton Begin */

    //var EdgeEditButton = Renderer.EdgeEditButton = Utils.inherit(Renderer._BaseButton);
    var EdgeEditButton = Utils.inherit(BaseButton);

    _(EdgeEditButton.prototype).extend({
        _init: function() {
            this.type = "Edge-edit-button";
            this.sector = this.renderer.drawSector(this, Utils._EDGE_BUTTON_INNER, Utils._EDGE_BUTTON_OUTER, -270, -90, 1, "edit", this.renkan.translate("Edit"));
        },
        mouseup: function() {
            if (!this.renderer.is_dragging) {
                this.source_representation.openEditor();
            }
        }
    }).value();

    /* EdgeEditButton End */

    return EdgeEditButton;

});


define('renderer/edgeremovebutton',['jquery', 'underscore', 'requtils', 'renderer/basebutton'], function ($, _, requtils, BaseButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* EdgeRemoveButton Begin */

    //var EdgeRemoveButton = Renderer.EdgeRemoveButton = Utils.inherit(Renderer._BaseButton);
    var EdgeRemoveButton = Utils.inherit(BaseButton);

    _(EdgeRemoveButton.prototype).extend({
        _init: function() {
            this.type = "Edge-remove-button";
            this.sector = this.renderer.drawSector(this, Utils._EDGE_BUTTON_INNER, Utils._EDGE_BUTTON_OUTER, -90, 90, 1, "remove", this.renkan.translate("Remove"));
        },
        mouseup: function() {
            this.renderer.click_target = null;
            this.renderer.is_dragging = false;
            this.renderer.removeRepresentationsOfType("editor");
            if (this.renderer.isEditable()) {
                if (this.options.element_delete_delay) {
                    var delid = Utils.getUID("delete");
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
    }).value();

    /* EdgeRemoveButton End */

    return EdgeRemoveButton;

});


define('renderer/edgerevertbutton',['jquery', 'underscore', 'requtils', 'renderer/basebutton'], function ($, _, requtils, BaseButton) {
    'use strict';

    var Utils = requtils.getUtils();

    /* EdgeRevertButton Begin */

    //var EdgeRevertButton = Renderer.EdgeRevertButton = Utils.inherit(Renderer._BaseButton);
    var EdgeRevertButton = Utils.inherit(BaseButton);

    _(EdgeRevertButton.prototype).extend({
        _init: function() {
            this.type = "Edge-revert-button";
            this.sector = this.renderer.drawSector(this, Utils._EDGE_BUTTON_INNER, Utils._EDGE_BUTTON_OUTER, -135, 135, 1, "revert", this.renkan.translate("Cancel deletion"));
        },
        mouseup: function() {
            this.renderer.click_target = null;
            this.renderer.is_dragging = false;
            if (this.renderer.isEditable()) {
                this.source_representation.model.unset("delete_scheduled");
            }
        }
    }).value();

    /* EdgeRevertButton End */

    return EdgeRevertButton;

});


define('renderer/miniframe',['jquery', 'underscore', 'requtils', 'renderer/baserepresentation'], function ($, _, requtils, BaseRepresentation) {
    'use strict';

    var Utils = requtils.getUtils();

    /* MiniFrame Begin */

    //var MiniFrame = Renderer.MiniFrame = Utils.inherit(Renderer._BaseRepresentation);
    var MiniFrame = Utils.inherit(BaseRepresentation);

    _(MiniFrame.prototype).extend({
        paperShift: function(_delta) {
            this.renderer.offset = this.renderer.offset.subtract(_delta.divide(this.renderer.minimap.scale).multiply(this.renderer.scale));
            this.renderer.redraw();
        },
        mouseup: function(_delta) {
            this.renderer.click_target = null;
            this.renderer.is_dragging = false;
        }
    }).value();


    /* MiniFrame End */

    return MiniFrame;

});


define('renderer/scene',['jquery', 'underscore', 'filesaver', 'requtils', 'renderer/miniframe'], function ($, _, filesaver, requtils, MiniFrame) {
    'use strict';

    var Utils = requtils.getUtils();

    /* Scene Begin */

    var Scene = function(_renkan) {
        this.renkan = _renkan;
        this.$ = $(".Rk-Render");
        this.representations = [];
        this.$.html(_renkan.options.templates['templates/scene.html'](_renkan));
        this.onStatusChange();
        this.canvas_$ = this.$.find(".Rk-Canvas");
        this.labels_$ = this.$.find(".Rk-Labels");
        if (!_renkan.options.popup_editor){
            this.editor_$ = $("#" + _renkan.options.editor_panel);
        }else{
            this.editor_$ = this.$.find(".Rk-Editor");
        }
        this.notif_$ = this.$.find(".Rk-Notifications");
        paper.setup(this.canvas_$[0]);
        this.totalScroll = 0;
        this.mouse_down = false;
        this.click_target = null;
        this.selected_target = null;
        this.edge_layer = new paper.Layer();
        this.node_layer = new paper.Layer();
        this.buttons_layer = new paper.Layer();
        this.delete_list = [];
        this.redrawActive = true;

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
            this.minimap.scale = 0.1;

            this.minimap.node_layer.activate();
            this.minimap.cliprectangle = new paper.Path.Rectangle(this.minimap.topleft, this.minimap.size);
            this.minimap.node_group.addChild(this.minimap.cliprectangle);
            this.minimap.node_group.clipped = true;
            this.minimap.miniframe = new paper.Path.Rectangle(this.minimap.topleft, this.minimap.size);
            this.minimap.node_group.addChild(this.minimap.miniframe);
            this.minimap.miniframe.fillColor = '#c0c0ff';
            this.minimap.miniframe.opacity = 0.3;
            this.minimap.miniframe.strokeColor = '#000080';
            this.minimap.miniframe.strokeWidth = 2;
            this.minimap.miniframe.__representation = new MiniFrame(this, null);
        }

        this.throttledPaperDraw = _(function() {
            paper.view.draw();
        }).throttle(100).value();

        this.bundles = [];
        this.click_mode = false;

        var _this = this,
        _allowScroll = true,
        _originalScale = 1,
        _zooming = false,
        _lastTapX = 0,
        _lastTapY = 0;

        this.image_cache = {};
        this.icon_cache = {};

        ['edit', 'remove', 'hide', 'show', 'link', 'enlarge', 'shrink', 'revert' ].forEach(function(imgname) {
            var img = new Image();
            img.src = _renkan.options.static_url + 'img/' + imgname + '.png';
            _this.icon_cache[imgname] = img;
        });

        var throttledMouseMove = _.throttle(function(_event, _isTouch) {
            _this.onMouseMove(_event, _isTouch);
        }, Utils._MOUSEMOVE_RATE);

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
                        _renkan.options.allow_double_click &&
                        new Date() - _lastTap < Utils._DOUBLETAP_DELAY &&
                        ( Math.pow(_lastTapX - _touches.pageX, 2) + Math.pow(_lastTapY - _touches.pageY, 2) < Utils._DOUBLETAP_DISTANCE )
                ) {
                    _lastTap = 0;
                    _this.onDoubleClick(_touches);
                } else {
                    _lastTap = new Date();
                    _lastTapX = _touches.pageX;
                    _lastTapY = _touches.pageY;
                    _originalScale = _this.view.scale;
                    _zooming = false;
                    _this.onMouseDown(_touches, true);
                }
            },
            touchmove: function(_event) {
                _event.preventDefault();
                _lastTap = 0;
                if (_event.originalEvent.touches.length === 1) {
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
                    _scaleRatio = _newScale / _this.view.scale,
                    _newOffset = new paper.Point([
                                                  _this.canvas_$.width(),
                                                  _this.canvas_$.height()
                                                  ]).multiply( 0.5 * ( 1 - _scaleRatio ) ).add(_this.view.offset.multiply( _scaleRatio ));
                    _this.view.setScale(_newScale, _newOffset);
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
                //_this.onMouseUp(_event, false);
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
                _.each(_event.originalEvent.dataTransfer.types, function(t) {
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
                            _.extend(res,data);
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

        if(this.renkan.project.get("views").length > 0 && this.renkan.options.save_view){
            this.$.find(".Rk-ZoomSetSaved").show();
        }
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
        bindClick(".Rk-Export-Button", "exportProject");
        this.$.find(".Rk-Bookmarklet-Button")
          /*jshint scripturl:true */
          .attr("href","javascript:" + Utils._BOOKMARKLET_CODE(_renkan))
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
            var _ratio,
                newWidth = _event.width,
                newHeight = _event.height;

            if (_this.minimap) {
                _this.minimap.topleft = paper.view.bounds.bottomRight.subtract(_this.minimap.size);
                _this.minimap.rectangle.fitBounds(_this.minimap.topleft.subtract([2,2]), _this.minimap.size.add([4,4]));
                _this.minimap.cliprectangle.fitBounds(_this.minimap.topleft, _this.minimap.size);
            }

            var ratioH = newHeight/(newHeight-_event.delta.height),
                ratioW = newWidth/(newWidth-_event.delta.width);
            if (newHeight < newWidth) {
                    _ratio = ratioH;
            } else {
                _ratio = ratioW;
            }

            _this.view.resizeZoom(ratioW, ratioH, _ratio);

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

        // register model events
        this.renkan.project.on("change:saveStatus", function(){
            switch (_this.renkan.project.get("saveStatus")) {
                case 0: //clean
                    _this.$.find(".Rk-Save-Button").removeClass("to-save");
                    _this.$.find(".Rk-Save-Button").removeClass("saving");
                    _this.$.find(".Rk-Save-Button").addClass("saved");
                    break;
                case 1: //dirty
                    _this.$.find(".Rk-Save-Button").removeClass("saved");
                    _this.$.find(".Rk-Save-Button").removeClass("saving");
                    _this.$.find(".Rk-Save-Button").addClass("to-save");
                    break;
                case 2: //saving
                    _this.$.find(".Rk-Save-Button").removeClass("saved");
                    _this.$.find(".Rk-Save-Button").removeClass("to-save");
                    _this.$.find(".Rk-Save-Button").addClass("saving");
                    break;
            }
        });

        this.renkan.project.on("change:loadingStatus", function(){
            if (_this.renkan.project.get("loadingStatus")){
                var animate = _this.$.find(".loader").addClass("run");
                var timer = setTimeout(function(){
                    _this.$.find(".loader").hide(250);
                }, 3000);
            }
            else{
                Backbone.history.start();
                _thRedraw();
            }
        });

        this.renkan.project.on("add:users remove:users", _thRedrawUsers);

        this.renkan.project.on("add:views remove:views", function(_node) {
            if(_this.renkan.project.get('views').length > 0) {
                _this.$.find(".Rk-ZoomSetSaved").show();
            }
            else {
                _this.$.find(".Rk-ZoomSetSaved").hide();
            }
        });

        this.renkan.project.on("add:nodes", function(_node) {
            _this.addRepresentation("Node", _node);
            if (!_this.renkan.project.get("loadingStatus")){
                _thRedraw();
            }
        });
        this.renkan.project.on("add:edges", function(_edge) {
            _this.addRepresentation("Edge", _edge);
            if (!_this.renkan.project.get("loadingStatus")){
                _thRedraw();
            }
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
        
        //register router events
        this.renkan.router.on("router", function(_params){
            _this.parameters(_params);
        });

        if (_renkan.options.size_bug_fix) {
            var _delay = (
                    typeof _renkan.options.size_bug_fix === "number" ?
                        _renkan.options.size_bug_fix
                                : 500
            );
            window.setTimeout(
                    function() {
                        _this.fixSize();
                    },
                    _delay
            );
        }

        if (_renkan.options.force_resize) {
            $(window).resize(function() {
                _this.autoScale();
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
                    var rxs = Utils.regexpFromTextOrArray(val);
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
        fixSize: function() {
            if(typeof this.view === 'undefined') {
                this.view = this.addRepresentation("View", this.renkan.project.get("views").last());
                this.view.setScale(view.get("zoom_level"), new paper.Point(view.get("offset")));
            }
            else{
                this.view.autoScale();
            }
        },
        drawSector: function(_repr, _inR, _outR, _startAngle, _endAngle, _padding, _imgname, _caption) {
            var _options = this.renkan.options,
                _startRads = _startAngle * Math.PI / 180,
                _endRads = _endAngle * Math.PI / 180,
                _img = this.icon_cache[_imgname],
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
                _centerR = (_inR + _outR) / 2,
                _centerRads = (_startRads + _endRads) / 2,
                _centerX = Math.cos(_centerRads) * _centerR,
                _centerY = Math.sin(_centerRads) * _centerR,
                _centerXIn = Math.cos(_centerRads) * _inR,
                _centerXOut = Math.cos(_centerRads) * _outR,
                _centerYIn = Math.sin(_centerRads) * _inR,
                _centerYOut = Math.sin(_centerRads) * _outR,
                _textX = Math.cos(_centerRads) * (_outR + 3),
                _textY = Math.sin(_centerRads) * (_outR + _options.buttons_label_font_size) + _options.buttons_label_font_size / 2;
            this.buttons_layer.activate();
            var _path = new paper.Path();
            _path.add([_startXIn, _startYIn]);
            _path.arcTo([_centerXIn, _centerYIn], [_endXIn, _endYIn]);
            _path.lineTo([_endXOut,  _endYOut]);
            _path.arcTo([_centerXOut, _centerYOut], [_startXOut, _startYOut]);
            _path.fillColor = _options.buttons_background;
            _path.opacity = 0.5;
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
                //_grp = new paper.Group([_path]),
                _delta = _grp.position,
                _imgdelta = new paper.Point([_centerX, _centerY]),
                _currentPos = new paper.Point(0,0);
            _text.content = _caption;
            // set group pivot to not depend on text visibility that changes the group bounding box.
            _grp.pivot = _grp.bounds.center;
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
                        _path.opacity = 0.8;
                        _text.visible = true;
                    },
                    unselect: function() {
                        _path.opacity = 0.5;
                        _text.visible = false;
                    },
                    destroy: function() {
                        _grp.remove();
                    }
            };
            var showImage = function() {
                var _raster = new paper.Raster(_img);
                _raster.position = _imgdelta.add(_grp.position).subtract(_delta);
                _raster.locked = true; // Disable mouse events on icon
                _grp.addChild(_raster);
            };
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
                        ( _bundle.from === _edgeRepr.from_representation && _bundle.to === _edgeRepr.to_representation ) ||
                        ( _bundle.from === _edgeRepr.to_representation && _bundle.to === _edgeRepr.from_representation )
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
                if (this.renkan.options.manual_save) {
                    savebtn.removeClass("Rk-Save-ReadOnly Rk-Save-Online");
                    tip.text(this.renkan.translate("Save Project"));
                } else {
                    savebtn.removeClass("disabled Rk-Save-ReadOnly").addClass("Rk-Save-Online");
                    tip.text(this.renkan.translate("Auto-save enabled"));
                }
            }
            this.redrawUsers();
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
                        this.view.scale * 0.8 * this.renkan.options.minimap_width / paper.view.bounds.width,
                        this.view.scale * 0.8 * this.renkan.options.minimap_height / paper.view.bounds.height,
                        ( this.renkan.options.minimap_width - 2 * this.renkan.options.minimap_padding ) / (_maxx - _minx),
                        ( this.renkan.options.minimap_height - 2 * this.renkan.options.minimap_padding ) / (_maxy - _miny)
                );
                this.minimap.offset = this.minimap.size.divide(2).subtract(new paper.Point([(_maxx + _minx) / 2, (_maxy + _miny) / 2]).multiply(_scale));
                this.minimap.scale = _scale;
            }
            if (nodes.length === 1) {
                this.minimap.scale = 0.1;
                this.minimap.offset = this.minimap.size.divide(2).subtract(new paper.Point([nodes.at(0).get("position").x, nodes.at(0).get("position").y]).multiply(this.minimap.scale));
            }
            this.redraw();
        },
        toPaperCoords: function(_point) {
            return _point.multiply(this.view.scale).add(this.view.offset);
        },
        toMinimapCoords: function(_point) {
            return _point.multiply(this.minimap.scale).add(this.minimap.offset).add(this.minimap.topleft);
        },
        toModelCoords: function(_point) {
            return _point.subtract(this.view.offset).divide(this.view.scale);
        },
        addRepresentation: function(_type, _model) {
            var RendererType = requtils.getRenderer()[_type];
            var _repr = new RendererType(this, _model);
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
            this.representations = _.reject(this.representations,
                function(_repr) {
                    return _repr === _representation;
                }
            );
        },
        getRepresentationByModel: function(_model) {
            if (!_model) {
                return undefined;
            }
            return _.find(this.representations, function(_repr) {
                return _repr.model === _model;
            });
        },
        removeRepresentationsOfType: function(_type) {
            var _representations = _.filter(this.representations,function(_repr) {
                return _repr.type === _type;
                }),
                _this = this;
            _.each(_representations, function(_repr) {
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
            _.each(this.representations, function(_repr) {
                _repr.unhighlight();
            });
        },
        unselectAll: function(_model) {
            _.each(this.representations, function(_repr) {
                _repr.unselect();
            });
        },
        redraw: function() {
            var _this = this;
            if(! this.redrawActive ) {
                return;
            }
            _.each(this.representations, function(_representation) {
                _representation.redraw({ dontRedrawEdges:true });
            });
            if (this.minimap && typeof this.view !== 'undefined') {
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
        onMouseMove: function(_event) {
            var _off = this.canvas_$.offset(),
            _point = new paper.Point([
                                      _event.pageX - _off.left,
                                      _event.pageY - _off.top
                                      ]),
                                      _delta = _point.subtract(this.last_point);
            this.last_point = _point;
            if (!this.is_dragging && this.mouse_down && _delta.length > Utils._MIN_DRAG_DISTANCE) {
                this.is_dragging = true;
            }
            var _hitResult = paper.project.hitTest(_point);
            if (this.is_dragging) {
                if (this.click_target && typeof this.click_target.paperShift === "function") {
                    this.click_target.paperShift(_delta);
                } else {
                    this.view.paperShift(_delta);
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
                    if (this.isEditable() && this.click_mode === Utils._CLICKMODE_ADDNODE) {
                        var _coords = this.toModelCoords(_point),
                        _data = {
                            id: Utils.getUID('node'),
                            created_by: this.renkan.current_user,
                            position: {
                                x: _coords.x,
                                y: _coords.y
                            }
                        };
                        var _node = this.renkan.project.addNode(_data);
                        this.getRepresentationByModel(_node).openEditor();
                    }
                }
            }
            if (this.click_mode) {
                if (this.isEditable() && this.click_mode === Utils._CLICKMODE_STARTEDGE && this.click_target && this.click_target.type === "Node") {
                    this.removeRepresentationsOfType("editor");
                    this.addTempEdge(this.click_target, _point);
                    this.click_mode = Utils._CLICKMODE_ENDEDGE;
                    this.notif_$.fadeOut(function() {
                        $(this).html(this.renkan.translate("Click on a second node to complete the edge")).fadeIn();
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
                this.view.updateUrl();
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
                                          ]).subtract(this.view.offset).multiply( Math.SQRT2 - 1 );
                if (this.totalScroll > 0) {
                    this.view.setScale( this.view.scale * Math.SQRT2, this.view.offset.subtract(_delta) );
                } else {
                    this.view.setScale( this.view.scale * Math.SQRT1_2, this.view.offset.add(_delta.divide(Math.SQRT2)));
                }
                this.totalScroll = 0;
            }
        },
        onDoubleClick: function(_event) {
            var _off = this.canvas_$.offset(),
            _point = new paper.Point([
                                      _event.pageX - _off.left,
                                      _event.pageY - _off.top
                                      ]);
            var _hitResult = paper.project.hitTest(_point);

            if (!this.isEditable()) {
                if (_hitResult && typeof _hitResult.item.__representation !== "undefined") {
                    if (_hitResult.item.__representation.model.get('uri')){
                        window.open(_hitResult.item.__representation.model.get('uri'), '_blank');
                    }
                }
                return;
            }
            if (this.isEditable() && (!_hitResult || typeof _hitResult.item.__representation === "undefined")) {
                var _coords = this.toModelCoords(_point),
                _data = {
                    id: Utils.getUID('node'),
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
        defaultDropHandler: function(_data) {
            var newNode = {};
            var snippet = "";
            switch(_data["text/x-iri-specific-site"]) {
                case "twitter":
                    snippet = $('<div>').html(_data["text/x-iri-selected-html"]);
                    var tweetdiv = snippet.find(".tweet");
                    newNode.title = this.renkan.translate("Tweet by ") + tweetdiv.attr("data-name");
                    newNode.uri = "http://twitter.com/" + tweetdiv.attr("data-screen-name") + "/status/" + tweetdiv.attr("data-tweet-id");
                    newNode.image = tweetdiv.find(".avatar").attr("src");
                    newNode.description = tweetdiv.find(".js-tweet-text:first").text();
                    break;
                case "google":
                    snippet = $('<div>').html(_data["text/x-iri-selected-html"]);
                    newNode.title = snippet.find("h3:first").text().trim();
                    newNode.uri = snippet.find("h3 a").attr("href");
                    newNode.description = snippet.find(".st:first").text().trim();
                    break;
                default:
                    if (_data["text/x-iri-source-uri"]) {
                        newNode.uri = _data["text/x-iri-source-uri"];
                    }
            }
            if (_data["text/plain"] || _data["text/x-iri-selected-text"]) {
                newNode.description = (_data["text/plain"] || _data["text/x-iri-selected-text"]).replace(/[\s\n]+/gm,' ').trim();
            }
            if (_data["text/html"] || _data["text/x-iri-selected-html"]) {
                snippet = $('<div>').html(_data["text/html"] || _data["text/x-iri-selected-html"]);
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
                snippet = $('<div>').html(_data["text/html"] || _data["text/x-iri-selected-html"]);
                newNode.image = snippet.find("[data-image]").attr("data-image") || newNode.image;
                newNode.uri = snippet.find("[data-uri]").attr("data-uri") || newNode.uri;
                newNode.title = snippet.find("[data-title]").attr("data-title") || newNode.title;
                newNode.description = snippet.find("[data-description]").attr("data-description") || newNode.description;
                newNode.clipPath = snippet.find("[data-clip-path]").attr("data-clip-path") || newNode.clipPath;
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

            if(typeof this.renkan.options.drop_enhancer === "function"){
                newNode = this.renkan.options.drop_enhancer(newNode, _data);
            }

            return newNode;

        },
        dropData: function(_data, _event) {
            if (!this.isEditable()) {
                return;
            }
            if (_data["text/json"] || _data["application/json"]) {
                try {
                    var jsondata = JSON.parse(_data["text/json"] || _data["application/json"]);
                    _.extend(_data,jsondata);
                }
                catch(e) {}
            }

            var newNode = (typeof this.renkan.options.drop_handler === "undefined")?this.defaultDropHandler(_data):this.renkan.options.drop_handler(_data);

            var _off = this.canvas_$.offset(),
            _point = new paper.Point([
                                      _event.pageX - _off.left,
                                      _event.pageY - _off.top
                                      ]),
                                      _coords = this.toModelCoords(_point),
                                      _nodedata = {
                id: Utils.getUID('node'),
                created_by: this.renkan.current_user,
                uri: newNode.uri || "",
                title: newNode.title || "",
                description: newNode.description || "",
                image: newNode.image || "",
                color: newNode.color || undefined,
                clip_path: newNode.clipPath || undefined,
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
                _cancelMethods = ["cancelFullScreen","mozCancelFullScreen","webkitCancelFullScreen"],
                i;
            if (_isFull) {
                for (i = 0; i < _cancelMethods.length; i++) {
                    if (typeof document[_cancelMethods[i]] === "function") {
                        document[_cancelMethods[i]]();
                        break;
                    }
                }
                var widthAft = this.$.width();
                var heightAft = this.$.height();

                if (this.renkan.options.show_top_bar) {
                    heightAft -= this.$.find(".Rk-TopBar").height();
                }
                if (this.renkan.options.show_bins && (this.renkan.$.find(".Rk-Bins").position().left > 0)) {
                    widthAft -= this.renkan.$.find(".Rk-Bins").width();
                }

                paper.view.viewSize = new paper.Size([widthAft, heightAft]);

            } else {
                for (i = 0; i < _requestMethods.length; i++) {
                    if (typeof _el[_requestMethods[i]] === "function") {
                        _el[_requestMethods[i]]();
                        break;
                    }
                }
                this.redraw();
            }
        },
        addNodeBtn: function() {
            if (this.click_mode === Utils._CLICKMODE_ADDNODE) {
                this.click_mode = false;
                this.notif_$.hide();
            } else {
                this.click_mode = Utils._CLICKMODE_ADDNODE;
                this.notif_$.text(this.renkan.translate("Click on the background canvas to add a node")).fadeIn();
            }
            return false;
        },
        addEdgeBtn: function() {
            if (this.click_mode === Utils._CLICKMODE_STARTEDGE || this.click_mode === Utils._CLICKMODE_ENDEDGE) {
                this.click_mode = false;
                this.notif_$.hide();
            } else {
                this.click_mode = Utils._CLICKMODE_STARTEDGE;
                this.notif_$.text(this.renkan.translate("Click on a first node to start the edge")).fadeIn();
            }
            return false;
        },
        exportProject: function() {
          var projectJSON = this.renkan.project.toJSON(),
              downloadLink = document.createElement("a"),
              projectId = projectJSON.id,
              fileNameToSaveAs = projectId + ".json";

          // clean ids
          delete projectJSON.id;
          delete projectJSON._id;
          delete projectJSON.space_id;

          var objId,
              idsMap = {},
              hiddenNodes;

          _.each(projectJSON.nodes, function(e,i,l) {
            objId = e.id || e._id;
            delete e._id;
            delete e.id;
            idsMap[objId] = e['@id'] = Utils.getUUID4();
          });
          _.each(projectJSON.edges, function(e,i,l) {
            delete e._id;
            delete e.id;
            e.to = idsMap[e.to];
            e.from = idsMap[e.from];
          });
          _.each(projectJSON.views, function(e,i,l) {
            delete e._id;
            delete e.id;

            if(e.hidden_nodes) {
                hiddenNodes = e.hidden_nodes;
                e.hidden_nodes = [];
                _.each(hiddenNodes, function(h,j) {
                    e.hidden_nodes.push(idsMap[h]);
                });
            }
          });
          projectJSON.users = [];

          var projectJSONStr = JSON.stringify(projectJSON, null, 2);
          var blob = new Blob([projectJSONStr], {type: "application/json;charset=utf-8"});
          filesaver(blob,fileNameToSaveAs);

        },
        parameters: function(_params){
            this.removeRepresentationsOfType("View");
            if ($.isEmptyObject(_params)){
                this.view = this.addRepresentation("View", this.renkan.project.get("views").at(this.validViewIndex(this.renkan.options.default_index_view)));
                if (!this.renkan.options.default_view){
                    this.view.autoScale();
                }
                return;
            }
            if (typeof _params.viewIndex !== 'undefined'){
                this.view = this.addRepresentation("View", this.renkan.project.get("views").at(this.validViewIndex(_params.viewIndex)));
                if (!this.renkan.options.default_view){
                    this.view.autoScale();
                }
            }
            if (typeof _params.view !== 'undefined' && _params.view.split(",").length >= 3){
                var viewParams = _params.view.split(",");
                var params = {
                        "project": this.renkan.project,
                        "offset": {
                            "x": parseFloat(viewParams[0]),
                            "y": parseFloat(viewParams[1])
                        },
                        "zoom_level": parseFloat(viewParams[2])
                };
                if (this.view){
                    this.view.setScale(params.zoom_level, new paper.Point(params.offset));
                } else{
                    this.view = this.addRepresentation("View", null);
                    this.view.params = params;
                    this.view.init();                    
                }
            }
            if (!this.view){
                this.view = this.addRepresentation("View", this.renkan.project.get("views").at(this.validViewIndex(this.renkan.options.default_index_view)));
                this.view.autoScale();
            }
            //other parameters must go after because most of them depends on a view that must be initialize before
            this.unhighlightAll();
            if (typeof _params.idNode !== 'undefined'){
                this.highlightModel(this.renkan.project.get("nodes").get(_params.idNode));                 
            }
        },
        validViewIndex: function(index){
            //check if the view index exist (negative index is from the end) and return the correct index or false if doesn't exist
            var _index = parseInt(index);
            var validIndex = 0;
            if (_index < 0){
                validIndex = this.renkan.project.get("views").length + _index;
            } else {
                validIndex = _index; 
            }
            if (typeof this.renkan.project.get("views").at(_index) === 'undefined'){
                validIndex = 0;
            }
            return validIndex;
        },
        foldBins: function() {
            var foldBinsButton = this.$.find(".Rk-Fold-Bins"),
                bins = this.renkan.$.find(".Rk-Bins");
            var _this = this,
                sizeBef = _this.canvas_$.width(),
                sizeAft;
            if (bins.position().left < 0) {
                bins.animate({left: 0},250);
                this.$.animate({left: 300},250,function() {
                    var w = _this.$.width();
                    paper.view.viewSize = new paper.Size([w, _this.canvas_$.height()]);
                });
                if ((sizeBef -  bins.width()) < bins.height()){
                    sizeAft = sizeBef;
                } else {
                    sizeAft = sizeBef - bins.width();
                }
                foldBinsButton.html("&laquo;");
            } else {
                bins.animate({left: -300},250);
                this.$.animate({left: 0},250,function() {
                    var w = _this.$.width();
                    paper.view.viewSize = new paper.Size([w, _this.canvas_$.height()]);
                });
                sizeAft = sizeBef+300;
                foldBinsButton.html("&raquo;");
            }
            _this.view.resizeZoom(1, 1, (sizeAft/sizeBef));
        },
        save: function() { },
        open: function() { }
    }).value();

    /* Scene End */

    return Scene;

});

define('renderer/viewrepr',['jquery', 'underscore', 'requtils', 'renderer/baserepresentation'], function ($, _, requtils, BaseRepresentation) {
    'use strict';

    var Utils = requtils.getUtils();

    /* Rkns.Renderer.View Class */

    /* The representation for the view. */

    var ViewRepr = Utils.inherit(BaseRepresentation);

    _(ViewRepr.prototype).extend({
        _init: function() {
            var _this = this;
            this.$ = $(".Rk-Render");
            this.type = "View";
            this.hiddenNodes = [];
            this.scale = 1;
            this.initialScale = 1;
            this.offset = paper.view.center;
            this.params = {};
            
            if (this.model){
                this.params = {
                    "zoom_level": _this.model.get("zoom_level"),
                    "offset": _this.model.get("offset"),
                    "hidden_nodes": _this.model.get("hidden_nodes")
                };
            }
                
            this.init();
            
            var bindClick = function(selector, fname) {
                _this.$.find(selector).click(function(evt) {
                    _this[fname](evt);
                    return false;
                });
            };
            
            bindClick(".Rk-ZoomOut", "zoomOut");
            bindClick(".Rk-ZoomIn", "zoomIn");
            bindClick(".Rk-ZoomFit", "autoScale");
            
            this.$.find(".Rk-ZoomSave").click( function() {
                var offset = {
                    "x": _this.offset.x,
                    "y": _this.offset.y
                };
                _this.model = _this.renkan.project.addView( { zoom_level:_this.scale, offset:offset, hidden_nodes: _this.hiddenNodes.concat() } );
                _this.params = {
                        "zoom_level": _this.model.get("zoom_level"),
                        "offset": _this.model.get("offset"),
                        "hidden_nodes": _this.model.get("hidden_nodes")
                };
                _this.updateUrl();
            });
            
            this.$.find(".Rk-ZoomSetSaved").click( function() {
                _this.model = _this.renkan.project.get("views").at(_this.renkan.project.get("views").length -1);
                _this.params = {
                        "zoom_level": _this.model.get("zoom_level"),
                        "offset": _this.model.get("offset"),
                        "hidden_nodes": _this.model.get("hidden_nodes")
                };
                _this.setScale(_this.params.zoom_level, new paper.Point(_this.params.offset));
                _this.showNodes(false);
                if (_this.options.hide_nodes){
                    _this.hiddenNodes = (_this.params.hidden_nodes || []).concat();
                    _this.hideNodes();
                }
                _this.updateUrl();
            });
            
            this.$.find(".Rk-ShowHiddenNodes").mouseenter( function() {
                _this.showNodes(true);
                _this.$.find(".Rk-ShowHiddenNodes").mouseleave( function() {
                    _this.hideNodes();
                });
            });
            this.$.find(".Rk-ShowHiddenNodes").click( function() {
                _this.showNodes(false);
                _this.$.find(".Rk-ShowHiddenNodes").off( "mouseleave" ); 
            });
            if(this.renkan.project.get("views").length > 0 && this.renkan.options.save_view){
                this.$.find(".Rk-ZoomSetSaved").show();
            }
        },
        redraw: function(options) {
            //console.log("view : ", this.model.toJSON());
        },
        init: function(){
            var _this = this;
            _this.setScale(_this.params.zoom_level, new paper.Point(_this.params.offset));
            
            if (_this.options.hide_nodes){
                _this.hiddenNodes = (_this.params.hidden_nodes || []).concat();
                _this.hideNodes();
            }
        },
        addHiddenNode: function(_model){
            this.hideNode(_model);
            this.hiddenNodes.push(_model.id);
            this.updateUrl();
        },
        hideNode: function(_model){
            if (typeof this.renderer.getRepresentationByModel(_model) !== 'undefined'){
                this.renderer.getRepresentationByModel(_model).hide();
            }
        },
        hideNodes: function(){
            var _this = this;
            this.hiddenNodes.forEach(function(_id, index){
                var node = _this.renkan.project.get("nodes").get(_id);
                if (typeof node !== 'undefined'){
                    return _this.hideNode(_this.renkan.project.get("nodes").get(_id));
                }else{
                    _this.hiddenNodes.splice(index, 1);
                }
            });
            paper.view.draw();
        },
        showNodes: function(ghost){
            var _this = this;
            this.hiddenNodes.forEach(function(_id){
                _this.renderer.getRepresentationByModel(_this.renkan.project.get("nodes").get(_id)).show(ghost);
            });
            if (!ghost){
                this.hiddenNodes = [];
            }
            paper.view.draw();
        },
        setScale: function(_newScale, _offset) {
            if ((_newScale/this.initialScale) > Utils._MIN_SCALE && (_newScale/this.initialScale) < Utils._MAX_SCALE) {
                this.scale = _newScale;
                if (_offset) {
                    this.offset = _offset;
                }
                this.renderer.redraw();
                this.updateUrl();
            }
        },
        zoomOut: function() {
            var _newScale = this.scale * Math.SQRT1_2,
            _offset = new paper.Point([
                                       this.renderer.canvas_$.width(),
                                       this.renderer.canvas_$.height()
                                       ]).multiply( 0.5 * ( 1 - Math.SQRT1_2 ) ).add(this.offset.multiply( Math.SQRT1_2 ));
            this.setScale( _newScale, _offset );
        },
        zoomIn: function() {
            var _newScale = this.scale * Math.SQRT2,
            _offset = new paper.Point([
                                       this.renderer.canvas_$.width(),
                                       this.renderer.canvas_$.height()
                                       ]).multiply( 0.5 * ( 1 - Math.SQRT2 ) ).add(this.offset.multiply( Math.SQRT2 ));
            this.setScale( _newScale, _offset );
        },
        resizeZoom: function(_scaleWidth, _scaleHeight, _ratio) {
            var _newScale = this.scale * _ratio,
                _offset = new paper.Point([
                                       (this.offset.x * _scaleWidth),
                                       (this.offset.y * _scaleHeight)
                                       ]);
            this.setScale( _newScale, _offset );
        },
        autoScale: function(force_view) {
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
                // Override calculated scale if asked
                if((typeof force_view !== "undefined") && parseFloat(force_view.zoom_level)>0 && parseFloat(force_view.offset.x)>0 && parseFloat(force_view.offset.y)>0){
                    this.setScale(parseFloat(force_view.zoom_level), new paper.Point(parseFloat(force_view.offset.x), parseFloat(force_view.offset.y)));
                }
                else{
                    this.setScale(_scale, paper.view.center.subtract(new paper.Point([(_maxx + _minx) / 2, (_maxy + _miny) / 2]).multiply(_scale)));
                }
            }
            if (nodes.length === 1) {
                this.setScale(1, paper.view.center.subtract(new paper.Point([nodes.at(0).get("position").x, nodes.at(0).get("position").y])));
            }
        },
        paperShift: function(_delta) {
            this.offset = this.offset.add(_delta);
            this.renderer.redraw();
        },
        updateUrl: function(){
            if(this.options.update_url){
                var result = {};
                var parameters = Backbone.history.getFragment().split('?');
                if (parameters.length > 1){
                    parameters[1].split("&").forEach(function(part) {
                        var item = part.split("=");
                        result[item[0]] = decodeURIComponent(item[1]);
                    });
                }
                result.view = Math.round(this.offset.x*1000)/1000 + ',' + Math.round(this.offset.y*1000)/1000 + ',' + Math.round(this.scale*1000)/1000;

                if (this.renkan.project.get("views").indexOf(this.model) > -1){
                    result.viewIndex = this.renkan.project.get("views").indexOf(this.model);
                    if (result.viewIndex === this.renkan.project.get("views").length - 1){
                        result.viewIndex = -1;
                    }
                } else {
                    if (result.viewIndex){
                        delete result.viewIndex;
                    }
                }
                this.renkan.router.navigate("?" + decodeURIComponent($.param(result)), {trigger: false, replace: true});
            }
        },
        destroy: function(_event) {
            this._super("destroy");
            this.showNodes(false);
        }
    }).value();

    return ViewRepr;

});


//Load modules and use them
if( typeof require.config === "function" ) {
    require.config({
        paths: {
            'jquery':'../lib/jquery/jquery',
            'underscore':'../lib/lodash/lodash',
            'filesaver' :'../lib/FileSaver/FileSaver',
            'requtils':'require-utils',
            'ckeditor-core':'../lib/ckeditor/ckeditor',
            'ckeditor-jquery':'../lib/ckeditor/adapters/jquery'
        },
        shim: {
            'ckeditor-jquery':{
                deps:['jquery','ckeditor-core']
            }
        },
    });
}

require(['renderer/baserepresentation',
         'renderer/basebutton',
         'renderer/noderepr',
         'renderer/edge',
         'renderer/tempedge',
         'renderer/baseeditor',
         'renderer/nodeeditor',
         'renderer/edgeeditor',
         'renderer/nodebutton',
         'renderer/nodeeditbutton',
         'renderer/noderemovebutton',
         'renderer/nodehidebutton',
         'renderer/nodeshowbutton',
         'renderer/noderevertbutton',
         'renderer/nodelinkbutton',
         'renderer/nodeenlargebutton',
         'renderer/nodeshrinkbutton',
         'renderer/edgeeditbutton',
         'renderer/edgeremovebutton',
         'renderer/edgerevertbutton',
         'renderer/miniframe',
         'renderer/scene',
         'renderer/viewrepr'
         ], function(BaseRepresentation, BaseButton, NodeRepr, Edge, TempEdge, BaseEditor, NodeEditor, EdgeEditor, NodeButton, NodeEditButton, NodeRemoveButton, NodeHideButton, NodeShowButton, NodeRevertButton, NodeLinkButton, NodeEnlargeButton, NodeShrinkButton, EdgeEditButton, EdgeRemoveButton, EdgeRevertButton, MiniFrame, Scene, ViewRepr){

    'use strict';

    var Rkns = window.Rkns;

    if(typeof Rkns.Renderer === "undefined"){
        Rkns.Renderer = {};
    }
    var Renderer = Rkns.Renderer;

    Renderer._BaseRepresentation = BaseRepresentation;
    Renderer._BaseButton = BaseButton;
    Renderer.Node = NodeRepr;
    Renderer.Edge = Edge;
    Renderer.View = ViewRepr;
    Renderer.TempEdge = TempEdge;
    Renderer._BaseEditor = BaseEditor;
    Renderer.NodeEditor = NodeEditor;
    Renderer.EdgeEditor = EdgeEditor;
    Renderer._NodeButton = NodeButton;
    Renderer.NodeEditButton = NodeEditButton;
    Renderer.NodeRemoveButton = NodeRemoveButton;
    Renderer.NodeHideButton = NodeHideButton;
    Renderer.NodeShowButton = NodeShowButton;
    Renderer.NodeRevertButton = NodeRevertButton;
    Renderer.NodeLinkButton = NodeLinkButton;
    Renderer.NodeEnlargeButton = NodeEnlargeButton;
    Renderer.NodeShrinkButton = NodeShrinkButton;
    Renderer.EdgeEditButton = EdgeEditButton;
    Renderer.EdgeRemoveButton = EdgeRemoveButton;
    Renderer.EdgeRevertButton = EdgeRevertButton;
    Renderer.MiniFrame = MiniFrame;
    Renderer.Scene = Scene;

    startRenkan();
});

define("main-renderer", function(){});

