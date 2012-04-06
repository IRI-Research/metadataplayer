/* embed module - listens and relay hash changes to a parent window. */

IriSP.EmbedModule = function(Popcorn, config, Serializer) {
  IriSP.Module.call(this, Popcorn, config, Serializer);

  window.addEventListener('message', IriSP.wrap(this, this.handleMessages), false);
  this._Popcorn.listen("IriSP.Mediafragment.hashchange", IriSP.wrap(this, this.relayChanges));
};

IriSP.EmbedModule.prototype = new IriSP.Module();

IriSP.EmbedModule.prototype.handleMessages = function(e) {
  if (e.data.type === "hashchange") {
    window.location.hash = e.data.value;    
  }  
};

IriSP.EmbedModule.prototype.relayChanges = function(newHash) {
  window.parent.postMessage({type: "hashchange", value: newHash}, "*"); 
  return;
};