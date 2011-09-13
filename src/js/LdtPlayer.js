/* 	
 *	Copyright 2010 Institut de recherche et d'innovation 
 *	contributor(s) : Samuel Huron 
 *	Use Silvia Pfeiffer 's javascript mediafragment implementation
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

if ( window.IriSP === undefined && window.__IriSP === undefined ) { 
	var IriSP = {}; 
	var __IriSP = IriSP; /* for backward compatibility */
}

		
// Official instance - to refactor ?
IriSP.MyLdt 		= null;
IriSP.MyTags 		= null;
IriSP.MyApiPlayer	= null;
IriSP.player		= null;

// genral var (old code) - to refactor 
IriSP.Durration		= null;
IriSP.playerLdtWidth	= null;
IriSP.playerLdtHeight	= null;


IriSP.init = function ( config ) {		
		if ( config === null ) {
			IriSP.config 			 = IriSP.configDefault;
		} else {
			
			IriSP.config 			 = config;
						
			if ( IriSP.config.player.params == null ) {
				IriSP.config.player.params = IriSP.configDefault.player.params;
			}
			
			if ( IriSP.config.player.flashvars == null ) {
				IriSP.config.player.flashvars = IriSP.configDefault.player.flashvars;
			}
			
			if ( IriSP.config.player.attributes == null ) {
				IriSP.config.player.attributes = IriSP.configDefault.player.attributes;
			}
		}
		
		var metadataSrc 		 = IriSP.config.metadata.src;
		var guiContainer		 = IriSP.config.gui.container;
		var guiMode				 = IriSP.config.gui.mode;
		var guiLdtShareTool		 = IriSP.LdtShareTool;
		
		// Localize jQuery variable
		IriSP.jQuery = null;

		/* FIXME : to refactor using popcorn.getscript ? */
		/******** Load jQuery if not present *********/
		if ( window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2' ) {
			
			var script_tag = document.createElement( 'script' );
			script_tag.setAttribute( "type", "text/javascript" );
			script_tag.setAttribute( "src", IriSP.lib.jQuery );
			
			script_tag.onload = scriptLibHandler;
			script_tag.onreadystatechange = function () { // Same thing but for IE
				if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
					scriptLibHandler();					
				}
			};
			
			// Try to find the head, otherwise default to the documentElement
			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script_tag );
		} else {
			// The jQuery version on the window is the one we want to use
			 IriSP.jQuery = window.jQuery;
			 scriptLibHandler();
		}

		/******** Called once jQuery has loaded ******/
		function scriptLibHandler() {
			
			var script_jqUi_tooltip = document.createElement( 'script' );
			script_jqUi_tooltip.setAttribute( "type", "text/javascript" );
			script_jqUi_tooltip.setAttribute( "src", IriSP.lib.jQueryToolTip );
			script_jqUi_tooltip.onload = scriptLoadHandler;
			script_jqUi_tooltip.onreadystatechange = function () { // Same thing but for IE
				if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
					scriptLoadHandler( "jquery.tools.min.js loded" );
				}
			};
			
			var script_swfObj = document.createElement('script');
			script_swfObj.setAttribute( "type","text/javascript" );
			script_swfObj.setAttribute( "src",IriSP.lib.swfObject );
			script_swfObj.onload = scriptLoadHandler;
			script_swfObj.onreadystatechange = function () { // Same thing but for IE
				if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
					scriptLoadHandler( "swfobject.js loded" );
				}
			};
		
			var script_jqUi = document.createElement( 'script' );
			script_jqUi.setAttribute( "type","text/javascript" );
			script_jqUi.setAttribute( "src",IriSP.lib.jQueryUI );
			script_jqUi.onload = scriptLoadHandler;
			script_jqUi.onreadystatechange = function () { // Same thing but for IE
				if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
					scriptLoadHandler( "jquery-ui.min.js loded" );
				}
			};
		

			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script_jqUi_tooltip);
			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script_jqUi );
			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script_swfObj );
			

		};

		/******** Called once all lib are loaded ******/
		var loadLib = 0;
		/* FIXME : ugly */
		function scriptLoadHandler( Mylib ) {
			//alert(Mylib);
			loadLib +=1;
			if( loadLib===3 ) { 
				main(); 			  
			}
		};

		/******** Our main function ********/
		function main() { 
			

			//  Make our own IriSP.jQuery and restore window.jQuery if there was one. 
			IriSP.jQuery = window.jQuery.noConflict( true );
			// Call ours Jquery
			IriSP.jQuery( document ).ready( function($) { 
				
				/******* Load CSS *******/
				var css_link_jquery = IriSP.jQuery( "<link>", { 
					rel: "stylesheet", 
					type: "text/css", 
					href: IriSP.lib.cssjQueryUI,
					'class': "dynamic_css"
				} );
				var css_link_custom = IriSP.jQuery( "<link>", { 
					rel: "stylesheet", 
					type: "text/css", 
					href: IriSP.config.gui.css,
					'class': "dynamic_css"
				} );
				
				css_link_jquery.appendTo( 'head' );
				css_link_custom.appendTo( 'head' );   

				// to see dynamicly loaded css on IE
				if ( $.browser.msie ) {
					$( '.dynamic_css' ).clone().appendTo( 'head' );
				}
				
				//__IriSP.trace("main","ready createMyHtml");
				
				IriSP.createPlayerChrome();
				
				/******* Load Metadata *******/
				IriSP.getMetadata();
			
			});
		}

};


