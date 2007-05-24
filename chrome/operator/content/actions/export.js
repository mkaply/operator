var export_vcard = {
  version: 0.8,
  description: "Export Contact",
  descriptionAll: "Export All",
  scope: {
    semantic: {
      "hCard" : "hCard",
    }
  },
  /* doActionAll gets ALL of the semantic Object arrays */
  doActionAll: function(semanticArrays) {
    var url;
    if (semanticArrays["hCard"].length > 0) {
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);

      file.append("hCard.vcf");

      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);

      fos.init(file, -1, -1, false);

      for (var j =0; j < semanticArrays["hCard"].length; j++) {
        var vcf = this.vCard(semanticArrays["hCard"][j]);
        if (vcf) {
          fos.write(vcf, vcf.length);
        }
      }

      fos.close();                                                                  

      var f = Components.classes["@mozilla.org/file/local;1"].
                         createInstance(Components.interfaces.nsILocalFile);
      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        f.launch();
        return;
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
      var vcf = this.vCard(semanticObject);
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);
  
      file.append("hCard.vcf");
  
      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);
  
      fos.init(file, -1, -1, false);
      fos.write(vcf, vcf.length);                                                   
      fos.close();                                                                  
  
      var f = Components.classes["@mozilla.org/file/local;1"].
                         createInstance(Components.interfaces.nsILocalFile);
      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        f.launch();
        return;
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
    vcf += "PRODID:-//kaply.com//Operator 0.7//EN" + crlf;
    vcf += "SOURCE:" + content.document.location.href + crlf;
    vcf += "NAME:" + content.document.title + crlf;
    vcf += "VERSION:3.0" + crlf;
    if (hcard.n && (hcard.n["family-name"] || hcard.n["given-name"] ||
        hcard.n["additional-name"] || hcard.n["honorific-prefix"] ||
        hcard.n["honorific-suffix"])) {
      vcf += "N;CHARSET=UTF-8:";
      if (hcard.n["family-name"]) {
        vcf += hcard.n["family-name"];
      }
      vcf += ";";
      if (hcard.n["given-name"]) {
        vcf += hcard.n["given-name"];
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
      vcf += "N:;;" + crlf;
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
      vcf += "SORT-STRING;CHARSET=UTF-8:" + hcard["sort-string"][0] + crlf;
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
        vcf += "TEL";
        if (hcard.tel[i].type) {
          vcf += ";TYPE=";
          vcf += hcard.tel[i].type.join(",");
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
        var s = hcard.note[i];
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
    vcf += "END:VCARD" + crlf;
    return vcf;
  }
};

var export_icalendar = {
  version: 0.8,
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
      var ics = this.iCalendar(semanticObject, true, true);
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);
  
      file.append("hCalendar.ics");
  
      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);
  
      fos.init(file, -1, -1, false);
      fos.write(ics, ics.length);                                                   
      fos.close();                                                                  
  
      var f = Components.classes["@mozilla.org/file/local;1"].
                         createInstance(Components.interfaces.nsILocalFile);
      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        f.launch();
        return;
      }
      url = Components.classes["@mozilla.org/network/io-service;1"].
                       getService(Components.interfaces.nsIIOService).
                       newFileURI(f).
                       spec;
    }
    return url;
  },
  /* doActionAll gets ALL of the semantic Object arrays */
  doActionAll: function(semanticArrays) {
    var url;
    if (semanticArrays["hCalendar"].length > 0) {
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);

      file.append("hCalendar.ics");

      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);

      fos.init(file, -1, -1, false);

      var ics, header, footer;
      for (var j =0; j < semanticArrays["hCalendar"].length > 0; j++) {
        if (j == 0) {
          header = true;
        } else {
          header = false;
        }
        if (j == (semanticArrays["hCalendar"].length > 0 -1)) {
          footer = true;
        } else {
          footer = false;
        }
        if (semanticArrays["hCalendar"][j]['dtstart']) {
          ics = this.iCalendar(semanticArrays["hCalendar"][j], header, footer);
          if (ics) {
            fos.write(ics, ics.length);
          }
        }
      }

      fos.close();                                                                  

      var f = Components.classes["@mozilla.org/file/local;1"].
                         createInstance(Components.interfaces.nsILocalFile);
      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        f.launch();
        return;
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
        if (hcalendar.location.adr[0]["street-address"]) {
          ics += ", ";
          ics += hcalendar.location.adr[0]["street-address"][0];
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
        date = hcalendar.dtstart.substr(0, T);
        time = hcalendar.dtstart.substr(T);
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
        date = hcalendar.dtend.substr(0, T);
        time = hcalendar.dtend.substr(T);
      } else {
        date = hcalendar.dtend;
        if (!Operator.upcomingOrgBugFixed) {
          if (content.document.location.href.indexOf("http://upcoming.org") == 0) {
            date = date.replace(/-/g, "");
            date = (parseInt(date)+1).toString();
          }
        }
      }
      ics += ":" + date.replace(/-/g,"");
      if (time) {
        ics += time.replace(/:/g,"");
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
  }
};

var export_kml = {
  version: 0.8,
  description: "Export as KML",
  descriptionAll: "Export All",
  scope: {
    semantic: {
      "geo" : "geo"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    var url;
    var kmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                    '<kml xmlns="http://earth.google.com/kml/2.1">\n' +
                    '  <Placemark>\n';
    var kmlFooter = '  </Placemark>\n' +
                    '</kml>';
    var kmlPoint = '  <Point>\n' +
                   '     <coordinates>%longitude%,%latitude%,0</coordinates>\n' +
                   '  </Point>\n';
 
    
    if (semanticObjectType == "geo") {
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);
  
      file.append("geo.kml");
  
      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);
  
      fos.init(file, -1, -1, false);
      fos.write(kmlHeader, kmlHeader.length);
      if (semanticObject.toString()) {
        var name = '  <name>' + semanticObject.toString() + '</name>';
        fos.write(name, name.length);
      }
      var str = kmlPoint;
      var str = str.replace(/%latitude%/g, semanticObject.latitude);
      var str = str.replace(/%longitude%/g, semanticObject.longitude);
      fos.write(str, str.length);
      fos.write(kmlFooter, kmlFooter.length);
      fos.close();                                                                  
  
      var f = Components.classes["@mozilla.org/file/local;1"].
                         createInstance(Components.interfaces.nsILocalFile);
      f.initWithPath(file.path);
      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        f.launch();
        return;
      }
      url = Components.classes["@mozilla.org/network/io-service;1"].
                       getService(Components.interfaces.nsIIOService).
                       newFileURI(f).
                       spec;
    }
    return url;
  }
};

Microformats.actions.add("export_vcard", export_vcard);
Microformats.actions.add("export_icalendar", export_icalendar);
Microformats.actions.add("export_kml", export_kml);
