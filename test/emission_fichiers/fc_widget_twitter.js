function twitterCallback2(twitters) {
  var statusHTML = [];
  var username = "";
  for (var i=0; i<twitters.length; i++){  
	username = twitters[i].user.screen_name;
    var status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
      return '<a href="'+url+'">'+url+'</a>';
    }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
      return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
    });
    statusHTML.push('<li><span>'+status+'</span><a style="font-size:85%" href="http://twitter.com/'+username+'/statuses/'+twitters[i].id+'">'+relative_time(twitters[i].created_at)+'</a></li>');
  }
  document.getElementById('twitter_update_list_'+username).innerHTML = statusHTML.join('');
}

function relative_time(time_value) {
	  var values = time_value.split(" ");
	  time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
	  var parsed_date = Date.parse(time_value);
	  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	  delta = delta + (relative_to.getTimezoneOffset() * 60);

	  if (delta < 60) {
	    return " il y a moins d'une minute";
	  } else if(delta < 120) {
	    return ' il y a une minute';
	  } else if(delta < (60*60)) {
	    return ' il y a '+(parseInt(delta / 60)).toString() + ' minutes ';
	  } else if(delta < (120*60)) {
	    return ' il y a une heure';
	  } else if(delta < (24*60*60)) {
	    return ' il y a ' + (parseInt(delta / 3600)).toString() + ' heures';
	  } else if(delta < (48*60*60)) {
	    return ' il y a un jour';
	  } else {
	    return ' il y a '+(parseInt(delta / 86400)).toString() + ' jours';
	  }
	}