__IriSP.Media = function ( id, url, duration, title, description ) {
		this.id 		 	= id;
		this.url 		= url;
		this.title 		= title;
		this.description = description;
		this.duration 	= duration;
		this.lignes 	  	= new Array();

		IriSP.trace( "__IriSP.Media" , "Media ID : "+id);
		IriSP.trace( "__IriSP.Media" , "Media URL : "+url);
		IriSP.trace( "__IriSP.Media" , "Media title : "+title);
};

__IriSP.Media.prototype.createPlayerMedia = function ( width, height, MyStreamer, MySwfPath) {
		IriSP.MyApiPlayer = new __IriSP.APIplayer( width, height, this.url, this.duration, MyStreamer, MySwfPath);
		//createPlayer(width,height,this.url,this.duration,MyStreamer,MySwfPath);
};

__IriSP.Media.prototype.getMediaDuration = function () {
		return (this.duration);
};

__IriSP.Media.prototype.getMediaTitle = function (){
		return (this.title);
};






/*  FIXME : API player - work in progress ... need refactoring of code */ 
__IriSP.APIplayer = function ( width, height, url, duration, streamerPath, MySwfPath){
		
		
		this.player 			= null;
		this.hashchangeUpdate 	= null;
		
		this.width				= width;
		this.height				= height;
		this.url				= url;
		this.duration			= duration;
		this.streamerPath		= streamerPath;
		this.MySwfPath			= MySwfPath;
		
		IriSP.MyApiPlayer		= this;
		
		IriSP.createPlayer( this.url, this.streamerPath );
		IriSP.trace( "__IriSP.APIplayer", "__IriSP.createPlayer" );
	
	//__IriSP.config.player
	/*
	- dailymotion  // &enableApi=1&chromeless=1
	- youtube 
	- html5
	- flowplayer 
	- jwplayer
	*/
		
};

__IriSP.APIplayer.prototype.ready = function( player ) {

	//__IriSP.trace("__IriSP.APIplayer.prototype.APIpReady"," __IriSP.createInterface");
	IriSP.createInterface( this.width, this.height, this.duration );
	//__IriSP.trace("__IriSP.APIplayer.prototype.APIpReady","END  __IriSP.createInterface");

	// hashchange EVENT
	if ( window.addEventListener ){
	
	// for firefox  hashchange EVENT
		window.addEventListener( "hashchange", function() {
		  var url = window.location.href;
		  var time = IriSP.retrieveTimeFragment( url );
		  IriSP.trace( "__IriSP.APIplayer.prototype.ready", time );
		  if( IriSP.MyApiPlayer.hashchangeUpdate==null ){
			IriSP.MyApiPlayer.seek( time );
			
		  } else {			  
			IriSP.MyApiPlayer.hashchangeUpdate = null;
		  }
		}, false );
	 
	} else if (window.attachEvent){
	// for ie hashchange EVENT
		window.attachEvent( "onhashchange", function() {
		  IriSP.trace( "hashchange",time );
		  var url = window.location.href;
		  var time = IriSP.retrieveTimeFragment( url );
		  if( IriSP.MyApiPlayer.hashchangeUpdate == null ){
			IriSP.MyApiPlayer.seek(time);
		  } else {
			IriSP.MyApiPlayer.hashchangeUpdate = null;
		  }
		}, false);
	}
	
	// Search
	//__IriSP.jQuery("#LdtSearchInput").change(function() {__IriSP.Search(this.value);});
	//__IriSP.jQuery("#LdtSearchInput").live('change', function(event) {__IriSP.Search(this.value);}); 
	IriSP.jQuery( "#LdtSearchInput" ).keydown( function() { IriSP.Search( this.value );} );
	IriSP.jQuery("#LdtSearchInput").keyup( function() { IriSP.Search( this.value );} );
	
};

__IriSP.APIplayer.prototype.pause = function(){
	this.hashchangeUpdate = true;
	IriSP.player.sendEvent( 'PAUSE' );
};

__IriSP.APIplayer.prototype.play  = function() {
	this.hashchangeUpdate = true;
	//__IriSP.trace("__IriSP.config.player.type",__IriSP.config.player.type);
	if( IriSP.config.player.type=='jwplayer' ){
	
		IriSP.player.sendEvent( 'PLAY' );
		
	} else if(IriSP.config.player.type == 'dailymotion' 
			  || IriSP.config.player.type == 'youtube' ) {
			  
		var status = IriSP.player.getPlayerState();
		IriSP.trace( "__IriSP.APIplayer.prototype.play.status", status);
		if ( status != 1 ){
			IriSP.player.playVideo();
		} else {
			IriSP.player.pauseVideo();
		}
	}
};

__IriSP.APIplayer.prototype.mute  = function() {
	IriSP.player.sendEvent( 'MUTE' );
	
	//alert(__IriSP.jQuery(".ui-icon-volume-on").css("background-position-x"));
	/* FIXME : remove hardcoded values */
	if ( IriSP.jQuery( ".ui-icon-volume-on" ).css( "background-position" ) == "-144px -160px" ){
		IriSP.jQuery(" .ui-icon-volume-on ").css(" background-position ", "-130px -160px");
	} else {
		IriSP.jQuery( ".ui-icon-volume-on" ).css( "background-position", "-144px -160px" );
	}
};

