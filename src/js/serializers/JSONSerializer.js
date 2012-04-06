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
IriSP.JSONSerializer.prototype.sync = function(callback, force_refresh) {
  /* we don't have to do much because jQuery handles json for us */

  var self = this;

  var fn = function(data) {
	  //TODO: seems taht data can be null here
	  if (data !== null) {
		  self._data = data;  
	      if (typeof(self._data["annotations"]) === "undefined" ||
	          self._data["annotations"] === null)
	          self._data["annotations"] = [];
	      
	      // sort the data too       
	      self._data["annotations"].sort(function(a, b) 
	          { var a_begin = +a.begin;
	            var b_begin = +b.begin;
	            return a_begin - b_begin;
	          });
	  }     
      callback(data);      
  };
  this._DataLoader.get(this._url, fn, force_refresh);
};

/** @return the metadata about the media being read FIXME: always return the first media. */
IriSP.JSONSerializer.prototype.currentMedia = function() {  
  return (typeof this._data.medias == "object" && this._data.medias.length) ? this._data.medias[0] : IriSP.__jsonMetadata.medias[0];
};

IriSP.JSONSerializer.prototype.getDuration = function() {
    var _m = this.currentMedia();
    if (_m === null || typeof _m.meta == "undefined") {
        return 0;
    }
    return +(IriSP.get_aliased(_m.meta, ["dc:duration", "duration"]) || 0);
}


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
    
    var searchViewType = this.getTweets();
    if (typeof(searchViewType) === "undefined") {
      var view;
      
      if (typeof(this._data.views) !== "undefined" && this._data.views !== null)
         view = this._data.views[0];    

      if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
              searchViewType = view.annotation_types[0];
      }
    }
    var filterfn = function(annotation) {
      if( searchViewType  != "" && 
          typeof(annotation.meta) !== "undefined" && 
          typeof(annotation.meta["id-ref"]) !== "undefined" &&
          annotation.meta["id-ref"] === searchViewType) {
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

/** return the current chapitre
    @param currentTime the current time, in seconds.
*/
IriSP.JSONSerializer.prototype.currentChapitre = function(currentTime) {
  return this.currentAnnotations(currentTime, this.getChapitrage())[0];
};

/** returns a list of ids of tweet lines (aka: groups in cinelab) */
IriSP.JSONSerializer.prototype.getTweetIds = function() {
  if (IriSP.null_or_undefined(this._data.lists) || IriSP.null_or_undefined(this._data.lists) ||
      IriSP.null_or_undefined(this._data.views) || IriSP.null_or_undefined(this._data.views[0]))
    return [];

  
  /* Get the displayable types
     We've got to jump through a few hoops because the json sometimes defines
     fields with underscores and sometimes with dashes
  */
  var annotation_types = IriSP.get_aliased(this._data.views[0], ["annotation_types", "annotation-types"]);
  if (annotation_types === null) {
      console.log("neither view.annotation_types nor view.annotation-types are defined");      
      return;
  }

  var available_types = IriSP.get_aliased(this._data, ["annotation_types", "annotation-types"]);    
  if (available_types === null) {
      console.log("neither view.annotation_types nor view.annotation-types are defined");      
      return;
  }
  
  var potential_types = [];
  
  // Get the list of types which contain "Tw" in their content
  for (var i = 0; i < available_types.length; i++) {
    if (/Tw/i.test(IriSP.get_aliased(available_types[i], ['dc:title', 'title']))) {
      potential_types.push(available_types[i].id);
    }
  }
  
  // Get the intersection of both.
  var tweetsId = IriSP.underscore.intersection(annotation_types, potential_types);
  
  return tweetsId;
};

/** this function returns a list of lines which are not tweet lines */
IriSP.JSONSerializer.prototype.getNonTweetIds = function() {
  if (IriSP.null_or_undefined(this._data.lists) || IriSP.null_or_undefined(this._data.lists) ||
      IriSP.null_or_undefined(this._data.views) || IriSP.null_or_undefined(this._data.views[0]))
    return [];

  /* Get the displayable types
     We've got to jump through a few hoops because the json sometimes defines
     fields with underscores and sometimes with dashes
  */
  var annotation_types = IriSP.get_aliased(this._data.views[0], ["annotation_types", "annotation-types"]);
  if (annotation_types === null) {
      console.log("neither view.annotation_types nor view.annotation-types are defined");      
      return;
  }

  var available_types = IriSP.get_aliased(this._data, ["annotation_types", "annotation-types"]);    
  if (available_types === null) {
      console.log("neither view.annotation_types nor view.annotation-types are defined");      
      return;
  }

  var potential_types = [];
  
  // Get the list of types which do not contain "Tw" in their content
  for (var i = 0; i < available_types.length; i++) {
    if (!(/Tw/i.test(IriSP.get_aliased(available_types[i], ['dc:title', 'title'])))) {
      potential_types.push(available_types[i].id);
    }
  }

  // Get the intersection of both.
  var nonTweetsId = IriSP.underscore.intersection(annotation_types, potential_types);
  
  return nonTweetsId;
  
};

/** return the id of the ligne de temps which contains name
    @param name of the ligne de temps
*/
IriSP.JSONSerializer.prototype.getId = function(name) {
   var available_types = IriSP.get_aliased(this._data, ["annotation_types", "annotation-types"]);  
   
  if (available_types == null)
    return;

  name = name.toUpperCase();
  var e;  
  e = IriSP.underscore.find(available_types, 
    function(entry) {
        if (IriSP.get_aliased(entry, ['dc:title', 'title']) === null)
          return false;
        return (entry["dc:title"].toUpperCase().indexOf(name) !== -1);
    });
  
  if (typeof(e) === "undefined")
    return;
    
  var id = e.id;

  return id;
};

/** return the list of id's of the ligne de temps which contains name
    @param name of the ligne de temps
*/
IriSP.JSONSerializer.prototype.getIds = function(name) {
   var available_types = IriSP.get_aliased(this._data, ["annotation_types", "annotation-types"]);  
   
  if (available_types == null)
    return;

  name = name.toUpperCase();
  var e = [];  
  e = IriSP.underscore.filter(available_types, 
                                  function(entry) { return (IriSP.get_aliased(entry, ['dc:title', 'title']).toUpperCase().indexOf(name) !== -1) });
  return IriSP.underscore.pluck(e, "id");  
};

/** return the id of the ligne de temps named "Chapitrage" */
IriSP.JSONSerializer.prototype.getChapitrage = function() {
  var val = this.getId("Chapitrage");
  if (typeof(val) === "undefined")
    val = this.getId("Chapter");   
  if (typeof(val) === "undefined")
    val = this.getId("Chapit");
  if (typeof(val) === "undefined")
    val = this.getId("Chap");
    
  return val;
};

/** return the id of the ligne de temps named "Tweets" */
IriSP.JSONSerializer.prototype.getTweets = function() {
  var val = this.getId("Tweets");
  if (typeof(val) === "undefined")
    val = this.getId("Tweet");
  if (typeof(val) === "undefined")
    val = this.getId("Twitter");
  if (typeof(val) === "undefined")
    val = this.getId("twit");
  if (typeof(val) === "undefined")
    val = this.getId("Polemic");
  
  return val;
};

/** return the id of the ligne de temps named "Contributions" */
IriSP.JSONSerializer.prototype.getContributions = function() {
  var val = this.getId("Contribution");
  if (typeof(val) === "undefined")
    val = this.getId("Particip");   
  if (typeof(val) === "undefined")
    val = this.getId("Contr");
  if (typeof(val) === "undefined")
    val = this.getId("Publ");
    
  return val;
};