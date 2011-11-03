/* 
 * 	
 *	Copyright 2010 Institut de recherche et d'innovation 
 *	contributor(s) : Samuel Huron 
 *	 
 *	contact@iri.centrepompidou.fr
 *	http://www.iri.centrepompidou.fr 
 *	 
 *	This software is a computer program whose purpose is to show and add annotations on a video .
 *	This software is governed by the CeCILL-C license under French law and
 *	abiding by the rules of distribution of free software. You can  use, 
 *	modify and/ or redistribute the software under the terms of the CeCILL-C
 *	license as circulated by CEA, CNRS and INRIA at the following URL
 *	"http://www.cecill.info". 
 *	
 *	The fact that you are presently reading this means that you have had
 *	knowledge of the CeCILL-C license and that you accept its terms.
*/
// CHART TIMELINE / VERSION PROTOTYPE  ::

IriSP.PolemicWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
 
  this.RAWTweets;
	this.userPol    = new Array();
	this.userNoPol  = new Array();
	this.userst 	   = new Array();
	this.numberOfTweet = 0;
	this.Users;
	this.TweetPolemic;
	this.yMax	  		= this.height; 
	this.PaperSlider;
	this.heightOfChart;
	this.tweets  = new Array();
  
	// Make and define the Raphael area
	this.paper = Raphael(document.getElementById(this._id), config.width, config.height);
  
};

IriSP.PolemicWidget.prototype = new IriSP.Widget();
	
