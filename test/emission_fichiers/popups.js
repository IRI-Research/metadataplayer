Drupal.theme.popupTemplate = function(popupId) {
  var template;
  template += '<div id="'+ popupId + '" class="popups-box">';
  template += "  <div class='popups-inner'>";
  template += '    <div class="popups-title">';
  template += '      <div class="popups-close"><a href="#">' + Drupal.t('Close') + '</a></div>';
  template += '      <div class="title">%title</div>';
  template += '      <div class="clear-block"></div>';
  template += '    </div>';
  template += '    <div class="popups-body">%body</div>';
  template += '    <div class="popups-buttons">%buttons</div>';
  template += '    <div class="popups-footer"></div>';
  template += '  </div>';
  template += '</div>';
  return template;
};
