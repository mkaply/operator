/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.magnolia_search_tags = {
  description: "Find bookmarks on Ma.gnolia",
  icon: "http://ma.gnolia.com/favicon.ico",
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
          url = "http://ma.gnolia.com/tags/" + encodeURIComponent(tag);
          break;
        }
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

ufJSActions.actions.magnolia_bookmark = {
  description: "Bookmark with Ma.gnolia",
  icon: "http://ma.gnolia.com/favicon.ico",
  scope: {
    microformats: {
      "xFolk" : "taggedlink"
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
      if (microformatNames[i] == "xFolk") {
        var xfolk = ufJSParser.createMicroformat(node, "xFolk");
        if (xfolk && xfolk.taggedlink && xfolk.taggedlink.link) {
          url = 'http://ma.gnolia.com/bookmarklet/add?url=' + encodeURIComponent(xfolk.taggedlink.link);
          if (xfolk.taggedlink.title) {
            url += '&title=' + encodeURIComponent(xfolk.taggedlink.title);
          }
          if (xfolk.description) {
            url += '&description=' + encodeURIComponent(xfolk.description);
          }
        }
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};

