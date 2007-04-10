/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.google_maps = {
  description: "Find with Google Maps",
  icon: "http://www.google.com/favicon.ico",
  scope: {
    microformats: {
      "hCard" : "adr",
      "geo" : "geo"
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
      if (microformatNames[i] == "hCard") {
        var adr = ufJSParser.getMicroformatProperty(node, "hCard", "adr");
        if (adr) {
          url = "http://maps.google.com/maps?q=";
          if (adr[0]["street-address"]) {
            url += adr[0]["street-address"].join(", ");
            url += ", ";
          }
          if (adr[0].region) {
            url += adr[0].region;
            url += ", ";
          }
          if (adr[0].locality) {
            url += adr[0].locality;
            url += ", ";
          }
          if (adr[0]["postal-code"]) {
            url += adr[0]["postal-code"];
            url += ", ";
          }
          if (adr[0]["country-name"]) {
            url += adr[0]["country-name"];
          }
          if (url.lastIndexOf(", ") == (url.length - ", ".length)) {
            url = url.substring(0, url.lastIndexOf(", "));
          }
          break;
        }
      } else if (microformatNames[i] == "geo") {
        var latitude = ufJSParser.getMicroformatProperty(node, "geo", "latitude");
        var longitude = ufJSParser.getMicroformatProperty(node, "geo", "longitude");
        if (latitude && longitude) {
          url = "http://maps.google.com/maps?ll=" + latitude + "," + longitude + "&q=" + latitude + "," + longitude;
          break;
        }
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

ufJSActions.actions.google_search = {
  description: "Find with Google Search",
  icon: "http://www.google.com/favicon.ico",
  scope: {
    microformats: {
      "hReview" : "hReview",
      "hResume" : "ufjsDisplayName"
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
    var searchstring;
    var action = ufJSActions.actions.google_search;
    for (var i in microformatNames) {
      if (microformatNames[i] == "hReview") {
        var hreview = ufJSParser.createMicroformat(node, "hReview");
        if (hreview.item.summary) {
          searchstring = hreview.item.summary;
        } else if (hreview.item.fn) {
          searchstring = hreview.item.fn;
        }
        break;
      } else {
        searchstring = ufJSParser.getMicroformatProperty(node, microformatNames[i], action.scope.microformats[microformatNames[i]]);
        if (searchstring) {
          break;
        }
      }
    }
    if (searchstring) {
      var url = "http://www.google.com/search?q=" + encodeURIComponent(searchstring);
      openUILink(url, event);
    }
  }
};

ufJSActions.actions.google_calendar = {
  description: "Add to Google Calendar",
  icon: "http://www.google.com/calendar/images/favicon.ico",
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
              dtstart = ufJSParser.localizeISO8601(dtstart);
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
                dtend = ufJSParser.localizeISO8601(dtend);
              }
            } else {
              if (!Operator.upcomingOrgBugFixed) {
                if (content.document.location.href.indexOf("http://upcoming.org") == 0) {
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
          var s = hcalendar.description;
          /* This should be an HTML only path */
          s	= s.replace(/[\n\r\t]/gi, ' ');
          s = s.replace(/\<br\s*\>\s*/gi, '\r\n');
          s = s.replace(/\<\/p>/gi, '\r\n\r\n');
          s	= s.replace(/\<.*?\>/gi, '');
          s	= s.replace(/^\s+/, '');
          s	= s.replace(/[\n\r\t\s]+$/gi, '');
          url += "details=" + encodeURIComponent(s.substr(0,1024));
          if (s.length > 1024) {
            url += "...";
          }
        }
        break;
      }
    }
    if (url) {
      Operator.debug_alert(url);
      openUILink(url, event);
    }
  }
};