/* FIXME : rename */
__IriSP.APIplayer.prototype.share = function( network ) {

	/* FIXME : remove hardcoded */
	var MyMessage = encodeURIComponent( "J'écoute Les Retours du Dimanche : " );
	var MyURLNow = window.location.href;
	var shareURL = null;
	//alert(network+" : "+MyURLNow);
	
	/* FIXME : use a sharing library */
	if(network == "facebook"){
			shareURL = "http://www.facebook.com/share.php?u=";			
		}else if(network == "twitter"){
			shareURL  = "http://twitter.com/home?status="+MyMessage;	
		}else if(network == "myspace"){
			shareURL ="http://www.myspace.com/Modules/PostTo/Pages/?u=";
		}else if(network == "delicious"){
			shareURL = "http://delicious.com/save?url=";
		}else if(network == "JameSpot"){
			shareURL = "http://www.jamespot.com/?action=spotit&u=";
			//alert(network+" non actif pour l'instant : "+MyURLNow);
	}
	
	if (shareURL != null)
		window.open( shareURL+encodeURIComponent(MyURLNow) );
	//window.location.href = shareURL+encodeURIComponent(MyURLNow);
};

__IriSP.APIplayer.prototype.seek = function (time) {
	
	if( time==0 ) { time=1; }
	
	IriSP.trace( "__IriSP.APIplayer.prototype.seek", time );
	
	if( IriSP.config.player.type=='jwplayer') {
		//__IriSP.MyApiPlayer.play()
		IriSP.player.sendEvent( 'SEEK', time );
	} else if( IriSP.config.player.type=='dailymotion'
			|| IriSP.config.player.type=='youtube' ) {
		IriSP.player.seekTo( time );
	}
	
	this.changePageUrlOffset( time );
};

__IriSP.APIplayer.prototype.update = function (time) {
	
	if( time != 0 ) {
		this.hashchangeUpdate = true;
		
		IriSP.trace( "__IriSP.APIplayer.prototype.update" ,time);
		IriSP.player.sendEvent( 'SEEK', time );
	}
};

__IriSP.APIplayer.prototype.changePageUrlOffset = function ( time ) {
	//alert(time);
  IriSP.trace( "__IriSP.APIplayer.prototype.changePageUrlOffset" , "CHANGE URL "+ time);
  
  window.location.hash = "#t=" + time;
  window.location.href =  window.location.href;
  
};

/* Media Fragment functionality by Silvia Pfeiffer */ 

IriSP.jumpToTimeoffset = function ( form ) {
	var time = form.time.value;
	IriSP.MyApiPlayer.changePageUrlOffset( time );
};

IriSP.retrieveTimeFragment = function ( url ) {
  var pageoffset = 0;
  var offsettime = 0;
  
  if ( url.split("#")[1] != null ) {
	pageoffset = url.split( "#" )[1];
		if ( pageoffset.substring( 2 ) != null ) {
			offsettime = pageoffset.substring( 2 );
		}
	}
	return offsettime;
};

IriSP.ignoreTimeFragment = function( url ){

	var pageurl = url;
	
	if ( url.split( "#" )[1] != null ) {
		pageurl = url.split( "#" )[0];
	}
 
	return pageurl;
};


/* code specific to jwplayer / creation and listener */

IriSP.currentPosition 	= 0; 
IriSP.currentVolume   	= 50; 
IriSP.player 			= null;
IriSP.startPosition 	= null;
IriSP.firstplay	 		= false;



IriSP.createPlayer = function ( url, streamerPath ) {
	if( IriSP.config.player.type=='dailymotion' ) {
		IriSP.config.player.src = IriSP.config.player.src+"&chromeless=1&enableApi=1";
	} else if ( IriSP.config.player.type=='youtube' ){
		IriSP.config.player.src = IriSP.config.player.src+"&enablejsapi=1&version=3";
	}
	
	IriSP.trace( "__IriSP.createPlayer", "start" );			
	
	IriSP.myUrlFragment = url.split( streamerPath );	
	
	var configTemp = IriSP.jQuery.extend( true, {}, IriSP.config );
	configTemp.player.flashvars.autostart =	"true";
	configTemp.player.flashvars.streamer =	streamerPath;
	configTemp.player.flashvars.file =	IriSP.myUrlFragment[1];
	
	var flashvars 		  = configTemp.player.flashvars;
	var params 			  = configTemp.player.params;
	var attributes 		  = configTemp.player.attributes;
	
	IriSP.trace(
				  "__IriSP.createPlayer",
				  "SWFOBJECT src:"+
				  IriSP.config.player.src+
				  " " +IriSP.config.gui.width+
				  " " +IriSP.config.gui.height
				  );
	
	swfobject.embedSWF(
						IriSP.config.player.src,
						"Ldt-PlaceHolder",
						IriSP.config.gui.width,
						IriSP.config.gui.height,
						"9.0.115", // FIXME : de-hardcode version ?
						false,
						flashvars,
						params,
						attributes
					);
	
	// need a methode to 
	// re execute if this swf call does'nt work 
};


/* jw player api */
IriSP.playerReady  = function (thePlayer) {

	//__IriSP.trace("__IriSP.playerReady","PLAYER READY !!!!!!!!!!!!");
	IriSP.player = window.document[thePlayer.id];
	//__IriSP.trace("__IriSP.playerReady","API CALL "+__IriSP.player);
	IriSP.MyApiPlayer.ready( IriSP.player );
	//__IriSP.trace("__IriSP.playerReady","API CALL END ");
	
	var url = document.location.href;
	var time = IriSP.retrieveTimeFragment( url );
	//__IriSP.trace("__IriSP.playerReady"," "+url+" "+time );
	IriSP.startPosition = time;
	//__IriSP.trace("__IriSP.playerReady"," LISTENER LAUCHER");
	IriSP.addListeners();	
	//__IriSP.trace("__IriSP.playerReady"," LISTENER END");
	
};

