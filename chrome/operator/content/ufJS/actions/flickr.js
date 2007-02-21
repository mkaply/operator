/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.flickr_search_tags = {
  description: "Find photos on flickr",
  icon: "http://flickr.com/favicon.ico",
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
          /* Flickr treats spaces as multiple tags - replace space with + */
          tag = tag.replace(/ /g, '+');
          url = "http://flickr.com/photos/tags/" + encodeURIComponent(tag);
          break;
        }
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};
