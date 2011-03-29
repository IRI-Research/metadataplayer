/* 
 * 	
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

if(window.__IriSP === undefined ){ var __IriSP={};}

		
/* CLASS TRACE */

__IriSP.traceNum=0;
__IriSP.trace = function(msg,value){

	if(__IriSP.config.gui.debug===true){
		__IriSP.traceNum += 1;
		__IriSP.jQuery("<div>"+__IriSP.traceNum+" - "+msg+" : "+value+"</div>").appendTo("#Ldt-output");
	}

}

// Player Configuration 
__IriSP.config = undefined;
__IriSP.configDefault = {
		metadata:{
			format:'cinelab',
			src:'',
			load:'jsonp'
		},
		gui:{
			width:650,
			height:0,
			mode:'radio',
			container:'LdtPlayer',
			debug:false, 
			css:'../src/css/LdtPlayer.css'
		},
		player:{
			type:'jwplayer',
			src:'../res/swf/player.swf',
			params:{
				allowfullscreen:"true", 
				allowscriptaccess:"always",
				wmode:"transparent"
			},
			flashvars:{
				streamer:"streamer",
				file:"file", 
				live:"true",
				autostart:"false",
				controlbar:"none",
				playerready:"__IriSP.playerReady"
			},
			attributes:{
				id:"Ldtplayer1",  
				name:"Ldtplayer1"
			}
		},
		module:null
	};
__IriSP.lib = {
			jQuery:"http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js",
			jQueryUI:"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js",
			jQueryToolTip:"http://cdn.jquerytools.org/1.2.4/all/jquery.tools.min.js",
			swfObject:"http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
			cssjQueryUI:"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/themes/base/jquery-ui.css"
		};
		
// Player Variable
__IriSP.LdtShareTool = ""+
"\n<a onclick=\"__IriSP.MyApiPlayer.share('delicious');\" title='partager avec delicious'><span class='share shareDelicious'>&nbsp;</span></a>"+		
"\n<a onclick=\"__IriSP.MyApiPlayer.share('facebook');\" title='partager avec facebook'> <span class='share shareFacebook'>&nbsp;</span></a>"+
"\n<a onclick=\"__IriSP.MyApiPlayer.share('twitter');\" title='partager avec twitter'>  <span class='share shareTwitter'>&nbsp;</span></a>"+
"\n<a onclick=\"__IriSP.MyApiPlayer.share('myspace');\" title='partager avec Myspace'>  <span class='share shareMySpace'>&nbsp;</span></a>";

// Official instance - to refactor ?
__IriSP.MyLdt 		= null;
__IriSP.MyTags 		= null;
__IriSP.MyApiPlayer	= null;
__IriSP.player		= null;

// genral var (old code) - to refactor 
__IriSP.Durration		= null;
__IriSP.playerLdtWidth	= null;
__IriSP.playerLdtHeight	= null;

	
 


__IriSP.init = function (config){

		
		if(config === null){
		
			__IriSP.config 			 = __IriSP.configDefault;
			
		} else {
			
			__IriSP.config 			 = config;
			
			

			if (__IriSP.config.player.params == null){
			__IriSP.config.player.params = __IriSP.configDefault.player.params;}
			
			if (__IriSP.config.player.flashvars == null){
			__IriSP.config.player.flashvars = __IriSP.configDefault.player.flashvars;}
			if (__IriSP.config.player.attributes == null){
			__IriSP.config.player.attributes = __IriSP.configDefault.player.attributes;}
		}
		
		var metadataSrc 		 = __IriSP.config.metadata.src;
		var guiContainer		 = __IriSP.config.gui.container;
		var guiMode				 = __IriSP.config.gui.mode;
		var guiLdtShareTool		 = __IriSP.LdtShareTool;
		// Localize jQuery variable
		__IriSP.jQuery = null;

		/******** Load jQuery if not present *********/
		if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
			var script_tag = document.createElement('script');
			script_tag.setAttribute("type","text/javascript");
			script_tag.setAttribute("src",__IriSP.lib.jQuery);
				//"http://cdn.jquerytools.org/1.2.4/full/jquery.tools.min.js");
			script_tag.onload = scriptLibHandler;
			script_tag.onreadystatechange = function () { // Same thing but for IE
				if (this.readyState == 'complete' || this.readyState == 'loaded') {
					scriptLibHandler();
					
				}
			};
			// Try to find the head, otherwise default to the documentElement
			(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
		} else {
			// The jQuery version on the window is the one we want to use
			 __IriSP.jQuery = window.jQuery;
			scriptLibHandler();
		}

		/******** Called once jQuery has loaded ******/
		function scriptLibHandler() {
			
			var script_jqUi_tooltip = document.createElement('script');
			script_jqUi_tooltip.setAttribute("type","text/javascript");
			script_jqUi_tooltip.setAttribute("src",__IriSP.lib.jQueryToolTip);
			script_jqUi_tooltip.onload = scriptLoadHandler;
			script_jqUi_tooltip.onreadystatechange = function () { // Same thing but for IE
				if (this.readyState == 'complete' || this.readyState == 'loaded') {
					scriptLoadHandler("jquery.tools.min.js loded");
				}
			};
			
			var script_swfObj = document.createElement('script');
			script_swfObj.setAttribute("type","text/javascript");
			script_swfObj.setAttribute("src",__IriSP.lib.swfObject);
			script_swfObj.onload = scriptLoadHandler;
			script_swfObj.onreadystatechange = function () { // Same thing but for IE
				if (this.readyState == 'complete' || this.readyState == 'loaded') {
					scriptLoadHandler("swfobject.js loded");
				}
			};
		
			var script_jqUi = document.createElement('script');
			script_jqUi.setAttribute("type","text/javascript");
			script_jqUi.setAttribute("src",__IriSP.lib.jQueryUI);
			script_jqUi.onload = scriptLoadHandler;
			script_jqUi.onreadystatechange = function () { // Same thing but for IE
				if (this.readyState == 'complete' || this.readyState == 'loaded') {
					scriptLoadHandler("jquery-ui.min.js loded");
				}
			};
		

			

			(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_jqUi_tooltip);
			(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_jqUi);
			(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_swfObj);
			

		};

		/******** Called once all lib are loaded ******/
		var loadLib = 0;
		function scriptLoadHandler(Mylib) {
			//alert(Mylib);
			loadLib +=1;
			if(loadLib===3){ 
				main(); 			  
			}else {
				// __IriSP.jQuery('#'+__IriSP.config.gui.container).html("Loading library ...");
			}
		};

		/******** Our main function ********/
		function main() { 
			

			//  Make __IriSP.jQuery and restore window.jQuery 
			__IriSP.jQuery = window.jQuery.noConflict(true);
			// Call MY Jquery
			__IriSP.jQuery(document).ready(function($) { 
				
				/******* Load CSS *******/
				var css_link_jquery = __IriSP.jQuery("<link>", { 
					rel: "stylesheet", 
					type: "text/css", 
					href: __IriSP.lib.cssjQueryUI,
					'class': "dynamic_css"
				});
				var css_link_custom = __IriSP.jQuery("<link>", { 
					rel: "stylesheet", 
					type: "text/css", 
					href: __IriSP.config.gui.css,
					'class': "dynamic_css"
				});
				
				css_link_jquery.appendTo('head');
				css_link_custom.appendTo('head');   

				// to see dynamicly loaded css on IE
				if ($.browser.msie) {
					$('.dynamic_css').clone().appendTo('head');
				}
				
				//__IriSP.trace("main","ready createMyHtml");
				
				__IriSP.createMyHtml();
				//__IriSP.trace("main","end createMyHtml");
				
				/******* Load Metadata *******/
				
				__IriSP.jQuery.ajax({
					  dataType: __IriSP.config.metadata.load,
					  url:metadataSrc,
					  success : function(json){
					  
							__IriSP.trace("ajax","success");
							
							// START PARSING ----------------------- 
							if(json === ""){
								alert("ERREUR DE CHARGEMENT JSON");
							} else {
							  
							  
								// # CREATE MEDIA  							//
								// # JUSTE ONE PLAYER FOR THE MOMENT		//
								//__IriSP.jQuery("<div></div>").appendTo("#output");
								var MyMedia = new  __IriSP.Media(
																	json.medias[0].id,
																	json.medias[0].href,
																	json.medias[0]['meta']['dc:duration'],
																	json.medias[0]['dc:title'],
																	json.medias[0]['dc:description']);
								
								__IriSP.trace("__IriSP.MyApiPlayer",
																	__IriSP.config.gui.width+"   "
																	+ __IriSP.config.gui.height + " "
																	+ json.medias[0].href + " "
																	+ json.medias[0]['meta']['dc:duration'] + " "
																	+ json.medias[0]['meta']['item']['value']);
								
								// Create APIplayer
								__IriSP.MyApiPlayer = new __IriSP.APIplayer(
																	__IriSP.config.gui.width,
																	__IriSP.config.gui.height,
																	json.medias[0].href,
																	json.medias[0]['meta']['dc:duration'],
																	json.medias[0]['meta']['item']['value']);
							
								// # CREATE THE FIRST LINE  				//
								__IriSP.trace("__IriSP.init.main","__IriSP.Ligne");
								__IriSP.MyLdt = new __IriSP.Ligne (
																	json['annotation-types'][0].id,
																	json['annotation-types'][0]['dc:title'],
																	json['annotation-types'][0]['dc:description'],
																	json.medias[0]['meta']['dc:duration']);			
								
								// CREATE THE TAG CLOUD 					//
								__IriSP.trace("__IriSP.init.main","__IriSP.Tags");
								__IriSP.MyTags =  new __IriSP.Tags (json.tags);
							
								// CREATE THE ANNOTATIONS  				    //
								// JUSTE FOR THE FIRST TYPE   			 	//
								__IriSP.jQuery.each(json.annotations, function(i,item) {
									if (item.meta['id-ref'] == __IriSP.MyLdt.id) {
										//__IriSP.trace("__IriSP.init.main","__IriSP.MyLdt.addAnnotation");
										__IriSP.MyLdt.addAnnotation(
													item.id,
													item.begin,
													item.end,
													item.media,
													item.content.title,
													item.content.description,
													item.content.color,
													item.tags);
									}
										//MyTags.addAnnotation(item);
								});	
								__IriSP.jQuery.each(json.lists, function(i,item) {
									__IriSP.trace("lists","");
								});	
								__IriSP.jQuery.each(json.views, function(i,item) {
									__IriSP.trace("views","");
								});	
							}
							// END PARSING ----------------------- //  
						
										
					},error : function(data){
						  alert("ERROR : "+data);
					}
				  });	
			
			
			});
		}

};