IriSP.PolemicWidget.prototype.draw = function() {
	
		// variable 
		// yMax
    
    var self = this;
		var yCoef	  		= 2; 						// coef for height of 1 tweet 
		var frameSize 		= 5; 						// frame size 
		var margin 	  		= 1;						// marge between frame
		var lineSize  		= this.width;				// timeline pixel width 
		var nbrframes 		= lineSize/frameSize; 		// frame numbers
		var numberOfTweet 	= 0;						// number of tweet overide later 
		var duration  		= +this._serializer.currentMedia().meta["dc:duration"];			// timescale width 
		var frameLenght 	= lineSize/frameSize;		// frame timescale	    
		var timeline;
		var colors  = new Array("","#1D973D","#C5A62D","#CE0A15","#036AAE","#585858");
		
		// array 
		//var tweets  = new Array();
		var element = new Array();
		var cluster = new Array();
		var frames  = new Array(frameLenght);
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
		

      this._serializer.sync(function(data) { loaded_callback.call(self, data) });
      
      function loaded_callback (json) {

		    // get current view (the first ???)
		    view = json.views[0];
		    
		    // the tweets are by definition of the second annotation type
		    tweet_annot_type = null;
		    if(typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
		    	tweet_annot_type = view.annotation_types[1];
		    }
			RAWTweets = json.annotations;
			
      for(var i = 0; i < json.annotations.length; i++) {
        var item = json.annotations[i];							
				var MyTime  = Math.floor(item.begin/duration*lineSize);
				var Myframe = Math.floor(MyTime/lineSize*frameLenght);

				if (typeof(item.meta) !== "undefined" 
					&& typeof(item.meta["id-ref"]) !== "undefined"
					&& item.meta["id-ref"] === tweet_annot_type) {
						
					var MyTJson = JSON.parse(item.meta['dc:source']['content']);
					
						if (item.content['polemics'] != undefined 
						&& item.content['polemics'][0] != null) {
						
						
					//console.log(item.meta['dc:source']['content']);
					
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
												tsource:MyTJson
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
									tsource:MyTJson
									
						};
						numberOfTweet+=1;
					}
					
				} 
			};	
			
		   DrawTweets.call (this); // FIXME: ugly.
		   if(numberOfTweet>0){Report();}
		   
		  };		 
		
		function pourcent(value,max){
			var myPourcentage = Math.round(value/max*1000)/10;
			return myPourcentage;
			
		}
		function round2Dec(value){
			var myValueRounded =  Math.round(value*100)/100;
			return myValueRounded
		}
		

		function searchKeyValueArray(mykey,myvalue,myarray){
			for(var i=0; i<myarray.length; i++) {
				if(myarray[i][mykey]==myvalue){
					return i;
					console.log("trouvé !");
				}
			}
			return true;
		}
		
		var tweetConversationel   = new Array();
		var tweetConversationelSP = 0;
		var tweetClient		  	  = new Array();
		var tweetRetweet		  = new Array();
		var maxRetweet
		function tweetRetweetCount(mytweet){
			tweet = mytweet.tsource
			var retweetIsHere = false;
			var myRT =	{
				   			id:'',
							tweet:tweet,
							total:1,
							SPtraine:''
						} 
			if(tweet.retweet_count>0){
				for(var i=0; i<tweetRetweet.length; i++){
					if(tweetRetweet[i].id==myRT.id){
						myRT = tweetRetweet[i];
						retweetIsHere=true;
					}
				}
				
				if (mytweet.qualification==5){
					myTclient.numberNsp+=1;
				}else{
					myTclient.numberSp+=1;
				}
				
				if(retweetIsHere==false){
					tweetRetweet.push(myRT);
				}else{
					myRT.total+=1;	
				}

			}
		}
		function tweetRetweetReport(tweet){
			
		}
		function tweetClientCount(tweet){
			var myTclient =	{
							client:tweet.tsource.source,
							numberNsp:0,
							numberSp:0,
							total:1,
							}
			var clientIsHere = false;
			for(var i=0; i<tweetClient.length; i++) {
				if (tweetClient[i].client==tweet.tsource.source){
					clientIsHere = true;
					myTclient = tweetClient[i];
				}
			}
			if (tweet.qualification==5){
				myTclient.numberNsp+=1;
			}else{
				myTclient.numberSp+=1;
			}
			if(clientIsHere==false){
				tweetClient.push(myTclient);
			}else{
				myTclient.total+=1
			}
		}
		function tweetClientSort(a,b){
			return (a.total < b.total)?1:-1;
		}
		function tweetClientReport(){
			tweetClient.sort(tweetClientSort);
			console.log("_______________________________");
			for(var i=0; i<tweetClient.length; i++) {
				if(tweetClient[i].total>1){
					console.log("t: "+tweetClient[i].total+" / sp :"+tweetClient[i].numberSp+" : "+tweetClient[i].client);
				}
			}
			console.log(JSON.stringify(tweetClient));
		}
		function conversationalCount(tweet){
			if(tweet.tsource.entities.user_mentions.length>2){
				if (tweet.qualification!=5){
					tweetConversationelSP+=1;
				}
				var myTc = {
							polemique:tweet.qualification,
							user_mentions:tweet.tsource.entities.user_mentions,
							tsource:tweet
							}
				tweetConversationel.push(myTc);
			}
		}
		function conversationalReport(){
			console.log("_______________________________");
			console.log("tweets conversationel    : "+tweetConversationel.length);
			console.log("tweets conversationel sp : "+pourcent(tweetConversationelSP,tweetConversationel.length));
			console.log("tweets conversationel nsp: "+pourcent(tweetConversationel.length-tweetConversationelSP,tweetConversationel.length));
		}
		function tweetsStats(){
			for(var i=0; i<this.tweets.length; i++) {
					conversationalCount(this.tweets[i])
					tweetClientCount(this.tweets[i]);
					//tweetRetweetCount(tweets[i]);
			}	
			conversationalReport();
			tweetClientReport();
		}		
		function numberUserUsePolemic(){
			
			for(var i=0; i<this.tweets.length; i++) {
				if (this.tweets[i].qualification!=5){
					var searchKeyValueArrayTest = searchKeyValueArray('userId', this.tweets[i].userId,userPol);
					if(searchKeyValueArrayTest==true){
						myUser = userPol.push({
											userId: this.tweets[i].userId,
											userScreenName: this.tweets[i].userScreenName,
											tweets:[]
											});
					}
				}else{
					var searchKeyValueArrayTest = searchKeyValueArray('userId',tweets[i].userId,userPol);
					if(searchKeyValueArrayTest==true){
						myUser = userNoPol.push({
											userId: tweets[i].userId,
											userScreenName: tweets[i].userScreenName,
											tweets:[]
											});
					}
				}
				
				var searchKeyValueArrayTest = searchKeyValueArray('userId',tweets[i].userId,userst);
				//console.log(searchKeyValueArrayTest);
				if(searchKeyValueArrayTest==true){
					//console.log("ici");
					myUser = userst.push({
										userId: tweets[i].userId,
										userScreenName: tweets[i].userScreenName,
										tweetsNP:[],
										tweetsSP:[],
										ecartNP:null,
										ecartSP:null
								 		});
					if(this.tweets[i].qualification!=5){
							userst[myUser-1].tweetsNP.push(tweets);
					}else {
							userst[myUser-1].tweetsSP.push(tweets);
					}
				}else{
					if(this.tweets[searchKeyValueArrayTest].qualification!=5){
						userst[searchKeyValueArrayTest].tweetsNP.push(this.tweets);
					}else {
						userst[searchKeyValueArrayTest].tweetsSP.push(this.tweets);
					}	
				}	
			}
			
			moyenneDeTweetsNPparUsers = (numberOfTweet-qTweet_0)/userNoPol.length
			moyenneDeTweetsSPparUsers = (numberOfTweet-qTweet_0)/userPol.length
			sommeDeMesCarreSP=0;
			sommeDeMesCarreNP=0;			
			for(var i=0; i<userst.length; i++) {
				myEcartSP = Math.pow(userst[i].tweetsSP.length-moyenneDeTweetsSPparUsers,2);
				userst[i].ecartSP=myEcartSP;
				sommeDeMesCarreSP+=myEcartSP;
				
				myEcartNP = Math.pow(userst[i].tweetsNP.length-moyenneDeTweetsNPparUsers,2);
				userst[i].ecartNP=myEcartNP;
				sommeDeMesCarreNP+=myEcartNP;
			}
			varianceSP	= sommeDeMesCarreSP/userst.length
			varianceNP	= sommeDeMesCarreNP/userst.length
			
			SommeVariances = varianceNP + varianceSP;
			
			EcartTypeSP = Math.sqrt(varianceSP);
			EcartTypeNP = Math.sqrt(varianceNP);
			
			SommeEcart = EcartTypeSP + EcartTypeNP;
			

			
			
			console.log("user  SP	       	: "+userPol.length);
			console.log("user  nSP  	   	: "+userNoPol.length);
			console.log("nbrTP / user SP   	: "+round2Dec(moyenneDeTweetsSPparUsers));
			console.log("nbrT  / user nSP  	: "+round2Dec(moyenneDeTweetsNPparUsers));
			console.log("varianceSP	  	: "+round2Dec(varianceSP));
			console.log("varianceNP	  	: "+round2Dec(varianceNP));
			console.log("EcartTypeSP	  	: "+round2Dec(EcartTypeSP));
			console.log("EcartTypeNP	  	: "+round2Dec(EcartTypeNP));
			
		}
		function Report(){
			console.log("_______________________________");
			console.log("Total de tweets   	: "+numberOfTweet)
			console.log("Total de tweets P 	: "+(numberOfTweet-qTweet_0)+" 	"+ pourcent((numberOfTweet-qTweet_0),numberOfTweet)+" %")
			console.log("accord       		: "+qTweet_OK+" 	"+pourcent(qTweet_OK,numberOfTweet)+" %");
			console.log("desaccord    		: "+qTweet_KO+" 	"+pourcent(qTweet_KO,numberOfTweet)+" %");
			console.log("question     		: "+qTweet_Q+" 	"+pourcent(qTweet_Q,numberOfTweet)+" %");
			console.log("reference    		: "+qTweet_REF+" 	"+pourcent(qTweet_REF,numberOfTweet)+" %");
			console.log("sans polemic 		: "+qTweet_0+" 	"+pourcent(qTweet_0,numberOfTweet)+" %");
			// numberUserUsePolemic();
			// tweetsStats.call(this); //fixme: ugly
		}
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
				var moy	= 0;
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
			
			// DRAW  TWEETS ============================================
			for(var i=0; i<nbrframes;i++) {
				var addEheight = 5;
				if (frames[i] != undefined){
				        
					// by type 
					for (var j = 6; j>-1; j--){
						if (frames[i].qualifVol[j]!=undefined){
							// show tweet by type 
							for (var k = 0; k < frames[i].mytweetsID.length; k++) {
								if (frames[i].mytweetsID[k].qualification == j) {                
                  var x = i*frameSize;
									var y = this.heightmax - addEheight;
									if (this.yMax > y) {
                    this.yMax = y;
                  }
                  
									var e = this.paper.rect(x, y, frameSize - margin, TweetHeight /* height */).attr({stroke:"#00","stroke-width":0.1,  fill: colors[j]});	
									addEheight += TweetHeight;
									e.time= frames[i].mytweetsID[k].timeframe;
									e.title= frames[i].mytweetsID[k].title;
                  
									e.mouseover(function(element) { return function (event) {                                             
                        // event.clientX and event.clientY are to raphael what event.pageX and pageY are to jquery.
                        self.TooltipWidget.show.call(self.TooltipWidget, element.title, "#fefefe", event.clientX - 106, event.clientY - 160);
                        element.displayed = true;
                      }}(e)).mouseout(function(element) { return function () {                          
                          self.TooltipWidget.hide.call(self);
										//this.attr({stroke:"#00","stroke-width":0.1});	
									}}(e)).mousedown(function () {
										self._Popcorn.currentTime(this.time/1000); // FIXME: update ?
									});
									__IriSP.jQuery(e.node).attr('id', 't'+k+'');
									__IriSP.jQuery(e.node).attr('title', frames[i].mytweetsID[k].title);
									__IriSP.jQuery(e.node).attr('begin',  frames[i].mytweetsID[k].timeframe);
									var tempPosition = {x:i*frameSize,y: this.heightmax-addEheight};
									addTip(e.node, frames[i].mytweetsID[k].title,colors[j],tempPosition);
									//frames[i].mytweetsID.pop();
								}
							}
						}
					}
				}

			}		
			// DRAW UI :: resize border and bgd
			var heightOfChart 	= (this.yMax-(this.height- this.yMax));
			var PaperBackground = this.paper.rect(0, this.yMax, this.width,heightOfChart).attr({fill:"#fff","stroke-width":0.1,opacity: 0.1});	
			var PaperBorder 	= this.paper.rect(0, this.yMax,this.width,1).attr({fill:"#fff",stroke: "none",opacity: 1});	
			var PaperSlider 	= this.paper.rect(0,20,1,heightOfChart).attr({fill:"#fc00ff",stroke: "none",opacity: 1});	
			
			// decalage 
			tweetSelection = this.paper.rect(-100,-100,5,5).attr({fill:"#fff",stroke: "none",opacity: 1});	
				
			PaperSlider.toFront();
			PaperBackground.toBack();
		}
		
		if(typeof(PaperSlider) !== 'undefined' ) {
			PaperSlider.toFront();
		}
		Report.call(this);
	}

	
	// jQuery(document).mousemove(function(e){
		// if (over){
			// __IriSP.jQuery("#tip").css("left", e.pageX-106).css("top", e.pageY-160);
			// __IriSP.jQuery("#tipcolor").css("background-color", tipColor);
			// __IriSP.jQuery("#tiptext").text(tipText);
			// __IriSP.jQuery("#tip").show();
		// }else{
			// if (typeof(__IriSP) !== 'undefined' && typeof(__IriSP.jQuery) === 'function') {
				// __IriSP.jQuery("#tip").css("left", -10000).css("top", -100000);
			    // //tweetSelection.attr({x:-100,y:-100});
			// }
		// }
	// });
	
	// var over 	 = false;
	// var tipText  = "";
	// var tipColor = "#efefef";
	// var tweetSelection;
	// var PaperSlider;
	
	// AddTip  ******************************************************************************
	function addTip(node, txt,color,tempPosition){
			IriSP.jQuery(node).mouseover(function(){
			   tipText = txt;
			   //tip.hide();//fadeIn(0);
			   tipColor = color;
			   over = true;
			   //tweetSelection.attr(tempPosition);
			   //tweetSelection.toFront();
			}).mouseout(function(){
			   //tip.show()//tip.fadeOut(0);
			   over = false;
			});
			

	}
	
		// jQuery(document).ready(function() {
			// if (typeof(__IriSP) !== 'undefined' && typeof(__IriSP.jQuery) === 'function') {
				// __IriSP.jQuery("#tip").hide();
			// }
		// });
    
    