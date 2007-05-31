/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

var bluetooth_vcard = {
  version: 0.8,
  description: "Send to Bluetooth Device",
  shortDescription: "Bluetooth (VCF)",
  scope: {
    semantic: {
      "hCard" : "hCard"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "hCard") {
      var vcf = SemanticActions.export_vcard.vCard(semanticObject);
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);

      file.append("hCard.vcf");

      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);

      fos.init(file, -1, -1, false);
      fos.write(vcf, vcf.length);                                                   
      fos.close();                                                                  

      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        var open = Components.classes["@mozilla.org/file/local;1"].
                                   createInstance(Components.interfaces.nsILocalFile);
        open.initWithPath("/usr/bin/open");
        var process = Components.classes["@mozilla.org/process/util;1"]
                         .createInstance(Components.interfaces.nsIProcess);
                          
        process.init(open);
        var args = [];
        args.push("-a");
        args.push("/Applications/Utilities/Bluetooth File Exchange.app");
        args.push(file.path);
        process.run(false, args, args.length);
        return true;
      }
    }
  }
};

var bluetooth_icalendar = {
  version: 0.8,
  description: "Send to Bluetooth Device",
  shortDescription: "Bluetooth (ICS)",
  scope: {
    semantic: {
      "hCalendar" : "dtstart"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "hCalendar") {
      var ics = SemanticActions.export_icalendar.iCalendar(semanticObject);
      var file = Components.classes["@mozilla.org/file/directory_service;1"].
                            getService(Components.interfaces.nsIProperties).
                            get("TmpD", Components.interfaces.nsIFile);

//        file.append("hCalendar.ics");
      file.append("hCalendar.vcs");

      var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
                           createInstance(Components.interfaces.nsIFileOutputStream);

      fos.init(file, -1, -1, false);
      fos.write(ics, ics.length);                                                   
      fos.close();                                                                  

      if (Components.classes["@mozilla.org/xre/app-info;1"]
                    .getService(Components.interfaces.nsIXULRuntime)
                    .OS == "Darwin") {
        var open = Components.classes["@mozilla.org/file/local;1"].
                                   createInstance(Components.interfaces.nsILocalFile);
        open.initWithPath("/usr/bin/open");
        var process = Components.classes["@mozilla.org/process/util;1"]
                         .createInstance(Components.interfaces.nsIProcess);
                          
        process.init(open);
        var args = [];
        args.push("-a");
        args.push("/Applications/Utilities/Bluetooth File Exchange.app");
        args.push(file.path);
        process.run(false, args, args.length);
        return true;
      }
    }
  }
};

SemanticActions.add("bluetooth_vcard", bluetooth_vcard);
SemanticActions.add("bluetooth_icalendar", bluetooth_icalendar);