__IriSP.createMyHtml = function(){
		var width = __IriSP.config.gui.width;
		var height = __IriSP.config.gui.height;
		var heightS = __IriSP.config.gui.height-20;
		
		// AUDIO  */
		// PB dans le html : ; 
		__IriSP.trace("__IriSP.createMyHtml",__IriSP.config.gui.container);

		
		
		if(__IriSP.config.gui.mode=="radio"){
		
		__IriSP.jQuery("#"+__IriSP.config.gui.container).before(
		"<div id='LdtSearchContainer'  style='margin-left:445px;position:absolute;'>\n"+
		"<div id='LdtSearch' style='display:none;background-color:#EEE;width:165px;boder:1px;border-color:#CFCFCF;position:absolute;text-align:center;'><input id='LdtSearchInput' style='margin-top:2px;margin-bottom:2px;' /></div>	\n"+
		"</div>\n"+
		" <div class='cleaner'></div>");
		__IriSP.trace("__IriSP.createHtml",__IriSP.config.gui.container);
		
		__IriSP.jQuery( "<div id='Ldt-Root'>\n"+
			"	<div id='Ldt-PlaceHolder'>\n"+
			"		<a href='http://www.adobe.com/go/getflashplayer'>Get flash</a> to see this player	\n"+
			"	</div>\n"+
			"	<div id='Ldt-controler' class='demo'>\n"+
			"		<div class='Ldt-Control1' >\n"+
			"			<button id='ldt-CtrlPlay' onclick='__IriSP.MyApiPlayer.play()'>Lecture / Pause </button>\n"+
			"			<button id='ldt-CtrlNext' onclick='__IriSP.MyLdt.nextAnnotation()'>Suivant</button>\n"+
			"		</div>\n"+
			"		<div id='Ldt-Annotations' class='ui-slider'>\n"+
			"			<div id='slider-range-min'></div>\n"+
			"	</div>\n"+
			"		<div class='Ldt-Control2'>\n"+
			"			<button id='ldt-CtrlLink'  onclick='__IriSP.searchblock()'> Rechercher </button>\n"+
			"			<button id='ldt-CtrlSound' onclick='__IriSP.MyApiPlayer.mute()'>Sound</button>\n"+
			"		</div>\n"+
			"  <div class='cleaner'>&nbsp\;</div> \n"+
			"  <div id='Ldt-Show-Arrow-container'>\n"+
			"  	<div id='Ldt-Show-Arrow'> </div>\n"+
			"  </div>\n"+
			"</div>\n"+
			"<div>\n"+
			" <div id='ldt-Show'> </div>\n"+
			"	<div id='Ldt-ShowAnnotation-audio' class='demo' >\n"+
			"		<div id='Ldt-SaTitle'></div>\n"+
			"		<div id='Ldt-SaDescription'></div>\n"+
			" 		<div class='cleaner'><!--&nbsp\;--></div>\n"+
			" </div>\n"+
			" <div id='Ldt-SaKeyword'>\n"+
			" <div id='Ldt-SaKeywordText'>  </div>\n"+
			" <div class='cleaner'></div>\n"+
			" <div id='Ldt-SaShareTools'>\n"+
			" \n"+
			" "+__IriSP.LdtShareTool+"\n"+
			" \n"+
			"  </div>\n"+
			" <div class='cleaner'></div>"+
			"</div>  "+
			//"<div id='Ldt-Tags'> Mots clefs : </div>"+
			"</div>"+
			"<div id='Ldt-output' style='clear:left;float:none;position:relative;height:200px;width:"+width+"px;overflow:scroll;' ></div>").appendTo("#"+__IriSP.config.gui.container);
			// special tricks IE 7
			if (__IriSP.jQuery.browser.msie==true && __IriSP.jQuery.browser.version=="7.0"){
				//LdtSearchContainer
				//__IriSP.jQuery("#LdtPlayer").attr("margin-top","50px");
				__IriSP.jQuery("#Ldt-Root").css("padding-top","25px");
						__IriSP.trace("__IriSP.createHtml","IE7 SPECIAL ");
			}
		} else if(__IriSP.config.gui.mode=="video") {
		
			__IriSP.jQuery(  "<div id='LdtSearchContainer'  style='margin-top:"+heightS+"px;margin-left:445px;position:absolute;'>\n"+
			"<div id='LdtSearch' style='background-color:#EEE;display:none;width:165px;boder:1px;border-color:#CFCFCF;position:absolute;text-align:center;z-index:999;'><input id='LdtSearchInput' style='margin-top:2px;margin-bottom:2px;' /></div>	\n"+
			"</div>\n"+
			"<div id='Ldt-Root'>\n"+
			"	<div id='Ldt-PlaceHolder'>\n"+
			"		<a href='http://www.adobe.com/go/getflashplayer'>Get flash</a> to see this player	\n"+
			"	</div>\n"+
						
			"	<div id='Ldt-controler' class='demo'>\n"+
			"		<div class='Ldt-Control1' >\n"+
			"			<button id='ldt-CtrlPlay' onclick='__IriSP.MyApiPlayer.play()'>Lecture / Pause </button>\n"+
			"			<button id='ldt-CtrlNext' onclick='__IriSP.MyLdt.nextAnnotation()'>Suivant</button>\n"+
			"		</div>\n"+
			"		<div id='Ldt-Annotations' class='ui-slider'>\n"+
			"			<div id='slider-range-min'></div>\n"+
			"	</div>\n"+
			"		<div class='Ldt-Control2'>\n"+
			"			<button id='ldt-CtrlLink'  onclick='__IriSP.searchblock()'> Rechercher </button>\n"+
			"			<button id='ldt-CtrlSound' onclick='__IriSP.MyApiPlayer.mute()'>Sound</button>\n"+
			"		</div>\n"+
			"  <div class='cleaner'>&nbsp\;</div> \n"+
			"  <div id='Ldt-Show-Arrow-container'>\n"+
			"  	<div id='Ldt-Show-Arrow'> </div>\n"+
			"  </div>\n"+
			"</div>\n"+
			"<div>\n"+
			" <div id='ldt-Show'> </div>\n"+
			"	<div id='Ldt-ShowAnnotation-audio' class='demo' >\n"+
			"		<div id='Ldt-SaTitle'></div>\n"+
			"		<div id='Ldt-SaDescription'></div>\n"+
			" 		<div class='cleaner'><!--&nbsp\;--></div>\n"+
			" </div>\n"+
			" <div id='Ldt-SaKeyword'>\n"+
			" <div id='Ldt-SaKeywordText'>  </div>\n"+
			" <div class='cleaner'></div>\n"+
			" <div id='Ldt-SaShareTools'>\n"+
			" \n"+
			" "+__IriSP.LdtShareTool+"\n"+
			" \n"+
			"  </div>\n"+
			" <div class='cleaner'></div>"+
			"</div>  "+
			//"<div id='Ldt-Tags'> Mots clefs : </div>"+
			"</div>"+
			"<div id='Ldt-output'></div>").appendTo("#"+__IriSP.config.gui.container);
		
		}
		
		
		__IriSP.trace("__IriSP.createHtml",__IriSP.jQuery.browser.msie+" "+__IriSP.jQuery.browser.version);		
		__IriSP.trace("__IriSP.createHtml","end");
		__IriSP.jQuery("#Ldt-Annotations").width(width-(75*2));
		__IriSP.jQuery("#Ldt-Show-Arrow-container").width(width-(75*2));
		__IriSP.jQuery("#Ldt-ShowAnnotation-audio").width(width-10);
		__IriSP.jQuery("#Ldt-ShowAnnotation-video").width(width-10);
		__IriSP.jQuery("#Ldt-SaKeyword").width(width-10);
		__IriSP.jQuery("#Ldt-controler").width(width-10);
		__IriSP.jQuery("#Ldt-Control").attr("z-index","100");
		__IriSP.jQuery("#Ldt-controler").hide();
		
		__IriSP.jQuery("<div id='Ldt-load-container'><div id='Ldt-loader'>&nbsp;</div> Chargement... </div>").appendTo("#Ldt-ShowAnnotation-audio");
	
		if(__IriSP.config.gui.mode=='radio'){
			__IriSP.jQuery("#Ldt-load-container").attr("width",__IriSP.config.gui.width);
		}
		// Show or not the output
		if(__IriSP.config.gui.debug===true){
			__IriSP.jQuery("#Ldt-output").show();
		} else {
			__IriSP.jQuery("#Ldt-output").hide();
		}
		
};

