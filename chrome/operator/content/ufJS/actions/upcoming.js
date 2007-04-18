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
    var url;
    if (microformatName == "tag") {
      var tag = ufJSParser.getMicroformatProperty(node, "tag", "tag");
      if (tag) {
        url = "http://upcoming.org/tag/" + encodeURIComponent(tag);
      }
    }
    if (url) {
      openUILink(url, event);
    }
  }
};
