
IriSP.JSONSerializer = function(DataLoader, url) {
  IriSP.Serializer.call(this, DataLoader, url);
};

IriSP.JSONSerializer.prototype = new IriSP.Serializer();

IriSP.JSONSerializer.prototype.serialize = function(data) {
  return JSON.stringify(data);
};

IriSP.JSONSerializer.prototype.deserialize = function(data) {
  return JSON.parse(data);
};

IriSP.JSONSerializer.prototype.sync = function(callback) {
  /* we don't have to do much because jQuery handles json for us */

  var self = this;

  var fn = function(data) {      
      self._data = data;      
      // sort the data too     
      self._data["annotations"].sort(function(a, b) 
          { var a_begin = +a.begin;
            var b_begin = +b.begin;
            return a_begin - b_begin;
          });
     
      callback(data);      
  };
  
  this._DataLoader.get(this._url, fn);
};

IriSP.JSONSerializer.prototype.currentMedia = function() {  
  return this._data.medias[0]; /* FIXME: don't hardcode it */
};

/* this function searches for an annotation which matches title, description and keyword 
   "" matches any field. 
*/    
IriSP.JSONSerializer.prototype.searchAnnotations = function(title, description, keyword) {
    var rTitle;
    var rDescription;
    var rKeyword;
    
    /* match anything if given the empty string */
    if (title == "")
      title = ".*";
    if (description == "")
      description = ".*";
    if (keyword == "")
      keyword = ".*";
    
    rTitle = new RegExp(title, "i");  
    rDescription = new RegExp(description, "i");  
    rKeyword = new RegExp(keyword, "i");  
    
    var ret_array = [];
    
    var i;
    for (i in this._data.annotations) {
      var annotation = this._data.annotations[i];
      
      if (rTitle.test(annotation.content.title) && 
          rDescription.test(annotation.content.description)) {
          /* FIXME : implement keyword support */
          ret_array.push(annotation);
      }
    }
    
    return ret_array;
}