__IriSP.Media = function (id,url,duration,title,description){
		this.id 		 	= id;
		this.url 		= url;
		this.title 		= title;
		this.description = description;
		this.duration 	= duration;
		this.lignes 	  	= new Array();

		__IriSP.trace("__IriSP.Media","Media ID : "+id);
		__IriSP.trace("__IriSP.Media","Media URL : "+url);
		__IriSP.trace("__IriSP.Media","Media title : "+title);
}
__IriSP.Media.prototype.createPlayerMedia = function (width,height,MyStreamer,MySwfPath){
		__IriSP.MyApiPlayer = new __IriSP.APIplayer(width,height,this.url,this.duration,MyStreamer,MySwfPath);
		//createPlayer(width,height,this.url,this.duration,MyStreamer,MySwfPath);
}
__IriSP.Media.prototype.getMediaDuration = function (){
		return (this.duration);
}
__IriSP.Media.prototype.getMediaTitle = function (){
		return (this.title);
}



/* 	INTERFACE : SLIDER ( CONTROL BAR ) | BUTTON ()   */
__IriSP.createInterface = function(width,height,duration){
				
		__IriSP.jQuery("#Ldt-controler").show();
		//__IriSP.jQuery("#Ldt-Root").css('display','visible');
		__IriSP.trace("__IriSP.createInterface",width+","+height+","+duration+",");
		
		__IriSP.jQuery("#Ldt-ShowAnnotation").click(function () { 
			 //__IriSP.jQuery(this).slideUp(); 
		});

		var LdtpPlayerY = __IriSP.jQuery("#Ldt-PlaceHolder").attr("top");
		var LdtpPlayerX = __IriSP.jQuery("#Ldt-PlaceHolder").attr("left");
		__IriSP.jQuery("#slider-range-min").slider({ //range: "min",
			value: 0,
			min: 1,
			max: duration/1000,//1:54:52.66 = 3600+3240+
			step: 0.1,
			slide: function(event, ui) {
				
				//__IriSP.jQuery("#amount").val(ui.value+" s");
				//player.sendEvent('SEEK', ui.value)
				__IriSP.MyApiPlayer.seek(ui.value);
				//changePageUrlOffset(ui.value);
				//player.sendEvent('PAUSE')
			}
		});
		__IriSP.trace("__IriSP.createInterface","ICI");
		__IriSP.jQuery("#amount").val(__IriSP.jQuery("#slider-range-min").slider("value")+" s");
		__IriSP.jQuery(".Ldt-Control1 button:first").button({
			icons: {
				primary: 'ui-icon-play'
			},
			text: false
		}).next().button({
			icons: {
				primary: 'ui-icon-seek-next'
			},
			 text: false
		});
		__IriSP.jQuery(".Ldt-Control2 button:first").button({
			icons: {
				primary: 'ui-icon-search'//,
				//secondary: 'ui-icon-volume-off'
			},
			text: false
		}).next().button({
			icons: {
				primary: 'ui-icon-volume-on'
			},
			 text: false
		});

		// /!\ PB A MODIFIER 
		//__IriSP.MyTags.draw();
		__IriSP.trace("__IriSP.createInterface","ICI2");
		__IriSP.jQuery("#ldt-CtrlPlay").attr("style","background-color:#CD21C24;");
		
		__IriSP.jQuery("#Ldt-load-container").hide();
		
		if(__IriSP.config.gui.mode=="radio" & __IriSP.jQuery.browser.msie!=true){
			__IriSP.jQuery("#Ldtplayer1").attr("height","0");
		}
		__IriSP.trace("__IriSP.createInterface","3");

		__IriSP.trace("__IriSP.createInterface","END");
		
	}