IriSP.addListeners = function () {
	if ( IriSP.player ) { 
		IriSP.trace("__IriSP.addListeners","ADD  Listener ");
		IriSP.player.addModelListener( "TIME", "__IriSP.positionListener");
		IriSP.player.addControllerListener( "VOLUME", "__IriSP.volumeListener" );
		IriSP.player.addModelListener( 'STATE', '__IriSP.stateMonitor' );
	} else {
		IriSP.setTimeout( "__IriSP.addListeners()", 100 );
	}

	// et changer les boutons
};

IriSP.stateMonitor = function ( obj ) { 

	 if(obj.newstate == 'PAUSED') {
		IriSP.trace( "__IriSP.stateMonitor", "PAUSE" );
		IriSP.MyApiPlayer.changePageUrlOffset( IriSP.currentPosition );			
		IriSP.jQuery( ".ui-icon-play" ).css( "background-position","0px -160px" );
		
	} else if (obj.newstate == 'PLAYING' ){
		
		IriSP.trace( "__IriSP.stateMonitor", "PLAYING "+IriSP.startPosition );
		
		// force buffering even if autostart is disabled. 
		if ( IriSP.config.player.flashvars.autostart == "false" && IriSP.firstplay == false && IriSP.startPosition == 0 ) {
			IriSP.trace("__IriSP.stateMonitor","first stop ???");
			IriSP.MyApiPlayer.play();
			IriSP.firstplay = true;
			IriSP.MyLdt.checkTime( 1 );
		}
		
		// once that the video is loaded, move it to the correct timecode
		if( IriSP.startPosition!=null ){
			IriSP.MyApiPlayer.update( IriSP.startPosition );
			IriSP.startPosition = null;
		}
		
		
		IriSP.jQuery( ".ui-icon-play" ).css( "background-position", "-16px -160px" );
	} else if (obj.newstate == 'BUFFERING'){
		IriSP.trace( "__IriSP.stateMonitor", "BUFFERING : "+IriSP.config.player.flashvars.autostart );
		//changePageUrlOffset(currentPosition);
	}
	
};

IriSP.positionListener = function(obj) { 
	//__IriSP.trace("__IriSP.positionListener",obj.position);
	IriSP.currentPosition = obj.position; 
	var tmp = document.getElementById( "posit" );
	if (tmp) { tmp.innerHTML = "position: " + IriSP.currentPosition; }
	IriSP.jQuery( "#slider-range-min" ).slider( "value", obj.position);
	IriSP.jQuery( "#amount" ).val(obj.position+" s");
	// display annotation 
	IriSP.MyLdt.checkTime( IriSP.currentPosition );
	
};

IriSP.volumeListener   = function (obj) { 
	IriSP.currentVolume = obj.percentage; 
	var tmp = document.getElementById("vol");
	if (tmp) { tmp.innerHTML = "volume: " + IriSP.currentVolume; }
};


/* dailymotion api 	*/
onDailymotionPlayerReady = function (playerid) {

	//alert(playerid);
	IriSP.player = document.getElementById( IriSP.config.player.attributes.id );
	IriSP.MyApiPlayer.ready( IriSP.player );
	
	var url = document.location.href;
	var time = IriSP.retrieveTimeFragment( url );
	IriSP.startPosition = time;
	IriSP.DailymotionAddListeners();	
	
	IriSP.MyApiPlayer.ready(playerid);
};

IriSP.DailymotionAddListeners = function () {
	if ( IriSP.player ) { 
		IriSP.trace( "__IriSP.addListeners","ADD  Listener " );
		//__IriSP.player.addEventListener("onStateChange", "__IriSP.DailymotionPositionListener");
		setTimeout( "__IriSP.DailymotionPositionListener()", 100);
		IriSP.DailymotionPositionListener();
		/* FIXME : works only with jwplayer */
		IriSP.player.addModelListener( "VOLUME", "__IriSP.volumeListener" );
		//__IriSP.player.addModelListener('STATE', '__IriSP.stateMonitor');
	} else {
		IriSP.setTimeout( "__IriSP.DailymotionAddListeners()", 100);
	}
};

IriSP.DailymotionPositionListener = function() { 
	
	IriSP.currentPosition = IriSP.player.getCurrentTime();
	//__IriSP.trace("__IriSP.DailymotionPositionListener",__IriSP.currentPosition);
	//__IriSP.trace("__IriSP.currentPosition",__IriSP.currentPosition);
	
	IriSP.jQuery( "#slider-range-min" ).slider( "value" , IriSP.currentPosition);
	IriSP.jQuery( "#amount" ).val( IriSP.currentPosition+" s" );
	// afficher annotation 
	/*__IriSP.MyLdt.checkTime(__IriSP.currentPosition);
	*/
	
	setTimeout( "__IriSP.DailymotionPositionListener()", 10 );
};

/* youtube api 	*/
onYouTubePlayerReady= function (playerid){

	var url = document.location.href;
	var time = IriSP.retrieveTimeFragment( url );
	IriSP.player = document.getElementById( IriSP.config.player.attributes.id );
	IriSP.startPosition = time;
	
	IriSP.MyApiPlayer.ready( IriSP.player );
	
	IriSP.MyApiPlayer.seek( time );
	IriSP.MyApiPlayer.play();
	
	
	IriSP.YouTubeAddListeners();	
	IriSP.trace( "onYouTubePlayerReady=", time);
	//__IriSP.MyApiPlayer.ready(playerid);
};

