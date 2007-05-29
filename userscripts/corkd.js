var corkd_search_tags = {
  version: 0.8,
  description: "Find wines on Cork'd",
  icon: "http://corkd.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    },
    url: "http://corkd.com"
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return("http://corkd.com/tags/" + encodeURIComponent(semanticObject.tag));
    }
  }
};

SemanticActions.add("corkd_search_tags", corkd_search_tags);