/*  API player - work in progress ... need refactoring of code */ 
__IriSP.APIplayer = function (width,height,url,duration,streamerPath,MySwfPath){
		
		
		this.player 			= null;
		this.hashchangeUpdate 	= null;
		
		this.width				= width;
		this.height				= height;
		this.url				= url;
		this.duration			= duration;
		this.streamerPath		= streamerPath;
		this.MySwfPath			= MySwfPath;
		
		__IriSP.MyApiPlayer		= this;
		
		__IriSP.createPlayer(this.url,this.streamerPath);
		__IriSP.trace("__IriSP.APIplayer","__IriSP.createPlayer");
	
	//__IriSP.config.player
	/*
	- dailymotion  // &enableApi=1&chromeless=1
	- youtube 
	- html5
	- flowplayer 
	- jwplayer
	*/
		
}
__IriSP.APIplayer.prototype.ready = function(player){

	//__IriSP.trace("__IriSP.APIplayer.prototype.APIpReady"," __IriSP.createInterface");
	__IriSP.createInterface(this.width,this.height,this.duration);
	//__IriSP.trace("__IriSP.APIplayer.prototype.APIpReady","END  __IriSP.createInterface");

	// hashchange EVENT
	if (window.addEventListener){
	
	// pour FIREFOX  hashchange EVENT
		window.addEventListener("hashchange", function() {
		  var url = window.location.href;
		  var time = __IriSP.retrieveTimeFragment(url);
		  __IriSP.trace("__IriSP.APIplayer.prototype.ready",time);
		  if(__IriSP.MyApiPlayer.hashchangeUpdate==null){
			__IriSP.MyApiPlayer.seek(time);
			
		  }else{
			__IriSP.MyApiPlayer.hashchangeUpdate=null;
		  }
		}, false);
	 
	} 
	else if (window.attachEvent){
	// FOR IE hashchange EVENT
	
		window.attachEvent("onhashchange", function() {
		  __IriSP.trace("hashchange",time);
		  var url = window.location.href;
		  var time = __IriSP.retrieveTimeFragment(url);
		  if(__IriSP.MyApiPlayer.hashchangeUpdate==null){
			__IriSP.MyApiPlayer.seek(time);
		  }else{
			__IriSP.MyApiPlayer.hashchangeUpdate=null;
		  }
		}, false);
	}
	
	// Search
	//__IriSP.jQuery("#LdtSearchInput").change(function() {__IriSP.Search(this.value);});
	//__IriSP.jQuery("#LdtSearchInput").live('change', function(event) {__IriSP.Search(this.value);}); 
	__IriSP.jQuery("#LdtSearchInput").keydown(function() {__IriSP.Search(this.value);});
	__IriSP.jQuery("#LdtSearchInput").keyup(function() {__IriSP.Search(this.value);});
	
}
__IriSP.APIplayer.prototype.pause = function(){
	this.hashchangeUpdate = true;
	__IriSP.player.sendEvent('PAUSE');
}
__IriSP.APIplayer.prototype.play  = function(){
	this.hashchangeUpdate = true;
	//__IriSP.trace("__IriSP.config.player.type",__IriSP.config.player.type);
	if(__IriSP.config.player.type=='jwplayer'){
	
		__IriSP.player.sendEvent('PLAY');
		
	} else if(__IriSP.config.player.type=='dailymotion' 
			  || __IriSP.config.player.type=='youtube') {
			  
		var status = __IriSP.player.getPlayerState();
		__IriSP.trace("__IriSP.APIplayer.prototype.play.status",status);
		if (status!=1){
			__IriSP.player.playVideo();
		}else{
			__IriSP.player.pauseVideo();
		}
	}
}
__IriSP.APIplayer.prototype.mute  = function(){
	__IriSP.player.sendEvent('MUTE');
	
	//alert(__IriSP.jQuery(".ui-icon-volume-on").css("background-position-x"));
	if (__IriSP.jQuery(".ui-icon-volume-on").css("background-position")=="-144px -160px"){
		__IriSP.jQuery(".ui-icon-volume-on").css("background-position","-130px -160px");
	} else {
		__IriSP.jQuery(".ui-icon-volume-on").css("background-position","-144px -160px");
	}
}
__IriSP.APIplayer.prototype.share = function(network){

	var MyMessage = encodeURIComponent("J'écoute Les Retours du Dimanche : ");
	var MyURLNow = window.location.href;
	var shareURL;
	//alert(network+" : "+MyURLNow);
	
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
	
	window.open(shareURL+encodeURIComponent(MyURLNow));
	//window.location.href = shareURL+encodeURIComponent(MyURLNow);
}
__IriSP.APIplayer.prototype.seek  = function (time){
	if(time==0){time=1}
	__IriSP.trace("__IriSP.APIplayer.prototype.seek",time);
	if(__IriSP.config.player.type=='jwplayer'){
		//__IriSP.MyApiPlayer.play()
		__IriSP.player.sendEvent('SEEK', time);
	} else if(__IriSP.config.player.type=='dailymotion'
			|| __IriSP.config.player.type=='youtube') {
		__IriSP.player.seekTo(time);
	}
	this.changePageUrlOffset(time);
}	
__IriSP.APIplayer.prototype.update = function (time){
	if(time!=0){
	this.hashchangeUpdate = true;
	__IriSP.trace("__IriSP.APIplayer.prototype.update",time);
	__IriSP.player.sendEvent('SEEK', time);
	}
}
__IriSP.APIplayer.prototype.changePageUrlOffset = function (time) {
	//alert(time);
  __IriSP.trace("__IriSP.APIplayer.prototype.changePageUrlOffset","CHANGE URL "+time);
  
  window.location.hash = "#t=" + time;
  window.location.href =  window.location.href;
  
}

