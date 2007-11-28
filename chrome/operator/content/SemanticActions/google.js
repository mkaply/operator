/* localizeISO8601 */ 

var google_maps = {
  description: "Find with Google Maps",
  shortDescription: "Google Maps",
  icon: "http://www.google.com/favicon.ico",
  scope: {
    semantic: {
      "geo" : "geo",
      "hCard" : "adr"
    }
  },
  doAction: function(semanticObject, semanticObjectType, propertyIndex) {
    var url;
    if ((semanticObjectType == "hCard") || (semanticObjectType == "adr")) {
      var adr;
      if (semanticObjectType == "hCard") {
        if (!propertyIndex) {
          propertyIndex = 0;
        }
        adr = semanticObject.adr[propertyIndex];
      } else {
        adr = semanticObject;
      }
      if (adr) {
        url = "http://maps.google.com/maps?q=";
        if (adr["street-address"]) {
          url += Microformats.simpleEscape(adr["street-address"].join(", "));
          url += ", ";
        }
        if (adr.region) {
          url += adr.region;
          url += ", ";
        }
        if (adr.locality) {
          url += adr.locality;
          url += ", ";
        }
        if (adr["postal-code"]) {
          url += adr["postal-code"];
          url += ", ";
        }
        if (adr["country-name"]) {
          url += adr["country-name"];
        }
        if (url.lastIndexOf(", ") == (url.length - ", ".length)) {
          url = url.substring(0, url.lastIndexOf(", "));
        }
      }
    } else if (semanticObjectType == "geo") {
      if (semanticObject.latitude && semanticObject.longitude) {
        return "http://maps.google.com/maps?ll=" + semanticObject.latitude + "," + semanticObject.longitude + "&q=" + semanticObject.latitude + "," + semanticObject.longitude;
      }
    }
    return url;
  },
  getActionName: function(semanticObject, semanticObjectType, propertyIndex) {
    if (semanticObjectType == "hCard") {
      if (propertyIndex == undefined) {
        return "";
      }
      var adr = semanticObject.adr[propertyIndex];
      if (!adr) {
        return;
      }
      return adr.toString();
    } else if (semanticObjectType == "geo") {
      if (propertyIndex == undefined) {
        return "";
      }
      return semanticObject.toString();
    }
  }

};

var google_search = {
  description: "Find with Google Search",
  shortDescription: "Google Search",
  icon: "http://www.google.com/favicon.ico",
  scope: {
    semantic: {
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var searchstring;
    var property = google_search.scope.semantic[semanticObjectType];
    if (property.indexOf(".") != -1) {
      var props = property.split(".");
      searchstring = semanticObject[props[0]][props[1]];
    } else {
      searchstring = semanticObject[property];
    }
    if (searchstring) {
      return  "http://www.google.com/search?q=" + encodeURIComponent(searchstring);
    }
    return null;
  }
};

var google_calendar = {
  description: "Add to Google Calendar",
  shortDescription: "Google Calendar (+)",
  icon: "http://www.google.com/calendar/images/favicon.ico",
  scope: {
    semantic: {
      "hCalendar" : "dtstart"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    if (semanticObjectType == "hCalendar") {
      var hcalendar = semanticObject;
      url = "http://www.google.com/calendar/event?action=TEMPLATE";
      if (hcalendar.dtstart) {
        url += "&";
        url += "dates="
        var dtstart = hcalendar.dtstart;
        /* If the date has a Z or nothing, use it as is (remove punctation) */
        /* If it has an offset, convert to local time */
        var T = dtstart.indexOf("T");
        if (T > -1) {
          var offset = dtstart.lastIndexOf("-");
          /* If there is an offset and there is no Z, localize */
          if ((offset > T) || !dtstart.match("Z")) {
            var dtStartDate = Microformats.dateFromISO8601(dtstart);
            dtstart = Microformats.iso8601FromDate(dtStartDate);
          }
        }
        /* This will need to change if Google ever supports TZ offsets */
        dtstart = dtstart.replace(/-/g,"").replace(/:/g,"");
        url += dtstart;
        url += "/";
        if (hcalendar.dtend) {
          var dtend = hcalendar.dtend;
          var T = dtend.indexOf("T");
          if (T > -1) {
            var offset = dtend.lastIndexOf("-");
            /* If there is an offset and there is no Z, localize */
            if ((offset > T) || !dtend.match("Z")) {
              var dtEndDate = Microformats.dateFromISO8601(dtend);
              dtend = Microformats.iso8601FromDate(dtEndDate);
            }
          } else {
            if (!Operator.upcomingBugFixed) {
              if (content.document.location.href.indexOf("http://upcoming.yahoo.com") == 0) {
                dtend = dtend.replace(/-/g, "");
                dtend = (parseInt(dtend)+1).toString();
              }
            }
            /* if dtstart had a time, dtend must have a time - google bug? */
            if (dtstart.indexOf("T") > -1) {
              dtend += dtstart.substr(dtstart.indexOf("T"));
            }
          }
          /* This will need to change if Google ever supports TZ offsets */
          url += dtend.replace(/-/g,"").replace(/:/g,"");
        } else {
          url += dtstart;
        }
      }
      url += "&";
      url += "text=" + encodeURIComponent(hcalendar.summary);
      if (hcalendar.location) {
        if (typeof hcalendar.location == "object") {
          var j = 0;
          url += "&";
          url += "location=";
          if (hcalendar.location.fn) {
            url += hcalendar.location.fn;
          }
          if (hcalendar.location.adr[j]["street-address"]) {
            if (hcalendar.location.fn) {
              url += ", ";
            }
            url += encodeURIComponent(hcalendar.location.adr[j]["street-address"][0]);
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
          url += "&";
          url += "location=" + hcalendar.location;
        }
      }
      if (hcalendar.description) {
        url += "&";
        var s = hcalendar.description.toHTML();
        url += "details=" + encodeURIComponent(s.substr(0,1024));
        if (s.length > 1024) {
          url += "...";
        }
      }
    }
    return url;
  }
};

SemanticActions.add("google_maps", google_maps);
SemanticActions.add("google_search", google_search);
SemanticActions.add("google_calendar", google_calendar);
