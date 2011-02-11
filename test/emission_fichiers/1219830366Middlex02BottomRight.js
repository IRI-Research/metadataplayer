function OAS_RICH(position) {
if (position == 'Middle') {
document.write ('<!-- \n');
document.write ('Support: http://pub.ftv-publicite.fr#OasDefault/2010_1605_I_1_1__RF-FMEte#37186#FMEte300x250.html#148c5#1278432104#270#S#Middle#www.radiofrance.fr/franceculture/les-retours-du-dimanche##\n');
document.write ('--><script id="extFlashMiddle1" type="text/javascript" src="http://pub.ftv-publicite.fr/RealMedia/ads/Creatives/TFSMflashobject.js"></script>\n');
document.write ('<SCRIPT Language="JavaScript">\n');
document.write ('<!--\n');
document.write ('if(!document.body)\n');
document.write ('document.write("<html><body>");\n');
document.write ('OASd = document;\n');
document.write ('var plug = false;\n');
document.write ('var flashVersion = -1;\n');
document.write ('var minFlashVersion = 8;\n');
document.write ('if(navigator.plugins != null && navigator.plugins.length > 0){flashVersion =(navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) ? navigator.plugins["Shockwave Flash" +(navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "")].description.split(" ")[2].split(".")[0] : -1;\n');
document.write ('plug = flashVersion >= minFlashVersion;}\n');
document.write ('else if(navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1){flashVersion = 4;plug = flashVersion >= minFlashVersion;}\n');
document.write ('else if(navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1){flashVersion = 3;plug = flashVersion >= minFlashVersion;}\n');
document.write ('else if(navigator.userAgent.toLowerCase().indexOf("webtv") != -1){flashVersion = 2;plug = flashVersion >= minFlashVersion;}\n');
document.write ('else if((navigator.appVersion.indexOf("MSIE") != -1) &&(navigator.appVersion.toLowerCase().indexOf("win") != -1) &&(navigator.userAgent.indexOf("Opera") == -1)){var oasobj;\n');
document.write ('var exc;\n');
document.write ('try{oasobj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");\n');
document.write ('flashVersion = oasobj.GetVariable("$version");} catch(exc){try{oasobj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");\n');
document.write ('version = "WIN 6,0,21,0"; \n');
document.write ('oasobj.AllowScriptAccess = "always";\n');
document.write ('flashVersion = oasobj.GetVariable("$version");} catch(exc){try{oasobj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");\n');
document.write ('flashVersion = oasobj.GetVariable("$version");} catch(exc){try{oasobj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");\n');
document.write ('flashVersion = "WIN 3,0,18,0";} catch(exc){try{oasobj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");\n');
document.write ('flashVersion = "WIN 2,0,0,11";} catch(exc){flashVersion = -1;}}}}}\n');
document.write ('plug =(flashVersion != -1)? flashVersion.split(" ")[1].split(",")[0] >= minFlashVersion : false;}\n');
document.write ('if(navigator.userAgent.indexOf("MSIE")>=0 && navigator.userAgent.indexOf("Mac")>=0) plug=1;\n');
document.write ('\n');
document.write ('if(plug)\n');
document.write ('{\n');
document.write ('document.write("<div id=\\');
document.write ('"FinContentMiddle1\\');
document.write ('"></div>");\n');
document.write ('function loadFlashMiddle1(){\n');
document.write ('	if(navigator.userAgent.indexOf("MSIE") != -1 && navigator.userAgent.indexOf("Opera") == -1){\n');
document.write ('	\n');
document.write ('		if (extFlashMiddle1.readyState == "complete")\n');
document.write ('  		{\n');
document.write ('	   		FlashObject("http://media.ftv-publicite.fr/0/OasDefault/2010_1605_I_1_1__RF-FMEte//FMEte300x250.swf?clicktag=http://pub.ftv-publicite.fr/5c/www.radiofrance.fr/franceculture/les-retours-du-dimanche/2130910481/Middle/OasDefault/2010_1605_I_1_1__RF-FMEte/FMEte300x250.html/35323766306463663463343536333930?", "OAS_AD_Middle", "width=300 height=250", "opaque", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ,"8", "FinContentMiddle1");\n');
document.write ('			extFlashMiddle1.onreadystatechange = "";\n');
document.write ('		}\n');
document.write ('	\n');
document.write ('		extFlashMiddle1.onreadystatechange = loadFlashMiddle1;\n');
document.write ('	}\n');
document.write ('	else\n');
document.write ('	{\n');
document.write ('           OASfp=" Menu=FALSE swModifyReport=TRUE width=300 height=250 ";\n');
document.write ('           OASd.write("<object id=\\');
document.write ('"techsource_Middle\\');
document.write ('" classid=\\');
document.write ('"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\\');
document.write ('" codebase=\\');
document.write ('"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0\\');
document.write ('""+OASfp+">");\n');
document.write ('           OASd.write("<param name=src value=\\');
document.write ('"http://media.ftv-publicite.fr/0/OasDefault/2010_1605_I_1_1__RF-FMEte//FMEte300x250.swf\\');
document.write ('"><param name=allowScriptAccess value=always><param name=quality value=autohigh><param name=loop value=true><param name=play value=true><param name=menu value=false><param name=wmode value=opaque><param name=FlashVars value=\\');
document.write ('"clicktag=http://pub.ftv-publicite.fr/5c/www.radiofrance.fr/franceculture/les-retours-du-dimanche/2130910481/Middle/OasDefault/2010_1605_I_1_1__RF-FMEte/FMEte300x250.html/35323766306463663463343536333930?\\');
document.write ('">");\n');
document.write ('           OASd.write("<embed src=\\');
document.write ('"http://media.ftv-publicite.fr/0/OasDefault/2010_1605_I_1_1__RF-FMEte//FMEte300x250.swf\\');
document.write ('""+OASfp+"pluginspage=\\');
document.write ('"http://www.macromedia.com/shockwave\\');
document.write ('" type=\\');
document.write ('"application/x-shockwave-flash\\');
document.write ('" width=300 height=250 PLAY=true LOOP=true QUALITY=autohigh WMODE=opaque FlashVars=\\');
document.write ('"clicktag=http://pub.ftv-publicite.fr/5c/www.radiofrance.fr/franceculture/les-retours-du-dimanche/2130910481/Middle/OasDefault/2010_1605_I_1_1__RF-FMEte/FMEte300x250.html/35323766306463663463343536333930?\\');
document.write ('" allowScriptAccess=always>");\n');
document.write ('           OASd.write("</embed></object>");\n');
document.write ('        }\n');
document.write ('\n');
document.write ('}\n');
document.write ('	loadFlashMiddle1();\n');
document.write ('}\n');
document.write ('if(!document.body)\n');
document.write ('document.write("</body></html>");\n');
document.write ('//-->\n');
document.write ('</SCRIPT><IMG SRC="http://pub.ftv-publicite.fr/5/www.radiofrance.fr/franceculture/les-retours-du-dimanche/2130910481/Middle/OasDefault/2010_1605_I_1_1__RF-FMEte/FMEte300x250.html/35323766306463663463343536333930?_RM_EMPTY_" WIDTH="2" HEIGHT="2" style="display: none" />');
}
if (position == 'x02') {
document.write ('<A HREF="http://pub.ftv-publicite.fr/5c/www.radiofrance.fr/franceculture/les-retours-du-dimanche/35827959/x02/OasDefault/default/empty.gif/35323766306463663463343536333930" target="_blank"><IMG SRC="http://pub.ftv-publicite.fr/5/www.radiofrance.fr/franceculture/les-retours-du-dimanche/35827959/x02/OasDefault/default/empty.gif/35323766306463663463343536333930"  WIDTH=2 HEIGHT=2 ALT="" BORDER=0 BORDER="0"></A>');
}
if (position == 'BottomRight') {
document.write ('<A HREF="http://pub.ftv-publicite.fr/5c/www.radiofrance.fr/franceculture/les-retours-du-dimanche/38451496/BottomRight/OasDefault/default/empty.gif/35323766306463663463343536333930" target="_blank"><IMG SRC="http://pub.ftv-publicite.fr/5/www.radiofrance.fr/franceculture/les-retours-du-dimanche/38451496/BottomRight/OasDefault/default/empty.gif/35323766306463663463343536333930"  WIDTH=2 HEIGHT=2 ALT="" BORDER=0 BORDER="0"></A>');
}
}
