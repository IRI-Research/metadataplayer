/** @class This class implement a serializer for the JSON-Cinelab format
    @params DataLoader a dataloader reference
    @url the url from which to get our cinelab
 */
IriSP.JSONSerializer = function(DataLoader, url) {
  IriSP.Serializer.call(this, DataLoader, url);
};

IriSP.JSONSerializer.prototype = new IriSP.Serializer();

/** serialize data */
IriSP.JSONSerializer.prototype.serialize = function(data) {
  return JSON.stringify(data);
};

/** deserialize data */
IriSP.JSONSerializer.prototype.deserialize = function(data) {
  return JSON.parse(data);
};

/** load JSON-cinelab data and also sort the annotations by start time
    @param callback function to call when the data is ready.
 */
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

/** @return the metadata about the media being read FIXME: always return the first media. */
IriSP.JSONSerializer.prototype.currentMedia = function() {  
  return this._data.medias[0]; /* FIXME: don't hardcode it */
};

/** searches for an annotation which matches title, description and keyword 
   "" matches any field. 
   Note: it ignores tweets.
   @return a list of matching ids.
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

/**
  search an annotation according to its title, description and keyword
  @param filter a function to filter the results with. Used to select between annotation types.
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

/** breaks a string in words and searches each of these words. Returns an array
   of objects with the id of the annotation and its number of occurences.
   
   @param searchString a string of words.
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

/** breaks a string in words and searches each of these words. Returns an array
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

/** returns all the annotations that are displayable at the moment 
   NB: only takes account the first type of annotations - ignores tweets 
   currentTime is in seconds.
   
   @param currentTime the time at which we search.
   @param (optional) the if of the type of the annotations we want to get.
 */

IriSP.JSONSerializer.prototype.currentAnnotations = function(currentTime, id) {
  var view;
  var currentTimeMs = 1000 * currentTime;

  if (typeof(id) === "undefined") {
      var legal_ids = this.getNonTweetIds();
  } else {
      legal_ids = [id];
  }
  
  var ret_array = [];
  
  var i;
  
  for (i in this._data.annotations) {
    var annotation = this._data.annotations[i];
    
    if (IriSP.underscore.include(legal_ids, annotation.meta["id-ref"]) && 
        annotation.begin <= currentTimeMs &&
        annotation.end >= currentTimeMs)
          ret_array.push(annotation);
  }
 
  if (ret_array == []) {
    console.log("ret_array empty, ", legal_ids);
  }
  
  return ret_array;
};


/** returns a list of ids of tweet lines (aka: groups in cinelab) */
IriSP.JSONSerializer.prototype.getTweetIds = function() {
  if (typeof(this._data.lists) === "undefined" || this._data.lists === null)
    return [];

  var tweetsId = [];
  
  /* first get the list containing the tweets */
  var tweets = IriSP.underscore.filter(this._data.lists, function(entry) { return entry.id.indexOf("tweet") !== -1 });
  
  if (tweets.length === 0)
    return [];
  
  // FIXME: collect tweets from multiple sources ?
  tweetsId = IriSP.underscore.pluck(tweets[0].items, "id-ref");

  return tweetsId;
};

/** this function returns a list of lines which are not tweet lines */
IriSP.JSONSerializer.prototype.getNonTweetIds = function() {
  if (typeof(this._data.lists) === "undefined" || this._data.lists === null)
    return [];
  
  /* complicated : for each list in this._data.lists, get the id-ref.
     flatten the returned array because pluck returns a string afterwards.
  */
  var ids = IriSP.underscore.flatten(IriSP.underscore.map(this._data.lists, function(entry) {                                                         
                                                         return IriSP.underscore.pluck(entry.items, "id-ref"); }));
                                                         
  var illegal_values = this.getTweetIds();
  return IriSP.underscore.difference(ids, illegal_values);
  
};

/** return the id of the ligne de temps which contains name
    @param name of the ligne de temps
*/
IriSP.JSONSerializer.prototype.getId = function(name) {
  if (typeof(this._data.lists) === "undefined" || this._data.lists === null)
    return;

  var e;
  /* first get the list containing the tweets */
  e = IriSP.underscore.find(this._data["annotation-types"], 
                                  function(entry) { return (entry["dc:title"].indexOf(name) !== -1) });
  
  if (typeof(e) === "undefined")
    return;
    
  var id = e.id;

  return id;
};

/** return the id of the ligne de temps named "Chapitrage" */
IriSP.JSONSerializer.prototype.getChapitrage = function() {
  return this.getId("Chapitrage");
};

/** return the id of the ligne de temps named "Tweets" */
IriSP.JSONSerializer.prototype.getTweets = function() {
  return this.getId("Tweets");
};

/** return the id of the ligne de temps named "Contributions" */
IriSP.JSONSerializer.prototype.getContributions = function() {
  return this.getId("Contributions");
};
