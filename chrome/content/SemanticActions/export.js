var export_vcard = {
  description: "Export Contact",
  descriptionAll: "Export All",
  scope: {
    semantic: {
      "hCard" : "hCard"
    }
  },
  /* doActionAll gets ALL of the semantic Object arrays */
  doActionAll: function(semanticArrays, semanticObjectType) {
    var url;
    if (semanticArrays["hCard"].length > 0) {
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);

      file.append("hCard.vcf");

      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);
      var cos = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
                           createInstance(Components.interfaces.nsIConverterOutputStream);

      fos.init(file, -1, -1, false);
      cos.init(fos, null, 0, null);
                           
      for (var j =0; j < semanticArrays["hCard"].length; j++) {
        var vcf = this.vCard(semanticArrays["hCard"][j]);
        if (vcf) {
          cos.writeString(vcf);
        }
      }

      cos.close();
      fos.close();                                                                  

      var f = Components.classes["@mozilla.org/file/local;1"].
                         createInstance(Components.interfaces.nsILocalFile);
      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        f.launch();
        return true;
      }
      url = Components.classes["@mozilla.org/network/io-service;1"].
                       getService(Components.interfaces.nsIIOService).
                       newFileURI(f).
                       spec;
    }
    return url;
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    if (semanticObjectType == "hCard") {
      this.checkForMimeType();
      var vcf = this.vCard(semanticObject);
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);
  
      file.append(semanticObject.fn + ".vcf");
  
      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);
                           
      var cos = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
                           createInstance(Components.interfaces.nsIConverterOutputStream);

      fos.init(file, -1, -1, false);
      cos.init(fos, null, 0, null);
      cos.writeString(vcf);
      cos.close();
      fos.close();                                                                  
  
      var f = Components.classes["@mozilla.org/file/local;1"].
                         createInstance(Components.interfaces.nsILocalFile);
      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        f.launch();
        return true;
      }
      url = Components.classes["@mozilla.org/network/io-service;1"].
                       getService(Components.interfaces.nsIIOService).
                       newFileURI(f).
                       spec;
    }
    return url;
  },
  vCard: function(hcard, lineending)
  {
    var crlf = "\r\n";
    if (lineending) {
      crlf = lineending;
    }
    var vcf;
    var i;
    var j;
    vcf  = "BEGIN:VCARD" + crlf;
    vcf += "PRODID:-//kaply.com//Operator 0.8//EN" + crlf;
    vcf += "SOURCE:" + content.document.location.href + crlf;
    vcf += "NAME:" + content.document.title + crlf;
    vcf += "VERSION:3.0" + crlf;
    if (hcard.n && (hcard.n["family-name"] || hcard.n["given-name"] ||
        hcard.n["additional-name"] || hcard.n["honorific-prefix"] ||
        hcard.n["honorific-suffix"])) {
      vcf += "N;CHARSET=UTF-8:";
      if (hcard.n["family-name"]) {
        vcf += hcard.n["family-name"].join(",");
      }
      vcf += ";";
      if (hcard.n["given-name"]) {
        vcf += hcard.n["given-name"].join(",");
      }
      vcf += ";";
      if (hcard.n["additional-name"]) {
        vcf += hcard.n["additional-name"].join(",");
      }
      vcf += ";";
      if (hcard.n["honorific-prefix"]) {
        vcf += hcard.n["honorific-prefix"].join(",");
      }
      vcf += ";";
      if (hcard.n["honorific-suffix"]) {
        vcf += hcard.n["honorific-suffix"].join(",");
      }
      vcf += crlf;
    } else {
      vcf += "N:;;;;" + crlf;
    }
    if (hcard.org) {
      vcf += "ORG;CHARSET=UTF-8:";
      if (hcard.org[0]["organization-name"]) {
        vcf += hcard.org[0]["organization-name"];
      }
      if (hcard.org[0]["organization-unit"]) {
        vcf += ";";
        vcf += hcard.org[0]["organization-unit"].join(";");
      }
      vcf += crlf;
    }
    if (hcard.fn) {
      vcf += "FN;CHARSET=UTF-8:" + hcard.fn + crlf;
    }
    if (hcard.title) {
      vcf += "TITLE;CHARSET=UTF-8:" + hcard.title[0] + crlf;
    }
    if (hcard.role) {
      vcf += "ROLE;CHARSET=UTF-8:" + hcard.role[0] + crlf;
    }
    if (hcard["sort-string"]) {
      vcf += "SORT-STRING;CHARSET=UTF-8:" + hcard["sort-string"] + crlf;
    }
    if (hcard["class"]) {
      vcf += "CLASS;CHARSET=UTF-8:" + hcard["class"] + crlf;
    }
    if (hcard.tz) {
      vcf += "TZ;CHARSET=UTF-8:" + hcard.tz + crlf;
    }
    if (hcard.category) {
      vcf += "CATEGORIES;CHARSET=UTF-8:" + hcard.category.join(",") + crlf;
    }
    if (hcard.rev) {
      vcf += "REV:" + hcard.rev + crlf;
    }
    if (hcard.bday) {
      vcf += "BDAY:" + hcard.bday + crlf;
    }
    if (hcard.uid) {
      vcf += "UID:" + hcard.uid + crlf;
    } else {
      vcf += "UID:" + crlf;
    }
    if (hcard.url) {
      for (i=0;i<hcard.url.length;i++) {
        vcf += "URL:" + hcard.url[i] + crlf;
      }
    }
    if (hcard.email) {
      for (i=0;i<hcard.email.length;i++) {
        vcf += "EMAIL";
        if (hcard.email[i].type) {
          vcf += ";TYPE=";
          vcf += hcard.email[i].type.join(",");
        }
        vcf += ":";
        vcf += hcard.email[i].value;
        vcf += crlf;
      }
    }
    if (hcard.adr) {
      for (i=0;i<hcard.adr.length;i++) {
        vcf += "ADR;CHARSET=UTF-8";
        if (hcard.adr[i].type) {
          vcf += ";TYPE=";
          vcf += hcard.adr[i].type.join(",");
        }
        vcf += ":";
        if (hcard.adr[i]["post-office-box"]) {
          vcf += hcard.adr[i]["post-office-box"];
        }
        vcf += ";";
        if (hcard.adr[i]["extended-address"]) {
          vcf += hcard.adr[i]["extended-address"];
        }
        vcf += ";";
        if (hcard.adr[i]["street-address"]) {
          vcf += hcard.adr[i]["street-address"].join(",");
        }
        vcf += ";";
        if (hcard.adr[i].locality) {
          vcf += hcard.adr[i].locality;
        }
        vcf += ";";
        if (hcard.adr[i].region) {
          vcf += hcard.adr[i].region;
        }
        vcf += ";";
        if (hcard.adr[i]["postal-code"]) {
          vcf += hcard.adr[i]["postal-code"];
        }
        vcf += ";";
        if (hcard.adr[i]["country-name"]) {
          vcf += hcard.adr[i]["country-name"];
        }
        vcf += crlf;
      }
    }
    if (hcard.tel) {
      for (i=0;i<hcard.tel.length;i++) {
        vcf += "TEL;TYPE=";
        if (hcard.tel[i].type) {
          vcf += hcard.tel[i].type.join(",");
        } else {
          /* Default to voice if there is no type */
          vcf += "VOICE";
        }
        vcf += ":";
        vcf += hcard.tel[i].value;
        vcf += crlf;
      }
    }
    if (hcard.geo) {
      vcf += "GEO:" + hcard.geo.latitude + ";" + hcard. geo.longitude + crlf;
    }
    if (hcard.note) {
      vcf += "NOTE;CHARSET=UTF-8:";
      for (i=0; i< hcard.note.length;i++) {
        var s = hcard.note[i].toString();
        if (!s) {
          continue;
        }
        s = s.replace(/\<.*?\>/gi, ' ');
        s = s.replace(/[\n\r\t]/gi, ' ');
        s = s.replace(/\s{2,}/gi, ' ');
        s = s.replace(/\s{2,}/gi, '');
        s = s.replace(/^\s+/, '');
        if (i != 0) {
          vcf += " ";
        }
        vcf += s;
      }
      vcf += crlf;
    }
    if (hcard.nickname) {
      vcf += "NICKNAME;CHARSET=UTF-8:" + hcard.nickname + crlf;
    }
    /* Add code to handle data URLs */
    if (hcard.photo) {
      vcf += "PHOTO;VALUE=uri:" + hcard.photo + crlf;
    }
    if (hcard.logo) {
      vcf += "LOGO;VALUE=uri:" + hcard.logo + crlf;
    }
    if (hcard.label) {
      vcf += "LABEL:" + hcard.label + crlf;
    }
    vcf += "END:VCARD" + crlf;
    return vcf;
  },
  /* This function checks to see if VCF is handled and if it isn't it sets it */
  checkForMimeType: function() {
    try {
      var mimeSvc = Components.classes["@mozilla.org/mime;1"].getService(Components.interfaces.nsIMIMEService);
      mimeSvc.getFromTypeAndExtension(null, "vcf");
      return true;
    } catch (ex) {
     var gRDF = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
     const mimeTypes = "UMimTyp";
     var fileLocator = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
     var file = fileLocator.get(mimeTypes, Components.interfaces.nsIFile);
     var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
     var fileHandler = ioService.getProtocolHandler("file").QueryInterface(Components.interfaces.nsIFileProtocolHandler);
     var datasource = gRDF.GetDataSourceBlocking(fileHandler.getURLSpecFromFile(file));
     
     var source = gRDF.GetResource("urn:mimetypes");
     var property = gRDF.GetResource("http://home.netscape.com/NC-rdf#MIME-types");
     var target = gRDF.GetResource("urn:mimetypes:root");
     datasource.Assert(source, property, target, true);
 
     // Make sure the target is a container.
     var containerUtils = Components.classes["@mozilla.org/rdf/container-utils;1"]
                             .getService(Components.interfaces.nsIRDFContainerUtils);
     if (!containerUtils.IsContainer(datasource, target))
       containerUtils.MakeSeq(datasource, target);
 
     // Get the type list as an RDF container.
     var container =
           Components.classes["@mozilla.org/rdf/container;1"].createInstance(Components.interfaces.nsIRDFContainer);
     container.Init(datasource, target);
     var element = gRDF.GetUnicodeResource("urn:mimetype:text/x-vcard");
     if (container.IndexOf(element) == -1)
       container.AppendElement(element);
     var source = gRDF.GetResource("urn:mimetypes");
     var property =  gRDF.GetResource("http://home.netscape.com/NC-rdf#MIME-types");
     datasource.Assert(gRDF.GetUnicodeResource("urn:mimetype:text/x-vcard"), gRDF.GetUnicodeResource("http://home.netscape.com/NC-rdf#value"), gRDF.GetLiteral("text/x-vcard"), true);
     datasource.Assert(gRDF.GetUnicodeResource("urn:mimetype:text/x-vcard"), gRDF.GetUnicodeResource("http://home.netscape.com/NC-rdf#fileExtensions"), gRDF.GetLiteral("vcf"), true);
    }
  }
};

