/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.yedda_search_tags = {
  description: "Find answers on Yedda",
  icon: "http://yedda.com/favicon.ico",
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
        url = "http://yedda.com/questions/tags/" + encodeURIComponent(tag) + "?source=operator";
      }
    }
    return url;
  }
};
