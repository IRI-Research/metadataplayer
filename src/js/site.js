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

