
function loadVideo(pUrl, autoplay) {
	
  swfobject.embedSWF(		  
      pUrl + '&rel=1&border=0&fs=1&autoplay=' + 
      (autoplay?1:0), 'player', '264', '227', '9.0.0', false, 
      false, {allowfullscreen: 'true'});
}

function showMyVideos(data) {
  var feed = data.feed;
  var url = '' ;
  var entries = feed.entry || [];
  var html = ['<div class="ytb_vide_list" id="ytb_video">'];
  var playerUrl=[];
  var nb_line=$('#line').text();
  var nb_item=nb_line*3;
  if(nb_item>entries.length){
	  nb_item=entries.length;
  }
	  
  for (var i = 0; i < nb_item; i++) {
    var entry = entries[i];	
    var title = entry.title.$t;
	var thumbnailUrl = entries[i].media$group.media$thumbnail[0].url;
	
	playerUrl[i] = entries[i].media$group.media$content[0].url;
	
	html.push('<div class="ytb_item" id="ytb_video_',i,'"><img src="', 
	              thumbnailUrl, '" width="88" height="64" alt="', title,'" /></div>');
	
  }
  html.push('</div>');
  $(document).ready(function() {
	for( var j = 0; j < nb_item; j++){		
		url=playerUrl[j];
		$('#ytb_video_'+j).click(function(){			
			loadVideo(url,false);
			});
		}
	});
 
 document.getElementById('videos').innerHTML = html.join('');
  if (entries.length > 0) {
    loadVideo(entries[0].media$group.media$content[0].url, false);
  }

}