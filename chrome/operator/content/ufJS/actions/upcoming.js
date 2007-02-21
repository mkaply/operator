/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.upcoming_search_tags = {
  description: "Find events on Upcoming.org",
  icon: "http://upcoming.org/favicon.ico",
  scope: {
    microformats: {
      "tag" : "tag"
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
      if (microformatNames[i] == "tag") {
        var tag = ufJSParser.getMicroformatProperty(node, "tag", "tag");
        if (tag) {
          url = "http://upcoming.org/tag/" + encodeURIComponent(tag);
          break;
        }
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};