IriSP.YouTubeAddListeners = function () {
	if ( IriSP.player ) { 
		IriSP.trace( "__IriSP.addListeners", "ADD  Listener " );
		IriSP.player.addEventListener( "onStateChange", "__IriSP.YouTubeStateMonitor" );
		setTimeout( "__IriSP.YouTubePositionListener()", 100 );
		
		/* FIXME : works only with jwplayer */
		IriSP.player.addModelListener( "VOLUME", "__IriSP.volumeListener" );
		//__IriSP.player.addModelListener('STATE', '__IriSP.stateMonitor');
	} else {
	}
};

IriSP.YouTubePositionListener = function() { 
	
	IriSP.currentPosition = IriSP.player.getCurrentTime();
	//__IriSP.trace("__IriSP.YouTubePositionListener",__IriSP.currentPosition);
	//__IriSP.trace("__IriSP.currentPosition",__IriSP.currentPosition);
	
	IriSP.MyLdt.checkTime(IriSP.currentPosition);
	IriSP.jQuery( "#slider-range-min" ).slider( "value", IriSP.currentPosition );
	IriSP.jQuery( "#amount" ).val( IriSP.currentPosition+" s" );
	// afficher annotation 
	IriSP.MyLdt.checkTime( IriSP.currentPosition );
	
	
	setTimeout( "__IriSP.YouTubePositionListener()", 10 );
};

IriSP.YouTubeStateMonitor = function (obj) { 
	IriSP.player.addModelListener( '__IriSP.YouTubeStateMonitor ', newstate );
	//alert(newstate+" "+obj.newstate);
	 if(newstate == '2') {
		IriSP.trace("__IriSP.stateMonitor","PAUSE");
		IriSP.MyApiPlayer.changePageUrlOffset( IriSP.currentPosition );
		
	} else if (newstate == '1' || newstate == '1') {
		// une fois la video prete a lire  la déplacer au bon timecode 
		if( IriSP.startPosition!=null ) {
			IriSP.MyApiPlayer.update( IriSP.startPosition );
			IriSP.startPosition = null;
		}
	} else if (newstate == '3'){
		IriSP.trace("__IriSP.stateMonitor","BUFFERING : ");
		//changePageUrlOffset(currentPosition);
	}
	
};


/* 	utils */
// code from http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
/* FIXME: maybe make it a little more robust */
IriSP.stripHtml = function(s){
	return s.replace(/\\&/g, '&amp;').replace(/\\</g, '&lt;').replace(/\\>/g, '&gt;').replace(/\\t/g, '&nbsp;&nbsp;&nbsp;').replace(/\\n/g, '<br />').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
};

// conversion de couleur Decimal vers HexaDecimal || 000 si fff
/* FIXME : move it somewhere else */
IriSP.DEC_HEXA_COLOR = function (dec) {
	 var hexa='0123456789ABCDEF',hex='';
	 var tmp;
	 while (dec>15){
		  tmp = dec-(Math.floor(dec/16))*16;
		  hex = hexa.charAt(tmp)+hex;
		  dec = Math.floor(dec/16);
	 }
	 hex = hexa.charAt(dec)+hex;
	 if (hex == "FFCC00"){ hex="";/* by default color of Ldt annotation */ }
	 return(hex);
};


/* Search  methods	*/
IriSP.SearchOldValue="";
IriSP.searchblockOpen=false;
IriSP.searchblock = function () {
	IriSP.trace( "__IriSP.searchblock", IriSP.searchblockOpen );
	
	if ( IriSP.searchblockOpen == false ) {
		IriSP.jQuery( ".ui-icon-search" ).css( "background-position", "-144px -112px" );
		//__IriSP.jQuery("#LdtSearch").animate({height:26},250);
		IriSP.jQuery("#LdtSearch").show(250);
		/* FIXME : refactor this */
		IriSP.jQuery("#LdtSearchInput").css('background-color','#fff');
		IriSP.jQuery("#LdtSearchInput").focus();
		IriSP.jQuery("#LdtSearchInput").attr('value',IriSP.SearchOldValue);
		IriSP.Search(IriSP.SearchOldValue);
		IriSP.searchblockOpen = true;
	} else {
		IriSP.SearchOldValue = IriSP.jQuery("#LdtSearchInput").attr('value');
		IriSP.jQuery("#LdtSearchInput").attr('value','');
		IriSP.SearchClean();
		IriSP.jQuery(".ui-icon-search").css("background-position","-160px -112px");
		//__IriSP.jQuery("#LdtSearch").animate({height:0},250);
		IriSP.jQuery("#LdtSearch").hide(250);
		IriSP.searchblockOpen = false;
	}
};