/* MEDIA FRAGMENT FUNCTION by Silvia Pfeiffer */ 

__IriSP.jumpToTimeoffset = function (form) {
	var time = form.time.value;
	__IriSP.MyApiPlayer.changePageUrlOffset(time);
}
__IriSP.retrieveTimeFragment = function (url) {
  var pageoffset = 0;
  var offsettime = 0;
  
  if (url.split("#")[1] != null) {
	pageoffset = url.split("#")[1];
		if (pageoffset.substring(2) != null) {
			offsettime = pageoffset.substring(2);
		}
	}
	return offsettime;
}  
__IriSP.ignoreTimeFragment = function(url){
 if (url.split("#")[1] != null) {
	var pageurl= url.split("#")[0];
 }
 return pageurl;
}


/* CODE SPECIAL JW PLAYER  creation + listener */

__IriSP.currentPosition 	= 0; 
__IriSP.currentVolume   	= 50; 
__IriSP.player 				= null;
__IriSP.startPosition 		= null;
__IriSP.firstplay	 		= false;



__IriSP.createPlayer = function (url,streamerPath) {


	if(__IriSP.config.player.type=='dailymotion'){
		__IriSP.config.player.src = __IriSP.config.player.src+"&chromeless=1&enableApi=1";
	} else if (__IriSP.config.player.type=='youtube'){
		__IriSP.config.player.src = __IriSP.config.player.src+"&enablejsapi=1&version=3";
	}
	
	__IriSP.trace("__IriSP.createPlayer","start");			
	
	__IriSP.myUrlFragment = url.split(streamerPath);	
	
	var configTemp = __IriSP.jQuery.extend(true, {}, __IriSP.config);
	configTemp.player.flashvars.autostart =	"true";
	configTemp.player.flashvars.streamer =	streamerPath;
	configTemp.player.flashvars.file =	__IriSP.myUrlFragment[1];
	
	var flashvars 		  = configTemp.player.flashvars;
	var params 			  = configTemp.player.params;
	var attributes 		  = configTemp.player.attributes;
	
	__IriSP.trace(
				  "__IriSP.createPlayer",
				  "SWFOBJECT src:"+
				  __IriSP.config.player.src+
				  " " +__IriSP.config.gui.width+
				  " " +__IriSP.config.gui.height
				  );
	
	swfobject.embedSWF(
						__IriSP.config.player.src,
						"Ldt-PlaceHolder",
						__IriSP.config.gui.width,
						__IriSP.config.gui.height,
						"9.0.115",
						false,
						flashvars,
						params,
						attributes
					);
	
	// need a methode to 
	// re execute if this swf call does'nt work 
}


/* API JW PLAYER 	*/
__IriSP.playerReady  = function (thePlayer) {

	//__IriSP.trace("__IriSP.playerReady","PLAYER READY !!!!!!!!!!!!");
	__IriSP.player = window.document[thePlayer.id];
	//__IriSP.trace("__IriSP.playerReady","API CALL "+__IriSP.player);
	__IriSP.MyApiPlayer.ready(__IriSP.player);
	//__IriSP.trace("__IriSP.playerReady","API CALL END ");
	
	var url = document.location.href;
	var time = __IriSP.retrieveTimeFragment(url);
	//__IriSP.trace("__IriSP.playerReady"," "+url+" "+time );
	__IriSP.startPosition = time;
	//__IriSP.trace("__IriSP.playerReady"," LISTENER LAUCHER");
	__IriSP.addListeners();	
	//__IriSP.trace("__IriSP.playerReady"," LISTENER END");
	
}
__IriSP.addListeners = function () {
	if (__IriSP.player) { 
		__IriSP.trace("__IriSP.addListeners","ADD  Listener ");
		__IriSP.player.addModelListener("TIME", "__IriSP.positionListener");
		__IriSP.player.addControllerListener("VOLUME", "__IriSP.volumeListener");
		__IriSP.player.addModelListener('STATE', '__IriSP.stateMonitor');
	} else {
		__IriSP.setTimeout("__IriSP.addListeners()",100);
	}

	// et changer les boutons
}
__IriSP.stateMonitor = function (obj) { 

	 if(obj.newstate == 'PAUSED')
    {
		__IriSP.trace("__IriSP.stateMonitor","PAUSE");
		__IriSP.MyApiPlayer.changePageUrlOffset(__IriSP.currentPosition);			
		__IriSP.jQuery(".ui-icon-play").css("background-position","0px -160px");
		
	} else if (obj.newstate == 'PLAYING'){
		
		__IriSP.trace("__IriSP.stateMonitor","PLAYING "+__IriSP.startPosition );
		
		// forcer le buffering mais stop du player si dans config 
		if (__IriSP.config.player.flashvars.autostart=="false" && __IriSP.firstplay==false && __IriSP.startPosition == 0){
			__IriSP.trace("__IriSP.stateMonitor","first stop ???");
			__IriSP.MyApiPlayer.play();
			__IriSP.firstplay = true;
			__IriSP.MyLdt.checkTime(1);
		}
		
		// une fois la video prete a lire  la déplacer au bon timecode 
		if(__IriSP.startPosition!=null){
			__IriSP.MyApiPlayer.update(__IriSP.startPosition);
			__IriSP.startPosition = null;
		}
		
		
		__IriSP.jQuery(".ui-icon-play").css("background-position","-16px -160px");
	} else if (obj.newstate == 'BUFFERING'){
		__IriSP.trace("__IriSP.stateMonitor","BUFFERING : "+__IriSP.config.player.flashvars.autostart);
		//changePageUrlOffset(currentPosition);
	}
	
}
__IriSP.positionListener = function(obj) { 
	//__IriSP.trace("__IriSP.positionListener",obj.position);
	__IriSP.currentPosition = obj.position; 
	var tmp = document.getElementById("posit");
	if (tmp) { tmp.innerHTML = "position: " + __IriSP.currentPosition; }
	__IriSP.jQuery("#slider-range-min").slider("value", obj.position);
	__IriSP.jQuery("#amount").val(obj.position+" s");
	// afficher annotation 
	__IriSP.MyLdt.checkTime(__IriSP.currentPosition);
	
}
__IriSP.volumeListener   = function (obj) { 
	__IriSP.currentVolume = obj.percentage; 
	var tmp = document.getElementById("vol");
	if (tmp) { tmp.innerHTML = "volume: " + __IriSP.currentVolume; }
}	


