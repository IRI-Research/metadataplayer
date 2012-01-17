/* 
 *   
 *  Copyright 2010 Institut de recherche et d'innovation 
 *  contributor(s) : Samuel Huron 
 *   
 *  contact@iri.centrepompidou.fr
 *  http://www.iri.centrepompidou.fr 
 *   
 *  This software is a computer program whose purpose is to show and add annotations on a video .
 *  This software is governed by the CeCILL-C license under French law and
 *  abiding by the rules of distribution of free software. You can  use, 
 *  modify and/ or redistribute the software under the terms of the CeCILL-C
 *  license as circulated by CEA, CNRS and INRIA at the following URL
 *  "http://www.cecill.info". 
 *  
 *  The fact that you are presently reading this means that you have had
 *  knowledge of the CeCILL-C license and that you accept its terms.
*/
// CHART TIMELINE / VERSION PROTOTYPE  ::

/** the polemic widget */
IriSP.PolemicWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
 
  this.userPol    = new Array();
  this.userNoPol  = new Array();
  this.userst      = new Array();
  this.numberOfTweet = 0;
  this.Users;
  this.TweetPolemic;
  this.yMax        = this.height; 
  this.PaperSlider;
  this.heightOfChart;
  this.tweets  = new Array();
  this.svgElements = {};
  
  this.oldSearchMatches = [];
};

IriSP.PolemicWidget.prototype = new IriSP.Widget();
  
