/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.yahoo_maps = {
  description: "Find with Yahoo! Maps",
  icon: "http://www.yahoo.com/favicon.ico",
  scope: {
    microformats: {
      "hCard" : "adr",
      "geo" : "geo"
    }
  },
  doAction: function(node, microformatName, event) {
    var url;
    if (microformatName == "hCard") {
      var adr = ufJSParser.getMicroformatProperty(node, "hCard", "adr");
      if (adr) {
        url = "http://maps.yahoo.com/maps_result?";
        if (adr[0]["street-address"]) {
          url += "&addr=" + encodeURIComponent(adr[0]["street-address"]);
        }
        if ((adr[0].locality) || (adr[0].region) || (adr[0]["postal-code"])) {
          url += "&csz=";
          if (adr[0].locality) {
            url += encodeURIComponent(adr[0].locality);
            if (adr[0].region) {
              url += ", ";
            } else if (adr[0]["postal-code"]) {
              url += " ";
            }
          }
          if (adr[0].region) {
            url += encodeURIComponent(adr[0].region);
            if (adr[0]["postal-code"]) {
              url += " ";
            }
          }
          if (adr[0]["postal-code"]) {
            url += encodeURIComponent(adr[0]["postal-code"]);
          }
        }
        if (adr[0]["country-name"]) {
          url += "&country=" + encodeURIComponent(adr[0]["country-name"]);
        }
      }
    } else if (microformatName == "geo") {
      var latitude = ufJSParser.getMicroformatProperty(node, "geo", "latitude");
      var longitude = ufJSParser.getMicroformatProperty(node, "geo", "longitude");
      if (latitude && longitude) {
        url = "http://maps.yahoo.com/#lat=" + latitude + "&lon=" + longitude + "&mag=3";
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

ufJSActions.actions.yahoo_search = {
  description: "Find with Yahoo! Search",
  icon: "http://www.yahoo.com/favicon.ico",
  scope: {
    microformats: {
      "hReview" : "hReview",
      "hResume" : "ufjsDisplayName"
    }
  },
  doAction: function(node, microformatName, event) {
    var searchstring;
    var action = ufJSActions.actions.yahoo_search;
    if (microformatName == "hReview") {
      var hreview = ufJSParser.createMicroformat(node, "hReview");
      if (hreview.item.summary) {
        searchstring = hreview.item.summary;
      } else if (hreview.item.fn) {
        searchstring = hreview.item.fn;
      }
    } else {
      searchstring = ufJSParser.getMicroformatProperty(node, microformatName, action.scope.microformats[microformatName]);
    }
    if (searchstring) {
      var url = "http://search.yahoo.com/search?p=" + encodeURIComponent(searchstring);
      openUILink(url, event);
    }
  }
};


/* yahoo claims:
The rend param is not needed, dont use it. Just specify a start time and 
duration. */

/* The best way to reverse engineer our seeds api is to go to 
calendar.yahoo.com, create an event, and then click on it again to edit. 
At the bottom of the edit screen you will see a panel with "*Want to 
tell others about this event?" *with the seed url for your event. */

ufJSActions.actions.yahoo_calendar = {
  description: "Add to Yahoo! Calendar",
  icon: "http://www.yahoo.com/favicon.ico",
  scope: {
    microformats: {
      "hCalendar" : "dtstart"
    }
  },
  doAction: function(node, microformatName, event) {
    var url;
    if (microformatName == "hCalendar") {
      var hcalendar = ufJSParser.createMicroformat(node, "hCalendar");
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
        url += ufJS.simpleEscape(date.replace(/-/g,""));
        if (time) {
          url += ufJS.simpleEscape(time.replace(/:/g,""));
        }
      }
      if (hcalendar.dtend) {
        var duration = "";
        var duration_num, hours, minutes;
        var dtStartDate = ufJSParser.dateFromISO8601(ufJSParser.localizeISO8601(hcalendar.dtstart));
        var dtEndDate = ufJSParser.dateFromISO8601(ufJSParser.localizeISO8601(hcalendar.dtend));
        if (!dtEndDate.time) {
          dtEndDate.setDate(dtEndDate.getDate()-1);
        }
        if (!Operator.upcomingOrgBugFixed) {
          if (content.document.location.href.indexOf("http://upcoming.org") == 0) {
            dtEndDate.setDate(dtEndDate.getDate()+1);
          }
        }
        
        if (((dtEndDate.getTime() - dtStartDate.getTime()) > 24*60*60*1000) || !dtEndDate.time) {
          url += "&";
          url += "rend=%2b";
          url += ufJSParser.iso8601FromDate(dtEndDate).replace(/-/g,"").replace(/:/g,"");
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
      url += "title=" + ufJS.simpleEscape(hcalendar.summary);
      if (hcalendar.description) {
        url += "&";
        var s = hcalendar.description;
        s = s.replace(/\<br\s*\>/gi, '%0D%0A');
        s = s.replace(/\<\/p>/gi, '%0D%0A%0D%0A');
        s	= s.replace(/\<.*?\>/gi, '');
        s	= s.replace(/^\s+/, '');
        url += "DESC=" + ufJS.simpleEscape(s.substr(0,2048));
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
    if (url) {
      openUILink(url, event);
    }
  }
};

ufJSActions.actions.yahoo_contact = {
  description: "Add to Yahoo! Contacts",
  icon: "http://www.yahoo.com/favicon.ico",
  scope: {
    microformats: {
      "hCard" : "hCard"
    }
  },
  doAction: function(node, microformatName, event) {
    var url;
    if (microformatName == "hCard") {
      var i, j, k;
      var hcard = ufJSParser.createMicroformat(node, "hCard");
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
            url += prefix + "a2=" + hcard.adr[j]["extended-address"] + "&";
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
        /* If business, default to work */
        if (hcard.org && (hcard.fn == hcard.org)) {
          workphone = hcard.tel[0].value;
        } else {
          homephone = hcard.tel[0].value;
        }
        preferred = hcard.tel[0].value;
        
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
            }
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
        /* 0=home, 1=work, 2=mobile */
        if (preferred == workphone) {
          url += "pp=1&";
        } else if (preferred == mobilephone) {
          url += "pp=2&";
        } else {
          url += "pp=0&";
        }
      }
      /* can be wu for a work url */
      if (hcard.url) {
        url += "pu=" + hcard.url[0] + "&";
      }
      url += "A=C";
    }
    if (url) {
      openUILink(url, event);
    }
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

