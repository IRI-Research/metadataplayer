/* main file */
// Why is it called main ? It only loads the libs !

if(window.IriSP === undefined && window.__IriSP === undefined) {
    /**
     @class
     the object under which everything goes.
     */
    IriSP = {};

    /** Alias to IriSP for backward compatibility */
    __IriSP = IriSP;
}

/* underscore comes bundled with the player and we need
 it ASAP, so load it that way
 */

IriSP._ = window._.noConflict();
IriSP.underscore = IriSP._;

IriSP.getLib = function(lib) {
    return (
        IriSP.libFiles.useCdn && typeof IriSP.libFiles.cdn[lib] == "string"
        ? IriSP.libFiles.cdn[lib]
        : (
            typeof IriSP.libFiles.locations[lib] == "string"
            ? IriSP.libFiles.locations[lib]
            : (
                typeof IriSP.libFiles.inDefaultDir[lib] == "string"
                ? IriSP.libFiles.defaultDir + IriSP.libFiles.inDefaultDir[lib]
                : null
            )
        )
    )
}
