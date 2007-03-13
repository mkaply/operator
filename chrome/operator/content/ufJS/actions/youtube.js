/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.youtube_search_tags = {
  description: "Find videos on YouTube",
  icon: "http://youtube.com/favicon.ico",
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
          url = "http://youtube.com/results?search_query=" + encodeURIComponent(tag);
          break;
        }
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};
