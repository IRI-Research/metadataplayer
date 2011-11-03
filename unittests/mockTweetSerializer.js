/* mock serializer, for unit testing. This file is separated from data.js
   because the stub data is huge an we don't want to ship it with the rest
   of the app */

IriSP.MockTweetSerializer = function(DataLoader, url) {
  IriSP.Serializer.call(this, DataLoader, url);
};

IriSP.MockTweetSerializer.prototype = new IriSP.Serializer();   

IriSP.MockTweetSerializer.prototype.currentMedia = function() {
  return this._data.medias[0];
};

// Copy some methods from JSONSerializer because we need them in
// some tests.

IriSP.MockTweetSerializer.prototype.searchAnnotations = IriSP.JSONSerializer.prototype.searchAnnotations;
IriSP.MockTweetSerializer.prototype.searchOccurences = IriSP.JSONSerializer.prototype.searchOccurences;

IriSP.MockTweetSerializer.prototype._data = {
"views": [
{
"id": "0", 
"contents": [
"914e1bcc-b6e0-11e0-a965-00145ea49a02"
], 
"annotation_types": [
"c_5AEE45AE-F0E5-2921-31CB-2683540AA7A4", 
"61bcaa2e-9963-4df2-a987-34c08e184fb6"
]
}
], 
"tags": [
{
"meta": {
"dc:contributor": "IRI", 
"dc:created": "2011-11-03T14:57:21.009848", 
"dc:title": "libidinal", 
"dc:modified": "2011-11-03T14:57:21.009848", 
"dc:creator": "IRI"
}, 
"id": "219d25fc-062c-11e1-93a3-00145ea49a02"
}, 
{
"meta": {
"dc:contributor": "IRI", 
"dc:created": "2011-11-03T14:57:20.999902", 
"dc:title": "eg8", 
"dc:modified": "2011-11-03T14:57:20.999902", 
"dc:creator": "IRI"
}, 
"id": "219ba10a-062c-11e1-93a3-00145ea49a02"
}, 
{
"meta": {
"dc:contributor": "IRI", 
"dc:created": "2011-11-03T14:57:20.993496", 
"dc:title": "enmi", 
"dc:modified": "2011-11-03T14:57:20.993496", 
"dc:creator": "IRI"
}, 
"id": "219aa55c-062c-11e1-93a3-00145ea49a02"
}, 
{
"meta": {
"dc:contributor": "IRI", 
"dc:created": "2011-11-03T14:57:20.995151", 
"dc:title": "Hadopi", 
"dc:modified": "2011-11-03T14:57:20.995151", 
"dc:creator": "IRI"
}, 
"id": "219ae77e-062c-11e1-93a3-00145ea49a02"
}, 
{
"meta": {
"dc:contributor": "IRI", 
"dc:created": "2011-11-03T14:57:20.995151", 
"dc:title": "eG8", 
"dc:modified": "2011-11-03T14:57:20.995151", 
"dc:creator": "IRI"
}, 
"id": "219ae30a-062c-11e1-93a3-00145ea49a02"
}, 
{
"meta": {
"dc:contributor": "IRI", 
"dc:created": "2011-11-03T14:57:21.009848", 
"dc:title": "contribution", 
"dc:modified": "2011-11-03T14:57:21.009848", 
"dc:creator": "IRI"
}, 
"id": "219d2156-062c-11e1-93a3-00145ea49a02"
}, 
{
"meta": {
"dc:contributor": "IRI", 
"dc:created": "2011-11-03T14:57:20.993496", 
"dc:title": "trust", 
"dc:modified": "2011-11-03T14:57:20.993496", 
"dc:creator": "IRI"
}, 
"id": "219aaab6-062c-11e1-93a3-00145ea49a02"
}, 
{
"meta": {
"dc:contributor": "IRI", 
"dc:created": "2011-11-03T14:57:20.999902", 
"dc:title": "barlow", 
"dc:modified": "2011-11-03T14:57:20.999902", 
"dc:creator": "IRI"
}, 
"id": "219b9c96-062c-11e1-93a3-00145ea49a02"
}
], 
"lists": [
{
"items": [
{
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6"
}
], 
"meta": {
"dc:contributor": "undefined", 
"dc:created": "2011-11-03T14:57:20.992502", 
"dc:creator": "undefined", 
"id-ref": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"dc:title": "Découpages personnels", 
"editable": "false", 
"dc:modified": "2011-11-03T14:57:20.992502", 
"dc:description": ""
}, 
"id": "tweet_CB21314C-490A-91C7-ADAF-6212DFCF4E23"
}, 
{
"items": [
{
"id-ref": "c_5AEE45AE-F0E5-2921-31CB-2683540AA7A4"
}
], 
"meta": {
"dc:contributor": "undefined", 
"dc:created": "2011-11-03T14:57:21.010261", 
"dc:creator": "undefined", 
"id-ref": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"dc:title": "Découpages personnels", 
"editable": "false", 
"dc:modified": "2011-11-03T14:57:21.010261", 
"dc:description": ""
}, 
"id": "g_CB21314C-490A-91C7-ADAF-6212DFCF4E23"
}
], 
"medias": [
{
"origin": "0", 
"http://advene.liris.cnrs.fr/ns/frame_of_reference/ms": "o=0", 
"href": "rtmp://media.iri.centrepompidou.fr/ddc_player/video/enmi/iri_enmiprepa2011_1bs.flv", 
"meta": {
"dc:contributor": "IRI", 
"item": {
"name": "streamer", 
"value": "rtmp://media.iri.centrepompidou.fr/ddc_player/"
}, 
"dc:created": "2011-07-25T19:08:41.797402", 
"dc:duration": 1699997, 
"dc:creator": "IRI", 
"dc:created.contents": "2011-07-25", 
"dc:title": "Bernard Stiegler - Introduction ENMI préparatoires 2011", 
"dc:creator.contents": "IRI", 
"dc:modified": "2011-07-25T19:08:41.862348", 
"dc:description": ""
}, 
"id": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"unit": "ms"
}
], 
"meta": {
"dc:contributor": "admin", 
"dc:created": "2011-07-25T19:08:53.255900", 
"dc:creator": "admin", 
"main_media": {
"id-ref": "914e1bcc-b6e0-11e0-a965-00145ea49a02"
}, 
"dc:description": "", 
"dc:title": " \tBernard Stiegler - Introduction ENMI préparatoires 2011", 
"id": "c609832e-b6e0-11e0-9f0f-00145ea49a02", 
"dc:modified": "2011-07-25T20:01:12.072312"
}, 
"annotations": [
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "Bernard Stiegler : Introduction. Nouvel espace public - Wikileaks\nToute publication implique une dissimulation. Estia : le privé c'est le domestique. Le rapport public - privé est profondement bouleversé. Privé = privatisation (des données privées commercialisées). Nous sommes motivés par le désir de publication dont les industries culturelles nous ont privé. Ethique à Nicomaque (Aristote): il n'y a pas de confirance sans filia (amitié).", 
"img": {
"src": ""
}, 
"title": "Introduction", 
"color": "16711680", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "undefined", 
"href": null
}
}, 
"begin": 4364, 
"meta": {
"dc:contributor": "perso", 
"id-ref": "c_5AEE45AE-F0E5-2921-31CB-2683540AA7A4", 
"dc:created": "2011-11-03T14:57:21.010291", 
"dc:modified": "2011-11-03T14:57:21.010291", 
"dc:creator": "perso"
}, 
"end": 445403, 
"tags": null, 
"color": "16711680", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "s_41FCF75C-4DBC-E109-57A2-2683540BC343"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "Première considération. Antigone : Le choeur dit ce qu'est l'Homme : inquiétant est l'homme. Hegel ajoute : la sagesse procède de l'inquiétude. Freud : l'inquiétante étrangeté, fin de la quiétude.", 
"img": {
"src": ""
}, 
"title": "Première considération", 
"color": "16737792", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "undefined", 
"href": null
}
}, 
"begin": 446166, 
"meta": {
"dc:contributor": "perso", 
"id-ref": "c_5AEE45AE-F0E5-2921-31CB-2683540AA7A4", 
"dc:created": "2011-11-03T14:57:21.010291", 
"dc:modified": "2011-11-03T14:57:21.010291", 
"dc:creator": "perso"
}, 
"end": 683750, 
"tags": null, 
"color": "16737792", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "s_ABD0E503-B166-8AAD-7109-2683540BA6C9"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "Le double redoublement époqual (Epoké: suspension du rapport au monde)\nHusserl : nous sommes dans une époké technologique. La confiance passe par un système technique (imprimerie puis Luther) selon B. Gilles. Ces espaces de confiance sont repris par Max Weber (la foi est la conception monothéiste de la confiance) et doivent être calculables.", 
"img": {
"src": ""
}, 
"title": "Le double redoublement époqual", 
"color": "16750848", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "undefined", 
"href": null
}
}, 
"begin": 683750, 
"meta": {
"dc:contributor": "perso", 
"id-ref": "c_5AEE45AE-F0E5-2921-31CB-2683540AA7A4", 
"dc:created": "2011-11-03T14:57:21.010291", 
"dc:modified": "2011-11-03T14:57:21.010291", 
"dc:creator": "perso"
}, 
"end": 1132168, 
"tags": null, 
"color": "16750848", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "s_A677A43D-BD3A-E2EB-46F5-2683540B5B5E"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "La confiance, la foi, la croyance, la filia, tous ces contextes repassent par le concept de l'économie libidinale introduit par Freud. Ethique Hacker (Himanen) : réaction au désinvestissement libidinal. Nous sommes dans un processus de défiance et d'infantilisation de régression (catastrophé). Rôle grandissant des tiers de confiance.", 
"img": {
"src": ""
}, 
"title": "Économie libidinale - tiers de confiance", 
"color": "13369344", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "undefined", 
"href": null
}
}, 
"begin": 1132168, 
"meta": {
"dc:contributor": "perso", 
"id-ref": "c_5AEE45AE-F0E5-2921-31CB-2683540AA7A4", 
"dc:created": "2011-11-03T14:57:21.010291", 
"dc:modified": "2011-11-03T14:57:21.010291", 
"dc:creator": "perso"
}, 
"end": 1694349, 
"tags": null, 
"color": "13369344", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "s_D68D6DC7-756D-0A6C-80C8-2683540B8F72"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "", 
"img": {
"src": ""
}, 
"title": "", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "undefined", 
"href": null
}
}, 
"begin": 1694349, 
"meta": {
"dc:contributor": "perso", 
"id-ref": "c_5AEE45AE-F0E5-2921-31CB-2683540AA7A4", 
"dc:created": "2011-11-03T14:57:21.010291", 
"dc:modified": "2011-11-03T14:57:21.010291", 
"dc:creator": "perso"
}, 
"end": 1696543, 
"tags": null, 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "s_C6A7D84F-B50D-F756-2CAE-2683540B2F12"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "RT @amil310: #enmi RT @amil310: #trust Waiting for Bernard Stiegler Can we trust in SNCF, really? Follow the seminar at http://bit.ly/l4ZbO4", 
"img": {
"src": "http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg"
}, 
"title": "Alexandre Monnin: RT @amil310: #enmi RT @amil310: #trust Waiting for Bernard Stiegler Can we trust in SNCF, really? Follow the seminar at http://bit.ly/l4ZbO4", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 15000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 7409472, \"verified\": false, \"profile_sidebar_fill_color\": \"E3E2DE\", \"profile_text_color\": \"634047\", \"followers_count\": 371, \"protected\": false, \"location\": \"Paris\", \"default_profile_image\": false, \"listed_count\": 68, \"utc_offset\": -10800, \"statuses_count\": 2825, \"description\": \"PhD student in Philosophy working on ontologies (computer & philo ones), tagging, Semantic Web, DigitalH, but mostly advocate for the Philosophy of the Web.\", \"friends_count\": 457, \"profile_link_color\": \"088253\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"EDECE9\", \"id_str\": \"7409472\", \"profile_background_image_url\": \"http://a1.twimg.com/images/themes/theme3/bg.gif\", \"name\": \"Alexandre Monnin\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 6, \"screen_name\": \"aamonnz\", \"url\": \"http://execo.univ-paris1.fr/spip.php?article67\", \"created_at\": \"Wed Jul 11 18:52:41 +0000 2007\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"D3D2CF\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"retweeted_status\": {\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 137694060, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 60, \"protected\": false, \"location\": \"Lyon, France\", \"default_profile_image\": false, \"listed_count\": 9, \"utc_offset\": null, \"statuses_count\": 138, \"description\": \"Prof, University Lyon1, France. Computer Science, Dynamic Knowledge Management and Engineering, Chair www2012\", \"friends_count\": 33, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a0.twimg.com/profile_images/855353678/alain_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"137694060\", \"profile_background_image_url\": \"http://a0.twimg.com/images/themes/theme1/bg.png\", \"name\": \"Alain Mille\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 1, \"screen_name\": \"amil310\", \"url\": \"http://liris.cnrs.fr/alain.mille\", \"created_at\": \"Tue Apr 27 13:25:54 +0000 2010\", \"contributors_enabled\": false, \"time_zone\": null, \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [{\"indices\": [9, 17], \"id\": 137694060, \"id_str\": \"137694060\", \"name\": \"Alain Mille\", \"screen_name\": \"amil310\"}], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}, {\"indices\": [19, 25], \"text\": \"trust\"}], \"urls\": [{\"indices\": [107, 127], \"url\": \"http://bit.ly/l4ZbO4\", \"expanded_url\": null}]}, \"text\": \"#enmi RT @amil310: #trust Waiting for Bernard Stiegler Can we trust in SNCF, really? Follow the seminar at http://bit.ly/l4ZbO4\", \"created_at\": \"Wed May 25 09:00:33 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73312486249611265, \"source\": \"<a href=\\\"http://www.tweetdeck.com\\\" rel=\\\"nofollow\\\">TweetDeck</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73312486249611265\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}, \"contributors\": null, \"entities\": {\"user_mentions\": [{\"indices\": [3, 11], \"id\": 137694060, \"id_str\": \"137694060\", \"name\": \"Alain Mille\", \"screen_name\": \"amil310\"}, {\"indices\": [22, 30], \"id\": 137694060, \"id_str\": \"137694060\", \"name\": \"Alain Mille\", \"screen_name\": \"amil310\"}], \"hashtags\": [{\"indices\": [13, 18], \"text\": \"enmi\"}, {\"indices\": [32, 38], \"text\": \"trust\"}], \"urls\": [{\"indices\": [120, 140], \"url\": \"http://bit.ly/l4ZbO4\", \"expanded_url\": null}]}, \"text\": \"RT @amil310: #enmi RT @amil310: #trust Waiting for Bernard Stiegler Can we trust in SNCF, really? Follow the seminar at http://bit.ly/l4ZbO4\", \"created_at\": \"Wed May 25 09:02:03 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73312863908925440, \"source\": \"<a href=\\\"http://twitter.com/tweetbutton\\\" rel=\\\"nofollow\\\">Tweet Button</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73312863908925440\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 15000, 
"tags": [
{
"id-ref": "219aa55c-062c-11e1-93a3-00145ea49a02"
}, 
{
"id-ref": "219aaab6-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "ada27eb6-1145-4b77-b7d5-dac5c65654e0-73312863908925440"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Souci de live ???", 
"img": {
"src": "http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg"
}, 
"title": "Alexandre Monnin: #enmi Souci de live ???", 
"color": "16763904", 
"polemics": [
"Q"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 50000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 7409472, \"verified\": false, \"profile_sidebar_fill_color\": \"E3E2DE\", \"profile_text_color\": \"634047\", \"followers_count\": 370, \"protected\": false, \"location\": \"Paris\", \"default_profile_image\": false, \"listed_count\": 68, \"utc_offset\": -10800, \"statuses_count\": 2826, \"description\": \"PhD student in Philosophy working on ontologies (computer & philo ones), tagging, Semantic Web, DigitalH, but mostly advocate for the Philosophy of the Web.\", \"friends_count\": 457, \"profile_link_color\": \"088253\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"EDECE9\", \"id_str\": \"7409472\", \"profile_background_image_url\": \"http://a1.twimg.com/images/themes/theme3/bg.gif\", \"name\": \"Alexandre Monnin\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 6, \"screen_name\": \"aamonnz\", \"url\": \"http://execo.univ-paris1.fr/spip.php?article67\", \"created_at\": \"Wed Jul 11 18:52:41 +0000 2007\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"D3D2CF\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Souci de live ???\", \"created_at\": \"Wed May 25 09:02:38 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73313011430993920, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73313011430993920\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 50000, 
"tags": [
{
"id-ref": "219aaab6-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "2ac976de-899e-4a08-8513-e4ea7bc8b92e-73313011430993920"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "RT @borisarfi: Xavier Niel sur #Hadopi \"Je pense que nous avons une mauvaise loi en France, une loi folle\" #eG8  #enmi", 
"img": {
"src": "http://a1.twimg.com/profile_images/309624209/Cy2_normal.png"
}, 
"title": "Samuel Huron: RT @borisarfi: Xavier Niel sur #Hadopi \"Je pense que nous avons une mauvaise loi en France, une loi folle\" #eG8  #enmi", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 80000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 14905766, \"verified\": false, \"profile_sidebar_fill_color\": \"ffffff\", \"profile_text_color\": \"4c9c8f\", \"followers_count\": 414, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 46, \"utc_offset\": -10800, \"statuses_count\": 1929, \"description\": \"Designer @ IRI Centre Pompidou / PhD student in Computer Human interface @ Paris11 : #ui #infoviz #Webdesign, #WebScience, #philosophy, #open #innovation\", \"friends_count\": 542, \"profile_link_color\": \"b3009b\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/309624209/Cy2_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"000000\", \"id_str\": \"14905766\", \"profile_background_image_url\": \"http://a2.twimg.com/profile_background_images/51130859/3577914799_1350cff02e.jpg\", \"name\": \"Samuel Huron\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 268, \"screen_name\": \"cybunk\", \"url\": \"http://www.cybunk.com\", \"created_at\": \"Mon May 26 06:02:18 +0000 2008\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"b3009b\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [{\"indices\": [3, 13], \"id\": 26981417, \"id_str\": \"26981417\", \"name\": \"Boris Arfi\", \"screen_name\": \"borisarfi\"}], \"hashtags\": [{\"indices\": [31, 38], \"text\": \"Hadopi\"}, {\"indices\": [107, 111], \"text\": \"eG8\"}, {\"indices\": [113, 118], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"RT @borisarfi: Xavier Niel sur #Hadopi \\\"Je pense que nous avons une mauvaise loi en France, une loi folle\\\" #eG8  #enmi\", \"created_at\": \"Wed May 25 09:03:08 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73313137151057920, \"source\": \"<a href=\\\"http://www.tweetdeck.com\\\" rel=\\\"nofollow\\\">TweetDeck</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73313137151057920\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 80000, 
"tags": [
{
"id-ref": "219ae30a-062c-11e1-93a3-00145ea49a02"
}, 
{
"id-ref": "219ae30a-062c-11e1-93a3-00145ea49a02"
}, 
{
"id-ref": "219ae77e-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "9b766956-6bb2-4720-a7b5-d150a41ab202-73313137151057920"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi La défiance ne serait seulement la perte de confiance, mais son retournement agressif, son inversion perverse, au sens etymologique", 
"img": {
"src": "http://a3.twimg.com/sticky/default_profile_images/default_profile_6_normal.png"
}, 
"title": "Etienne Armand AMATO: #enmi La défiance ne serait seulement la perte de confiance, mais son retournement agressif, son inversion perverse, au sens etymologique", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 99000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 223600369, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 7, \"protected\": false, \"location\": null, \"default_profile_image\": true, \"listed_count\": 0, \"utc_offset\": null, \"statuses_count\": 1, \"description\": null, \"friends_count\": 1, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/sticky/default_profile_images/default_profile_6_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"223600369\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"Etienne Armand AMATO\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"EA_Amato\", \"url\": null, \"created_at\": \"Mon Dec 06 20:51:31 +0000 2010\", \"contributors_enabled\": false, \"time_zone\": null, \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi La d\\u00e9fiance ne serait seulement la perte de confiance, mais son retournement agressif, son inversion perverse, au sens etymologique\", \"created_at\": \"Wed May 25 09:03:27 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73313214305280000, \"source\": \"web\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73313214305280000\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 99000, 
"tags": [
{
"id-ref": "219ae77e-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "b99854e0-29ad-4bc5-b38b-4aaa2b39f33d-73313214305280000"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi mise en place d'un nouvel espace publique depuis 9/11. Espace public = dispositif de publication.", 
"img": {
"src": "http://a3.twimg.com/profile_images/1339638568/photoNicoS_normal.jpg"
}, 
"title": "nicolasauret: #enmi mise en place d'un nouvel espace publique depuis 9/11. Espace public = dispositif de publication.", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 188000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 293395401, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 3, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 0, \"utc_offset\": 3600, \"statuses_count\": 3, \"description\": \"Founder of Inflammable Productions, producer of new media content + project manager @IRI Centre Pompidou\", \"friends_count\": 10, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/profile_images/1339638568/photoNicoS_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": true, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"293395401\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"nicolasauret\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"nicolasauret\", \"url\": null, \"created_at\": \"Thu May 05 08:31:25 +0000 2011\", \"contributors_enabled\": false, \"time_zone\": \"Paris\", \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi mise en place d'un nouvel espace publique depuis 9/11. Espace public = dispositif de publication.\", \"created_at\": \"Wed May 25 09:04:56 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73313588592386048, \"source\": \"<a href=\\\"http://www.tweetdeck.com\\\" rel=\\\"nofollow\\\">TweetDeck</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73313588592386048\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 188000, 
"tags": [
{
"id-ref": "219ae77e-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "9e283e03-9d4d-4e7f-98f7-c3ea1e4fdabc-73313588592386048"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Catastrophe et Confiance == http://bit.ly/jh2dTK ??", 
"img": {
"src": "http://a1.twimg.com/profile_images/309624209/Cy2_normal.png"
}, 
"title": "Samuel Huron: #enmi Catastrophe et Confiance == http://bit.ly/jh2dTK ??", 
"color": "16763904", 
"polemics": [
"Q", 
"REF"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 209000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 14905766, \"verified\": false, \"profile_sidebar_fill_color\": \"ffffff\", \"profile_text_color\": \"4c9c8f\", \"followers_count\": 414, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 46, \"utc_offset\": -10800, \"statuses_count\": 1929, \"description\": \"Designer @ IRI Centre Pompidou / PhD student in Computer Human interface @ Paris11 : #ui #infoviz #Webdesign, #WebScience, #philosophy, #open #innovation\", \"friends_count\": 542, \"profile_link_color\": \"b3009b\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/309624209/Cy2_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"000000\", \"id_str\": \"14905766\", \"profile_background_image_url\": \"http://a2.twimg.com/profile_background_images/51130859/3577914799_1350cff02e.jpg\", \"name\": \"Samuel Huron\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 268, \"screen_name\": \"cybunk\", \"url\": \"http://www.cybunk.com\", \"created_at\": \"Mon May 26 06:02:18 +0000 2008\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"b3009b\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": [{\"indices\": [34, 54], \"url\": \"http://bit.ly/jh2dTK\", \"expanded_url\": null}]}, \"text\": \"#enmi Catastrophe et Confiance == http://bit.ly/jh2dTK ??\", \"created_at\": \"Wed May 25 09:05:17 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73313679264854016, \"source\": \"<a href=\\\"http://www.tweetdeck.com\\\" rel=\\\"nofollow\\\">TweetDeck</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73313679264854016\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 209000, 
"tags": [
{
"id-ref": "219ae77e-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "b0b5c6f0-5ce3-4292-af28-11ddf80653b6-73313679264854016"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Plus de live -- :(", 
"img": {
"src": "http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg"
}, 
"title": "Alexandre Monnin: #enmi Plus de live -- :(", 
"color": "16763904", 
"polemics": [
"KO"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 287000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 7409472, \"verified\": false, \"profile_sidebar_fill_color\": \"E3E2DE\", \"profile_text_color\": \"634047\", \"followers_count\": 370, \"protected\": false, \"location\": \"Paris\", \"default_profile_image\": false, \"listed_count\": 68, \"utc_offset\": -10800, \"statuses_count\": 2827, \"description\": \"PhD student in Philosophy working on ontologies (computer & philo ones), tagging, Semantic Web, DigitalH, but mostly advocate for the Philosophy of the Web.\", \"friends_count\": 457, \"profile_link_color\": \"088253\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"EDECE9\", \"id_str\": \"7409472\", \"profile_background_image_url\": \"http://a1.twimg.com/images/themes/theme3/bg.gif\", \"name\": \"Alexandre Monnin\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 6, \"screen_name\": \"aamonnz\", \"url\": \"http://execo.univ-paris1.fr/spip.php?article67\", \"created_at\": \"Wed Jul 11 18:52:41 +0000 2007\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"D3D2CF\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Plus de live -- :(\", \"created_at\": \"Wed May 25 09:06:35 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73314003862044672, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73314003862044672\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 287000, 
"tags": [
{
"id-ref": "219ae77e-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "cbcdc041-a215-4f67-baa9-86f818392ac9-73314003862044672"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Dispositif de publication et d'occultation, qui compense la souffrance du peuple qui n'avait plus accès aux moyens de diffusion", 
"img": {
"src": "http://a3.twimg.com/sticky/default_profile_images/default_profile_6_normal.png"
}, 
"title": "Etienne Armand AMATO: #enmi Dispositif de publication et d'occultation, qui compense la souffrance du peuple qui n'avait plus accès aux moyens de diffusion", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 325000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 223600369, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 7, \"protected\": false, \"location\": null, \"default_profile_image\": true, \"listed_count\": 0, \"utc_offset\": null, \"statuses_count\": 2, \"description\": null, \"friends_count\": 1, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/sticky/default_profile_images/default_profile_6_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"223600369\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"Etienne Armand AMATO\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"EA_Amato\", \"url\": null, \"created_at\": \"Mon Dec 06 20:51:31 +0000 2010\", \"contributors_enabled\": false, \"time_zone\": null, \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Dispositif de publication et d'occultation, qui compense la souffrance du peuple qui n'avait plus acc\\u00e8s aux moyens de diffusion\", \"created_at\": \"Wed May 25 09:07:13 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73314163715358720, \"source\": \"web\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73314163715358720\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 325000, 
"tags": [
{
"id-ref": "219ae77e-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "9d2af859-5765-4013-9d81-edfdb44c0b49-73314163715358720"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "== #enmi \"le peuple souffre depuis un siecle de ne plus avoir accés a la publication\"  B. Stiegler", 
"img": {
"src": "http://a1.twimg.com/profile_images/309624209/Cy2_normal.png"
}, 
"title": "Samuel Huron: == #enmi \"le peuple souffre depuis un siecle de ne plus avoir accés a la publication\"  B. Stiegler", 
"color": "16763904", 
"polemics": [
"REF"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 340000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 14905766, \"verified\": false, \"profile_sidebar_fill_color\": \"ffffff\", \"profile_text_color\": \"4c9c8f\", \"followers_count\": 414, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 46, \"utc_offset\": -10800, \"statuses_count\": 1930, \"description\": \"Designer @ IRI Centre Pompidou / PhD student in Computer Human interface @ Paris11 : #ui #infoviz #Webdesign, #WebScience, #philosophy, #open #innovation\", \"friends_count\": 542, \"profile_link_color\": \"b3009b\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/309624209/Cy2_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"000000\", \"id_str\": \"14905766\", \"profile_background_image_url\": \"http://a2.twimg.com/profile_background_images/51130859/3577914799_1350cff02e.jpg\", \"name\": \"Samuel Huron\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 268, \"screen_name\": \"cybunk\", \"url\": \"http://www.cybunk.com\", \"created_at\": \"Mon May 26 06:02:18 +0000 2008\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"b3009b\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [3, 8], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"== #enmi \\\"le peuple souffre depuis un siecle de ne plus avoir acc\\u00e9s a la publication\\\"  B. Stiegler\", \"created_at\": \"Wed May 25 09:07:28 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73314228785790976, \"source\": \"<a href=\\\"http://www.tweetdeck.com\\\" rel=\\\"nofollow\\\">TweetDeck</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73314228785790976\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 340000, 
"tags": [
{
"id-ref": "219ae77e-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "4310875e-202f-4704-87e4-bd456f2a615f-73314228785790976"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi B.Stiegler \"Montée en puissance du web numérique : nouvel espace de publication. Investit par un désir de publication.\" #eg8 #barlow", 
"img": {
"src": "http://a3.twimg.com/profile_images/1339638568/photoNicoS_normal.jpg"
}, 
"title": "nicolasauret: #enmi B.Stiegler \"Montée en puissance du web numérique : nouvel espace de publication. Investit par un désir de publication.\" #eg8 #barlow", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 401000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 293395401, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 3, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 0, \"utc_offset\": 3600, \"statuses_count\": 4, \"description\": \"Founder of Inflammable Productions, producer of new media content + project manager @IRI Centre Pompidou\", \"friends_count\": 10, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/profile_images/1339638568/photoNicoS_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": true, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"293395401\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"nicolasauret\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"nicolasauret\", \"url\": null, \"created_at\": \"Thu May 05 08:31:25 +0000 2011\", \"contributors_enabled\": false, \"time_zone\": \"Paris\", \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}, {\"indices\": [126, 130], \"text\": \"eg8\"}, {\"indices\": [131, 138], \"text\": \"barlow\"}], \"urls\": []}, \"text\": \"#enmi B.Stiegler \\\"Mont\\u00e9e en puissance du web num\\u00e9rique : nouvel espace de publication. Investit par un d\\u00e9sir de publication.\\\" #eg8 #barlow\", \"created_at\": \"Wed May 25 09:08:29 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73314481106714624, \"source\": \"<a href=\\\"http://www.tweetdeck.com\\\" rel=\\\"nofollow\\\">TweetDeck</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73314481106714624\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 401000, 
"tags": [
{
"id-ref": "219b9c96-062c-11e1-93a3-00145ea49a02"
}, 
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}, 
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "807eec28-0165-4fee-8f1e-0facab6d5bb7-73314481106714624"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Problème de réseau, le live est tombé. On essayera à la pause", 
"img": {
"src": "http://a3.twimg.com/sticky/default_profile_images/default_profile_0_normal.png"
}, 
"title": "Yves-Marie Haussonne: #enmi Problème de réseau, le live est tombé. On essayera à la pause", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 572000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 47312923, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 4, \"protected\": false, \"location\": null, \"default_profile_image\": true, \"listed_count\": 0, \"utc_offset\": null, \"statuses_count\": 124, \"description\": null, \"friends_count\": 0, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/sticky/default_profile_images/default_profile_0_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"47312923\", \"profile_background_image_url\": \"http://a0.twimg.com/images/themes/theme1/bg.png\", \"name\": \"Yves-Marie Haussonne\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"ymh_work\", \"url\": null, \"created_at\": \"Mon Jun 15 11:25:05 +0000 2009\", \"contributors_enabled\": false, \"time_zone\": null, \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Probl\\u00e8me de r\\u00e9seau, le live est tomb\\u00e9. On essayera \\u00e0 la pause\", \"created_at\": \"Wed May 25 09:11:20 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73315198567579649, \"source\": \"web\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73315198567579649\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 572000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "e0511a28-c123-4af0-859d-dfaa52ee74b3-73315198567579649"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi \"inquiétant est l'homme\" sophocle  \"l'inquiétude est la source de la philo \" Hegel \"inquietante étrangeté\" Freud http://bit.ly/l0fanQ", 
"img": {
"src": "http://a1.twimg.com/profile_images/309624209/Cy2_normal.png"
}, 
"title": "Samuel Huron: #enmi \"inquiétant est l'homme\" sophocle  \"l'inquiétude est la source de la philo \" Hegel \"inquietante étrangeté\" Freud http://bit.ly/l0fanQ", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 628000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 14905766, \"verified\": false, \"profile_sidebar_fill_color\": \"ffffff\", \"profile_text_color\": \"4c9c8f\", \"followers_count\": 414, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 46, \"utc_offset\": -10800, \"statuses_count\": 1931, \"description\": \"Designer @ IRI Centre Pompidou / PhD student in Computer Human interface @ Paris11 : #ui #infoviz #Webdesign, #WebScience, #philosophy, #open #innovation\", \"friends_count\": 542, \"profile_link_color\": \"b3009b\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/309624209/Cy2_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"000000\", \"id_str\": \"14905766\", \"profile_background_image_url\": \"http://a2.twimg.com/profile_background_images/51130859/3577914799_1350cff02e.jpg\", \"name\": \"Samuel Huron\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 268, \"screen_name\": \"cybunk\", \"url\": \"http://www.cybunk.com\", \"created_at\": \"Mon May 26 06:02:18 +0000 2008\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"b3009b\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": [{\"indices\": [119, 139], \"url\": \"http://bit.ly/l0fanQ\", \"expanded_url\": null}]}, \"text\": \"#enmi \\\"inqui\\u00e9tant est l'homme\\\" sophocle  \\\"l'inqui\\u00e9tude est la source de la philo \\\" Hegel \\\"inquietante \\u00e9tranget\\u00e9\\\" Freud http://bit.ly/l0fanQ\", \"created_at\": \"Wed May 25 09:12:16 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73315436367855616, \"source\": \"<a href=\\\"http://www.tweetdeck.com\\\" rel=\\\"nofollow\\\">TweetDeck</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73315436367855616\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 628000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "61a45d63-7352-4611-9b09-bd37077987fe-73315436367855616"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Cable débranché. Le live est de retour", 
"img": {
"src": "http://a3.twimg.com/sticky/default_profile_images/default_profile_0_normal.png"
}, 
"title": "Yves-Marie Haussonne: #enmi Cable débranché. Le live est de retour", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 735000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 47312923, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 4, \"protected\": false, \"location\": null, \"default_profile_image\": true, \"listed_count\": 0, \"utc_offset\": null, \"statuses_count\": 125, \"description\": null, \"friends_count\": 0, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/sticky/default_profile_images/default_profile_0_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"47312923\", \"profile_background_image_url\": \"http://a0.twimg.com/images/themes/theme1/bg.png\", \"name\": \"Yves-Marie Haussonne\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"ymh_work\", \"url\": null, \"created_at\": \"Mon Jun 15 11:25:05 +0000 2009\", \"contributors_enabled\": false, \"time_zone\": null, \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Cable d\\u00e9branch\\u00e9. Le live est de retour\", \"created_at\": \"Wed May 25 09:14:03 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73315883203833856, \"source\": \"web\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73315883203833856\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 735000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "21693b30-7ded-4dbc-9827-136b15cfa5ec-73315883203833856"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi ça remarche :) ++", 
"img": {
"src": "http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg"
}, 
"title": "Alexandre Monnin: #enmi ça remarche :) ++", 
"color": "16763904", 
"polemics": [
"OK"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 799000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 7409472, \"verified\": false, \"profile_sidebar_fill_color\": \"E3E2DE\", \"profile_text_color\": \"634047\", \"followers_count\": 370, \"protected\": false, \"location\": \"Paris\", \"default_profile_image\": false, \"listed_count\": 68, \"utc_offset\": -10800, \"statuses_count\": 2828, \"description\": \"PhD student in Philosophy working on ontologies (computer & philo ones), tagging, Semantic Web, DigitalH, but mostly advocate for the Philosophy of the Web.\", \"friends_count\": 457, \"profile_link_color\": \"088253\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"EDECE9\", \"id_str\": \"7409472\", \"profile_background_image_url\": \"http://a1.twimg.com/images/themes/theme3/bg.gif\", \"name\": \"Alexandre Monnin\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 6, \"screen_name\": \"aamonnz\", \"url\": \"http://execo.univ-paris1.fr/spip.php?article67\", \"created_at\": \"Wed Jul 11 18:52:41 +0000 2007\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"D3D2CF\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi \\u00e7a remarche :) ++\", \"created_at\": \"Wed May 25 09:15:07 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73316151018524672, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73316151018524672\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 799000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "d09bcacb-90e4-4a55-91d7-088125d9acfb-73316151018524672"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Descartes: interruption de ma volonté par rapport à mon entendement==", 
"img": {
"src": "http://a3.twimg.com/profile_images/379424006/PortaitVP120Ko_normal.jpg"
}, 
"title": "Vincent Puig: #enmi Descartes: interruption de ma volonté par rapport à mon entendement==", 
"color": "16763904", 
"polemics": [
"REF"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 856000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 68424173, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 93, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 5, \"utc_offset\": 3600, \"statuses_count\": 169, \"description\": \"Co-founder of IRI/Centre Pompidou, Research Institute on cultural technologies (annotation tools, collaborative Web and social networks, multimodal interfaces)\", \"friends_count\": 5, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/profile_images/379424006/PortaitVP120Ko_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"68424173\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"Vincent Puig\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"vincentpuig\", \"url\": \"http://www.iri.centrepompidou.fr\", \"created_at\": \"Mon Aug 24 14:49:27 +0000 2009\", \"contributors_enabled\": false, \"time_zone\": \"Paris\", \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Descartes: interruption de ma volont\\u00e9 par rapport \\u00e0 mon entendement==\", \"created_at\": \"Wed May 25 09:16:04 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73316389389217792, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73316389389217792\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 856000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "09b576b3-36c7-4775-91f0-41e38fe73ccd-73316389389217792"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi le Web est aussi une technique de publication ++", 
"img": {
"src": "http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg"
}, 
"title": "Alexandre Monnin: #enmi le Web est aussi une technique de publication ++", 
"color": "16763904", 
"polemics": [
"OK"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 912000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 7409472, \"verified\": false, \"profile_sidebar_fill_color\": \"E3E2DE\", \"profile_text_color\": \"634047\", \"followers_count\": 370, \"protected\": false, \"location\": \"Paris\", \"default_profile_image\": false, \"listed_count\": 68, \"utc_offset\": -10800, \"statuses_count\": 2829, \"description\": \"PhD student in Philosophy working on ontologies (computer & philo ones), tagging, Semantic Web, DigitalH, but mostly advocate for the Philosophy of the Web.\", \"friends_count\": 457, \"profile_link_color\": \"088253\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"EDECE9\", \"id_str\": \"7409472\", \"profile_background_image_url\": \"http://a1.twimg.com/images/themes/theme3/bg.gif\", \"name\": \"Alexandre Monnin\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 6, \"screen_name\": \"aamonnz\", \"url\": \"http://execo.univ-paris1.fr/spip.php?article67\", \"created_at\": \"Wed Jul 11 18:52:41 +0000 2007\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"D3D2CF\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi le Web est aussi une technique de publication ++\", \"created_at\": \"Wed May 25 09:17:00 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73316627998982144, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73316627998982144\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 912000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "429dd17e-568f-453b-b821-56cb419ba9d3-73316627998982144"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Donc d'écriture ++", 
"img": {
"src": "http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg"
}, 
"title": "Alexandre Monnin: #enmi Donc d'écriture ++", 
"color": "16763904", 
"polemics": [
"OK"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 923000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 7409472, \"verified\": false, \"profile_sidebar_fill_color\": \"E3E2DE\", \"profile_text_color\": \"634047\", \"followers_count\": 370, \"protected\": false, \"location\": \"Paris\", \"default_profile_image\": false, \"listed_count\": 68, \"utc_offset\": -10800, \"statuses_count\": 2830, \"description\": \"PhD student in Philosophy working on ontologies (computer & philo ones), tagging, Semantic Web, DigitalH, but mostly advocate for the Philosophy of the Web.\", \"friends_count\": 457, \"profile_link_color\": \"088253\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/513016932/twitterProfilePhoto_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"EDECE9\", \"id_str\": \"7409472\", \"profile_background_image_url\": \"http://a1.twimg.com/images/themes/theme3/bg.gif\", \"name\": \"Alexandre Monnin\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 6, \"screen_name\": \"aamonnz\", \"url\": \"http://execo.univ-paris1.fr/spip.php?article67\", \"created_at\": \"Wed Jul 11 18:52:41 +0000 2007\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"D3D2CF\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Donc d'\\u00e9criture ++\", \"created_at\": \"Wed May 25 09:17:11 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73316673108717568, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73316673108717568\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 923000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "8b191a27-5c94-46c7-8d3e-1f0a3476f2cf-73316673108717568"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Stiegler :Ce qui constitue l'humain depuis l'hominisation, c'est qu'il est régulièrement confronté à des suspensions technologiques.++", 
"img": {
"src": "http://a3.twimg.com/profile_images/1339638568/photoNicoS_normal.jpg"
}, 
"title": "nicolasauret: #enmi Stiegler :Ce qui constitue l'humain depuis l'hominisation, c'est qu'il est régulièrement confronté à des suspensions technologiques.++", 
"color": "16763904", 
"polemics": [
"OK"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 1015000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 293395401, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 3, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 0, \"utc_offset\": 3600, \"statuses_count\": 7, \"description\": \"Founder of Inflammable Productions, producer of new media content + project manager @IRI Centre Pompidou\", \"friends_count\": 10, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/profile_images/1339638568/photoNicoS_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": true, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"293395401\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"nicolasauret\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"nicolasauret\", \"url\": null, \"created_at\": \"Thu May 05 08:31:25 +0000 2011\", \"contributors_enabled\": false, \"time_zone\": \"Paris\", \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Stiegler :Ce qui constitue l'humain depuis l'hominisation, c'est qu'il est r\\u00e9guli\\u00e8rement confront\\u00e9 \\u00e0 des suspensions technologiques.++\", \"created_at\": \"Wed May 25 09:18:43 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73317056312909824, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73317056312909824\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 1015000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "0f98001e-3c41-4b9c-921d-e369cfbdef7f-73317056312909824"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Stiegler pense un rapport de l'Homme au monde par la technologie++", 
"img": {
"src": "http://a3.twimg.com/profile_images/379424006/PortaitVP120Ko_normal.jpg"
}, 
"title": "Vincent Puig: #enmi Stiegler pense un rapport de l'Homme au monde par la technologie++", 
"color": "16763904", 
"polemics": [
"OK"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 1025000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 68424173, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 93, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 5, \"utc_offset\": 3600, \"statuses_count\": 170, \"description\": \"Co-founder of IRI/Centre Pompidou, Research Institute on cultural technologies (annotation tools, collaborative Web and social networks, multimodal interfaces)\", \"friends_count\": 5, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/profile_images/379424006/PortaitVP120Ko_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"68424173\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"Vincent Puig\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"vincentpuig\", \"url\": \"http://www.iri.centrepompidou.fr\", \"created_at\": \"Mon Aug 24 14:49:27 +0000 2009\", \"contributors_enabled\": false, \"time_zone\": \"Paris\", \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Stiegler pense un rapport de l'Homme au monde par la technologie++\", \"created_at\": \"Wed May 25 09:18:53 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73317100810276864, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73317100810276864\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 1025000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "b72f2732-73d9-4425-8e62-9d32b31a51fd-73317100810276864"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi la foi conception monotheist de lq confiance et calculabilite ==", 
"img": {
"src": "http://a3.twimg.com/sticky/default_profile_images/default_profile_0_normal.png"
}, 
"title": "Yves-Marie Haussonne: #enmi la foi conception monotheist de lq confiance et calculabilite ==", 
"color": "16763904", 
"polemics": [
"REF"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 1155000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 47312923, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 4, \"protected\": false, \"location\": null, \"default_profile_image\": true, \"listed_count\": 0, \"utc_offset\": null, \"statuses_count\": 126, \"description\": null, \"friends_count\": 0, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/sticky/default_profile_images/default_profile_0_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"47312923\", \"profile_background_image_url\": \"http://a0.twimg.com/images/themes/theme1/bg.png\", \"name\": \"Yves-Marie Haussonne\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"ymh_work\", \"url\": null, \"created_at\": \"Mon Jun 15 11:25:05 +0000 2009\", \"contributors_enabled\": false, \"time_zone\": null, \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi la foi conception monotheist de lq confiance et calculabilite ==\", \"created_at\": \"Wed May 25 09:21:03 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73317644270444546, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73317644270444546\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 1155000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "875ca945-960a-4346-9149-692ba6575f2d-73317644270444546"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "RT @nicolasauret: #enmi Stiegler :Ce qui constitue l'humain depuis l'hominisation, c'est qu'il est régulièrement confronté à des suspens ...", 
"img": {
"src": "http://a2.twimg.com/profile_images/1367788685/021EB7A5-E5A2-4837-9E76-4A6019F6E1EE_normal"
}, 
"title": "Fabian Gental: RT @nicolasauret: #enmi Stiegler :Ce qui constitue l'humain depuis l'hominisation, c'est qu'il est régulièrement confronté à des suspens ...", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 1174000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 115128839, \"verified\": false, \"profile_sidebar_fill_color\": \"d6fffc\", \"profile_text_color\": \"04838f\", \"followers_count\": 10, \"protected\": false, \"location\": \"Paris / Limoges / Berlin\", \"default_profile_image\": false, \"listed_count\": 0, \"utc_offset\": 3600, \"statuses_count\": 14, \"description\": \"\\u00c9tudiant en design @ENSCI les Ateliers\\n@ENSA Limoges\", \"friends_count\": 29, \"profile_link_color\": \"05d5ff\", \"profile_image_url\": \"http://a2.twimg.com/profile_images/1367788685/021EB7A5-E5A2-4837-9E76-4A6019F6E1EE_normal\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"bf9dc9\", \"id_str\": \"115128839\", \"profile_background_image_url\": \"http://a3.twimg.com/profile_background_images/76127896/test.png\", \"name\": \"Fabian Gental\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": true, \"favourites_count\": 1, \"screen_name\": \"3615fabe\", \"url\": null, \"created_at\": \"Wed Feb 17 18:08:52 +0000 2010\", \"contributors_enabled\": false, \"time_zone\": \"Berlin\", \"profile_sidebar_border_color\": \"ffffff\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"retweeted_status\": {\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 293395401, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 3, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 0, \"utc_offset\": 3600, \"statuses_count\": 7, \"description\": \"Founder of Inflammable Productions, producer of new media content + project manager @IRI Centre Pompidou\", \"friends_count\": 10, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/profile_images/1339638568/photoNicoS_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": true, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"293395401\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"nicolasauret\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"nicolasauret\", \"url\": null, \"created_at\": \"Thu May 05 08:31:25 +0000 2011\", \"contributors_enabled\": false, \"time_zone\": \"Paris\", \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Stiegler :Ce qui constitue l'humain depuis l'hominisation, c'est qu'il est r\\u00e9guli\\u00e8rement confront\\u00e9 \\u00e0 des suspensions technologiques.++\", \"created_at\": \"Wed May 25 09:18:43 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73317056312909824, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73317056312909824\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}, \"contributors\": null, \"entities\": {\"user_mentions\": [{\"indices\": [3, 16], \"id\": 293395401, \"id_str\": \"293395401\", \"name\": \"nicolasauret\", \"screen_name\": \"nicolasauret\"}], \"hashtags\": [{\"indices\": [18, 23], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"RT @nicolasauret: #enmi Stiegler :Ce qui constitue l'humain depuis l'hominisation, c'est qu'il est r\\u00e9guli\\u00e8rement confront\\u00e9 \\u00e0 des suspens ...\", \"created_at\": \"Wed May 25 09:21:22 +0000 2011\", \"truncated\": true, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73317726894030848, \"source\": \"<a href=\\\"http://tapbots.com/tweetbot\\\" rel=\\\"nofollow\\\">Tweetbot for iPhone</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73317726894030848\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 1174000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "1adb2d5a-71d6-4704-acc1-71f7b2fe0130-73317726894030848"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi B stiegler :  Crise de confiance, car le nouveau systeme techno fait exploser les cadres sociaux http://bit.ly/l4ZbO4", 
"img": {
"src": "http://a3.twimg.com/profile_images/1339638568/photoNicoS_normal.jpg"
}, 
"title": "nicolasauret: #enmi B stiegler :  Crise de confiance, car le nouveau systeme techno fait exploser les cadres sociaux http://bit.ly/l4ZbO4", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 1181000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 293395401, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 3, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 0, \"utc_offset\": 3600, \"statuses_count\": 8, \"description\": \"Founder of Inflammable Productions, producer of new media content + project manager @IRI Centre Pompidou\", \"friends_count\": 10, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/profile_images/1339638568/photoNicoS_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": true, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"293395401\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"nicolasauret\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"nicolasauret\", \"url\": null, \"created_at\": \"Thu May 05 08:31:25 +0000 2011\", \"contributors_enabled\": false, \"time_zone\": \"Paris\", \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": [{\"indices\": [103, 123], \"url\": \"http://bit.ly/l4ZbO4\", \"expanded_url\": null}]}, \"text\": \"#enmi B stiegler :  Crise de confiance, car le nouveau systeme techno fait exploser les cadres sociaux http://bit.ly/l4ZbO4\", \"created_at\": \"Wed May 25 09:21:29 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73317753603358720, \"source\": \"<a href=\\\"http://www.tweetdeck.com\\\" rel=\\\"nofollow\\\">TweetDeck</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73317753603358720\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 1181000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "52afd104-e38f-4bf6-a23d-a6b5d6379da8-73317753603358720"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi Confiance calculable (raison) et foi (non calculable mais motivée par le desir) ne s'opposent pas.--", 
"img": {
"src": "http://a3.twimg.com/profile_images/379424006/PortaitVP120Ko_normal.jpg"
}, 
"title": "Vincent Puig: #enmi Confiance calculable (raison) et foi (non calculable mais motivée par le desir) ne s'opposent pas.--", 
"color": "16763904", 
"polemics": [
"KO"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 1438000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 68424173, \"verified\": false, \"profile_sidebar_fill_color\": \"DDEEF6\", \"profile_text_color\": \"333333\", \"followers_count\": 93, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 5, \"utc_offset\": 3600, \"statuses_count\": 171, \"description\": \"Co-founder of IRI/Centre Pompidou, Research Institute on cultural technologies (annotation tools, collaborative Web and social networks, multimodal interfaces)\", \"friends_count\": 5, \"profile_link_color\": \"0084B4\", \"profile_image_url\": \"http://a3.twimg.com/profile_images/379424006/PortaitVP120Ko_normal.jpg\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": false, \"profile_background_color\": \"C0DEED\", \"id_str\": \"68424173\", \"profile_background_image_url\": \"http://a3.twimg.com/images/themes/theme1/bg.png\", \"name\": \"Vincent Puig\", \"lang\": \"en\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 0, \"screen_name\": \"vincentpuig\", \"url\": \"http://www.iri.centrepompidou.fr\", \"created_at\": \"Mon Aug 24 14:49:27 +0000 2009\", \"contributors_enabled\": false, \"time_zone\": \"Paris\", \"profile_sidebar_border_color\": \"C0DEED\", \"default_profile\": true, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#enmi Confiance calculable (raison) et foi (non calculable mais motiv\\u00e9e par le desir) ne s'opposent pas.--\", \"created_at\": \"Wed May 25 09:25:46 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73318830763552769, \"source\": \"<a href=\\\"http://amateur.iri.centrepompidou.fr/\\\" rel=\\\"nofollow\\\">Annotation pol\\u00e9mique par tweeter</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73318830763552769\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 1438000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "6d1660e1-a012-484b-99f8-e6cc49ccf39c-73318830763552769"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#eg8 #enmi :: le language, interface entre l'homme et le monde.   technologie de confiance ?? Qu'elles liberté ?", 
"img": {
"src": "http://a1.twimg.com/profile_images/309624209/Cy2_normal.png"
}, 
"title": "Samuel Huron: #eg8 #enmi :: le language, interface entre l'homme et le monde.   technologie de confiance ?? Qu'elles liberté ?", 
"color": "16763904", 
"polemics": [
"Q"
], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 1454000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 14905766, \"verified\": false, \"profile_sidebar_fill_color\": \"ffffff\", \"profile_text_color\": \"4c9c8f\", \"followers_count\": 414, \"protected\": false, \"location\": \"Paris, France\", \"default_profile_image\": false, \"listed_count\": 46, \"utc_offset\": -10800, \"statuses_count\": 1934, \"description\": \"Designer @ IRI Centre Pompidou / PhD student in Computer Human interface @ Paris11 : #ui #infoviz #Webdesign, #WebScience, #philosophy, #open #innovation\", \"friends_count\": 542, \"profile_link_color\": \"b3009b\", \"profile_image_url\": \"http://a1.twimg.com/profile_images/309624209/Cy2_normal.png\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"000000\", \"id_str\": \"14905766\", \"profile_background_image_url\": \"http://a2.twimg.com/profile_background_images/51130859/3577914799_1350cff02e.jpg\", \"name\": \"Samuel Huron\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": false, \"favourites_count\": 268, \"screen_name\": \"cybunk\", \"url\": \"http://www.cybunk.com\", \"created_at\": \"Mon May 26 06:02:18 +0000 2008\", \"contributors_enabled\": false, \"time_zone\": \"Greenland\", \"profile_sidebar_border_color\": \"b3009b\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 4], \"text\": \"eg8\"}, {\"indices\": [5, 10], \"text\": \"enmi\"}], \"urls\": []}, \"text\": \"#eg8 #enmi :: le language, interface entre l'homme et le monde.   technologie de confiance ?? Qu'elles libert\\u00e9 ?\", \"created_at\": \"Wed May 25 09:26:02 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": null, \"id\": 73318901475328000, \"source\": \"<a href=\\\"http://www.tweetdeck.com\\\" rel=\\\"nofollow\\\">TweetDeck</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73318901475328000\", \"place\": null, \"retweet_count\": 0, \"geo\": null, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 1454000, 
"tags": [
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}, 
{
"id-ref": "219ba10a-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "0a85f156-f4b1-49f1-ac00-51b0ea070134-73318901475328000"
}, 
{
"content": {
"mimetype": "application/x-ldt-structured", 
"description": "#enmi  edward bernays /VS/ pekka himanen ? #libidinal vers #contribution ?", 
"img": {
"src": "http://a2.twimg.com/profile_images/1367788685/021EB7A5-E5A2-4837-9E76-4A6019F6E1EE_normal"
}, 
"title": "Fabian Gental: #enmi  edward bernays /VS/ pekka himanen ? #libidinal vers #contribution ?", 
"color": "16763904", 
"polemics": [], 
"audio": {
"mimetype": "audio/mp3", 
"src": "", 
"href": null
}
}, 
"begin": 1538000, 
"meta": {
"dc:contributor": "perso", 
"dc:source": {
"mimetype": "application/json", 
"url": "http://dev.twitter.com", 
"content": "{\"user\": {\"follow_request_sent\": null, \"profile_use_background_image\": true, \"id\": 115128839, \"verified\": false, \"profile_sidebar_fill_color\": \"d6fffc\", \"profile_text_color\": \"04838f\", \"followers_count\": 10, \"protected\": false, \"location\": \"Paris / Limoges / Berlin\", \"default_profile_image\": false, \"listed_count\": 0, \"utc_offset\": 3600, \"statuses_count\": 16, \"description\": \"\\u00c9tudiant en design @ENSCI les Ateliers\\n@ENSA Limoges\", \"friends_count\": 29, \"profile_link_color\": \"05d5ff\", \"profile_image_url\": \"http://a2.twimg.com/profile_images/1367788685/021EB7A5-E5A2-4837-9E76-4A6019F6E1EE_normal\", \"notifications\": null, \"show_all_inline_media\": false, \"geo_enabled\": true, \"profile_background_color\": \"bf9dc9\", \"id_str\": \"115128839\", \"profile_background_image_url\": \"http://a3.twimg.com/profile_background_images/76127896/test.png\", \"name\": \"Fabian Gental\", \"lang\": \"fr\", \"following\": null, \"profile_background_tile\": true, \"favourites_count\": 1, \"screen_name\": \"3615fabe\", \"url\": null, \"created_at\": \"Wed Feb 17 18:08:52 +0000 2010\", \"contributors_enabled\": false, \"time_zone\": \"Berlin\", \"profile_sidebar_border_color\": \"ffffff\", \"default_profile\": false, \"is_translator\": false}, \"favorited\": false, \"contributors\": null, \"entities\": {\"user_mentions\": [], \"hashtags\": [{\"indices\": [0, 5], \"text\": \"enmi\"}, {\"indices\": [43, 53], \"text\": \"libidinal\"}, {\"indices\": [59, 72], \"text\": \"contribution\"}], \"urls\": []}, \"text\": \"#enmi  edward bernays /VS/ pekka himanen ? #libidinal vers #contribution ?\", \"created_at\": \"Wed May 25 09:27:26 +0000 2011\", \"truncated\": false, \"retweeted\": false, \"in_reply_to_status_id\": null, \"coordinates\": {\"type\": \"Point\", \"coordinates\": [2.3704253400000002, 48.858806250000001]}, \"id\": 73319252060405760, \"source\": \"<a href=\\\"http://tapbots.com/tweetbot\\\" rel=\\\"nofollow\\\">Tweetbot for iPhone</a>\", \"in_reply_to_status_id_str\": null, \"in_reply_to_screen_name\": null, \"id_str\": \"73319252060405760\", \"place\": {\"country_code\": \"FR\", \"url\": \"http://api.twitter.com/1/geo/id/7238f93a3e899af6.json\", \"country\": \"France\", \"place_type\": \"city\", \"bounding_box\": {\"type\": \"Polygon\", \"coordinates\": [[[2.2241005999999999, 48.815541400000001], [2.4697521, 48.815541400000001], [2.4697521, 48.902146100000003], [2.2241005999999999, 48.902146100000003]]]}, \"full_name\": \"Paris, Paris\", \"attributes\": {}, \"id\": \"7238f93a3e899af6\", \"name\": \"Paris\"}, \"retweet_count\": 0, \"geo\": {\"type\": \"Point\", \"coordinates\": [48.858806250000001, 2.3704253400000002]}, \"in_reply_to_user_id_str\": null, \"in_reply_to_user_id\": null}"
}, 
"dc:creator": "perso", 
"id-ref": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:modified": "2011-11-03T14:57:20.992536"
}, 
"end": 1538000, 
"tags": [
{
"id-ref": "219d2156-062c-11e1-93a3-00145ea49a02"
}, 
{
"id-ref": "219d2156-062c-11e1-93a3-00145ea49a02"
}, 
{
"id-ref": "219d25fc-062c-11e1-93a3-00145ea49a02"
}
], 
"color": "16763904", 
"media": "914e1bcc-b6e0-11e0-a965-00145ea49a02", 
"id": "9862e2d4-ef66-4368-98e2-562a61232a5a-73319252060405760"
}
], 
"annotation-types": [
{
"dc:contributor": "perso", 
"dc:creator": "perso", 
"dc:title": "Bernard Stiegler", 
"id": "c_5AEE45AE-F0E5-2921-31CB-2683540AA7A4", 
"dc:created": "2011-11-03T14:57:21.010291", 
"dc:description": "", 
"dc:modified": "2011-11-03T14:57:21.010291"
}, 
{
"dc:contributor": "perso", 
"dc:creator": "perso", 
"dc:title": "Tweets", 
"id": "61bcaa2e-9963-4df2-a987-34c08e184fb6", 
"dc:created": "2011-11-03T14:57:20.992536", 
"dc:description": "Tweets", 
"dc:modified": "2011-11-03T14:57:20.992536"
}
]
}