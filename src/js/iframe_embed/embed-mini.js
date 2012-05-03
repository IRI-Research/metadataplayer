(function(a) {var b=document.location,c=b.getElementById(a),d=window,e="hashchange";
d.onhashchange=function(){c.contentWindow.postMessage({type:e,hash:b.hash},"*");};
d.addEventListener('message',function(f){g=f.data;if(g.type===e){b.hash=g.hash;}});    
})("metadataplayer_embed");
