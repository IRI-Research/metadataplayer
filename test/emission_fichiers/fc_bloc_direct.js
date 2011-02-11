Drupal.behaviors.fcBlocDirect = function(context) {
  // Set up interval
  if (context == document && typeof(Drupal.settings.rf_bloc_suppress) == 'undefined') { // Only one is enough
    var fcBlocDirectUpdateInterval = setInterval('fcBlocDirectUpdate()', Drupal.settings.fc_bloc_direct.interval);
    if (Drupal.settings.fc_bloc_direct.refresh_on_load === 1) {
      fcBlocDirectUpdate();
    };
  };
};

// Interval callback
function fcBlocDirectUpdate() {
  var url = Drupal.settings.basePath + 'fc_bloc_direct/refresh';
  $.ajax({
    method: 'get',
    url : url,
    dataType : 'json',
    error: function(xhr) {
      // Do nothing in production mode
      // Drupal.CTools.AJAX.handleErrors(xhr, url);
    },
    success: Drupal.CTools.AJAX.respond
  });
};
