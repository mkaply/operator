var thirty_boxes_calendar = {
  description: "Add to 30 Boxes",
  shortDescription: "30 Boxes (+)",
  icon: "http://30boxes.com/favicon.ico",
  scope: {
    semantic: {
      "hCalendar" : "dtstart"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    if (semanticObjectType == "hCalendar") {
      var hcalendar = semanticObject;
      url = "http://30boxes.com/add.php?e=";
      if (hcalendar.summary) {
  //      url += encodeURIComponent(hcalendar.summary);
        url += Microformats.simpleEscape(hcalendar.summary) + " ";
      }
      if (hcalendar.description) {
        url += " (";
        var s = hcalendar.description.toHTML();
        /* 30 boxes doesn't like raw HTML. convert some */
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
        var dtStartDate = Microformats.dateFromISO8601(hcalendar.dtstart);
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
          var dtEndDate = Microformats.dateFromISO8601(hcalendar.dtend);
          if (!dtEndDate.time) {
            dtEndDate.setDate(dtEndDate.getDate()-1);
          }
//          if (!Operator.upcomingBugFixed) {
//            if (content.document.location.href.indexOf("http://upcoming.yahoo.com") == 0) {
              dtEndDate.setDate(dtEndDate.getDate()+1);
//            }
//          }
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
    return url;
  }
};

SemanticActions.add("30boxes_calendar", thirty_boxes_calendar);
