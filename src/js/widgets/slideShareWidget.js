
/** A widget to display slide show from embed slide share */
IriSP.SlideShareWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};

IriSP.SlideShareWidget.prototype = new IriSP.Widget();

IriSP.SlideShareWidget.prototype.draw = function() {
  var self = this;
  
  // If the div supposed to host the slides does not exist, we cancel
  if(this.selector.length==0){
	  if(console){ if(console.log){ console.log("No div for slideshare widget, this widget is canceled. id = " + this._id); } }
	  return;
  }
  var templ = Mustache.to_html(IriSP.slideShareWidget_template);
  this.selector.append(templ);
  
  // Synchro management
  this._disableUpdate = false;
  this.selector.find('.sync_on').click(function(event) { self.syncHandler.call(self, event); });
  this.selector.find('.sync_off').click(function(event) { self.unSyncHandler.call(self, event); });
  
  // global variables used to keep the position and width of the zone.  
  this.zoneLeft = 0;
  this.zoneWidth = 0;
  // global variable to save the last slide url
  this.lastSSFullUrl = "";
  this.lastSSUrl = "";
  this.lastSSId = "";
  this.containerDiv = this.selector.find('.SlideShareContainer');
  
  // Update the slide from timeupdate event
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.slideShareUpdater));
  
  this._Popcorn.listen("IriSP.SlideShareWidget.show", IriSP.wrap(this, this.show));
  this._Popcorn.listen("IriSP.SlideShareWidget.hide", IriSP.wrap(this, this.hide));
  
  // Get data from "slideshare" cutting/annotation-type
  var annotations = this._serializer._data.annotations;
  var view_type = this._serializer.getSlideShareType();
  if(typeof(view_type) === "undefined") {
	  if(console){ if(console.log){ console.log("No annotation-type for slideshare widget, this widget is canceled and the container is visible hidden."); } }
	  this.selector.hide();
	  return;
  }
  var i = 0;
  this.segments_slides = [];
  var nb_annot = annotations.length;
  for (i = 0; i < nb_annot; i++) {
    var annotation = annotations[i];
    /* filter the annotations whose type is not the one we want */
    if (view_type != "" && typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && annotation.meta["id-ref"] != view_type) {
        continue;
    }
    this.segments_slides.push(annotation);
  }
};

/* update the slider and the position marker as time passes */
IriSP.SlideShareWidget.prototype.slideShareUpdater = function() {
  // If it is asked not to synchronize, we do nothing
  if(this._disableUpdate)
    return;
  
  var self = this;
  
  // We search if a segments_slides is in the current timecode
  var time = this._Popcorn.currentTime() * 1000;
  var nb_slides = this.segments_slides.length;
  var forceEmpty = false;
  for (i = 0; i < nb_slides; i++) {
    var segment_slide = this.segments_slides[i];
    if(segment_slide.begin<time && time<segment_slide.end){
    	if(segment_slide.content.description!=this.lastSSFullUrl){
			// The url is like http://stuf.com#X and X is the slide number. So we split and save it.
    		this.lastSSFullUrl = segment_slide.content.description;
    		if(this.lastSSFullUrl==""){
    			// We force unload
    			forceEmpty = true;
    		}
    		else{
	    		var description_ar = this.lastSSFullUrl.split("#id=");
	    		var slideNb = 1;
	    		if(description_ar[1]){
	    			slideNb = description_ar[1];
	    		}
	    		if(description_ar[0]!=this.lastSSUrl && description_ar[0].substring(0,7)=="http://"){
	    			this.lastSSUrl = description_ar[0];
		    		// We have the slideshare oembed url (version 1 because we want the flash embed).
		    		var url = "http://www.slideshare.net/api/oembed/1?format=jsonp&url=" + this.lastSSUrl;
		    		
		    		IriSP.jQuery.ajax({
						url: url,
						dataType: "jsonp",
						success: function(data) {
							self.lastSSId = data["slideshow_id"];
							embed_code = data["html"];
							// If slideNb exist, we hack the embed code to add ?startSlide=X
							if(slideNb){
								embed_code = embed_code.replace(new RegExp("ssplayer2.swf\\?","g"), "ssplayer2.swf?startSlide=" + slideNb + "&");
							}
							self.containerDiv.html(embed_code);
						},
						error: function(jqXHR, textStatus, errorThrown){
							self.containerDiv.html("Error while downloading the slideshow. jqXHR = " + jqXHR + ", textStatus = " + textStatus + ", errorThrown = " + errorThrown);
						}
		    		});
	    		}
	    		else if(description_ar[0]!=this.lastSSUrl){
	    			this.lastSSUrl = description_ar[0];
	    			this.lastSSId = "";
		    		// In this case, we only have an id that is meant to build the flash embed
					embed_code = '<div style="width:425px"><embed src="http://static.slidesharecdn.com/swf/ssplayer2.swf?doc=' + this.lastSSUrl + '&startSlide=' + slideNb + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="transparent" width="425" height="355"></embed></div>';
					self.containerDiv.html(embed_code);
	    		}
	    		else{
	    			// If the presentation was already loaded, we only use the ss js api to load the wanted slide number
	    			var embed = null;
	    			if(this.lastSSId!=""){
	    				// If the presentation was loaded from a public url, we get the div from its id.
						embed = document.getElementsByName("__sse" + this.lastSSId)[0];
	    			}
	    			else if(this.lastSSUrl.substring(0,7)!="http://"){
	    				// If the presentation was loaded from a private id, we get the div from dom tree.
	    				embed = this.containerDiv.children()[0].children[0];
	    			}
					if(embed){
						embed.jumpTo(parseInt(slideNb));
					}
	    		}
	    		return;
    		}
    	}
    }
  }
  if(forceEmpty==true){
	this.lastSSFullUrl = "";
	this.lastSSUrl = "";
	this.lastSSId = "";
  	this.containerDiv.html("");
  }

};

// Functions to stop or trigger sync between timeupdate event and slides        
IriSP.SlideShareWidget.prototype.unSyncHandler = function(params) {
	//console.log("slideShare NO SYNC !");
	this._disableUpdate = true;
};
IriSP.SlideShareWidget.prototype.syncHandler = function(params) {
	//console.log("slideShare SYNC PLEASE !");
	this._disableUpdate = false;
};


/** responds to an "IriSP.SlideShareWidget.position" message
    @param params an array with the first element being the left distance in
           percents and the second element the width of the slice in pixels
*/        
IriSP.SlideShareWidget.prototype.positionSlideShareHandler = function(params) {
  //console.log("positionSlideShareHandler");
};


IriSP.SlideShareWidget.prototype.show = function() {
  this.selector.show();
};

IriSP.SlideShareWidget.prototype.hide = function() {
  this.selector.hide();
};
