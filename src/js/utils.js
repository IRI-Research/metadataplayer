/* utils.js - various utils that don't belong anywhere else */

/* trace function, for debugging */

IriSP.traceNum = 0;
IriSP.trace = function( msg, value ) {
/*
	if( IriSP.config.gui.debug === true ) {
		IriSP.traceNum += 1;
		IriSP.jQuery( "<div>"+IriSP.traceNum+" - "+msg+" : "+value+"</div>" ).appendTo( "#Ldt-output" );
	}
*/
};

/* used in callbacks - because in callbacks we lose "this",
   we need to have a special function which wraps "this" in 
   a closure. This way, the 
*/   
IriSP.wrap = function (obj, fn) {
  return function() {    
    var args = Array.prototype.slice.call(arguments, 0);
    return fn.apply(obj, args);
  }
}

/* convert a time to a percentage in the media */
IriSP.timeToPourcent = function(time, timetotal){
	var time = Math.abs(time);
  var timetotal = Math.abs(timetotal);
  
	return Math.floor((time/timetotal) * 100);
};

IriSP.padWithZeros = function(num) {
  if (Math.abs(num) < 10) {
    return "0" + num.toString();
  } else {
    return num.toString();
  }
};

/* convert a number of milliseconds to a tuple of the form 
   [hours, minutes, seconds]
*/
IriSP.msToTime = function(ms) {
  return IriSP.secondsToTime(ms / 1000);
}
/* convert a number of seconds to a tuple of the form 
   [hours, minutes, seconds]
*/
IriSP.secondsToTime = function(secs) {  
  var hours = Math.abs(parseInt( secs / 3600 ) % 24);
  var minutes = Math.abs(parseInt( secs / 60 ) % 60);
  var seconds = parseFloat(Math.abs(secs % 60).toFixed(0));
  
  var toString_fn = function() {
    var ret = "";
    if (hours > 0)
       ret = IriSP.padWithZeros(this.hours) + ":";
    ret += IriSP.padWithZeros(this.minutes) + ":" + IriSP.padWithZeros(this.seconds);

    return ret;
  }
  return {"hours" : hours, "minutes" : minutes, "seconds" : seconds, toString: toString_fn};
};

/* format a tweet - replaces @name by a link to the profile, #hashtag, etc. */
IriSP.formatTweet = function(tweet) {
  /*
    an array of arrays which hold a regexp and its replacement.
  */
  var regExps = [
    /* copied from http://codegolf.stackexchange.com/questions/464/shortest-url-regex-match-in-javascript/480#480 */
    [/((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi, "<a href='$1'>$1</a>"],
    [/@(\w+)/gi, "<a href='http://twitter.com/$1'>@$1</a>"], // matches a @handle
    [/#(\w+)/gi, "<a href='http://twitter.com/search?q=%23$1'>#$1</a>"],// matches a hashtag
    [/(\+\+)/gi, "<span class='Ldt-PolemicPlusPlus'>$1</span>"],
    [/(--)/gi, "<span class='Ldt-PolemicMinusMinus'>$1</span>"],
    [/(==)/gi, "<span class='Ldt-PolemicEqualEqual'>$1</span>"],
    [/(\?\?)/gi, "<span class='Ldt-PolemicQuestion'>$1</span>"]
  ]; 

  var i = 0;
  for(i = 0; i < regExps.length; i++) {
     tweet = tweet.replace(regExps[i][0], regExps[i][1]);
  }
  
  return tweet;
};

IriSP.countProperties = function(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
                ++count;
    }

    return count;
};

// conversion de couleur Decimal vers HexaDecimal || 000 si fff
IriSP.DEC_HEXA_COLOR = function (dec) {
  var val = +dec;
  var str = val.toString(16);
  var zeroes = "";
  if (str.length < 6) {
    for (var i = 0; i < 6 - str.length; i++)
      zeroes += "0";
  }
  return zeroes + str;
};

/* shortcut to have global variables in templates */
IriSP.templToHTML = function(template, values) {
  var params = IriSP.jQuery.extend(
      { "defaults" : IriSP.default_templates_vars,
        "l10n" : IriSP.i18n.getMessages()
        },
      values);
  return Mustache.to_html(template, params);
};

/* we need to be stricter than encodeURIComponent,
   because of twitter
*/  
IriSP.encodeURI = function(str) {
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
                                 replace(/\)/g, '%29').replace(/\*/g, '%2A');  
}

IriSP.jqEscape = function(text) {
   return text.replace(/(:|\.)/g,'\\$1')
}

IriSP.jqId = function (text) { 
   return IriSP.jQuery('#' + IriSP.jqEscape(text));
 }  

IriSP.__guidCounter = 0;
IriSP.guid = function(prefix) {
  IriSP.__guidCounter += 1;
  return prefix + IriSP.__guidCounter;
};

/** returns an url to share on facebook */
IriSP.mkFbUrl = function(url, text) {
  if (typeof(text) === "undefined")
    text = "I'm watching ";
  
  return "http://www.facebook.com/share.php?u=" + IriSP.encodeURI(text) + IriSP.shorten_url(url);
};

/** returns an url to share on twitter */
IriSP.mkTweetUrl = function(url, text) {
  if (typeof(text) === "undefined")
    text = "I'm watching ";
  
  return "http://twitter.com/home?status=" + IriSP.encodeURI(text) + IriSP.shorten_url(url);
};

/** returns an url to share on google + */
IriSP.mkGplusUrl = function(url, text) {
  return "https://plusone.google.com/_/+1/confirm?hl=en&url=" + IriSP.shorten_url(url);
};

/** test if a value is null or undefined */
IriSP.null_or_undefined = function(val) {
  return (typeof(val) === "undefined" || val === null);
};

/** get a property that can have multiple names **/

IriSP.get_aliased = function(_obj, _aliases) {
    for (var _i = 0; _i < _aliases.length; _i++) {
        if (typeof _obj[_aliases[_i]] !== "undefined") {
            return _obj[_aliases[_i]];
        }
    }
    return null;
}

/** issue a call to an url shortener and return the shortened url */
IriSP.shorten_url = function(url) {
  if (IriSP.config.shortener.hasOwnProperty("shortening_function"))
    return IriSP.config.shortener.shortening_function(url);
    
  return url;
};


/* for ie compatibility
if (Object.prototype.__defineGetter__&&!Object.defineProperty) {
   Object.defineProperty=function(obj,prop,desc) {
      if ("get" in desc) obj.__defineGetter__(prop,desc.get);
      if ("set" in desc) obj.__defineSetter__(prop,desc.set);
   }
}
*/

/* Creates regexps from text */
IriSP.regexpFromText = function(_text) {
    return new RegExp('(' + _text.replace(/(\W)/gim,'\\$1') + ')','gim');
}
