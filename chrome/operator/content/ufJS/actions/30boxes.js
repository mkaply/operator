/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions["30boxes_calendar"] = {
  description: "Add to 30 Boxes",
  icon: "http://30boxes.com/favicon.ico",
  scope: {
    microformats: {
      "hCalendar" : "dtstart"
    }
  },
  doAction: function(node, microformatName, event) {
    var microformatNames;
    if (!microformatName) {
      microformatNames = ufJS.getMicroformatNameFromNode(node);
    } else {
      microformatNames = [];
      microformatNames.push(microformatName);
    }
    var url;
    for (var i in microformatNames) {
      if (microformatNames[i] == "hCalendar") {
        var hcalendar = ufJSParser.createMicroformat(node, "hCalendar");
        url = "http://30boxes.com/add.php?e=";
        if (hcalendar.summary) {
    //      url += encodeURIComponent(hcalendar.summary);
          url += ufJS.simpleEscape(hcalendar.summary);
        }
        if (hcalendar.description) {
          url += " (";
          var s = hcalendar.description;
          /* This should be an HTML only path */
          s	= s.replace(/[\n\r\t]/gi, ' ');
          s = s.replace(/\<br\s*\>\s*/gi, '\r\n');
          s = s.replace(/\<\/p>/gi, '\r\n\r\n');
          s	= s.replace(/\<.*?\>/gi, '');
          s	= s.replace(/^\s+/, '');
          s	= s.replace(/[\n\r\t\s]+$/gi, '');
          url += encodeURIComponent(s.substr(0,1024));
          url += ")";
        }
        if (hcalendar.dtstart) {
          url += " ";
          url += ufJS.dateFromISO8601(hcalendar.dtstart).toLocaleString();
        }
        if (hcalendar.location) {
          url += "[";
          if (typeof hcalendar.location == "object") {
            var j = 0;
            if (hcalendar.location.adr[j]["street-address"]) {
              url += hcalendar.location.adr[j]["street-address"][0];
            }
            if (hcalendar.location.adr[j].locality) {
              url += ", ";
              url += hcalendar.location.adr[j].locality;
            }
            if (hcalendar.location.adr[j].region) {
              url += ", ";
              url += hcalendar.location.adr[j].region;
            }
            if (hcalendar.location.adr[j]["postal-code"]) {
              url += " ";
              url += hcalendar.location.adr[j]["postal-code"];
            }
            if (hcalendar.location.adr[j]["country-name"]) {
              url += ",";
              url += hcalendar.location.adr[j]["country-name"];
            }
          } else {
            url += hcalendar.location;
          }
          url += "]";
        }
        break;
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};
