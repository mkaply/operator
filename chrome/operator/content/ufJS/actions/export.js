ufJSActions.actions.export_vcard = {
  description: "Export Contact",
  descriptionAll: "Export All",
  scope: {
    semantic: {
      "hCard" : "hCard",
      "RDFa" : "http://xmlns.com/foaf/0.1/givenname"
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
        var vcf = ufJS.vCard(semanticArrays["hCard"][j]);
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
    if (semanticObjectType == "RDFa") {
      alert("RDFA");
    }
    if (semanticObjectType == "hCard") {
      var vcf = ufJS.vCard(semanticObject);
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
  }
};

ufJSActions.actions.export_icalendar = {
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
      var ics = ufJS.iCalendar(semanticObject, true, true);
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
          ics = ufJS.iCalendar(semanticArrays["hCalendar"][j], header, footer);
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
  }
};
ufJSActions.actions.export_kml = {
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
          ics = ufJS.iCalendar(semanticArrays["hCalendar"][j], header, footer);
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
  }
};

