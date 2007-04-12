/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.bluetooth_vcard = {
  description: "Send to Bluetooth Device",
  descriptionAll: "Send All to Bluetooth Device",
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
        }
        for (var j =0; j < vcards.length; j++) {
          var vcf = ufJS.vCard(vcards[j]);
          if (vcf) {
            fos.write(vcf, vcf.length);
          }
        }
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
          return;
        }
      }
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
          return;
        }
      }
    }
  }
};

ufJSActions.actions.bluetooth_icalendar = {
  description: "Send to Bluetooth Device",
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
        var ics = ufJS.iCalendar(node);
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
          return;
        }
      }
    }
  }
};

