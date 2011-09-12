/* localizeISO8601 */ 

var google_maps = {
  description: "Find with Google Maps",
  shortDescription: "Google Maps",
  icon: "http://www.google.com/favicon.ico",
  scope: {
    semantic: {
      "geo" : "geo",
      "hCard" : "label",
      "hCard" : "geo",
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
        if (semanticObject.adr) {
          adr = semanticObject.adr[propertyIndex];
        } else {
		  /* label */
          return "http://maps.google.com/maps?q=" + Microformats.simpleEscape(semanticObject.label[propertyIndex]);  
        }
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
	  if (semanticObjectType == "hCard") {
		url += " (" + semanticObject.toString().replace("(", "[").replace(")", "]") + ")";
	  }
    } else if (semanticObjectType == "geo") {
      if (semanticObject.latitude && semanticObject.longitude) {
        url = "http://maps.google.com/maps?ll=" + semanticObject.latitude + "," + semanticObject.longitude + "&q=" + semanticObject.latitude + "," + semanticObject.longitude;
		url += " (" + semanticObject.toString().replace("(", "[").replace(")", "]") + ")";
      }
    }
    return url
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
      var date, time;
      if (hcalendar.dtstart) {
        url += "&";
        url += "dates="
        /* If the date has a Z or nothing, use it as is (remove punctation) */
        /* If it has an offset, convert to Z */
        var T = hcalendar.dtstart.indexOf("T");
        if (T > -1) {
          var tzpos = hcalendar.dtstart.lastIndexOf("+");
          if (tzpos == -1) {
            tzpos = hcalendar.dtstart.lastIndexOf("-");
          }
          if (tzpos > T) {
            var js_date = Microformats.dateFromISO8601(hcalendar.dtstart.substr(0, tzpos-1));
            var tzhours = parseInt(hcalendar.dtstart.substr(tzpos+1, 2), 10);
            var tzminutes = parseInt(hcalendar.dtstart.substr(tzpos+3, 2), 10);
            if (hcalendar.dtstart.charAt(tzpos) == "-") {
              js_date.setHours(js_date.getHours()+tzhours);
              js_date.setMinutes(js_date.getMinutes()+tzminutes);
            } else if (hcalendar.dtstart.charAt(tzpos) == "+") {
              js_date.setHours(js_date.getHours()-tzhours);
              js_date.setMinutes(js_date.getMinutes()-tzminutes);
            }
            var dtstart = Microformats.iso8601FromDate(js_date, true);
            date = dtstart.substr(0, T);
            time = dtstart.substr(T) + "Z";
          } else {
            date = hcalendar.dtstart.substr(0, T);
            time = hcalendar.dtstart.substr(T);
          }
          dtstart = date + time;
        } else {
          dtstart = hcalendar.dtstart;
        }
        /* This will need to change if Google ever supports TZ offsets */
        dtstart = dtstart.replace(/-/g,"").replace(/:/g,"");
        url += dtstart;
        url += "/";
        if (hcalendar.dtend) {
          var T = hcalendar.dtend.indexOf("T");
          if (T > -1) {
            var tzpos = hcalendar.dtend.lastIndexOf("+");
            if (tzpos == -1) {
              tzpos = hcalendar.dtend.lastIndexOf("-");
            }
            if (tzpos > T) {
              var js_date = Microformats.dateFromISO8601(hcalendar.dtend.substr(0, tzpos-1));
              var tzhours = parseInt(hcalendar.dtend.substr(tzpos+1, 2), 10);
              var tzminutes = parseInt(hcalendar.dtend.substr(tzpos+3, 2), 10);
              if (hcalendar.dtend.charAt(tzpos) == "-") {
                js_date.setHours(js_date.getHours()+tzhours);
                js_date.setMinutes(js_date.getMinutes()+tzminutes);
              } else if (hcalendar.dtend.charAt(tzpos) == "+") {
                js_date.setHours(js_date.getHours()-tzhours);
                js_date.setMinutes(js_date.getMinutes()-tzminutes);
              }
              var dtend = Microformats.iso8601FromDate(js_date, true);
              date = dtend.substr(0, T);
              time = dtend.substr(T) + "Z";
            } else {
              date = hcalendar.dtend.substr(0, T);
              time = hcalendar.dtend.substr(T);
            }
            dtend = date + time;
          } else {
//            if ((!Operator.upcomingBugFixed) &&
//                ((content.document.location.href.indexOf("http://upcoming.yahoo.com") == 0))) {
                dtend = hcalendar.dtend.replace(/-/g, "");
                dtend = (parseInt(dtend, 10)+1).toString();
//            } else {
//              dtend = hcalendar.dtend;
//            }
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
            url += encodeURIComponent(hcalendar.location.fn);
          }
		  if (hcalendar.location.adr[j]) {
            if (hcalendar.location.adr[j]["street-address"]) {
              if (hcalendar.location.fn) {
                url += ", ";
              }
              url += encodeURIComponent(hcalendar.location.adr[j]["street-address"][0]);
            }
            if (hcalendar.location.adr[j].locality) {
              url += ", ";
              url += encodeURIComponent(hcalendar.location.adr[j].locality);
            }
            if (hcalendar.location.adr[j].region) {
              url += ", ";
              url += encodeURIComponent(hcalendar.location.adr[j].region);
            }
            if (hcalendar.location.adr[j]["postal-code"]) {
              url += " ";
              url += hcalendar.location.adr[j]["postal-code"];
            }
            if (hcalendar.location.adr[j]["country-name"]) {
              url += ",";
              url += encodeURIComponent(hcalendar.location.adr[j]["country-name"]);
            }
		  }
        } else {
          url += "&";
          url += "location=" + encodeURIComponent(hcalendar.location);
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
