/* utils.js - various utils that don't belong anywhere else */

IriSP.jqEscape = function(_text) {
    return text.replace(/(:|\.)/g,'\\$1');
}

IriSP.getLib = function(lib) {
    if (IriSP.libFiles.useCdn && typeof IriSP.libFiles.cdn[lib] == "string") {
        return IriSP.libFiles.cdn[lib];
    }
    if (typeof IriSP.libFiles.locations[lib] == "string") {
        return IriSP.libFiles.locations[lib];
    }
    if (typeof IriSP.libFiles.inDefaultDir[lib] == "string") {
        return IriSP.libFiles.defaultDir + '/' + IriSP.libFiles.inDefaultDir[lib];
    }
}

IriSP.loadCss = function(_cssFile) {
    IriSP.jQuery("<link>", {
        rel : "stylesheet",
        type : "text/css",
        href : _cssFile
    }).appendTo('head');
}