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
    var url;
    if (microformatName == "hCalendar") {
      var hcalendar = new hCalendar(node);
      url = "http://30boxes.com/add.php?e=";
      if (hcalendar.summary) {
  //      url += encodeURIComponent(hcalendar.summary);
        url += ufJS.simpleEscape(hcalendar.summary) + " ";
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
        url += ") ";
      }
      var dt;
      if (hcalendar.dtstart) {
        dt = ufJSParser.localizeISO8601(hcalendar.dtstart);
        var dtStartDate = ufJSParser.dateFromISO8601(dt);
        url += (dtStartDate.getMonth()+1) + "/" + dtStartDate.getDate() + "/" + dtStartDate.getFullYear();
        if (dtStartDate.time) {
          url += " " + dtStartDate.getHours() + ":";
          if (dtStartDate.getMinutes() < 10) {
            url += "0";
          }
          url += dtStartDate.getMinutes();
        }
        if (hcalendar.dtend) {
          url += " - ";
          dt = ufJSParser.localizeISO8601(hcalendar.dtend);
          var dtEndDate = ufJSParser.dateFromISO8601(dt);
          if (!dtEndDate.time) {
            dtEndDate.setDate(dtEndDate.getDate()-1);
          }
          if (!Operator.upcomingOrgBugFixed) {
            if (content.document.location.href.indexOf("http://upcoming.org") == 0) {
              dtEndDate.setDate(dtEndDate.getDate()+1);
            }
          }
          url += (dtEndDate.getMonth()+1) + "/" + dtEndDate.getDate() + "/" + dtEndDate.getFullYear();
          if (dtEndDate.time) {
            url += " " + dtEndDate.getHours() + ":";
            if (dtEndDate.getMinutes() < 10) {
              url += "0";
            }
            url += dtEndDate.getMinutes();
          }
        }
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
    }
    if (url) {
      openUILink(url, event);
    }
  }
};
