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


var add_google_contact = {
  description: "Add to Google Contacts",
  shortDescription: "Add Google Contact",
  login_details: {
    email: null,
    password: null,
    auth_token: null
  },
  scope: {
    semantic: {
      "hCard" : "fn"
    }
  },
  doAction: function(semanticObject, semanticObjectType, propertyIndex) {
	  var nb = getBrowser().getNotificationBox();

    //Do we have login details?
    if (add_google_contact.login_details.email == null) {
      if (Operator.debug) {
        alert("Finding login details");
      }
      add_google_contact.login_details = add_google_contact.get_login_details();

      //If the user cancelled finding them...
      if (add_google_contact.login_details.email == false) {
        if (Operator.debug) {
          alert("User cancelled");
        }
        return false;
      } else if (add_google_contact.login_details.email.indexOf('@') == -1) {
          add_google_contact.login_details.email = add_google_contact.login_details.email + "@gmail.com";
      }

    }

    if (Operator.debug) {
        alert("Finding auth token");
    }

    try {
      add_google_contact.login_details.auth_token = add_google_contact.login(add_google_contact.login_details.email,
                                                                             add_google_contact.login_details.password);
    } catch (e) {
      nb.appendNotification(e + ", try switching on Operator's debug mode for more detail", "2", null, nb.PRIORITY_INFO_LOW, null);
      return;
    }

    if (Operator.debug) {
      alert("Creating XML from hcard");
    }
    xml = add_google_contact.create_xml_from_vcard(semanticObject);

    if (Operator.debug) {
      alert("Submitting");
    }
        try {
            result = add_google_contact.create_contact(add_google_contact.login_details.email, add_google_contact.login_details.auth_token, xml);
            if (Operator.debug) {
                alert(result);
            }

            nb.appendNotification(semanticObject.fn + " Added Successfully to your Google Contacts", "2", null, nb.PRIORITY_INFO_LOW, null);
        } catch (ex) {
            nb.appendNotification(ex, "2", null, nb.PRIORITY_INFO_LOW, null);
            return;
        }
  },
  get_login_details: function () {
    result = null;
    try {
      if ("@mozilla.org/passwordmanager;1" in Components.classes) {
        result = add_google_contact.get_login_details_ff2();
      } else if ("@mozilla.org/login-manager;1" in Components.classes) {
        result = add_google_contact.get_login_details_ff3();
      }
    } catch (ex) {
      dump(ex);
      if (Operator.debug) {
        alert(ex);
      }
    }

    if (Operator.debug) {
        alert("Details: " + result.email + ", " + result.password);
    }
    return result;
  },
  /** @todo Remove support for FF2? */
  get_login_details_ff2: function () {
    var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"]
                                    .getService(Components.interfaces.nsIPasswordManager);

    var e = passwordManager.enumerator;

    //Ask the existing password manager for google account details
    var queryString = 'https://www.google.com';

    while (e.hasMoreElements()) {
      try {
          var pass = e.getNext().QueryInterface(Components.interfaces.nsIPassword);

          if (pass.host == queryString) {
              email_address = pass.user;
              password      = pass.password;

              //TODO: Check if the email_address is valid (I store my username without the @ details)
              return {email: email_address, password: password, auth_token: false};
          }
      } catch (ex) { 
          dump(ex);
          if (Operator.debug) {
              alert(ex);
          }
      }
    }

    //We didn't find the details. Oh dear.
    //Better ask nicely.

    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                            .getService(Components.interfaces.nsIPromptService);


    email_address = {value: ""};
    password      = {value: ""};
    check         = {value: true};

    var result = prompts.promptUsernameAndPassword(null, "", "Enter email and password for your Google Account:",
                                                   email_address, password, "Remember password", check);


    if (check.value) {
        try {
            passwordManager.addUser(queryString, email_address.value, password.value);
        } catch (ex) {
            dump(ex);
            if (Operator.debug) {
                alert(ex);
            }
        }
    }

    return {email: email_address.value, password: password.value, auth_token: false};
  },
  get_login_details_ff3: function () {

    var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                                   .getService(Components.interfaces.nsILoginManager);
    
    var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
                                             Components.interfaces.nsILoginInfo,
                                             "init");

    var hostname = 'https://www.google.com';
    var logins = myLoginManager.findLogins({}, hostname, hostname, null);

        //Fetch the last one
        for (var i = 0; i < logins.length; i++) {
                email_address = logins[i].username;
                password          = logins[i].password;

                return {email: email_address, password: password, auth_token: false};
        }

    //We didn't find the details. Oh dear.
    //Better ask nicely.

    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                            .getService(Components.interfaces.nsIPromptService);


    email_address = {value: ""};
    password      = {value: ""};
    check         = {value: true};

    var result = prompts.promptUsernameAndPassword(null, "", "Enter email and password for your Google Account:",
                                                   email_address, password, "Remember password", check);


    if (check.value) {
      try {
        var authLoginInfo = new nsLoginInfo(hostname,
                                            null, 'Google login (operator)',
                                            email_address.value, password.value, "", "");

        myLoginManager.addLogin(authLoginInfo);
      } catch (ex) {
          dump(ex);
          if (Operator.debug) {
              alert(ex);
          }
      }
    }

    return {email: email_address.value, password: password.value, auth_token: false};
  },
  /**
   * Send a create contact request for the email & auth_token provided.
   *
   * The contact is described in xml.
   *
   * @see add_google_contact.create_xml_from_vcard()
   */
  create_contact: function (email_address, auth_token, xml) {
      url = 'http://www.google.com/m8/feeds/contacts/' + escape(email_address) + "/base";

      return add_google_contact.send_request("POST", url, xml, auth_token, "application/atom+xml");
  },
  /**
   * Fetch an authorisation token for a given
   * username and password
   *
   * @return An authorisation token string
   */
  login: function (username, password) {
    var url = 'https://www.google.com/accounts/ClientLogin';
    var content = "";

    content  += "accountType=HOSTED_OR_GOOGLE";
    content  += "&Email="  + username;
    content  += "&Passwd=" + password;
    content  += "&service=cp";
    content  += "&source=NoCompany-Operator-0.1";


    response = add_google_contact.send_request("POST", url, content, null, "application/x-www-form-urlencoded");


    // Sample response
    /*
    HTTP/1.0 200 OK
    Server: GFE/1.3
    Content-Type: text/plain

    SID=DQAAAGgA...7Zg8CTN
    LSID=DQAAAGsA...lk8BBbG
    Auth=DQAAAGgA...dk3fA5N
    */
    if (response) {
      parts = response.split("\n");
      if (parts[2].substring(5)) {
        return parts[2].substring(5);
      }
    }

    throw "Invalid or unknown response - Authentication probably failed for " + username;
  },
  /**
   * Extracts information out from a hCard semantic object
   * and returns a google-friendly XML representation.
   */
  create_xml_from_vcard: function (hcard) {
    var i;
    var full_address;
    var email;
    var tel;
    var url;
    var xml = "";

    xml += "<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' xmlns:gd='http://schemas.google.com/g/2005' xmlns:gContact='http://schemas.google.com/contact/2008'>" + "\n";
    xml += "  <atom:category scheme='http://schemas.google.com/g/2005#kind' term='http://schemas.google.com/contact/2008#contact' />" + "\n";

    //Parse name
    xml += "  <atom:title type='text'>" + hcard.fn + "</atom:title> " + "\n";
    xml += "  <gContact:name><gContact:fullName>" + hcard.fn + "</gContact:fullName></gContact:name> " + "\n";

    // Any applicable Notes
    xml += "  <atom:content type='text'>Data from " + content.document.location.href + "</atom:content>" + "\n";

    if (hcard.email) {
      for (i = 0; i < hcard.email.length; i++) {
        email = hcard.email[i];

        type = 'home';
        if (email.type && email.type[0] == 'work') {
            type = 'work';
        }

        xml += "     <gd:email rel='http://schemas.google.com/g/2005#" + type + "' address='" + email.value + "' />" + "\n";
      }
    }


    if (hcard.tel) {
      for (i = 0; i < hcard.tel.length; i++) {
        tel = hcard.tel[i];

        type = 'home';
        if (tel.type && tel.type[0] == 'work') {
            type = 'work';
        }
        xml += "     <gd:phoneNumber rel='http://schemas.google.com/g/2005#" + type + "'>"  + tel.value + "</gd:phoneNumber>" + "\n";
      }
    }

    if (hcard.url) {
      for (i = 0; i < hcard.url.length; i++) {
        url = hcard.url[i];
        // IMs
        if ('xmpp:' == url.substring(0, 5)) {
            xml += "     <gd:im address='" + url.substring(5) + "' protocol='http://schemas.google.com/g/2005#JABBER' rel='http://schemas.google.com/g/2005#home' />" + "\n";
        }
        if ('http' == url.substring(0, 4)) {
            xml += "     <gContact:website rel='home-page' href='" + String(url) + "' />" + "\n";
        }

        /** @todo    If I ever find the way to tell google about the right bit of api */
        /*
        if ('aim:goim?screenname=' == url.substring(0, 20)) {
            //xml += "     <gd:im address='" + url + "' protocol='http://schemas.google.com/g/2005#GOOGLE_TALK' rel='http://schemas.google.com/g/2005#home' />" + "\n";
        }
        if ('ymsgr:sendIM?' == url.substring(0, 13)) {
            //xml += "     <gd:im address='" + url + "' protocol='http://schemas.google.com/g/2005#GOOGLE_TALK' rel='http://schemas.google.com/g/2005#home' />" + "\n";
        }
        */
      }
    }

    xml += "     <gContact:website rel='other' href='" + content.document.location.href + "' />";

    /** @todo gd:structuredPostalAddress support? */
    if (hcard.adr) {
      for (i = 0; i < hcard.adr.length; i++) {
        adr = hcard.adr[i];
        full_address = "";
        if (adr["street-address"]) {
            full_address += adr["street-address"] + " ";
        }

        if (adr["locality"]) {
            full_address += adr["locality"] + " ";
        }

        if (adr["region"]) {
            full_address += adr["region"] + " ";
        }

        if (adr["postal-code"]) {
            full_address += adr["postal-code"] + " ";
        }

        if (adr["country-name"]) {
            full_address += adr["country-name"] + " ";
        }

        if (full_address != "") {
            xml += "     <gd:postalAddress rel='http://schemas.google.com/g/2005#work'>" + full_address + "</gd:postalAddress>" + "\n";
        }
      }
    }


    xml += "</atom:entry>" + "\n";

    return xml;
  },
  /**
   * A helper method to send http requests to the google services.
   */
  send_request: function (method, url, content, auth, content_type) {
      request = new XMLHttpRequest();

      request.open(method, url, false);

      if (auth) {
        request.setRequestHeader("Authorization", "GoogleLogin auth=" + auth);
      }

      if (content_type) {
        request.setRequestHeader("Content-type", content_type);
      }

      try {
        request.send(content);

        if (request.status == 200 || request.status == 201 || request.status == 409) {
            return request.responseText;
        }

        throw "Unexpected status: " + request.status + "; " + request.responseText;

      } catch (ex) {
        dump(ex);

        if (Operator.debug) {
            alert(ex);
        }

        throw ex;
      }
  }
};

SemanticActions.add("add_google_contact", add_google_contact);

SemanticActions.add("google_maps", google_maps);
SemanticActions.add("google_search", google_search);
SemanticActions.add("google_calendar", google_calendar);