/* API DAILYMOTION 	*/
onDailymotionPlayerReady = function (playerid){

	//alert(playerid);
	__IriSP.player = document.getElementById(__IriSP.config.player.attributes.id);
	__IriSP.MyApiPlayer.ready(__IriSP.player);
	
	var url = document.location.href;
	var time = __IriSP.retrieveTimeFragment(url);
	__IriSP.startPosition = time;
	__IriSP.DailymotionAddListeners();	
	
	__IriSP.MyApiPlayer.ready(playerid);
}
__IriSP.DailymotionAddListeners = function () {
	if (__IriSP.player) { 
		__IriSP.trace("__IriSP.addListeners","ADD  Listener ");
		//__IriSP.player.addEventListener("onStateChange", "__IriSP.DailymotionPositionListener");
		setTimeout("__IriSP.DailymotionPositionListener()",100);
		__IriSP.DailymotionPositionListener();
		__IriSP.player.addModelListener("VOLUME", "__IriSP.volumeListener");
		//__IriSP.player.addModelListener('STATE', '__IriSP.stateMonitor');
	} else {
		__IriSP.setTimeout("__IriSP.DailymotionAddListeners()",100);
	}
}
__IriSP.DailymotionPositionListener = function() { 
	
	__IriSP.currentPosition = __IriSP.player.getCurrentTime();
	//__IriSP.trace("__IriSP.DailymotionPositionListener",__IriSP.currentPosition);
	//__IriSP.trace("__IriSP.currentPosition",__IriSP.currentPosition);
	
	__IriSP.jQuery("#slider-range-min").slider("value",__IriSP.currentPosition);
	__IriSP.jQuery("#amount").val(__IriSP.currentPosition+" s");
	// afficher annotation 
	/*__IriSP.MyLdt.checkTime(__IriSP.currentPosition);
	*/
	
	setTimeout("__IriSP.DailymotionPositionListener()",10);
}

/* API YOUTUBE 	*/
onYouTubePlayerReady= function (playerid){

	var url = document.location.href;
	var time = __IriSP.retrieveTimeFragment(url);
	__IriSP.player = document.getElementById(__IriSP.config.player.attributes.id);
	__IriSP.startPosition = time;
	
	__IriSP.MyApiPlayer.ready(__IriSP.player);
	
	__IriSP.MyApiPlayer.seek(time);
	__IriSP.MyApiPlayer.play();
	
	
	__IriSP.YouTubeAddListeners();	
	__IriSP.trace("onYouTubePlayerReady=",time);
	//__IriSP.MyApiPlayer.ready(playerid);
}
__IriSP.YouTubeAddListeners = function () {
	if (__IriSP.player) { 
		__IriSP.trace("__IriSP.addListeners","ADD  Listener ");
		__IriSP.player.addEventListener("onStateChange", "__IriSP.YouTubeStateMonitor");
		setTimeout("__IriSP.YouTubePositionListener()",100);
		__IriSP.player.addModelListener("VOLUME", "__IriSP.volumeListener");
		//__IriSP.player.addModelListener('STATE', '__IriSP.stateMonitor');
	} else {
		__IriSP.setTimeout("__IriSP.YouTubePositionListener()",100);
	}
}
__IriSP.YouTubePositionListener = function() { 
	
	__IriSP.currentPosition = __IriSP.player.getCurrentTime();
	//__IriSP.trace("__IriSP.YouTubePositionListener",__IriSP.currentPosition);
	//__IriSP.trace("__IriSP.currentPosition",__IriSP.currentPosition);
	
	__IriSP.MyLdt.checkTime(__IriSP.currentPosition);
	__IriSP.jQuery("#slider-range-min").slider("value",__IriSP.currentPosition);
	__IriSP.jQuery("#amount").val(__IriSP.currentPosition+" s");
	// afficher annotation 
	__IriSP.MyLdt.checkTime(__IriSP.currentPosition);
	
	
	setTimeout("__IriSP.YouTubePositionListener()",10);
}
__IriSP.YouTubeStateMonitor = function (obj) { 
	__IriSP.player.addModelListener('__IriSP.YouTubeStateMonitor ', newstate);
	//alert(newstate+" "+obj.newstate);
	 if(newstate == '2')
    {
		__IriSP.trace("__IriSP.stateMonitor","PAUSE");
		__IriSP.MyApiPlayer.changePageUrlOffset(__IriSP.currentPosition);			
		
	}else if (newstate == '1'){
		// une fois la video prete a lire  la déplacer au bon timecode 
		if(__IriSP.startPosition!=null){
			__IriSP.MyApiPlayer.update(__IriSP.startPosition);
			__IriSP.startPosition = null;
		}
	} 
	else if (newstate == '-1'){
		// une fois la video prete a lire  la déplacer au bon timecode 
		if(__IriSP.startPosition!=null){
			__IriSP.MyApiPlayer.update(__IriSP.startPosition);
			__IriSP.startPosition = null;
		}
	} else if (newstate == '3'){
		__IriSP.trace("__IriSP.stateMonitor","BUFFERING : ");
		//changePageUrlOffset(currentPosition);
	}
	
}



/* 	UTIL */
// code from http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
__IriSP.stripHtml = function(s){
	return s.replace(/\\&/g, '&amp;').replace(/\\</g, '&lt;').replace(/\\>/g, '&gt;').replace(/\\t/g, '&nbsp;&nbsp;&nbsp;').replace(/\\n/g, '<br />').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}
// conversion de couleur Decimal vers HexaDecimal || 000 si fff 
__IriSP.DEC_HEXA_COLOR = function (dec){
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
}


