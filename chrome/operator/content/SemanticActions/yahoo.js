/* simpleEscape dateFromISO8601 localizeISO8601 iso8601FromDate */

var yahoo_maps = {
  description: "Find with Yahoo! Maps",
  shortDescription: "Yahoo! Maps",
  icon: "http://www.yahoo.com/favicon.ico",
  scope: {
    semantic: {
      "hCard" : "adr",
      "geo" : "geo"
    }
  },
  doAction: function(semanticObject, semanticObjectType, propertyIndex) {
    var url;
    if (semanticObjectType == "hCard") {
      if (propertyIndex == undefined) {
        propertyIndex = 0;
      }
      var adr = semanticObject.adr[propertyIndex];
      if (adr) {
        url = "http://maps.yahoo.com/maps_result?";
        if (adr["street-address"]) {
          url += "&addr=" + encodeURIComponent(adr["street-address"]);
        }
        if ((adr.locality) || (adr.region) || (adr["postal-code"])) {
          url += "&csz=";
          if (adr.locality) {
            url += encodeURIComponent(adr.locality);
            if (adr.region) {
              url += ", ";
            } else if (adr["postal-code"]) {
              url += " ";
            }
          }
          if (adr.region) {
            url += encodeURIComponent(adr.region);
            if (adr["postal-code"]) {
              url += " ";
            }
          }
          if (adr["postal-code"]) {
            url += encodeURIComponent(adr["postal-code"]);
          }
        }
        if (adr["country-name"]) {
          url += "&country=" + encodeURIComponent(adr["country-name"]);
        }
      }
    } else if (semanticObjectType == "geo") {
      if (semanticObject.latitude && semanticObject.longitude) {
        return "http://maps.yahoo.com/#lat=" + semanticObject.latitude + "&lon=" + semanticObject.longitude + "&mag=3";
      }
    }
    return url;
  }
};

