/*extern ufJS, ufJSActions, ufJSParser, openUILink */ 

ufJSActions.actions.youtube_search_tags = {
  description: "Find videos on YouTube",
  icon: "http://youtube.com/favicon.ico",
  scope: {
    semantic: {
      "tag" : "tag"
    }
  },
  /*
   * Perform an action
   * 
   * @param semanticObject     JavaScript representation of the semantic object
   * @param semanticObjectType Semantic object type as a string
   * @param domNode            DOM Node associated with the semantic object
   * @return                   If you return a value, we attempt to open it as a url
   */
  doAction: function(semanticObject, semanticObjectType, domNode) {
    if (semanticObjectType == "tag") {
      var tag = ufJSParser.getMicroformatProperty(semanticObject, "tag", "tag");
      if (tag) {
        return("http://youtube.com/results?search_query=" + encodeURIComponent(tag));
      }
    }
  }
};
