/*extern Components, Microformats, sizeToContent */

var Operator_Debug = {
  X2VLoaded: false,
  X2V: function()
  {
    if (!Operator_Debug.X2VLoaded) {
      document.getElementById('x2v').value =  "...loading...";
      var url;
      if (window.title == "hCard") {
        url = "http://suda.co.uk/projects/microformats/hcard/POST/";
      } else if (window.title == "hCalendar") {
        url = "http://suda.co.uk/projects/microformats/hcalendar/POST/";
      }
      var item = document.getElementById('x2v').item;
      var params = "uri=" + item.ownerDocument.location.href + "&body=";
      var serializer = new XMLSerializer();
      params += serializer.serializeToString(item);
      var request = new XMLHttpRequest();
      request.open('POST', url, true);
  
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.setRequestHeader("Content-length", params.length);
      request.setRequestHeader("Connection", "close");
      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          if (request.status == 200) {
            document.getElementById('x2v').value = request.responseText;
            Operator_Debug.X2VLoaded = true;
          } else {
            document.getElementById('x2v').value = "Error loading X2V";
          }
        }
      }
      request.send(params);
    }
  },
  onPageLoad: function(window_args) 
  {
    var tabbox = document.getElementById('debug.tabs');
    window.title=window_args[0];
    if (window_args[0] == "Alert") {
      document.getElementById('error.tab').label = "Info";
    }
    if (window_args[5]) {
      document.getElementById('x2v').item =  window_args[5];
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