/* Search  methodes	*/
__IriSP.SearchOldValue="";
__IriSP.searchblockOpen=false;
__IriSP.searchblock 		= function (){
	__IriSP.trace("__IriSP.searchblock",__IriSP.searchblockOpen);
	if (__IriSP.searchblockOpen==false){
		__IriSP.jQuery(".ui-icon-search").css("background-position","-144px -112px");
		//__IriSP.jQuery("#LdtSearch").animate({height:26},250);
		__IriSP.jQuery("#LdtSearch").show(250);
		__IriSP.jQuery("#LdtSearchInput").css('background-color','#fff');
		__IriSP.jQuery("#LdtSearchInput").focus();
		__IriSP.jQuery("#LdtSearchInput").attr('value',__IriSP.SearchOldValue);
		__IriSP.Search(__IriSP.SearchOldValue);
		__IriSP.searchblockOpen=true;
	} else {
		__IriSP.SearchOldValue = __IriSP.jQuery("#LdtSearchInput").attr('value');
		__IriSP.jQuery("#LdtSearchInput").attr('value','');
		__IriSP.SearchClean();
		__IriSP.jQuery(".ui-icon-search").css("background-position","-160px -112px");
		//__IriSP.jQuery("#LdtSearch").animate({height:0},250);
		__IriSP.jQuery("#LdtSearch").hide(250);
		__IriSP.searchblockOpen=false;
	}
}
__IriSP.Search 				= function (value){

	annotations = __IriSP.LDTligne.annotations;
	
	__IriSP.trace("__IriSP.Search",annotations.length+" "+value);
	var finded  = 0;
	var findmem = 0;
	var factor  = 0;
	__IriSP.trace(value,value.length);
	var valueS = value.toLowerCase();
	__IriSP.trace("__IriSP.Search",annotations.length+" "+valueS);
	if(valueS.length>=3){
		
		for (var i=0; i < annotations.length; ++i){
			annotation = annotations[i];
			
			__IriSP.jQuery("#output2").text(annotation.title+" ?= "+value);
			
			chaine1 = annotation.title.toLowerCase();
			chaine2 = annotation.description.toLowerCase();
			chaine3 = annotation.htmlTags.toLowerCase();
			
			if(chaine1.indexOf(valueS,0) !=-1){
				finded+=1;	
			}
			if(chaine2.indexOf(valueS,0) !=-1){
				finded+=1;	
			}
			if(chaine3.indexOf(valueS,0) !=-1){
				finded+=1;	
			}
			
			findmem += finded;
			if(finded>0){
				factor = finded*8;
				__IriSP.jQuery("#"+annotation.id).dequeue();
				__IriSP.jQuery("#"+annotation.id).animate({height:factor},200);
				__IriSP.jQuery("#"+annotation.id).css('border','2px');
				__IriSP.jQuery("#"+annotation.id).css('border-color','red');
				__IriSP.jQuery("#"+annotation.id).animate({opacity:0.6},200);
				
				__IriSP.trace("!!!!!!!!!!!!!!!!!!"," ?= "+annotation.id);
				__IriSP.jQuery("#LdtSearchInput").css('background-color','#e1ffe1');
			}else {
				__IriSP.jQuery("#"+annotation.id).dequeue();
				__IriSP.jQuery("#"+annotation.id).animate({height:0},250);
				__IriSP.jQuery("#"+annotation.id).animate({opacity:0.3},200);
			}
			
			finded = 0;
		}
		if(findmem==0){
				__IriSP.jQuery("#LdtSearchInput").css('background-color','#f6f6f6');
		}
		
	} else if(value.length==0){
		__IriSP.SearchClean();
		__IriSP.jQuery("#LdtSearchInput").css('background-color','#fff');		
	} else {
		__IriSP.SearchClean();
		__IriSP.jQuery("#LdtSearchInput").css('background-color','#f6f6f6');
	}
}
__IriSP.SearchClean 		= function (){
	annotations = __IriSP.LDTligne.annotations;
	
	for (var i=0; i < annotations.length; ++i){
			annotation = annotations[i];
			__IriSP.jQuery("#"+annotation.id).dequeue();
			__IriSP.jQuery("#"+annotation.id).animate({height:0},100);	
			__IriSP.jQuery("#"+annotation.id).css('border','0px');
			__IriSP.jQuery("#"+annotation.id).css('border-color','red');
			__IriSP.jQuery("#"+annotation.id).animate({opacity:0.3},100);
		}
}
__IriSP.SearchCleanString 	= function (value){
	var reg = new RegExp("(chien)", "g");
	value.replace(reg,"")
	return value;
}	
__IriSP.SearchThisSegment  	= function (annotation){
					__IriSP.jQuery("#LdtSearchInput").text(annotation.title);
					__IriSP.trace("__IriSP.Ligne.prototype.checkTimeLigne",annotation.title);
					/*__IriSP.jQuery("#Ldt-SaDescription").text(annotationTempo.description);
					__IriSP.jQuery("#Ldt-SaKeywordText").html("Mots clefs : "+annotationTempo.htmlTags);*/
}


/* CLASS Ligne (annotationType) 	*/

__IriSP.LDTligne 	= null;		
__IriSP.Ligne = function (id,title,description,duration){
	this.id 		 = id;
	this.title 		 = title;
	this.description = description;
	//
	this.annotations = new Array();
	this.duration = duration;
	this.annotationOldRead="";
	__IriSP.LDTligne = this;
	__IriSP.trace("__IriSP.Ligne","CREATE "+__IriSP.LDTligne);
}	
__IriSP.Ligne.prototype.addAnnotation = function (id,begin,end,media,title,description,color,tags){
	var myAnnotation = new __IriSP.Annotation(id,begin,end,media,title,description,color,tags,this.duration);
	this.annotations.push(myAnnotation);
	//__IriSP.trace("__IriSP.Ligne.prototype.addAnnotation  ","add annotation "+title);
}
__IriSP.Ligne.prototype.onClickLigneAnnotation = function(id){
	//changePageUrlOffset(currentPosition);
	//player.sendEvent('SEEK', this.start);
	//__IriSP.trace("SEEK",this.start);
}
__IriSP.Ligne.prototype.searchLigneAnnotation = function(id){
	/*for (){
	}*/
}
__IriSP.Ligne.prototype.listAnnotations = function(){

}
__IriSP.Ligne.prototype.nextAnnotation = function (){
	var annotationCibleNumber = this.numAnnotation(this.annotationOldRead)+1;
	var annotationCible = this.annotations[annotationCibleNumber];

	if(annotationCibleNumber<this.annotations.length-1){
		annotationCible.begin
		__IriSP.player .sendEvent('SEEK', annotationCible.begin/1000);
		__IriSP.trace("LIGNE  ","| next = "+annotationCibleNumber+" - "+this.annotations.length+" | seek :"+annotationCible.begin/1000);
	}else{
		__IriSP.player .sendEvent('SEEK', this.annotations[0].begin/1000);
	}
	
	
}
__IriSP.Ligne.prototype.numAnnotation = function (annotationCible){
	for (var i=0; i < this.annotations.length; ++i){
		if(annotationCible == this.annotations[i]){
			return i;
		}
	}
}
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
					__IriSP.jQuery("#Ldt-SaTitle").text(annotationTempo.title);
					__IriSP.jQuery("#Ldt-SaDescription").text(annotationTempo.description);
					__IriSP.jQuery("#Ldt-SaKeywordText").html("Mots clefs : "+annotationTempo.htmlTags);
					
					//__IriSP.jQuery('#Ldt-ShowAnnotation').slideDown();
					var startPourcent 	= annotationTempo.timeToPourcent((annotationTempo.begin*1+(annotationTempo.end*1-annotationTempo.begin*1)/2),annotationTempo.duration*1); 
					__IriSP.jQuery("#Ldt-Show-Arrow").animate({left:startPourcent+'%'},1000);
					__IriSP.jQuery("#"+annotationTempo.id).animate({alpha:'100%'},1000);
					//alert(startPourcent);
					var tempolinkurl  =  __IriSP.ignoreTimeFragment(window.location.href)+"#t="+(this.annotations[i].begin/1000);
				}
			break;
		}else{
		annotationTempo=-1;
		}		
		
	}
	// si il y en a pas : retractation du volet 
	if( annotationTempo == -1){
		if(annotationTempo!=this.annotationOldRead){
			__IriSP.trace("Check : ","pas d'annotation ici ");
			__IriSP.jQuery("#Ldt-SaTitle").text("");
			__IriSP.jQuery("#Ldt-SaDescription").text("");
			__IriSP.jQuery("#Ldt-SaKeywordText").html("");
			__IriSP.jQuery('#Ldt-ShowAnnotation').slideUp();
			if(this.annotationOldRead){
				__IriSP.jQuery("#"+this.annotationOldRead.id).animate({alpha:'70%'},1000);
			}
			//__IriSP.jQuery("#Ldt-Show-Arrow").animate({left:'0%'},1000);
			this.annotationOldRead = annotationTempo;
		}
	}
	//__IriSP.trace("__IriSP.Ligne.prototype.checkTimeLigne",annotationTempo);
}


/* CLASS Annotation */

