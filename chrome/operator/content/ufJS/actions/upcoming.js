/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.upcoming_search_tags = {
  description: "Find events on Upcoming.org",
  icon: "http://upcoming.org/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(node, semanticObjectType) {
    var url;
    if (semanticObjectType == "tag") {
      var tag = ufJSParser.getMicroformatProperty(node, "tag", "tag");
      if (tag) {
        url = "http://upcoming.org/tag/" + encodeURIComponent(tag);
      }
    }
    return url;
  }
};