/* Search with typeahead */
IriSP.Search = function ( value ){

	annotations = IriSP.LDTligne.annotations;
	
	IriSP.trace("__IriSP.Search", annotations.length+" "+value);
	
	var found  = 0;
	var findmem = 0;
	var factor  = 0;
	IriSP.trace(value,value.length);
	var valueS = value.toLowerCase();
	IriSP.trace("__IriSP.Search", annotations.length+" "+valueS);
	if(valueS.length>=3){
		
		for (var i=0; i < annotations.length; ++i){
			annotation = annotations[i];
			
			IriSP.jQuery("#output2").text(annotation.title+" ?= "+value);
			
			chaine1 = annotation.title.toLowerCase();
			chaine2 = annotation.description.toLowerCase();
			chaine3 = annotation.htmlTags.toLowerCase();
			
			if(chaine1.indexOf(valueS,0) !=-1){
				found+=1;	
			}
			if(chaine2.indexOf(valueS,0) !=-1){
				found+=1;	
			}
			if(chaine3.indexOf(valueS,0) !=-1){
				found+=1;	
			}
			
			findmem += found;
			if(found>0){
				factor = found*8;
				IriSP.jQuery("#"+annotation.id).dequeue();
				IriSP.jQuery("#"+annotation.id).animate({height:factor},200);
				IriSP.jQuery("#"+annotation.id).css('border','2px');
				IriSP.jQuery("#"+annotation.id).css('border-color','red');
				IriSP.jQuery("#"+annotation.id).animate({opacity:0.6},200);
				
				IriSP.trace("!!!!!!!!!!!!!!!!!!"," ?= "+annotation.id);
				IriSP.jQuery("#LdtSearchInput").css('background-color','#e1ffe1');
			}else {
				IriSP.jQuery("#"+annotation.id).dequeue();
				IriSP.jQuery("#"+annotation.id).animate({height:0},250);
				IriSP.jQuery("#"+annotation.id).animate({opacity:0.3},200);
			}
			
			found = 0;
		}
		if(findmem==0){
				IriSP.jQuery("#LdtSearchInput").css('background-color','#f6f6f6');
		}
		
	} else if(value.length==0){
		IriSP.SearchClean();
		IriSP.jQuery("#LdtSearchInput").css('background-color','#fff');		
	} else {
		IriSP.SearchClean();
		IriSP.jQuery("#LdtSearchInput").css('background-color','#f6f6f6');
	}
};

IriSP.SearchClean = function (){
	annotations = IriSP.LDTligne.annotations;
	
	for (var i=0; i < annotations.length; ++i){
			annotation = annotations[i];
			IriSP.jQuery("#"+annotation.id).dequeue();
			IriSP.jQuery("#"+annotation.id).animate({height:0},100);	
			IriSP.jQuery("#"+annotation.id).css('border','0px');
			IriSP.jQuery("#"+annotation.id).css('border-color','red');
			IriSP.jQuery("#"+annotation.id).animate({opacity:0.3},100);
		}
};

IriSP.SearchThisSegment = function (annotation){
	/* FIXME: to implement */
					IriSP.jQuery("#LdtSearchInput").text(annotation.title);
					IriSP.trace("__IriSP.Ligne.prototype.checkTimeLigne",annotation.title);
					/*__IriSP.jQuery("#Ldt-SaDescription").text(annotationTempo.description);
					__IriSP.jQuery("#Ldt-SaKeywordText").html("Mots clefs : "+annotationTempo.htmlTags);*/
};


/* CLASS Ligne (annotationType) 	*/

IriSP.LDTligne 	= null;		
__IriSP.Ligne = function( id, title, description, duration ) {
	this.id 		 = id;
	this.title 		 = title;
	this.description = description;
	//
	this.annotations = new Array();
	this.duration = duration;
	this.annotationOldRead = "";
	IriSP.LDTligne = this;
	IriSP.trace("__IriSP.Ligne","CREATE "+IriSP.LDTligne);
};

__IriSP.Ligne.prototype.addAnnotation = function ( id, begin, end, media, title, description, color, tags ) {
	var myAnnotation = new __IriSP.Annotation(id,begin,end,media,title,description,color,tags,this.duration);
	this.annotations.push(myAnnotation);
	//__IriSP.trace("__IriSP.Ligne.prototype.addAnnotation  ","add annotation "+title);
};

__IriSP.Ligne.prototype.onClickLigneAnnotation = function( id ) {
	/* TODO implement */
	//changePageUrlOffset(currentPosition);
	//player.sendEvent('SEEK', this.start);
	//__IriSP.trace("SEEK",this.start);
};

__IriSP.Ligne.prototype.searchLigneAnnotation = function( id ) {
	/* TODO implement */
	/*for (){
	}*/
};

__IriSP.Ligne.prototype.listAnnotations = function() {
	/* TODO implement */
};

__IriSP.Ligne.prototype.nextAnnotation = function () {
	
	var annotationCibleNumber = this.numAnnotation(this.annotationOldRead)+1;
	var annotationCible = this.annotations[annotationCibleNumber];

	if( annotationCibleNumber<this.annotations.length-1 ){
		IriSP.player.sendEvent( 'SEEK', annotationCible.begin/1000 );
		IriSP.trace( "LIGNE  ", "| next = "+annotationCibleNumber+" - "+this.annotations.length+" | seek :"+annotationCible.begin/1000);
	} else {
		IriSP.player.sendEvent( 'SEEK', this.annotations[0].begin/1000);
	}
		
};

__IriSP.Ligne.prototype.numAnnotation = function (annotationCible){
	for (var i=0; i < this.annotations.length; ++i){
		if(annotationCible == this.annotations[i]){
			return i;
		}
	}
};

