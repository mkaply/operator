/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.yedda_search_tags = {
  description: "Find answers on Yedda",
  icon: "http://yedda.com/favicon.ico",
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
          url = "http://yedda.com/questions/tags/" + encodeURIComponent(tag) + "?source=operator";
          break;
        }
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};
