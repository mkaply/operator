var amazon_search_tags = {
  description: "Find products on amazon.com",
  shortDescription: "amazon.com",
  icon: "http://www.ammazon.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return "http://www.amazon.com/tag/" + encodeURIComponent(semanticObject.tag);
    }
    return null;
  }
};

SemanticActions.add("amazon_search_tags", amazon_search_tags);