var export_icalendar = {
  description: "Export Event",
  descriptionAll: "Export All",
  scope: {
    semantic: {
      "hCalendar" : "dtstart"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    if (semanticObjectType == "hCalendar") {
      this.checkForMimeType();
      var ics = this.iCalendar(semanticObject, true, true);
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);
  
      file.append("hCalendar.ics");
  
      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);
      var cos = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
                           createInstance(Components.interfaces.nsIConverterOutputStream);

      fos.init(file, -1, -1, false);
      cos.init(fos, null, 0, null);

      cos.writeString(ics);
      cos.close();
      fos.close();                                                                  
  
      var f = Components.classes["@mozilla.org/file/local;1"].
                         createInstance(Components.interfaces.nsILocalFile);
      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        f.launch();
        return true;
      }
      url = Components.classes["@mozilla.org/network/io-service;1"].
                       getService(Components.interfaces.nsIIOService).
                       newFileURI(f).
                       spec;
    }
    return url;
  },
  /* doActionAll gets ALL of the semantic Object arrays */
  doActionAll: function(semanticArrays, semanticObjectType) {
    var url;
    if (semanticArrays["hCalendar"].length > 0) {
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);

      file.append("hCalendar.ics");

      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);
      var cos = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
                           createInstance(Components.interfaces.nsIConverterOutputStream);

      fos.init(file, -1, -1, false);
      cos.init(fos, null, 0, null);

      var ics, header, footer;
      for (var j =0; j < semanticArrays["hCalendar"].length > 0; j++) {
        if (j == 0) {
          header = true;
        } else {
          header = false;
        }
        if (j == (semanticArrays["hCalendar"].length - 1)) {
          footer = true;
        } else {
          footer = false;
        }
        if (semanticArrays["hCalendar"][j]['dtstart']) {
          ics = this.iCalendar(semanticArrays["hCalendar"][j], header, footer);
          if (ics) {
            cos.writeString(ics);
          }
        }
      }

      cos.close();
      fos.close();                                                                  

      var f = Components.classes["@mozilla.org/file/local;1"].
                         createInstance(Components.interfaces.nsILocalFile);
      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        f.launch();
        return true;
      }
      url = Components.classes["@mozilla.org/network/io-service;1"].
                       getService(Components.interfaces.nsIIOService).
                       newFileURI(f).
                         spec;
    }
    return url;
  },
  iCalendar: function(hcalendar, header, footer)
  {
    var crlf = "\n";
    var ics = "";
    if (header) {
      ics += "BEGIN:VCALENDAR" + crlf;;
      ics += "PRODID:" + crlf;;
      ics += "X-ORIGINAL-URL:" + content.document.location.href + crlf;;
      ics += "X-WR-CALNAME:" + crlf;;
      ics += "VERSION:2.0" + crlf;;
      ics += "METHOD:PUBLISH" + crlf;;
    }
    ics += "BEGIN:VEVENT" + crlf;;
    if (hcalendar["class"]) {
      ics += "CLASS:" + hcalendar["class"] + crlf;;
    }
    if (hcalendar.description) {
      var s = hcalendar.description;
      s = s.replace(/\<.*?\>/gi, '');
      s = s.replace(/[\n\r\t]/gi, ' ');
      s = s.replace(/\s{2,}/gi, ' ');
      s = s.replace(/\s{2,}/gi, '');
      s = s.replace(/^\s+/, '');

/*
      var newdescription = "";
      for (var i = 0; i < hcalendar.description.length; i++) {
        if ((hcalendar.description.charCodeAt(i) == 13)  && //r
            (hcalendar.description.charCodeAt(i + 1) == 10 )) { //n
          newdescription += hcalendar.description[i] + hcalendar.description[i+1] + '  ';
          i++;
        } else if ((hcalendar.description.charCodeAt(i) == 13 ) || //r
                   (hcalendar.description.charCodeAt(i) == 10 ))  { //n
          newdescription += hcalendar.description[i] + '  ';
        } else {
          newdescription += hcalendar.description[i];
        }
      }
*/
      ics += "DESCRIPTION;CHARSET=UTF-8:" + s + crlf;;
    }
    if (hcalendar.location) {
      ics += "LOCATION;CHARSET=UTF-8:";
      if (typeof hcalendar.location == "object") {
        if (hcalendar.location.fn) {
          ics += hcalendar.location.fn;
        }
        if (hcalendar.location.adr) {
          if (hcalendar.location.adr[0]["street-address"]) {
            ics += ", ";
            ics += hcalendar.location.adr[0]["street-address"][0];
          }
          if (hcalendar.location.adr[0]["extended-address"]) {
            ics += ", ";
            ics += hcalendar.location.adr[0]["extended-address"];
          }
          if (hcalendar.location.adr[0].locality) {
            ics += ", ";
            ics += hcalendar.location.adr[0].locality;
          }
          if (hcalendar.location.adr[0].region) {
            ics += ", ";
            ics += hcalendar.location.adr[0].region;
          }
          if (hcalendar.location.adr[0]["postal-code"]) {
            ics += " ";
            ics += hcalendar.location.adr[0]["postal-code"];
          }
          if (hcalendar.location.adr[0]["country-name"]) {
            ics += ",";
            ics += hcalendar.location.adr[0]["country-name"];
          }
        }
      } else {
        ics += hcalendar.location;
      }
      ics += crlf;;
    }
    if (hcalendar.summary) {
      ics += "SUMMARY;CHARSET=UTF-8:" + hcalendar.summary + crlf;;
    }
    if (hcalendar.status) {
      ics += "STATUS:" + hcalendar.status + crlf;;
    }
    if (hcalendar.transp) {
      ics += "TRANSP:" + hcalendar.transp + crlf;;
    }
    /* OUTLOOK REQUIRES UID */
    ics += "UID:";
    if (hcalendar.uid) {
      ics += hcalendar.uid;
    }
    ics += crlf;;
    if (hcalendar.url) {
      ics += "URL:" + hcalendar.url + crlf;;
    }
    var date;
    var time;
    if (hcalendar.dtstart) {
      ics += "DTSTART;VALUE=DATE";
      var T = hcalendar.dtstart.indexOf("T");
      if (T > -1) {
        ics += "-TIME";
        /* This is some seriously ugly code that accomodates the fact that */
        /* ICS don't support TZ offsets, only UTC (Z) */
        var tzpos = hcalendar.dtstart.lastIndexOf("+");
        if (tzpos == -1) {
          tzpos = hcalendar.dtstart.lastIndexOf("-");
        }
        if (tzpos > T) {
          var js_date = Microformats.dateFromISO8601(hcalendar.dtstart.substr(0, tzpos));
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
          var js_date = Microformats.dateFromISO8601(hcalendar.dtstart);
          var dtstart = Microformats.iso8601FromDate(js_date, true);
          date = dtstart.substr(0, T);
          time = dtstart.substr(T);
		  if (hcalendar.dtstart.indexOf('Z') != -1) {
			time += "Z";
		  }
        }
      } else {
        date = hcalendar.dtstart;
      }
      ics += ":" + date.replace(/-/g,"");
      if (time) {
        ics += time.replace(/:/g,"");
      }
      ics += crlf;
    }
    if (hcalendar.dtend) {
      ics += "DTEND;VALUE=DATE";
      var T = hcalendar.dtend.indexOf("T");
      if (T > -1) {
        ics += "-TIME";
        /* This is some seriously ugly code that accomodates the fact that */
        /* ICS don't support TZ offsets, only UTC (Z) */
        var tzpos = hcalendar.dtend.lastIndexOf("+");
        if (tzpos == -1) {
          tzpos = hcalendar.dtend.lastIndexOf("-");
        }
        if (tzpos > T) {
          var js_date = Microformats.dateFromISO8601(hcalendar.dtend.substr(0, tzpos));
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
          var js_date = Microformats.dateFromISO8601(hcalendar.dtend);
          var dtend = Microformats.iso8601FromDate(js_date, true);
          date = dtend.substr(0, T);
          time = dtend.substr(T);
		  if (hcalendar.dtend.indexOf('Z') != -1) {
			time += "Z";
		  }
        }
      } else {
        date = hcalendar.dtend;
        if (!Operator.upcomingBugFixed) {
          if (content.document.location.href.indexOf("http://upcoming.yahoo.com") == 0) {
            date = date.replace(/-/g, "");
            date = (parseInt(date, 10)+1).toString();
          }
        }
      }
      ics += ":" + date.replace(/-/g,"");
      if (time) {
        ics += time.replace(/:/g,"");
      }
      ics += crlf;
    }
    if (hcalendar.rrule) {
      ics += "RRULE:";
      for (let i in hcalendar.rrule) {
        ics += i.toUpperCase() + "=" + hcalendar.rrule[i].toUpperCase() + ";";
      }
      ics += crlf;
    }
    
    /* OUTLOOK REQUIRES DTSTAMP */
    ics += "DTSTAMP:";
    if (hcalendar.dtstamp) {
      ics += hcalendar.dtstamp;
    } else {
      ics += "19701209T000000Z";
    }
    ics += crlf;;
    if (hcalendar.category) {
      ics += "CATEGORIES;CHARSET=UTF-8:" + hcalendar.category.join(",") + crlf;;
    }
    if (hcalendar.location) {
      if (typeof hcalendar.location == "object") {
        if (hcalendar.location.geo) {
          ics += "GEO:" + hcalendar.location.geo.latitude + ";" + hcalendar.location.geo.longitude + crlf;;
        }
      }
    }
    ics += "END:VEVENT" + crlf;;
    if (footer) {
      ics += "END:VCALENDAR" + crlf;;
    }

    return ics;
  },
  /* This function checks to see if VCF is handled and if it isn't it sets it */
  checkForMimeType: function() {
    try {
      var mimeSvc = Components.classes["@mozilla.org/mime;1"].getService(Components.interfaces.nsIMIMEService);
      mimeSvc.getFromTypeAndExtension(null, "ics");
      return true;
    } catch (ex) {
     var gRDF = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
     const mimeTypes = "UMimTyp";
     var fileLocator = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
     var file = fileLocator.get(mimeTypes, Components.interfaces.nsIFile);
     var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
     var fileHandler = ioService.getProtocolHandler("file").QueryInterface(Components.interfaces.nsIFileProtocolHandler);
     var datasource = gRDF.GetDataSourceBlocking(fileHandler.getURLSpecFromFile(file));
     
     var source = gRDF.GetResource("urn:mimetypes");
     var property = gRDF.GetResource("http://home.netscape.com/NC-rdf#MIME-types");
     var target = gRDF.GetResource("urn:mimetypes:root");
     datasource.Assert(source, property, target, true);
 
     // Make sure the target is a container.
     var containerUtils = Components.classes["@mozilla.org/rdf/container-utils;1"]
                             .getService(Components.interfaces.nsIRDFContainerUtils);
     if (!containerUtils.IsContainer(datasource, target))
       containerUtils.MakeSeq(datasource, target);
 
     // Get the type list as an RDF container.
     var container =
           Components.classes["@mozilla.org/rdf/container;1"].createInstance(Components.interfaces.nsIRDFContainer);
     container.Init(datasource, target);
     var element = gRDF.GetUnicodeResource("urn:mimetype:text/calendar");
     if (container.IndexOf(element) == -1)
       container.AppendElement(element);
     var source = gRDF.GetResource("urn:mimetypes");
     var property =  gRDF.GetResource("http://home.netscape.com/NC-rdf#MIME-types");
     datasource.Assert(gRDF.GetUnicodeResource("urn:mimetype:text/calendar"), gRDF.GetUnicodeResource("http://home.netscape.com/NC-rdf#value"), gRDF.GetLiteral("text/calendar"), true);
     datasource.Assert(gRDF.GetUnicodeResource("urn:mimetype:text/calendar"), gRDF.GetUnicodeResource("http://home.netscape.com/NC-rdf#fileExtensions"), gRDF.GetLiteral("ics"), true);
    }
  }
};

