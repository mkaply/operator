/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.technorati_search_tags = {
  description: "Find blogs on technorati",
  icon: "http://technorati.com/favicon.ico",
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
        url = "http://technorati.com/tag/" + encodeURIComponent(tag);
      }
    }
    return url;
  }
};
