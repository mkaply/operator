var yedda_search_tags = {
  version: 0.8,
  description: "Find answers on Yedda",
  shortDescription: "Yedda",
  icon: "http://yedda.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return "http://yedda.com/questions/tags/" + encodeURIComponent(semanticObject.tag) + "?source=operator";
    }
  }
};

SemanticActions.add("yedda_search_tags", yedda_search_tags);
