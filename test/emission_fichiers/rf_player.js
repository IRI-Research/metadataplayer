Drupal.behaviors.rfPlayerOpeningLinks = function(context) {
  $('a.rf-player-open:not(.rf-player-open-processed)', context).each(function () {
    var common_settings = { 
      height: 458,
      width: 560,
      top: 150,
      left: 250,
      windowName: 'player'
    }

    var chrome_settings = { 
      height: 515,
      width: 560,
      top: 150,
      left: 250,
      windowName: 'player'
    }

    var chrome_settings_windows = { 
      height: 465,
      width: 560,
      top: 150,
      left: 250,
      windowName: 'player'
    }

    var is_chrome = /chrome/.test(navigator.userAgent.toLowerCase());
    var is_windows = /windows/.test(navigator.userAgent.toLowerCase());

    if (is_chrome == false) {
      $(this).popupWindow(common_settings);
    }
    else {
      if (is_windows == false) {
        $(this).popupWindow(chrome_settings);
      }
      else {
        $(this).popupWindow(chrome_settings_windows);
      }
    }

    // We can add the processed class
    $(this).addClass('rf-player-open-processed');
  });
};