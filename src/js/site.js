/* site.js - all our site-dependent config : player chrome, cdn locations, etc...*/

IriSP.lib = { 
		jQuery:"http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js",
		jQueryUI:"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js",
		jQueryToolTip:"http://cdn.jquerytools.org/1.2.4/all/jquery.tools.min.js",
		swfObject:"http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
		cssjQueryUI:"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/themes/base/jquery-ui.css"
};

//Player Configuration 
IriSP.config = undefined;
IriSP.configDefault = {
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
				playerready:"IriSP.playerReady"
			},
			attributes:{
				id:"Ldtplayer1",  
				name:"Ldtplayer1"
			}
		},
		module:null
};

//Player Variable
/* FIXME: use an sharing library */
IriSP.LdtShareTool = ""+
"\n<a onclick=\"__IriSP.MyApiPlayer.share('delicious');\" title='partager avec delicious'><span class='share shareDelicious'>&nbsp;</span></a>"+		
"\n<a onclick=\"__IriSP.MyApiPlayer.share('facebook');\" title='partager avec facebook'> <span class='share shareFacebook'>&nbsp;</span></a>"+
"\n<a onclick=\"__IriSP.MyApiPlayer.share('twitter');\" title='partager avec twitter'>  <span class='share shareTwitter'>&nbsp;</span></a>"+
"\n<a onclick=\"__IriSP.MyApiPlayer.share('myspace');\" title='partager avec Myspace'>  <span class='share shareMySpace'>&nbsp;</span></a>";

/* FIXME: move the function out of this file to ui.js*/
IriSP.createPlayerChrome = function(){
	var width = IriSP.config.gui.width;
	var height = IriSP.config.gui.height;
	var heightS = IriSP.config.gui.height-20;
	
	// AUDIO  */
	// PB dans le html : ; 
	IriSP.trace( "__IriSP.createMyHtml",IriSP.config.gui.container );

	
	/* FIXME : factor this in another file */
	if( IriSP.config.gui.mode=="radio" ){
	
	IriSP.jQuery( "#"+IriSP.config.gui.container ).before(
	"<div id='LdtSearchContainer'  style='margin-left:445px;position:absolute;'>\n"+
	"<div id='LdtSearch' style='display:none;background-color:#EEE;width:165px;boder:1px;border-color:#CFCFCF;position:absolute;text-align:center;'><input id='LdtSearchInput' style='margin-top:2px;margin-bottom:2px;' /></div>	\n"+
	"</div>\n"+
	" <div class='cleaner'></div>");
	IriSP.trace("__IriSP.createHtml",IriSP.config.gui.container);
	
	IriSP.jQuery( "<div id='Ldt-Root'>\n"+
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
		" "+IriSP.LdtShareTool+"\n"+
		" \n"+
		"  </div>\n"+
		" <div class='cleaner'></div>"+
		"</div>  "+
		//"<div id='Ldt-Tags'> Mots clefs : </div>"+
		"</div>"+
		"<div id='Ldt-output' style='clear:left;float:none;position:relative;height:200px;width:"+width+"px;overflow:scroll;' ></div>").appendTo("#"+IriSP.config.gui.container);
		// special tricks IE 7
		if (IriSP.jQuery.browser.msie==true && IriSP.jQuery.browser.version=="7.0"){
			//LdtSearchContainer
			//__IriSP.jQuery("#LdtPlayer").attr("margin-top","50px");
			IriSP.jQuery("#Ldt-Root").css("padding-top","25px");
					IriSP.trace("__IriSP.createHtml","IE7 SPECIAL ");
		}
	} else if(IriSP.config.gui.mode=="video") {
	
		IriSP.jQuery(  "<div id='LdtSearchContainer'  style='margin-top:"+heightS+"px;margin-left:445px;position:absolute;'>\n"+
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
		" "+IriSP.LdtShareTool+"\n"+
		" \n"+
		"  </div>\n"+
		" <div class='cleaner'></div>"+
		"</div>  "+
		//"<div id='Ldt-Tags'> Mots clefs : </div>"+
		"</div>"+
		"<div id='Ldt-output'></div>").appendTo("#"+IriSP.config.gui.container);
	
	}
	
	
	IriSP.trace("__IriSP.createHtml",IriSP.jQuery.browser.msie+" "+IriSP.jQuery.browser.version);		
	IriSP.trace("__IriSP.createHtml","end");
	IriSP.jQuery("#Ldt-Annotations").width(width-(75*2));
	IriSP.jQuery("#Ldt-Show-Arrow-container").width(width-(75*2));
	IriSP.jQuery("#Ldt-ShowAnnotation-audio").width(width-10);
	IriSP.jQuery("#Ldt-ShowAnnotation-video").width(width-10);
	IriSP.jQuery("#Ldt-SaKeyword").width(width-10);
	IriSP.jQuery("#Ldt-controler").width(width-10);
	IriSP.jQuery("#Ldt-Control").attr("z-index","100");
	IriSP.jQuery("#Ldt-controler").hide();
	
	IriSP.jQuery("<div id='Ldt-load-container'><div id='Ldt-loader'>&nbsp;</div> Chargement... </div>").appendTo("#Ldt-ShowAnnotation-audio");

	if(IriSP.config.gui.mode=='radio'){
		IriSP.jQuery("#Ldt-load-container").attr("width",IriSP.config.gui.width);
	}
	// Show or not the output
	if(IriSP.config.gui.debug===true){
		IriSP.jQuery("#Ldt-output").show();
	} else {
		IriSP.jQuery("#Ldt-output").hide();
	}
	
};

