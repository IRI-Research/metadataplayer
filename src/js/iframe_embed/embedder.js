/* This piece of code is directly requested by the page the player is embedded
   on. It creates the iframe the player is embedded in and it reflects changes
   to the iframe url in the page url.   
*/

(function(_frameId) {
    var _frame = document.getElementById(_frameId);
    
    window.onhashchange = function() {
        frame.contentWindow.postMessage({type: "hashchange", hash: hashvalue}, "*");
    };

    window.addEventListener('message', function(_e) {
        if (e.data.type === "hashchange") {
            document.location.hash = e.data.hash;
        }
    });
    
})("metadataplayer_embed");
