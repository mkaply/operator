/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.export_vcard = {
  description: "Export Contact",
  scope: {
    microformats: {
      "hCard" : "hCard"
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
        url = "data:text/x-vcard;charset=utf8," + vcf.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
/* The old way here for comparison purposes 
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
        f.launch();
*/
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
        url = "data:text/calendar;charset=utf8," + escape(ics);
        break;
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