var yahoo_search = {
  version: 0.8,
  description: "Find with Yahoo! Search",
  shortDescription: "Yahoo! Search",
  icon: "http://www.yahoo.com/favicon.ico",
  scope: {
    semantic: {
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var searchstring;
    var property = yahoo_search.scope.semantic[semanticObjectType];
    if (property.indexOf(".") != -1) {
      var props = property.split(".");
      searchstring = semanticObject[props[0]][props[1]];
    } else {
      searchstring = semanticObject[property];
    }
    if (searchstring) {
      return "http://search.yahoo.com/search?p=" + encodeURIComponent(searchstring);
    }
    return null;
  }
};


/* yahoo says:
The rend param is not needed, dont use it. Just specify a start time and 
duration. (This didn't work for me) */

/* The best way to reverse engineer our seeds api is to go to 
calendar.yahoo.com, create an event, and then click on it again to edit. 
At the bottom of the edit screen you will see a panel with "*Want to 
tell others about this event?" *with the seed url for your event. */

var yahoo_calendar = {
  version: 0.8,
  description: "Add to Yahoo! Calendar",
  shortDescription: "Yahoo! Calendar (+)",
  icon: "http://www.yahoo.com/favicon.ico",
  scope: {
    semantic: {
      "hCalendar" : "dtstart"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    if (semanticObjectType == "hCalendar") {
      var hcalendar = semanticObject;
      url = "http://calendar.yahoo.com/?v=60&";
      url += "type=";
      if (hcalendar.category) {
        switch (hcalendar.category[0].toLowerCase()) {
          case "music":
          case "performing arts":
          case "festivals":
            url += "24";
            break;
          default:
            url += "0";
            break;
        }
      } else {
        url += "0";
      }
      if (hcalendar.dtstart) {
        url += "&";
        url += "st=";
        var T = hcalendar.dtstart.indexOf("T");
        var date;
        var time;
        if (T > -1) {
          date = hcalendar.dtstart.substr(0, T);
          time = hcalendar.dtstart.substr(T);
        } else {
          date = hcalendar.dtstart;
        }
        url += Microformats.simpleEscape(date.replace(/-/g,""));
        if (time) {
          url += Microformats.simpleEscape(time.replace(/:/g,""));
        }
      }
      if (hcalendar.dtend) {
        var duration = "";
        var duration_num, hours, minutes;
        var dtStartDate = Microformats.dateFromISO8601(hcalendar.dtstart);
        var dtEndDate = Microformats.dateFromISO8601(hcalendar.dtend);
        if (!dtEndDate.time) {
          dtEndDate.setDate(dtEndDate.getDate()-1);
        }
        if (!Operator.upcomingBugFixed) {
          if (content.document.location.href.indexOf("http://upcoming.yahoo.com") == 0) {
            dtEndDate.setDate(dtEndDate.getDate()+1);
          }
        }
        
        if (((dtEndDate.getTime() - dtStartDate.getTime()) > 24*60*60*1000) || !dtEndDate.time) {
          url += "&";
          url += "rend=%2b";
          url += Microformats.iso8601FromDate(dtEndDate).replace(/-/g,"").replace(/:/g,"");
          if (dtEndDate.time && dtStartDate.time) {
            dtEndDate.time = false;
            var end = dtEndDate.getHours()*60 + dtEndDate.getMinutes();
            var start = dtStartDate.getHours()*60 + dtStartDate.getMinutes();
            duration_num = end-start;
            hours = Math.floor(duration_num/60);
            minutes = duration_num - (hours * 60);
            if (hours <= 9) {
              duration += "0";
            }
            duration += hours.toString();
            if (minutes <= 9) {
              duration += "0";
            }
            duration += minutes.toString();
            url += "&dur=" + duration;
          }
          url += "&rpat=1dy";
        } else {
          duration_num = dtEndDate.getTime() - dtStartDate.getTime();
          duration_num = duration_num/1000/60;
          hours = Math.floor(duration_num/60);
          minutes = duration_num - (hours * 60);
          if (hours <= 9) {
            duration += "0";
          }
          duration += hours.toString();
          if (minutes <= 9) {
            duration += "0";
          }
          duration += minutes.toString();
          url += "&dur=" + duration;
        }
      }
      url += "&";
      url += "title=" + Microformats.simpleEscape(hcalendar.summary);
      if (hcalendar.description) {
        url += "&";
        var s = hcalendar.description.toHTML();
        s = s.replace(/\<br\s*\>/gi, '%0D%0A');
        s = s.replace(/\<\/p>/gi, '%0D%0A%0D%0A');
        s	= s.replace(/\<.*?\>/gi, '');
        s	= s.replace(/^\s+/, '');
        url += "DESC=" + Microformats.simpleEscape(s.substr(0,2048));
        if (s.length > 2048) {
          url += "...";
        }
      }
      if (hcalendar.location) {
        if (typeof hcalendar.location == "object") {
          var j = 0;
          url += "&";
          if (hcalendar.location.fn) {
            url += "in_loc=" + hcalendar.location.fn;
          }
          if (hcalendar.location.adr[j]["street-address"]) {
            url += "&";
            url += "in_st=" + encodeURIComponent(hcalendar.location.adr[j]["street-address"][0]);
          }
          if (hcalendar.location.adr[j].locality) {
            url += "&";
            url += "in_csz=" + hcalendar.location.adr[j].locality;
            if (hcalendar.location.adr[j].region) {
              url += ", ";
              url += hcalendar.location.adr[j].region;
            }
            if (hcalendar.location.adr[j]["postal-code"]) {
              url += " ";
              url += hcalendar.location.adr[j]["postal-code"];
            }
          }
        } else {
          url += "&";
          url += "in_loc=" + hcalendar.location;
        }
      }
      if (hcalendar.url) {
        url += "&";
        url += "url=" + hcalendar.url;
      }
    }
    return url;
  }
};

/* yid = Yahoo! ID */

var yahoo_contacts = {
  version: 0.8,
  description: "Add to Yahoo! Contacts",
  shortDescription: "Yahoo! Contacts (+)",
  icon: "http://www.yahoo.com/favicon.ico",
  scope: {
    semantic: {
      "hCard" : "hCard"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    if (semanticObjectType == "hCard") {
      var i, j, k;
      var hcard = semanticObject;
      url = "http://address.yahoo.com/?";
      if (hcard.n && (hcard.n["family-name"]) && (hcard.n["given-name"])) {
        url += "ln=" + hcard.n["family-name"] + "&";
        url += "fn=" + hcard.n["given-name"] + "&";
        if (hcard.n["additional-name"]) {
          url += "mn=";
          for (j=0;j<hcard.n["additional-name"].length;j++) {
            url += hcard.n["additional-name"][j];
            if (i != hcard.n["additional-name"].length -1) {
              url += " ";
            }
            url += "&";
          }
        }
      } else {
        url += "fn=" + hcard.fn + "&";
      }
      if (hcard.org) {
        url += "co=" + hcard.org[0]["organization-name"] + "&";
      }
      /* only using the first email */
      if (hcard.email) {
        url += "e=";
        /* Default to first email address */
        var email = hcard.email[0].value;
        /* Look for a preferred */
        for (j=0;j<hcard.email.length;j++) {
          if (hcard.email[j].type) {
            for (k=0;k<hcard.email[j].type.length;k++) {
              if (hcard.email[j].type[k] == "pref") {
                email = hcard.email[j].value;
                break;
              }
            }
          }
        }
        url += email;
        url += "&";
      }
  
      if (hcard.adr) {
        for (j=0;j<hcard.adr.length;j++) {
          var prefix = "h";
          /* If business, default to work */
          if (hcard.org && (hcard.fn == hcard.org)) {
            prefix = "w";
          }
          if (hcard.adr[j].type) {
            /* Should I have a way to have one address be work and home? */
            for (k=0;k<hcard.adr[j].type.length;k++) {
              if (hcard.adr[j].type[k].toLowerCase() == "work") {
                prefix = "w";
                break;
              }
            }
          }
    
          if (hcard.adr[j]["street-address"]) {
            url += prefix + "a1=" + escape(hcard.adr[j]["street-address"][0]) + "&";
          }
          if (hcard.adr[j]["extended-address"]) {
            url += prefix + "a2=" + escape(hcard.adr[j]["extended-address"]) + "&";
          }
          if (hcard.adr[j].locality) {
            url += prefix + "c=" + hcard.adr[j].locality + "&";
          }
          if (hcard.adr[j].region) {
            url += prefix + "s=" + hcard.adr[j].region + "&";
          }
          if (hcard.adr[j]["postal-code"]) {
            url += prefix + "z=" + hcard.adr[j]["postal-code"] + "&";
          }
          if (hcard.adr[j]["country-name"]) {
            url += prefix + "co=" + hcard.adr[j]["country-name"] + "&";
          }
        }
      }
      if (hcard.tel) {
        /* default home phone to first number */
        var homephone;
        var workphone;
        var mobilephone;
        var preferred;
        var fax;
        for (j=0;j<hcard.tel.length;j++) {
          if (hcard.tel[j].type) {
            for (k=0;k<hcard.tel[j].type.length;k++) {
              if (hcard.tel[j].type[k].toLowerCase() == "home") {
                homephone = hcard.tel[j].value; 
              }
              if (hcard.tel[j].type[k].toLowerCase() == "work") {
                workphone = hcard.tel[j].value; 
              }
              if (hcard.tel[j].type[k].toLowerCase() == "cell") {
                mobilephone = hcard.tel[j].value; 
              }
              if (hcard.tel[j].type[k].toLowerCase() == "pref") {
                preferred = hcard.tel[j].value; 
              }
              if (hcard.tel[j].type[k].toLowerCase() == "fax") {
                fax = hcard.tel[j].value; 
              }
            }
          }
        }
        if (!homephone && !workphone) {
          /* If business, default to work */
          if (hcard.org && (hcard.fn == hcard.org)) {
            workphone = hcard.tel[0].value;
          } else {
            homephone = hcard.tel[0].value;
          }
        }
        
        /* op for other */
        if (homephone) {
          url += "hp=" + homephone + "&";
        }
        if (workphone) {
          url += "wp=" + workphone + "&";
        }
        if (mobilephone) {
          url += "mb=" + mobilephone + "&";
        }
        if (fax) {
          url += "f=" + fax + "&";
        }
        if (!preferred) {
          /* Yahoo sucks and if there is no preferred defaults to home */
          /* even if there is no home. let's be smarter. The first phone */
          /* in the list will be preferred */
          preferred = hcard.tel[0].value;
        }
        /* 0=home, 1=work, 2=mobile */
        if (preferred == workphone) {
          url += "pp=1&";
        } else if (preferred == mobilephone) {
          url += "pp=2&";
        } else  if (preferred == homephone) {
          url += "pp=0&";
        }
      }
      /* can be wu for a work url */
      if (hcard.url) {
        url += "pu=" + hcard.url[0] + "&";
      }
      url += "A=C";
    }
    return url;
  }
};






/* What I learned about Yahoo! Calendar types */

    /* for type= - for now default to 0 (other)
    DEFAULT Other
    1 Appointment
    10 Appointment
    11 Anniversary
    12 Bill Payment
    13 Birthday
    14 Call
    15 Graduation
    16 Holiday
    17 Interview
    18 Meeting
    19 Chat
    20 Other
    21 Net Event
    22 TV Show
    23 Movie
    24 Concert
    25 Travel
    26 Club Event
    27 Breakfast
    28 Lunch
    29 Dinner
    30 Happy Hour
    31 Party
    32 Performance
    33 Reunion
    34 Sports Event
    35 Vacation
    36 Wedding
    37 Class
    */

SemanticActions.add("yahoo_maps", yahoo_maps);
SemanticActions.add("yahoo_search", yahoo_search);
SemanticActions.add("yahoo_calendar", yahoo_calendar);
SemanticActions.add("yahoo_contacts", yahoo_contacts);
