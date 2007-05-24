ufJSActions.actions.youtube_search_tags = {
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