IriSP.PolemicWidget.prototype.draw = function() {
  
    // variable 
    // yMax
    
    var self = this;
    var yCoef        = 2;             // coef for height of 1 tweet 
    var frameSize     = 5;             // frame size 
    var margin         = 1;            // marge between frame
    var lineSize      = this.width;        // timeline pixel width 
    var nbrframes     = lineSize/frameSize;     // frame numbers
    var numberOfTweet   = 0;            // number of tweet overide later 
    var duration      = +this._serializer.currentMedia().meta["dc:duration"];      // timescale width 
    var frameLength   = lineSize / frameSize;    // frame timescale  
    var timeline;
    var colors  = new Array("","#1D973D","#C5A62D","#CE0A15","#036AAE","#585858");
    
    // array 
    //var tweets  = new Array();
    var element = new Array();
    var cluster = new Array();
    var frames  = new Array(frameLength);
    var slices  = new Array();
    
    
    // Classes =======================================================================
    var Frames = function(){
      
      var Myclusters;
      var x;
      var y;
      var width;
      var height;
    };
    Frames = function(json){
      // make my clusters
      // ou Frame vide 
    };
    Frames.prototype.draw = function(){
    };
    Frames.prototype.zoom = function(){
    };
    Frames.prototype.inside = function(){
    };
    var Clusters = function(){
      var Object;
      var yDist;
      var x;
      var y;
      var width;
      var height;
    };
    Clusters = function(json){
      // make my object
    };
    var Tweet = function(){
    };
    // Classes =======================================================================

    // Refactoring (parametere) ************************************************************
    // color translastion
    var qTweet_0  =0;
    var qTweet_Q  =0;
    var qTweet_REF=0;
    var qTweet_OK =0;
    var qTweet_KO =0;
    function colorTranslation(value){
      if(value == "Q"){
        qTweet_Q+=1;
        return 2;
      }else if(value =="REF"){
        qTweet_REF+=1;
        return 4;
      }else if(value =="OK"){
        qTweet_OK+=1;
        return 1;
      }else if(value =="KO"){
        qTweet_KO+=1;
        return 3;
      }else if(value ==""){
        qTweet_0+=1;
        return 5;
      }
    }
    

      this._serializer.sync(function(data) { loaded_callback.call(self, data); return; });
      
      function loaded_callback (json) {
      var view_type = this._serializer.getTweets();

      
      if (typeof(view_type) === "undefined") {
        var view_type = this._serializer.getTweetIds()[0];
        if (typeof(view_type) === "undefined") {
          // default to guessing if nothing else works.
          var view = json.views[0];
          
          if(typeof(view.annotation_types) !== "undefined") {
            /* we need to be backward compatible with the old files which used to
               feature only two lines : Chapitrage and Tweets. We've added a
               "Contributions" line so we need to discriminate against that */
            if (view.annotation_types.length === 2 && typeof(this._serializer.getContributions()) === "undefined") {
              var view_type = view.annotation_types[1];
            } else {
              console.log("PolemicWidget: invalid file - minimizing");
              return;
            }
          }      
        }
      }
      
      // Make and define the Raphael area
      this.paper = Raphael(document.getElementById(this._id), this._config.width, this._config.height);
      
      // event handlers
      this._Popcorn.listen("IriSP.search", IriSP.wrap(this, function(searchString) { this.searchHandler(searchString); }));
      this._Popcorn.listen("IriSP.search.closed", IriSP.wrap(this, this.searchFieldClosedHandler));
      this._Popcorn.listen("IriSP.search.cleared", IriSP.wrap(this, this.searchFieldClearedHandler));
      this.selector.mouseleave(IriSP.wrap(this, function() { self.TooltipWidget.hide.call(self.TooltipWidget); }));
      this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));
      this._Popcorn.listen("IriSP.Mediafragment.showAnnotation", IriSP.wrap(this, this.showAnnotation));
      
      for(var i = 0; i < json.annotations.length; i++) {
        var item = json.annotations[i];        
        var MyTime  = Math.floor(item.begin/duration*lineSize);
        var Myframe = Math.floor(MyTime/lineSize*frameLength);

        if (typeof(item.meta) !== "undefined" 
          && typeof(item.meta["id-ref"]) !== "undefined"
          && item.meta["id-ref"] === view_type) {
            
            var MyTJson = {};
            if (typeof(item.meta['dc:source']) !== "undefined") {
              var MyTJson = JSON.parse(item.meta['dc:source']['content']);
            }
            
            if (item.content['polemics'] != undefined 
            && item.content['polemics'][0] != null) {
            
              // a tweet can have many polemics at the same time.
              for(var j=0; j<item.content['polemics'].length; j++){
                  
                  this.tweets[numberOfTweet] = {
                        id:i,
                        qualification:colorTranslation(item.content['polemics'][j]),
                        yIndicator:MyTime,
                        yframe:Myframe,
                        title:item.content['title'],
                        timeframe:item.begin,
                        userId: MyTJson.id,
                        userScreenName: MyTJson.screen_name,
                        tsource:MyTJson,
                        cinecast_id: item.id
                        };
                  numberOfTweet+=1;
                  
              }
          }
          else {
            this.tweets[numberOfTweet] = {
                  id:i,
                  qualification:colorTranslation(""),
                  yIndicator:MyTime,
                  yframe:Myframe,
                  title:item.content['title'],
                  timeframe:item.begin,
                  userId: MyTJson.id,
                  userScreenName: MyTJson.screen_name,
                  tsource:MyTJson,
                  cinecast_id: item.id
            };
            numberOfTweet+=1;
          }
          
        } 
      };  
      
       DrawTweets.call (this); // FIXME: ugly.
       
      };      

    // tweet Drawing (in raphael) 
    function DrawTweets (){
    // GROUPES TWEET ============================================
    // Count nbr of cluster and tweet in a frame an save int in "frames"
      numberOfTweet = this.tweets.length;
      for(var i=0; i<nbrframes; i++) {  
        for(var j=0; j<numberOfTweet; j++) {  
        
          if (i==this.tweets[j].yframe){
            
            var k = this.tweets[j].qualification;
            
            // make array for frame cluster
            if(frames[i]==undefined){
              frames[i] = {id:i,
                     qualifVol:new Array(),
                     mytweetsID:new Array()
                    };
            }
            // add my tweet to frame
            frames[i].mytweetsID.push(this.tweets[j]);
            
            // count opinion by frame
            if( frames[i].qualifVol[k] == undefined){
              frames[i].qualifVol[k] = 1;
            }else{
              frames[i].qualifVol[k] += 1;
            }
            
          }
        }
      }
    
    // GROUPES TWEET ============================================    
    // max of tweet by Frame 
      var max = 0; 
      for(var i = 0; i < nbrframes; i++) {
        var moy  = 0;
        for (var j = 0; j < 6; j++) {    
          if (frames[i] != undefined) {
            if (frames[i].qualifVol[j] != undefined) {
              moy += frames[i].qualifVol[j];
            }
          }
        }
        
        if (moy > max) {
          max = moy;
        }
      }
    
      var tweetDrawed = new Array();
      var TweetHeight = 5;
      var newHeight = TweetHeight * max + 10;

      
      if (newHeight > this.height) {
        this.paper.setSize(this.width, newHeight);
        this.height = newHeight;
        console.log("resizeing");
      }
      
  
      // DRAW  TWEETS ============================================
      for(var i = 0; i < nbrframes; i++) {
        var addEheight = 5;
        if (frames[i] != undefined){                
          // by type 
          
          for (var j = 6; j > -1; j--) {
            if (frames[i].qualifVol[j] != undefined) {
              // show tweet by type 
              for (var k = 0; k < frames[i].mytweetsID.length; k++) {
              
                if (frames[i].mytweetsID[k].qualification == j) {                
                  var x = i * frameSize;
                  var y = this.height - addEheight;
                  
                  if (this.yMax > y) {
                    this.yMax = y;
                  }
                  
                  /* some tweets seem to be duplicated - so we make a check before
                     creating a new rect */
                  if (this.svgElements.hasOwnProperty(frames[i].mytweetsID[k].cinecast_id))
                    continue;
                  
                  var e = this.paper.rect(x, y, frameSize - margin, TweetHeight /* height */)
                                    .attr({stroke:"#00","stroke-width":0.1,  fill: colors[j]});  
                  
                  addEheight += TweetHeight;
                  
                  /* stick a lot of things into e because that's the easiest way
                     to do it */
                  e.color = colors[j];
                  e.time = frames[i].mytweetsID[k].timeframe;
                  e.title = frames[i].mytweetsID[k].title;
                  e.id = frames[i].mytweetsID[k].cinecast_id;
                  var pos = IriSP.jQuery(e.node).offset();                  
                  e.x = pos.left;
                  e.y = pos.top;
                  this.svgElements[e.id] = e;
                  
                  IriSP.jQuery(e.node).mouseenter(function(element) { return function (event) {                        
                        // event.clientX and event.clientY are to raphael what event.pageX and pageY are to jquery.                        
                        self.TooltipWidget.show.call(self.TooltipWidget, element.title, element.attr("fill"), event.pageX - 106, event.pageY - 160);
                        element.displayed = true;
                  }}(e)).mousedown(function(element) { return function () {                    
                    self._Popcorn.currentTime(element.time/1000);
                    self._Popcorn.trigger("IriSP.PolemicTweet.click", element.id); 
                    }
                  }(e));                  
                  
                  IriSP.jQuery(e.node).attr('id', 't' + k + '');
                  IriSP.jQuery(e.node).attr('title', frames[i].mytweetsID[k].title);
                  IriSP.jQuery(e.node).attr('begin',  frames[i].mytweetsID[k].timeframe);                  
                }
              }
            }
          }
        }

      }    
      // DRAW UI :: resize border and bgd      
      this.paperBackground = this.paper.rect(0, 0, this.width, this.height).attr({fill:"#F8F8F8","stroke-width":0.1,opacity: 1});  

      // outer borders
      this.outerBorders   = [];
      this.outerBorders.push(this.paper.rect(0, this.height - 1, this.width, 1).attr({fill:"#ababab",stroke: "none",opacity: 1}));  
      this.outerBorders.push(this.paper.rect(0, 0, this.width, 1).attr({fill:"#ababab",stroke: "none",opacity: 1}));  

      // inner borders
      this.innerBorders   = [];
      this.innerBorders.push(this.paper.rect(1, this.height - 2, this.width, 1).attr({fill:"#efefef",stroke: "none",opacity: 1}));  
      this.innerBorders.push(this.paper.rect(1, 1, this.width, 1).attr({fill:"#efefef",stroke: "none",opacity: 1}));  
      this.innerBorders.push(this.paper.rect(1, 1, 1, this.height - 2).attr({fill:"#d0d1d1",stroke: "none",opacity: 0.8}));  
      this.innerBorders.push(this.paper.rect(this.width - 2, 1, 1, this.height - 2).attr({fill:"#efefef",stroke: "none",opacity: 1}));  



      this.paperSlider   = this.paper.rect(0, 0, 0, this.height).attr({fill:"#D4D5D5", stroke: "none", opacity: 1});
      
      // the small white line displayed over the slider.
      this.sliderTip = this.paper.rect(0, 0, 1, this.height).attr({fill:"#fc00ff", stroke: "none", opacity: 1});
      // decalage 
      // tweetSelection = this.paper.rect(-100,-100,5,5).attr({fill:"#fff",stroke: "none",opacity: 1});  
      
      
      this.paperSlider.toBack();
      this.paperBackground.toBack();
      this.sliderTip.toFront();
    }
    

}

