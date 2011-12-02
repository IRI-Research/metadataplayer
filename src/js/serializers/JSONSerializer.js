
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
   Note: it ignores tweets.
*/    
IriSP.JSONSerializer.prototype.searchAnnotations = function(title, description, keyword) {
    /* we can have many types of annotations. We want search to only look for regular segments */
    /* the next two lines are a bit verbose because for some test data, _serializer.data.view is either
       null or undefined.
    */
    var view;

    if (typeof(this._data.views) !== "undefined" && this._data.views !== null)
       view = this._data.views[0];

    var searchViewType = "";

    if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
            searchViewType = view.annotation_types[0];
    }

    var filterfn = function(annotation) {
      if( searchViewType  != "" && 
          typeof(annotation.meta) !== "undefined" && 
          typeof(annotation.meta["id-ref"]) !== "undefined" &&
          annotation.meta["id-ref"] !== searchViewType) {
        return true; // don't pass
      } else {
          return false;
      }
    };

    return this.searchAnnotationsFilter(title, description, keyword, filterfn);

};

/* only look for tweets */
IriSP.JSONSerializer.prototype.searchTweets = function(title, description, keyword) {
    /* we can have many types of annotations. We want search to only look for regular segments */
    /* the next two lines are a bit verbose because for some test data, _serializer.data.view is either
       null or undefined.
    */
    var view;

    if (typeof(this._data.views) !== "undefined" && this._data.views !== null)
       view = this._data.views[0];

    var searchViewType = "";

    if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
            searchViewType = view.annotation_types[0];
    }

    var filterfn = function(annotation) {
      if( searchViewType  != "" && 
          typeof(annotation.meta) !== "undefined" && 
          typeof(annotation.meta["id-ref"]) !== "undefined" &&
          annotation.meta["id-ref"] !== searchViewType) {
        return false; // pass
      } else {
          return true;
      }
    };

    return this.searchAnnotationsFilter(title, description, keyword, filterfn);

};

/*
  the previous function call this one, which is more general:
 */    
IriSP.JSONSerializer.prototype.searchAnnotationsFilter = function(title, description, keyword, filter) {

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
      
      /* filter the annotations whose type is not the one we want */
      if (filter(annotation)) {
          continue;
      }
      
      if (rTitle.test(annotation.content.title) && 
          rDescription.test(annotation.content.description)) {
          /* FIXME : implement keyword support */
          ret_array.push(annotation);
      }
    }
    
    return ret_array;
};

/* breaks a string in words and searches each of these words. Returns an array
   of objects with the id of the annotation and its number of occurences.
   
   FIXME: optimize ? seems to be n^2 in the worst case.
*/
IriSP.JSONSerializer.prototype.searchOccurences = function(searchString) {
  var ret = { };
  var keywords = searchString.split(/\s+/);
  
  for (var i in keywords) {
    var keyword = keywords[i];
    
    // search this keyword in descriptions and title
    var found_annotations = []
    found_annotations = found_annotations.concat(this.searchAnnotations(keyword, "", ""));
    found_annotations = found_annotations.concat(this.searchAnnotations("", keyword, ""));
    
    for (var j in found_annotations) {
      var current_annotation = found_annotations[j];
      
      if (!ret.hasOwnProperty(current_annotation.id)) {
        ret[current_annotation.id] = 1;
      } else {
        ret[current_annotation.id] += 1;
      }
      
    }

  };
  
  return ret;
};

/* breaks a string in words and searches each of these words. Returns an array
   of objects with the id of the annotation and its number of occurences.
   
   FIXME: optimize ? seems to be n^2 in the worst case.
*/
IriSP.JSONSerializer.prototype.searchTweetsOccurences = function(searchString) {
  var ret = { };
  var keywords = searchString.split(/\s+/);
  
  for (var i in keywords) {
    var keyword = keywords[i];
    
    // search this keyword in descriptions and title
    var found_annotations = []
    found_annotations = found_annotations.concat(this.searchTweets(keyword, "", ""));
    found_annotations = found_annotations.concat(this.searchTweets("", keyword, ""));
    
    for (var j in found_annotations) {
      var current_annotation = found_annotations[j];
      
      if (!ret.hasOwnProperty(current_annotation.id)) {
        ret[current_annotation.id] = 1;
      } else {
        ret[current_annotation.id] += 1;
      }
      
    }

  };
  
  return ret;
};

/* takes the currentTime and returns all the annotations that are displayable at the moment 
   NB: only takes account the first type of annotations - ignores tweets 
   currentTime is in seconds.
 */

IriSP.JSONSerializer.prototype.currentAnnotations = function(currentTime) {
  var view;
  var currentTimeMs = 1000 * currentTime;

  if (typeof(this._data.views) !== "undefined" && this._data.views !== null)
     view = this._data.views[0];

  var view_type = "";

  if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length >= 1) {
          view_type = view.annotation_types[0];
  }

  var ret_array = [];
  
  var i;
 
  for (i in this._data.annotations) {
    var annotation = this._data.annotations[i];
    
    if (annotation.meta["id-ref"] === view_type && annotation.begin <= currentTimeMs && annotation.end >= currentTimeMs)
      ret_array.push(annotation);
  }

  return ret_array;
};
