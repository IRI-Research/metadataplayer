/* Initialization of the namespace */

if (typeof window.IriSP === "undefined") {
    window.IriSP = {};
}

if (typeof IriSP.jQuery === "undefined" && typeof window.jQuery !== "undefined" && parseFloat(window.jQuery().jquery) >= 1.7) {
    IriSP.jQuery = window.jQuery;
}

if (typeof IriSP._ === "undefined" && typeof window._ !== "undefined" && parseFloat(window._.VERSION) >= 1.4) {
    IriSP._ = window._;
}