/** update the positionMarker as time passes */
IriSP.PolemicWidget.prototype.sliderUpdater = function() {

    var time = +this._Popcorn.currentTime();
    var duration = +this._serializer.currentMedia().meta["dc:duration"];
    
    this.paperSlider.attr("width", time * (this.width / (duration / 1000)));
        
    this.sliderTip.attr("x", time * (this.width / (duration / 1000)));
};

/** reacts to IriSP.search events */    
IriSP.PolemicWidget.prototype.searchHandler = function(searchString) {
  if (searchString == "")
    return;

  var matches = this._serializer.searchTweetsOccurences(searchString);

  if (IriSP.countProperties(matches) > 0) {
    this._Popcorn.trigger("IriSP.search.matchFound");
  } else {
    this._Popcorn.trigger("IriSP.search.noMatchFound");
  }

  
  // decrease the opacity of the other elements.
  for (var id in this.svgElements) {
    var e = this.svgElements[id];
    e.attr({fill: e.color, opacity: 0.4});   
  }
  

  for (var id in matches) {    
    if (this.svgElements.hasOwnProperty(id)) {
      var e = this.svgElements[id];
      this.svgElements[id].attr({fill: "#fc00ff", opacity: 1});
    }
  }

  this.oldSearchMatches = matches;
};

/** reacts to IriSP.search.cleared messages */
IriSP.PolemicWidget.prototype.searchFieldClearedHandler = function() {
  for (var id in this.svgElements) {
    var e = this.svgElements[id];
    e.attr({fill: e.color, opacity: 1});
  }
};

/** reacts to IriSP.search.closed messages by clearing the highlighted elements */
IriSP.PolemicWidget.prototype.searchFieldClosedHandler = function() {
  for (var id in this.svgElements) {
    var e = this.svgElements[id];
    e.attr({fill: e.color, opacity: 1});
  }
 
};
   
IriSP.PolemicWidget.prototype.showAnnotation = function(id) {
  if (this.svgElements.hasOwnProperty(id)) {
    var e = this.svgElements[id];
    this.TooltipWidget.show(e.title, e.attr("fill"), e.x - 103, e.y - 160);
  }
};   
