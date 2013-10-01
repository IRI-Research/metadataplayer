/* Initialization of the namespace */

if (typeof window.IriSP === "undefined") {
    window.IriSP = {
        VERSION: "0.3.2"
    };
}

if (typeof IriSP.jQuery === "undefined" && typeof window.jQuery !== "undefined") {
    var jvp = window.jQuery().jquery.split("."),
        jv = 100 * parseInt(jvp[0]) + parseInt(jvp[1]);
    if (jv > 170) {
        IriSP.jQuery = window.jQuery;
    }
}

if (typeof IriSP._ === "undefined" && typeof window._ !== "undefined" && parseFloat(window._.VERSION) >= 1.4) {
    IriSP._ = window._;
}
