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
        url = "data:text/x-vcard ;charset=utf8," + escape(vcf);
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

