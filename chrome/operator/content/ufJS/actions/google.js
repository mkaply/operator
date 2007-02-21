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
        if (typeof hreview.item == "string") {
          searchstring = hreview.item;
        } else {
          if (hreview.item.summary) {
            searchstring = hreview.item.summary;
          } else if (hreview.item.fn) {
            searchstring = hreview.item.fn;
          }
        }
        if (searchstring) {
          break;
        }
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
          url += "dates=";
          url += hcalendar.dtstart.replace(/-/g,"").replace(/:/g,"");
    
          url += "/";
          if (hcalendar.dtend) {
            url += hcalendar.dtend.replace(/-/g,"").replace(/:/g,"");
          } else {
            url += hcalendar.dtstart.replace(/-/g,"").replace(/:/g,"");
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
              url += ", ";
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
      openUILink(url, event);
    }
  }
};

