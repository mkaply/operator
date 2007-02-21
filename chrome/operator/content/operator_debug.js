/*extern Components, Microformats, sizeToContent */

var Operator_Debug = {
  onPageLoad: function(window_args) 
  {
    var tabbox = document.getElementById('debug.tabs');
    window.title=window_args[0];
    if (window_args[0] == "Alert") {
      document.getElementById('error.tab').label = "Info";
    }
    if (window_args[5]) {
      document.getElementById('x2v').value = window_args[5];
      tabbox.selectedTab = document.getElementById('x2v.tab');
    } else {
      document.getElementById('x2v.tab').collapsed = true;
      document.getElementById('x2v.tabpanel').collapsed = true;
    }
    if (window_args[4]) {
      document.getElementById('vcfical').value = window_args[4];
      tabbox.selectedTab = document.getElementById('vcfical.tab');
    } else {
      document.getElementById('vcfical.tab').collapsed = true;
      document.getElementById('vcfical.tabpanel').collapsed = true;
    }
    if (window_args[3]) {
      document.getElementById('source').value = window_args[3];
      tabbox.selectedTab = document.getElementById('source.tab');
    } else {
      document.getElementById('source.tab').collapsed = true;
      document.getElementById('source.tabpanel').collapsed = true;
    }
    if (window_args[2]) {
      document.getElementById('dump').value = window_args[2];
      tabbox.selectedTab = document.getElementById('dump.tab');
    } else {
      document.getElementById('dump.tab').collapsed = true;
      document.getElementById('dump.tabpanel').collapsed = true;
    }
    if (window_args[1]) {
      document.getElementById('error').value = window_args[1];
      tabbox.selectedTab = document.getElementById('error.tab');
    } else {
      document.getElementById('error.tab').collapsed = true;
      document.getElementById('error.tabpanel').collapsed = true;
    }
    if ((document.getElementById('x2v.tab').collapsed === true) &&
        (document.getElementById('vcfical.tab').collapsed === true) &&
        (document.getElementById('source.tab').collapsed === true) &&
        (document.getElementById('dump.tab').collapsed === true)) {
      document.getElementById('error.tab').collapsed = true;
    }
  }
};