__IriSP.Ligne.prototype.checkTime = function(time){
	
	var annotationTempo = -1;
	//__IriSP.trace("__IriSP.Ligne.prototype.checkTimeLigne",time);
	//__IriSP.trace("__IriSP.Ligne.prototype.checkTimeLigne",this.annotations.length);
	
	for (var i=0; i < this.annotations.length; ++i){
		annotationTempo = this.annotations[i];	
		
		//__IriSP.SearchThisSegment(annotationTempo);
		
		if (time>annotationTempo.begin/1000 && time<annotationTempo.end/1000){
			
				// different form the previous
				if(annotationTempo!=this.annotationOldRead){
					this.annotationOldRead = annotationTempo;
					IriSP.jQuery("#Ldt-SaTitle").text(annotationTempo.title);
					IriSP.jQuery("#Ldt-SaDescription").text(annotationTempo.description);
					IriSP.jQuery("#Ldt-SaKeywordText").html("Mots clefs : "+annotationTempo.htmlTags);
					
					//__IriSP.jQuery('#Ldt-ShowAnnotation').slideDown();
					var startPourcent 	= annotationTempo.timeToPourcent((annotationTempo.begin*1+(annotationTempo.end*1-annotationTempo.begin*1)/2),annotationTempo.duration*1); 
					IriSP.jQuery("#Ldt-Show-Arrow").animate({left:startPourcent+'%'},1000);
					IriSP.jQuery("#"+annotationTempo.id).animate({alpha:'100%'},1000);
					//alert(startPourcent);
					var tempolinkurl  =  IriSP.ignoreTimeFragment(window.location.href)+"#t="+(this.annotations[i].begin/1000);
				}
			break;
		} else {
		annotationTempo = -1;
		}		
		
	}
	// si il y en a pas : retractation du volet 
	if( annotationTempo == -1){
		if(annotationTempo != this.annotationOldRead){
			IriSP.trace("Check : ","pas d'annotation ici ");
			IriSP.jQuery("#Ldt-SaTitle").text("");
			IriSP.jQuery("#Ldt-SaDescription").text("");
			IriSP.jQuery("#Ldt-SaKeywordText").html("");
			IriSP.jQuery('#Ldt-ShowAnnotation').slideUp();
			if(this.annotationOldRead){
				IriSP.jQuery("#"+this.annotationOldRead.id).animate({alpha:'70%'},1000);
			}
			//__IriSP.jQuery("#Ldt-Show-Arrow").animate({left:'0%'},1000);
			this.annotationOldRead = annotationTempo;
		}
	}
	//__IriSP.trace("__IriSP.Ligne.prototype.checkTimeLigne",annotationTempo);
};


/* CLASS Annotation */

__IriSP.Annotation = function (){
	var id 	= null;
	var begin 			= null;
	var end 			= null;
	var media 			= null;
	var description	= null;
	var title 			= null;
	var color 			= null;
	var tags			= null;
	IriSP.trace("annotation ","réussi");
};

__IriSP.Annotation = function( id, begin, end, media, title, description, color, tags, duration ){
	this.id 			= id;
	this.begin 			= begin;
	this.end 			= end;
	this.media 			= media;
	this.description 	= description;
	this.title 			= title;
	this.color 			= color;
	this.tags			= tags;
	this.htmlTags		= "";
	this.duration		= duration;
	// draw it 
	this.draw();
	this.drawTags();
	//
	IriSP.trace("Annotation created : ",id);
};

__IriSP.Annotation.prototype.draw = function(){
	//alert (this.duration);
	var startPourcent 	= this.timeToPourcent(this.begin,this.duration); // temps du media 
	var endPourcent 	= this.timeToPourcent(this.end,this.duration)-startPourcent;
	var titleForDiv		= this.title.substr(0,55);
	
	IriSP.jQueryAnnotationTemplate = "<div title='"+IriSP.stripHtml(titleForDiv)+"' id='"+this.id+"'  class='ui-slider-range ui-slider-range-min ui-widget-header iri-chapter' width='100%' style=\"left:"+startPourcent+"%; width:"+endPourcent+"%; padding-top:15px; border-left:solid 1px #aaaaaa; border-right:solid 1px #aaaaaa; background:#"+IriSP.DEC_HEXA_COLOR(this.color)+";\" onClick=\"__IriSP.MyApiPlayer.seek('"+Math.round(this.begin/1000)+"');__IriSP.jQuery('#Ldt-ShowAnnotation').slideDown();\"    ></div> ";
	//alert(this.color+" : "+DEC_HEXA_COLOR(this.color));
	
	/* FIXME: templatize this portion */
	IriSP.jQuerytoolTipTemplate = "<div class='Ldt-tooltip'>"
						+"<div class='title'>"+IriSP.stripHtml(this.title)+"</div>"
						+"<div class='time'>"+this.begin+" : "+this.end+"</div>"
						+"<div class='description'>"+IriSP.stripHtml(this.description)+"</div>"
						+"</div>";
	
	
	IriSP.jQuery("<div>"+IriSP.jQueryAnnotationTemplate+"</div>").appendTo("#Ldt-Annotations");
	// TOOLTIP BUG ! 
	
	IriSP.jQuery("#"+this.id).tooltip({ effect: 'slide'});
	
	
	IriSP.jQuery("#"+this.id).fadeTo(0,0.3);
	IriSP.jQuery("#"+this.id).mouseover(function() {
		IriSP.jQuery("#"+this.id).animate({opacity: 0.6}, 5);
	}).mouseout(function(){		
		IriSP.jQuery("#"+this.id).animate({opacity: 0.3}, 5);
	});
	IriSP.trace("__IriSP.Annotation.prototype.draw","ADD ANOTATION : "+this.begin+" "+this.end+" "+IriSP.stripHtml(this.title)+" | "+startPourcent+" | "+endPourcent+" | duration = "+this.duration);
	
};

__IriSP.Annotation.prototype.drawTags = function(){
	/* FIXME : to implement */
	var KeywordPattern = '<a href=\"\"> '+' </a>';
	
	//__IriSP.trace(" !? Tags : ",this.tags);
	
	if (this.tags!=undefined){
		for (var i = 0; i < this.tags.length; ++i){
			
			//this.htmlTags += '<span onclick=\"ShowTag('+this.tags[i]['id-ref']+');\"  > '+MyTags.getTitle(this.tags[i]['id-ref'])+' </span>'+" , ";
			this.htmlTags += '<span> '+IriSP.MyTags.getTitle(this.tags[i]['id-ref'])+' </span>'+" , ";
			
		}		
	}
};

