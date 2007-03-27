/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.export_vcard = {
  description: "Export Contact",
  descriptionAll: "Export All",
  scope: {
    microformats: {
      "hCard" : "hCard"
    }
  },
  doActionAll: function(doc, microformatName, event) {
    var microformatNames;
    microformatNames = [];
    microformatNames.push(microformatName);
    var url;
    for (var i in microformatNames) {
      if (microformatNames[i] == "hCard") {
        var vcards = ufJSParser.getElementsByClassName(doc, "vcard");
        if (vcards.length > 0) {
          var file = Components.classes["@mozilla.org/file/directory_service;1"].
                                getService(Components.interfaces.nsIProperties).
                                get("TmpD", Components.interfaces.nsIFile);

          file.append("hCard.vcf");

          var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                               createInstance(Components.interfaces.nsIFileOutputStream);

          fos.init(file, -1, -1, false);

          for (var j =0; j < vcards.length; j++) {
            var vcf = ufJS.vCard(vcards[j]);
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
          break;
        }
      }
    }
    if (url) {
      openUILink(url, event);
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
        var vcf = ufJS.vCard(node);
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
        break;
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

ufJSActions.actions.export_icalendar = {
  description: "Export Event",
  descriptionAll: "Export All",
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
        var ics = ufJS.iCalendar(node, true, true);
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
        break;
      }
    }
    if (url) {
      openUILink(url, event);
    }
  },
  doActionAll: function(doc, microformatName, event) {
    var microformatNames;
    microformatNames = [];
    microformatNames.push(microformatName);
    var url;
    for (var i in microformatNames) {
      if (microformatNames[i] == "hCalendar") {
        var icals = ufJSParser.getElementsByClassName(doc, "vevent");
        if (icals.length > 0) {
          var file = Components.classes["@mozilla.org/file/directory_service;1"].
                                getService(Components.interfaces.nsIProperties).
                                get("TmpD", Components.interfaces.nsIFile);

          file.append("hCalendar.ics");

          var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                               createInstance(Components.interfaces.nsIFileOutputStream);

          fos.init(file, -1, -1, false);

          var ics, header, footer;
          for (var j =0; j < icals.length; j++) {
            if (j == 0) {
              header = true;
            } else {
              header = false;
            }
            if (j == (icals.length -1)) {
              footer = true;
            } else {
              footer = false;
            }
            ics = ufJS.iCalendar(icals[j], header, footer);
            if (ics) {
              fos.write(ics, ics.length);
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
        break;
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

