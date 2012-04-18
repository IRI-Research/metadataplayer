/* utils.js - various utils that don't belong anywhere else */

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
  var params = IriSP.underscore.extend(
      {
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

/** get a property that can have multiple names **/

/** issue a call to an url shortener and return the shortened url */
IriSP.shorten_url = function(url) {
  return encodeURIComponent(url);
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
