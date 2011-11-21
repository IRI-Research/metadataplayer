/* data.js - this file deals with how the players gets and sends data */

IriSP.DataLoader = function() {
  this._cache = {};
  
  /*
    A structure to hold callbacks for specific urls. We need it because
    ajax calls are asynchronous, so it means that sometimes we ask
    multiple times for a ressource because the first call hasn't been
    received yet.
  */
  this._callbacks = {};
};

IriSP.DataLoader.prototype.get = function(url, callback) {

  var base_url = url.split("&")[0]
  if (this._cache.hasOwnProperty(base_url)) {
    callback(this._cache[base_url]);
  } else {  
    if (!this._callbacks.hasOwnProperty(base_url)) {
      this._callbacks[base_url] = [];
      this._callbacks[base_url].push(callback);   
      /* we need a closure because this gets lost when it's called back */
  
      // uncomment you don't want to use caching.
      // IriSP.jQuery.get(url, callback);
      
      var func = function(data) {
                  this._cache[base_url] = data;                                
                  var i = 0;
                  
                  for (i = 0; i < this._callbacks[base_url].length; i++) {
                    this._callbacks[base_url][i](this._cache[base_url]);                                  
                  }
      };
      
      IriSP.jQuery.get(url, IriSP.wrap(this, func));                                
    
    } else {
      /* simply push the callback - it'll get called when the ressource
         has been received */
      
      this._callbacks[base_url].push(callback);   
   
    }
  }
}

/* the base abstract "class" */
IriSP.Serializer = function(DataLoader, url) {
  this._DataLoader = DataLoader;
  this._url = url;
  this._data = [];
};

IriSP.Serializer.prototype.serialize = function(data) { };
IriSP.Serializer.prototype.deserialize = function(data) {};

IriSP.Serializer.prototype.currentMedia = function() {  
};

IriSP.Serializer.prototype.sync = function(callback) {  
  callback.call(this, this._data);  
};

IriSP.SerializerFactory = function(DataLoader) {
  this._dataloader = DataLoader;
};

IriSP.SerializerFactory.prototype.getSerializer = function(metadataOptions) {
  /* This function returns serializer set-up with the correct
     configuration - takes a metadata struct describing the metadata source
  */
  
  if (metadataOptions === undefined)
    /* return an empty serializer */
    return IriSP.Serializer("", "");
            
  switch(metadataOptions.type) {
    case "json":
      return new IriSP.JSONSerializer(this._dataloader, metadataOptions.src);
      break;
    
    case "dummy": /* only used for unit testing - not defined in production */
      return new IriSP.MockSerializer(this._dataloader, metadataOptions.src);
      break;
    
    case "empty":
      return new IriSP.Serializer("", "empty");
      break;
      
    default:      
      return undefined;
  }
};
