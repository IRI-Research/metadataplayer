
/** A widget to display slide show from embed slide share */
IriSP.SlideShareWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};

IriSP.SlideShareWidget.prototype = new IriSP.Widget();

IriSP.SlideShareWidget.prototype.draw = function() {
  var self = this;
  
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
  this.lastSlide = "";
  this.containerDiv = this.selector.find('.SlideShareContainer');
  
  // Update the slide from timeupdate event
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.slideShareUpdater));
  
  this._Popcorn.listen("IriSP.SlideShareWidget.show", IriSP.wrap(this, this.show));
  this._Popcorn.listen("IriSP.SlideShareWidget.hide", IriSP.wrap(this, this.hide));
  
  // Get data from "slideshare" cutting/annotation-type
  var annotations = this._serializer._data.annotations;
  var view_type = this._serializer.getSlideShareType();
  if(typeof(view_type) === "undefined") {
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
  var found = false;
  for (i = 0; i < nb_slides; i++) {
    var segment_slide = this.segments_slides[i];
    if(segment_slide.begin<time && time<segment_slide.end){
    	found = true;
    	if(segment_slide.content.description!=this.lastSlide){
			// The url is like http://stuf.com#X and X is the slide number. So we split and save it.
    		this.lastSlide = segment_slide.content.description;
    		var description_ar = this.lastSlide.split("#");
    		console.log("description_ar = " + description_ar);
    		var slideUrl = description_ar[0];
    		var slideNb = description_ar[1];
    		// We have the slideshare oembed url.
    		var url = "http://www.slideshare.net/api/oembed/2?format=jsonp&url=" + slideUrl;
    		
    		IriSP.jQuery.ajax({
				url: url,
				dataType: "jsonp",
				success: function(data) {
					ss_id = data["slideshow_id"];
					embed_code = data["html"];
					// If slideNb exist, we hack the embed code to add ?startSlide=X
					if(slideNb){
						embed_code = embed_code.replace(new RegExp("embed_code/"+ss_id), "embed_code/" + ss_id + "?startSlide=" + slideNb);
					}
					self.containerDiv.html(embed_code);
				},
				error: function(jqXHR, textStatus, errorThrown){
					self.containerDiv.html("Error while downloading the slideshow. jqXHR = " + jqXHR + ", textStatus = " + textStatus + ", errorThrown = " + errorThrown);
				}
    		});
    		
    		/*
    		var url = this.url_proxy;
    		if(url.search(/\?/)<0){
    			url += "?";
    		}
    		url += "&" + this.parameter_name + "=" + this.lastSlide;
    		
    		IriSP.jQuery.ajax({
				url: url,
				success: function(xml) {
					xml = IriSP.jQuery.parseXML(xml);
					self.containerDiv.html(xml);
				},
				error: function(jqXHR, textStatus, errorThrown){
					self.containerDiv.html("Error while downloading the slideshow. jqXHR = " + jqXHR + ", textStatus = " + textStatus + ", errorThrown = " + errorThrown);
				}
    		});
    		
    		*/
    		
    		
    		
    		return;
    	}
    }
  }
  if(found==false){
  	this.lastSlide = "";
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


// SHA1ise function
IriSP.SlideShareWidget.prototype.sha1 = function(msg) {
	 
	function rotate_left(n,s) {
		var t4 = ( n<<s ) | (n>>>(32-s));
		return t4;
	};
 
	function lsb_hex(val) {
		var str="";
		var i;
		var vh;
		var vl;
 
		for( i=0; i<=6; i+=2 ) {
			vh = (val>>>(i*4+4))&0x0f;
			vl = (val>>>(i*4))&0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};
 
	function cvt_hex(val) {
		var str="";
		var i;
		var v;
 
		for( i=7; i>=0; i-- ) {
			v = (val>>>(i*4))&0x0f;
			str += v.toString(16);
		}
		return str;
	};
 
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	};
 
	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;
 
	msg = Utf8Encode(msg);
 
	var msg_len = msg.length;
 
	var word_array = new Array();
	for( i=0; i<msg_len-3; i+=4 ) {
		j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
		msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
		word_array.push( j );
	}
 
	switch( msg_len % 4 ) {
		case 0:
			i = 0x080000000;
		break;
		case 1:
			i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
		break;
 
		case 2:
			i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
		break;
 
		case 3:
			i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
		break;
	}
 
	word_array.push( i );
 
	while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 
	word_array.push( msg_len>>>29 );
	word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
	for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
		for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
		for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 
		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;
 
		for( i= 0; i<=19; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=20; i<=39; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=40; i<=59; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=60; i<=79; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
 
	}
 
	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
 
	return temp.toLowerCase();
 
};