__IriSP.Annotation = function (){
	var id 			= null;
	var begin 			= null;
	var end 			= null;
	var media 			= null;
	var description	= null;
	var title 			= null;
	var color 			= null;
	var tags			= null;
	__IriSP.trace("annotation ","r�ussi")
}	
__IriSP.Annotation = function(id,begin,end,media,title,description,color,tags,duration){
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
	__IriSP.trace("Annotation created : ",id);
}	
__IriSP.Annotation.prototype.draw = function(){
	//alert (this.duration);
	var startPourcent 	= this.timeToPourcent(this.begin,this.duration); // temps du media 
	var endPourcent 	= this.timeToPourcent(this.end,this.duration)-startPourcent;
	var titleForDiv		= this.title.substr(0,55);
	
	__IriSP.jQueryAnnotationTemplate = "<div title='"+__IriSP.stripHtml(titleForDiv)+"' id='"+this.id+"'  class='ui-slider-range ui-slider-range-min ui-widget-header iri-chapter' width='100%' style=\"left:"+startPourcent+"%; width:"+endPourcent+"%; padding-top:15px; border-left:solid 1px #aaaaaa; border-right:solid 1px #aaaaaa; background:#"+__IriSP.DEC_HEXA_COLOR(this.color)+";\" onClick=\"__IriSP.MyApiPlayer.seek('"+Math.round(this.begin/1000)+"');__IriSP.jQuery('#Ldt-ShowAnnotation').slideDown();\"    ></div> ";
	//alert(this.color+" : "+DEC_HEXA_COLOR(this.color));
	
	__IriSP.jQuerytoolTipTemplate = "<div class='Ldt-tooltip'>"
						+"<div class='title'>"+__IriSP.stripHtml(this.title)+"</div>"
						+"<div class='time'>"+this.begin+" : "+this.end+"</div>"
						+"<div class='description'>"+__IriSP.stripHtml(this.description)+"</div>"
						+"</div>";
	
	
	__IriSP.jQuery("<div>"+__IriSP.jQueryAnnotationTemplate+"</div>").appendTo("#Ldt-Annotations");
	// TOOLTIP BUG ! 
	
	__IriSP.jQuery("#"+this.id).tooltip({ effect: 'slide'});
	
	
	__IriSP.jQuery("#"+this.id).fadeTo(0,0.3);
	__IriSP.jQuery("#"+this.id).mouseover(function() {
		__IriSP.jQuery("#"+this.id).animate({opacity: 0.6}, 5)
	}).mouseout(function(){		
		__IriSP.jQuery("#"+this.id).animate({opacity: 0.3}, 5)
	});
	__IriSP.trace("__IriSP.Annotation.prototype.draw","ADD ANOTATION : "+this.begin+" "+this.end+" "+__IriSP.stripHtml(this.title)+" | "+startPourcent+" | "+endPourcent+" | duration = "+this.duration);
	
}	
__IriSP.Annotation.prototype.drawTags = function(){
	var KeywordPattern = '<a href=\"\"> '+' </a>';
	
	//__IriSP.trace(" !? Tags : ",this.tags);
	
	if (this.tags!=undefined){
		for (var i = 0; i < this.tags.length; ++i){
			
			//this.htmlTags += '<span onclick=\"ShowTag('+this.tags[i]['id-ref']+');\"  > '+MyTags.getTitle(this.tags[i]['id-ref'])+' </span>'+" , ";
			this.htmlTags += '<span> '+__IriSP.MyTags.getTitle(this.tags[i]['id-ref'])+' </span>'+" , ";
			
		}		
	}
}
__IriSP.Annotation.prototype.tootTipAnnotation = function() {
	// 1 chercher le div correspondant
	// 2 y mettre les information
	return this.color + ' ' + this.type + ' apple';
}
__IriSP.Annotation.prototype.onRollOverAnnotation = function (){
	this.tootTip();
}		
__IriSP.Annotation.prototype.timeToPourcent = function(time,timetotal){
	return (parseInt(Math.round(time/timetotal*100)));
}
 

/* CLASS Tags */

__IriSP.Tags = function(object){
	this.myTags 	=	object;
	this.htmlTags 	= 	null;
	this.weigthMax 	= 	0;
	//this.mySegments  = 	new array();
}
__IriSP.Tags.prototype.addAnnotation = function (annotation){
	for (var i = 0; i < this.myTags.length; ++i){
		this.myTags[i].mySegments = new Array(); 
		if (annotation.tags!=null){
			for (var j = 0; j < annotation.tags.length; ++j){
				if (this.myTags[i]['id'] == annotation.tags[j]['id-ref']){
					this.myTags[i].mySegments.push([annotation.begin,annotation.end,annotation.id]);
					var weigthTempo = this.myTags[i].mySegments.length
					var tempo = this.myTags[i].mySegments[weigthTempo-1];
					//__IriSP.trace ("__IriSP.Tags.prototype.addAnnotation ","  "+this.myTags[i]['meta']['dc:title']+" "+this.myTags[i]['id']+" : "+tempo[0]+" - "+tempo[1]);
					
					if (this.weigthMax < weigthTempo ){
						this.weigthMax = weigthTempo;
					}
				}
			}
		}
	}
}
__IriSP.Tags.prototype.getTitle = function (id){
	for (var i = 0; i < this.myTags.length; ++i){
		if(this.myTags[i]['id']==id){
			return(this.myTags[i]['meta']['dc:title']);
		}
	}

}
__IriSP.Tags.prototype.draw = function (){

	__IriSP.trace("__IriSP.Tags.prototype.draw"," !!! WELL START " );
	for (var i = 0; i < this.myTags.length; ++i){
		__IriSP.trace("__IriSP.Tags.prototype.draw"," ADD Tags : "+this.myTags[i]['id']);
		if(this.myTags[i]['id']!=null){
		this.htmlTags += '<span onclick=\"MyTags.show( \''+this.myTags[i]['id']
						+'\');\" style=\"font-size:'  +((this.myTags[i].mySegments.length/this.weigthMax*10)+8)
						+'px;\" alt=\"'+this.myTags[i].mySegments.length
						+'\"> '+this.myTags[i]['meta']['dc:title']+' </span>'+' , ';
		}
	}
	
	__IriSP.jQuery('#Ldt-Tags').html(this.htmlTags);
	__IriSP.trace("__IriSP.Tags.prototype.draw"," !!!!  END WMAX= "+this.weigthMax );
	
}
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
			__IriSP.trace("######### TAG DRAWing : "," END" );		
			
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
	
	leftPourCent 	= __IriSP.timeToPourcent((timeStartOffsetA*1+(timeStartOffsetB-timeStartOffsetA)/2),__IriSP.MyLdt.duration); 
	WidthPourCent	= __IriSP.timeToPourcent((timeEndOffsetA*1+(timeEndOffsetB-timeEndOffsetA)/2),__IriSP.MyLdt.duration)-leftPourCent; 			
	//WidthPourCent	= timeToPourcent((timeEndOffsetA*1+(timeEndOffsetB-timeEndOffsetA)/2),MyLdt.duration)-startPourcent; 			
	__IriSP.jQuery("#Ldt-Show-Tags").css('left',leftPourCent+'%');
	__IriSP.jQuery("#Ldt-Show-Tags").css('width',WidthPourCent+'%');
	// like arrow script
	
	
	
}