var export_kml = {
    description: "Export KML",
    descriptionAll: "Export All KML",
    scope: {
        semantic: {
            "geo" : "geo"
        }
    },
    doActionAll: function(semanticArrays, semanticObjectType) {
        if (semanticObjectType == 'geo') {
            return export_kml.kml_export_action(semanticArrays['geo']);
        }
    },
    doAction: function(semanticObject, semanticObjectType) {
        if (semanticObjectType == 'geo') {
            return export_kml.kml_export_action(new Array(semanticObject));
        }
    },
    xmlns_kml: 'http://earth.google.com/kml/2.2',
    kml_create_placemark: function kml_create_placemark(name, description, lat, lon, alt) {
      var placemark = document.createElementNS(export_kml.xmlns_kml, 'Placemark');
  
      var nameNode = document.createElementNS(export_kml.xmlns_kml, 'name');
      nameNode.appendChild(document.createTextNode(name));
  
      var descriptionNode = document.createElementNS(export_kml.xmlns_kml, 'description');
      descriptionNode.appendChild(document.createTextNode(description));
  
      var pointNode = export_kml.kml_create_point(lat, lon, alt);
  
      placemark.appendChild(nameNode);
      placemark.appendChild(descriptionNode);
      placemark.appendChild(pointNode);
  
      return placemark;
    },
    kml_create_point: function kml_create_point(lat, lon, alt) {
      var point = document.createElementNS(export_kml.xmlns_kml, 'Point');
      var coordinates = document.createElementNS(export_kml.xmlns_kml, 'coordinates');
      coordinates.appendChild(document.createTextNode(lon + ',' + lat));
  
      point.appendChild(coordinates);
  
      return point;
    },
    kml_open_file: function kml_open_file(filename) {
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);
      file.append(filename);
  
      return file;
    },
    kml_write_document: function kml_write_document(doc, filename) {
      var file = export_kml.kml_open_file(filename);
      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                             createInstance(Components.interfaces.nsIFileOutputStream);

      fos.init(file, -1, -1, false);

      var xml;
      var s = new XMLSerializer();

      var stream = {
          close : function() {},
          flush : function() {},
          write : function(string, count) {
                        fos.write(string, string.length);
                  }
      };

      s.serializeToStream(doc, stream, "UTF-8");

      fos.close();

      return file;
    },
    kml_execute_url: function kml_execute_url(file) {
      var f = Components.classes["@mozilla.org/file/local;1"]
                        .createInstance(Components.interfaces.nsILocalFile);

      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
          f.launch();
          return true;
      }

      return Components.classes["@mozilla.org/network/io-service;1"]
                       .getService(Components.interfaces.nsIIOService)
                       .newFileURI(f)
                       .spec;
    },
    kml_export_action: function kml_export_action(items) {
    var doc = document.implementation.createDocument(export_kml.xmlns_kml,'kml',null);;

    var folder = document.createElementNS(export_kml.xmlns_kml, 'Folder');

    for (var i = 0; i < items.length; i++) {
        var placemark = export_kml.kml_create_placemark(items[i].toString(), '', items[i].latitude, items[i].longitude, 0);
        folder.appendChild(placemark);
    }

    doc.documentElement.appendChild(folder);

    return export_kml.kml_execute_url(export_kml.kml_write_document(doc, 'geo.kml'));
  }
};

SemanticActions.add("export_vcard", export_vcard);
SemanticActions.add("export_icalendar", export_icalendar);
SemanticActions.add("export_kml", export_kml);
