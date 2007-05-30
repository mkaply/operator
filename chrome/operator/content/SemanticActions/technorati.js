var technorati_search_tags = {
  version: 0.8,
  description: "Find blogs on technorati",
  shortDescription: "technorati",
  icon: "http://technorati.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return "http://technorati.com/tag/" + encodeURIComponent(semanticObject.tag);
    }
  }
};

SemanticActions.add("technorati_search_tags", technorati_search_tags);