__IriSP.Annotation.prototype.tootTipAnnotation = function() {
	// 1 chercher le div correspondant
	// 2 y mettre les information
	return this.color + ' ' + this.type + ' apple';
};

__IriSP.Annotation.prototype.onRollOverAnnotation = function (){
	this.tootTip();
};

__IriSP.Annotation.prototype.timeToPourcent = function(time,timetotal){
	return (parseInt(Math.round(time/timetotal*100)));
};
 

/* CLASS Tags */

__IriSP.Tags = function(object){
	this.myTags 	=	object;
	this.htmlTags 	= 	null;
	this.weigthMax 	= 	0;
	//this.mySegments  = 	new array();
};

__IriSP.Tags.prototype.addAnnotation = function (annotation){
	for (var i = 0; i < this.myTags.length; ++i){
		this.myTags[i].mySegments = new Array(); 
		if (annotation.tags!=null){
			for (var j = 0; j < annotation.tags.length; ++j){
				if (this.myTags[i]['id'] == annotation.tags[j]['id-ref']){
					this.myTags[i].mySegments.push([annotation.begin,annotation.end,annotation.id]);
					var weigthTempo = this.myTags[i].mySegments.length;
					var tempo = this.myTags[i].mySegments[weigthTempo-1];
					//__IriSP.trace ("__IriSP.Tags.prototype.addAnnotation ","  "+this.myTags[i]['meta']['dc:title']+" "+this.myTags[i]['id']+" : "+tempo[0]+" - "+tempo[1]);
					
					if (this.weigthMax < weigthTempo ){
						this.weigthMax = weigthTempo;
					}
				}
			}
		}
	}
};

__IriSP.Tags.prototype.getTitle = function (id){
	for (var i = 0; i < this.myTags.length; ++i){
		if(this.myTags[i]['id']==id){
			return(this.myTags[i]['meta']['dc:title']);
		}
	}

};

__IriSP.Tags.prototype.draw = function (){

	IriSP.trace("__IriSP.Tags.prototype.draw"," !!! WELL START " );
	for (var i = 0; i < this.myTags.length; ++i){
		IriSP.trace("__IriSP.Tags.prototype.draw"," ADD Tags : "+this.myTags[i]['id']);
		if(this.myTags[i]['id']!=null){
		this.htmlTags += '<span onclick=\"MyTags.show( \''+this.myTags[i]['id']
						+'\');\" style=\"font-size:'  +((this.myTags[i].mySegments.length/this.weigthMax*10)+8)
						+'px;\" alt=\"'+this.myTags[i].mySegments.length
						+'\"> '+this.myTags[i]['meta']['dc:title']+' </span>'+' , ';
		}
	}
	
	IriSP.jQuery('#Ldt-Tags').html(this.htmlTags);
	IriSP.trace("__IriSP.Tags.prototype.draw"," !!!!  END WMAX= "+this.weigthMax );
	
};

__IriSP.Tags.prototype.show = function (id){
	
	var timeStartOffsetA	=	100000000000000000000;
	var timeStartOffsetB	=	100000000000000000000;
	var timeEndOffsetA		=	0;
	var timeEndOffsetB		=	0;
	var timeStartID;
	var timeEndID;
	var WidthPourCent;
	var leftPourCent;
	var timeStartOffset;
	
	// case 1 : seul segment 
	// case 2 : 2 ou X segments 
	
	
	for (var i = 0; i < this.myTags.length; ++i){
		if (this.myTags[i]['id']==id){
			IriSP.trace("######### TAG DRAWing : "," END" );		
			
			for (var j = 0; j < this.myTags[i].mySegments.length; ++j){
				if(timeStartOffset> this.myTags[i].mySegments[j][0]){
					timeStartOffsetA = this.myTags[i].mySegments[j][0];
					timeStartOffsetB = this.myTags[i].mySegments[j][1];
					timeStartID		 = this.myTags[i].mySegments[j][2]
				}
				if(timeStartOffset> this.myTags[i].mySegments[j][0]){
					timeEndOffsetA  = this.myTags[i].mySegments[j][0];
					timeEndOffsetB  = this.myTags[i].mySegments[j][1];
					timeEndID		= this.myTags[i].mySegments[j][2]
				}
			}
			
		}
	}
	
	// -------------------------------------------------
	// 
	// -------------------------------------------------
	
	leftPourCent 	= IriSP.timeToPourcent((timeStartOffsetA*1+(timeStartOffsetB-timeStartOffsetA)/2),IriSP.MyLdt.duration); 
	WidthPourCent	= IriSP.timeToPourcent((timeEndOffsetA*1+(timeEndOffsetB-timeEndOffsetA)/2),IriSP.MyLdt.duration)-leftPourCent; 			
	//WidthPourCent	= timeToPourcent((timeEndOffsetA*1+(timeEndOffsetB-timeEndOffsetA)/2),MyLdt.duration)-startPourcent; 			
	IriSP.jQuery("#Ldt-Show-Tags").css('left',leftPourCent+'%');
	IriSP.jQuery("#Ldt-Show-Tags").css('width',WidthPourCent+'%');
	IriSP.jQuery("#Ldt-Show-Tags").text('joijoij');
	// like arrow script
	
	
	
};

