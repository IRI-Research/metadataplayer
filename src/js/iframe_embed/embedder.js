/* This piece of code is directly requested by the page the player is embedded
   on. It creates the iframe the player is embedded in and it reflects changes
   to the iframe url in the page url.   
*/

if (typeof IriSP === "undefined") {
    IriSP = {};
}

IriSP.iFrameUpdater = function(_frameId) {
    
    var _frame = document.getElementById(_frameId),
        _blocked = false,
        _updater = function() {
            _blocked = true;
            window.setTimeout(function() {
                _blocked = false;
            }, 1000);
            _frame.contentWindow.postMessage(document.location.hash, "*");
        };
    
    window.onhashchange = _updater;
    
    window.addEventListener('message', function(_e) {
        if (/^#/.test(_e.data) && !_blocked) {
            if (typeof window.history !== "undefined" && typeof window.history.replaceState !== "undefined") {
                window.history.replaceState({}, "", _e.data);
            } else {
                document.location.hash = _e.data;
            }
        }
    });
    
    window.setTimeout(_updater, 2000);
    
};
