var youtube_search_tags = {
  description: "Find videos on YouTube",
  shortDescription: "YouTube",
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
    return null;
  }
};

SemanticActions.add("youtube_search_tags", youtube_search_tags);
