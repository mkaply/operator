var youtube_search_tags = {
  version: 0.8,
  description: "Find videos on YouTube",
  icon: "http://youtube.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObject.tag) {
      return("http://youtube.com/results?search_query=" + encodeURIComponent(semanticObject.tag));
    }
  }
};

SemanticActions.add("youtube_search_tags", youtube_search_tags);
