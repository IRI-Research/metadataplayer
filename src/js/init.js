/* Initialization of the namespace */

if (typeof window.IriSP === "undefined") {
    window.IriSP = {};
}

if (typeof IriSP.jQuery === "undefined" && typeof window.jQuery !== "undefined") {
    IriSP.jQuery = window.jQuery;
}

if (typeof IriSP._ === "undefined" && typeof window._ !== "undefined") {
    IriSP._ = window._;
}
